import { useState, useEffect } from 'react';
import type { Platform } from '@/types/show';

const CACHE_KEY = 'streamwatch_weekly_top_v2';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

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
  currentSeason: number;
  currentEpisode: number;
  airdate: string;
  isNewSeason: boolean;     // ep 1 of any season
  isSeriesPremiere: boolean; // season 1, ep 1
}

export interface PlatformWeeklyData {
  topFive: WeeklyShow[];
  newThisWeek: WeeklyShow[];
  newSeasons: WeeklyShow[];
}

interface CacheEntry {
  timestamp: number;
  weekOf: string;
  data: Record<Platform, PlatformWeeklyData>;
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
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function emptyPlatform(): PlatformWeeklyData {
  return { topFive: [], newThisWeek: [], newSeasons: [] };
}

async function fetchWeeklyTop(): Promise<Record<Platform, PlatformWeeklyData>> {
  const monday = getMondayDate();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const responses = await Promise.allSettled(
    dates.map(date =>
      fetch(`https://api.tvmaze.com/schedule/web?date=${date}&country=US`)
        .then(r => r.json())
    )
  );

  const allEpisodes: any[] = responses.flatMap(r =>
    r.status === 'fulfilled' && Array.isArray(r.value) ? r.value : []
  );

  // One entry per show: keep earliest episode this week
  const showMap = new Map<number, any>();
  for (const ep of allEpisodes) {
    const show = ep._embedded?.show ?? ep.show;
    if (!show) continue;
    const ch = show.webChannel?.name ?? show.network?.name ?? '';
    const platform = PLATFORM_MAP[ch];
    if (!platform) continue;

    const existing = showMap.get(show.id);
    const isEarlier =
      !existing ||
      ep.airdate < existing.ep.airdate ||
      (ep.airdate === existing.ep.airdate && (ep.number ?? 99) < (existing.ep.number ?? 99));

    if (isEarlier) showMap.set(show.id, { show, platform, ep });
  }

  const grouped: Record<Platform, PlatformWeeklyData> = {
    netflix: emptyPlatform(),
    hulu:    emptyPlatform(),
    apple:   emptyPlatform(),
    prime:   emptyPlatform(),
  };

  for (const { show, platform, ep } of showMap.values()) {
    const isNewSeason     = ep.number === 1;
    const isSeriesPremiere = ep.season === 1 && ep.number === 1;

    const weeklyShow: WeeklyShow = {
      tvmazeId:        show.id,
      title:           show.name,
      platform,
      platformLabel:   PLATFORM_LABELS[platform],
      image:           show.image?.medium ?? show.image?.original ?? '',
      rating:          show.rating?.average ?? 0,
      genres:          show.genres ?? [],
      summary:         show.summary?.replace(/<[^>]+>/g, '') ?? '',
      premiered:       show.premiered ?? '',
      status:          show.status ?? '',
      currentSeason:   ep.season ?? 1,
      currentEpisode:  ep.number ?? 1,
      airdate:         ep.airdate ?? '',
      isNewSeason,
      isSeriesPremiere,
    };

    grouped[platform].newThisWeek.push(weeklyShow);
    if (isNewSeason) grouped[platform].newSeasons.push(weeklyShow);
  }

  for (const p of Object.keys(grouped) as Platform[]) {
    // Top 5 by rating
    grouped[p].topFive = [...grouped[p].newThisWeek]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // New this week: by airdate then rating desc
    grouped[p].newThisWeek.sort(
      (a, b) => a.airdate.localeCompare(b.airdate) || b.rating - a.rating
    );

    // New seasons: by airdate
    grouped[p].newSeasons.sort((a, b) => a.airdate.localeCompare(b.airdate));
  }

  return grouped;
}

export function useWeeklyTop() {
  const [data, setData] = useState<Record<Platform, PlatformWeeklyData>>({
    netflix: emptyPlatform(),
    hulu:    emptyPlatform(),
    apple:   emptyPlatform(),
    prime:   emptyPlatform(),
  });
  const [loading, setLoading] = useState(true);
  const [weekOf, setWeekOf]   = useState('');

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
