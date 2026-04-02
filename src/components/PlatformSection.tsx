import type { Platform } from '@/types/show';
import { shows } from '@/data/shows';
import { ShowCard } from '@/components/ShowCard';

interface PlatformSectionProps {
  platform: Platform;
}

const platformConfig: Record<Platform, { label: string; color: string; bg: string; description: string }> = {
  netflix: { label: 'Netflix', color: '#E50914', bg: '#1a0203', description: 'Originals & exclusives' },
  hulu: { label: 'Hulu', color: '#1CE783', bg: '#031a0e', description: 'Live TV & originals' },
  apple: { label: 'Apple TV+', color: '#A0A0A0', bg: '#141414', description: 'Award-winning originals' },
  prime: { label: 'Prime Video', color: '#00A8E1', bg: '#011520', description: 'Included with Prime' },
};

export function PlatformSection({ platform }: PlatformSectionProps) {
  const platformShows = shows.filter(s => s.platform === platform);
  const config = platformConfig[platform];

  if (platformShows.length === 0) return null;

  return (
    <section style={{ marginBottom: '48px' }}>
      {/* Platform Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <div style={{
          padding: '6px 16px',
          borderRadius: '6px',
          border: `1px solid ${config.color}40`,
          backgroundColor: config.bg,
          color: config.color,
          fontSize: '15px',
          fontWeight: 700,
        }}>
          {config.label}
        </div>
        <span style={{ fontSize: '14px', color: 'hsl(220 8% 55%)' }}>
          {config.description} · {platformShows.length} shows
        </span>
      </div>

      {/* Horizontal scroll row */}
      <div style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        paddingBottom: '12px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(220 14% 25%) transparent',
      }}>
        {platformShows.map(show => (
          <div
            key={show.id}
            style={{ flexShrink: 0, width: '160px' }}
          >
            <ShowCard show={show} />
          </div>
        ))}
      </div>
    </section>
  );
}
