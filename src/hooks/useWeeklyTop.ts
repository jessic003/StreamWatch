import { useState, useEffect } from 'react';
import type { Platform } from '@/types/show';

const CACHE_KEY = 'streamwatch_weekly_top';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface WeeklyShow {
  tvmazeId: number;
  title: string;
  platform: Platform;
  platformLabel: string;
  image: string;
  rating: number;
  genres: string[];
  summary: string;
  premiered: string;
  status: string;
}

interface CacheEntry {
  timestamp: number;
  weekOf: string;
  data: Record<Platform, WeeklyShow[]>;
}

const PLATFORM_MAP: Record<string, Platform> = {
  'Netflix':              'netflix',
  'Hulu':                 'hulu',
  'Apple TV+':            'apple',
  'Amazon':               'prime',
  'Amazon Prime Video':   'prime',
  'Prime Video':          'prime',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  netflix: 'Netflix',
  hulu:    'Hulu',
  apple:   'Apple TV+',
  prime:   'Prime Video',
};

function getMondayDate(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

async function fetchWeeklyTop(): Promise<Record<Platform, WeeklyShow[]>> {
  const monday = getMondayDate();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  // Fetch all 7 days in parallel
  const responses = await Promise.allSettled(
    dates.map(date =>
      fetch(`https://api.tvmaze.com/schedule/web?date=${date}&country=US`)
        .then(r => r.json())
    )
  );

  // Flatten all episodes
  const allEpisodes: any[] = responses.flatMap(r =>
    r.status === 'fulfilled' && Array.isArray(r.value) ? r.value : []
  );

  // Deduplicate by show id, keep the one with highest rating
  const showMap = new Map<number, any>();
  for (const ep of allEpisodes) {
    const show = ep._embedded?.show ?? ep.show;
    if (!show) continue;
    const ch = show.webChannel?.name ?? show.network?.name ?? '';
    const platform = PLATFORM_MAP[ch];
    if (!platform) continue;

    const existing = showMap.get(show.id);
    const rating = show.rating?.average ?? 0;
    if (!existing || rating > (existing.show.rating?.average ?? 0)) {
      showMap.set(show.id, { show, platform, ep });
    }
  }

  // Group by platform, sort by rating desc, take top 5
  const grouped: Record<Platform, WeeklyShow[]> = {
    netflix: [], hulu: [], apple: [], prime: [],
  };

  for (const { show, platform } of showMap.values()) {
    grouped[platform].push({
      tvmazeId: show.id,
      title: show.name,
      platform,
      platformLabel: PLATFORM_LABELS[platform],
      image: show.image?.medium ?? show.image?.original ?? '',
      rating: show.rating?.average ?? 0,
      genres: show.genres ?? [],
      summary: show.summary?.replace(/<[^>]+>/g, '') ?? '',
      premiered: show.premiered ?? '',
      status: show.status ?? '',
    });
  }

  for (const p of Object.keys(grouped) as Platform[]) {
    grouped[p] = grouped[p]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }

  return grouped;
}

export function useWeeklyTop() {
  const [data, setData] = useState<Record<Platform, WeeklyShow[]>>({
    netflix: [], hulu: [], apple: [], prime: [],
  });
  const [loading, setLoading] = useState(true);
  const [weekOf, setWeekOf] = useState('');

  const load = async (force = false) => {
    setLoading(true);
    const monday = getMondayDate();

    if (!force) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached: CacheEntry = JSON.parse(raw);
          if (cached.weekOf === monday && Date.now() - cached.timestamp < CACHE_TTL) {
            setData(cached.data);
            setWeekOf(cached.weekOf);
            setLoading(false);
            return;
          }
        }
      } catch { /* ignore */ }
    }

    const result = await fetchWeeklyTop();
    const entry: CacheEntry = { timestamp: Date.now(), weekOf: monday, data: result };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(entry)); } catch { /* ignore */ }

    setData(result);
    setWeekOf(monday);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  return { data, loading, weekOf, refresh: () => load(true) };
}
