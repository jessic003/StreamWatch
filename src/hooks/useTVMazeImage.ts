import { useState, useEffect } from 'react';

const cache = new Map<string, string | null>();

export function useTVMazeImage(title: string, fallback: string) {
  const [imageUrl, setImageUrl] = useState<string>(() => cache.get(title) ?? fallback);

  useEffect(() => {
    if (cache.has(title)) {
      const cached = cache.get(title);
      setImageUrl(cached ?? fallback);
      return;
    }

    const controller = new AbortController();

    fetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        const url: string | null = data?.image?.original ?? data?.image?.medium ?? null;
        cache.set(title, url);
        setImageUrl(url ?? fallback);
      })
      .catch(() => {
        cache.set(title, null);
      });

    return () => controller.abort();
  }, [title, fallback]);

  return imageUrl;
}
