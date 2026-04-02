import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Show, Platform } from '@/types/show';
import { useTVMazeImage } from '@/hooks/useTVMazeImage';

const platformConfig: Record<Platform, { label: string; color: string; bg: string }> = {
  netflix: { label: 'Netflix', color: '#E50914', bg: '#1a0203' },
  hulu: { label: 'Hulu', color: '#1CE783', bg: '#031a0e' },
  apple: { label: 'Apple TV+', color: '#A0A0A0', bg: '#141414' },
  prime: { label: 'Prime', color: '#00A8E1', bg: '#011520' },
};

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const [hovered, setHovered] = useState(false);
  const platform = platformConfig[show.platform];
  const imageUrl = useTVMazeImage(show.title, show.image);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'hsl(220 14% 11%)',
        border: `1px solid ${hovered ? 'hsl(265 80% 40%)' : 'hsl(220 14% 18%)'}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: hovered ? '0 12px 32px hsl(265 80% 10% / 0.6)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Cover Image */}
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={show.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />
        {/* New badge */}
        {show.isNew && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'hsl(30 90% 55%)',
            color: 'white',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            New
          </div>
        )}
        {/* Platform badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: platform.bg,
          border: `1px solid ${platform.color}60`,
          color: platform.color,
          fontSize: '11px',
          fontWeight: 600,
        }}>
          {platform.label}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px' }}>
        <h3 style={{
          margin: '0 0 6px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'hsl(0 0% 95%)',
          lineHeight: 1.3,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {show.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={13} fill="hsl(30 90% 55%)" color="hsl(30 90% 55%)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(30 90% 65%)' }}>
              {show.rating.toFixed(1)}
            </span>
          </div>
          {/* Year */}
          <span style={{ fontSize: '12px', color: 'hsl(220 8% 50%)' }}>
            {show.year}
          </span>
        </div>

        {/* Season */}
        <div style={{ fontSize: '12px', color: 'hsl(220 8% 60%)', marginBottom: '8px' }}>
          Season {show.seasons} now streaming
        </div>

        {/* Genre tag */}
        <div style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: 'hsl(220 14% 18%)',
          color: 'hsl(220 8% 65%)',
          fontSize: '11px',
          fontWeight: 500,
        }}>
          {show.genre}
        </div>
      </div>
    </div>
  );
}
