import { useState, useEffect } from 'react';
import { shows } from '@/data/shows';

const CACHE_KEY = 'streamwatch_renewals';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export interface RenewalInfo {
  title: string;
  platform: string;
  image: string;
  id: string;
  nextSeason: number;
  nextEpisodeDate: string | null;
  status: string;
}

interface CacheEntry {
  timestamp: number;
  data: RenewalInfo[];
}

async function fetchRenewals(): Promise<RenewalInfo[]> {
  const results: RenewalInfo[] = [];

  await Promise.all(
    shows.map(async (show) => {
      try {
        const res = await fetch(
          `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(show.title)}&embed=nextepisode`
        );
        if (!res.ok) return;
        const data = await res.json();

        const status: string = data?.status ?? '';
        const nextEp = data?._embedded?.nextepisode;
        const nextEpSeason: number | null = nextEp?.season ?? null;

        // Only include if renewed (Running + has a future episode in a new season)
        if (
          status === 'Running' &&
          nextEpSeason !== null &&
          nextEpSeason > show.seasons
        ) {
          results.push({
            id: show.id,
            title: show.title,
            platform: show.platform,
            image: data?.image?.medium ?? show.image,
            nextSeason: nextEpSeason,
            nextEpisodeDate: nextEp?.airdate ?? null,
            status,
          });
        }
      } catch {
        // silently skip failed fetches
      }
    })
  );

  return results.sort((a, b) => {
    if (!a.nextEpisodeDate) return 1;
    if (!b.nextEpisodeDate) return -1;
    return new Date(a.nextEpisodeDate).getTime() - new Date(b.nextEpisodeDate).getTime();
  });
}

export function useRenewals() {
  const [renewals, setRenewals] = useState<RenewalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const load = async (force = false) => {
    setLoading(true);

    // Check cache
    if (!force) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached: CacheEntry = JSON.parse(raw);
          if (Date.now() - cached.timestamp < CACHE_TTL) {
            setRenewals(cached.data);
            setLastChecked(new Date(cached.timestamp));
            setLoading(false);
            return;
          }
        }
      } catch { /* ignore */ }
    }

    const data = await fetchRenewals();
    const entry: CacheEntry = { timestamp: Date.now(), data };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch { /* ignore */ }

    setRenewals(data);
    setLastChecked(new Date());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return { renewals, loading, lastChecked, refresh: () => load(true) };
}
