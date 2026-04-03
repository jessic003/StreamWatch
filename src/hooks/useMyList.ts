import { useState, useEffect } from 'react';
import type { WeeklyShow } from './useWeeklyTop';

const KEY = 'streamwatch_my_list';

export function useMyList() {
  const [myList, setMyList] = useState<WeeklyShow[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(myList)); } catch { /* ignore */ }
  }, [myList]);

  const isAdded = (tvmazeId: number) => myList.some(s => s.tvmazeId === tvmazeId);

  const toggle = (show: WeeklyShow) => {
    setMyList(prev =>
      prev.some(s => s.tvmazeId === show.tvmazeId)
        ? prev.filter(s => s.tvmazeId !== show.tvmazeId)
        : [...prev, show]
    );
  };

  return { myList, isAdded, toggle };
}
