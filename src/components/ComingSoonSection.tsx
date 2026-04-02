import { Clock } from 'lucide-react';
import type { ComingSoonShow, Platform } from '@/types/show';
import { useTVMazeImage } from '@/hooks/useTVMazeImage';

interface ComingSoonSectionProps {
  shows: ComingSoonShow[];
}

const platformColors: Record<Platform, string> = {
  netflix: '#E50914',
  hulu: '#1CE783',
  apple: '#A0A0A0',
  prime: '#00A8E1',
};

const platformLabels: Record<Platform, string> = {
  netflix: 'Netflix',
  hulu: 'Hulu',
  apple: 'Apple TV+',
  prime: 'Prime Video',
};

function ComingSoonCard({ show }: { show: ComingSoonShow }) {
  const color = platformColors[show.platform];
  const label = platformLabels[show.platform];
  const imageUrl = useTVMazeImage(show.title, show.image);

  return (
    <div
      style={{
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'hsl(220 14% 10%)',
        border: '1px solid hsl(220 14% 18%)',
        opacity: 0.85,
      }}
    >
      {/* Image with overlay */}
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={show.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(40%) brightness(0.6)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, hsl(220 14% 8% / 0.9) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: 'hsl(220 14% 10%)',
          border: `1px solid ${color}60`,
          color: color,
          fontSize: '11px',
          fontWeight: 600,
        }}>
          {label}
        </div>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'hsl(30 90% 65%)',
          fontSize: '12px',
          fontWeight: 600,
        }}>
          <Clock size={12} />
          {show.releaseDate}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px' }}>
        <h3 style={{
          margin: '0 0 6px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'hsl(0 0% 85%)',
          lineHeight: 1.3,
        }}>
          {show.title}
        </h3>
        <div style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: 'hsl(220 14% 18%)',
          color: 'hsl(220 8% 55%)',
          fontSize: '11px',
          marginBottom: '8px',
        }}>
          {show.genre}
        </div>
        <p style={{
          fontSize: '12px',
          color: 'hsl(220 8% 50%)',
          margin: 0,
          lineHeight: 1.5,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {show.description}
        </p>
      </div>
    </div>
  );
}

export function ComingSoonSection({ shows }: ComingSoonSectionProps) {
  if (shows.length === 0) return null;

  return (
    <section style={{ paddingTop: '48px', paddingBottom: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 700,
          margin: '0 0 8px',
          color: 'hsl(0 0% 95%)',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <Clock size={26} color="hsl(30 90% 55%)" />
          Coming Soon
        </h2>
        <p style={{ fontSize: '15px', color: 'hsl(220 8% 55%)', margin: 0 }}>
          Upcoming shows to add to your watchlist
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        {shows.map(show => (
          <ComingSoonCard key={show.id} show={show} />
        ))}
      </div>
    </section>
  );
}
