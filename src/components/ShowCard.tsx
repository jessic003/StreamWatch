import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Show, Platform } from '@/types/show';
import { useTVMazeImage } from '@/hooks/useTVMazeImage';

const platformConfig: Record<Platform, { label: string; color: string; bg: string }> = {
  netflix: { label: 'Netflix', color: '#E50914', bg: '#1a0203' },
  hulu:    { label: 'Hulu',    color: '#1CE783', bg: '#031a0e' },
  apple:   { label: 'Apple TV+', color: '#A0A0A0', bg: '#141414' },
  prime:   { label: 'Prime',   color: '#00A8E1', bg: '#011520' },
};

const isThisMonth = (date?: string) =>
  !!date && date.includes('April 2026');

interface ShowCardProps { show: Show }

export function ShowCard({ show }: ShowCardProps) {
  const [hovered, setHovered] = useState(false);
  const platform = platformConfig[show.platform];
  const imageUrl  = useTVMazeImage(show.title, show.image);
  const thisMonth = isThisMonth(show.currentSeasonDate);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'hsl(220 14% 11%)',
        border: `1px solid ${
          thisMonth
            ? 'hsl(145 60% 40% / 0.7)'
            : hovered
            ? 'hsl(265 80% 40%)'
            : 'hsl(220 14% 18%)'
        }`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: thisMonth
          ? '0 0 18px hsl(145 60% 30% / 0.35)'
          : hovered
          ? '0 12px 32px hsl(265 80% 10% / 0.6)'
          : 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Cover Image ── */}
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={imageUrl}
          alt={show.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* NEW badge */}
        {show.isNew && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            padding: '2px 8px', borderRadius: 4,
            backgroundColor: 'hsl(30 90% 55%)',
            color: '#fff', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>New</div>
        )}

        {/* Platform badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          padding: '2px 8px', borderRadius: 4,
          backgroundColor: platform.bg,
          border: `1px solid ${platform.color}60`,
          color: platform.color, fontSize: 11, fontWeight: 600,
        }}>{platform.label}</div>

        {/* NOW PLAYING badge */}
        {show.nowPlaying && (
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 999,
            backgroundColor: thisMonth
              ? 'hsl(145 60% 15% / 0.92)'
              : 'hsl(220 14% 8% / 0.88)',
            border: `1px solid ${thisMonth ? 'hsl(145 60% 40%)' : 'hsl(265 80% 45%)'}`,
            color: thisMonth ? 'hsl(145 60% 60%)' : 'hsl(265 80% 75%)',
            fontSize: 11, fontWeight: 700,
            backdropFilter: 'blur(4px)',
          }}>
            {/* Pulse dot */}
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: thisMonth ? 'hsl(145 60% 50%)' : 'hsl(265 80% 60%)',
              display: 'inline-block',
              boxShadow: thisMonth
                ? '0 0 6px hsl(145 60% 50%)'
                : '0 0 6px hsl(265 80% 60%)',
            }} />
            NOW PLAYING
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {/* Title */}
        <h3 style={{
          margin: 0, fontSize: 14, fontWeight: 600,
          color: 'hsl(0 0% 95%)', lineHeight: 1.3,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{show.title}</h3>

        {/* Description — always visible, full text */}
        <p style={{
          margin: 0, fontSize: 12,
          color: 'hsl(220 8% 60%)', lineHeight: 1.55,
        }}>{show.description}</p>

        {/* Rating + Year */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={12} fill="hsl(30 90% 55%)" color="hsl(30 90% 55%)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(30 90% 65%)' }}>
              {show.rating.toFixed(1)}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'hsl(220 8% 50%)' }}>{show.year}</span>
        </div>

        {/* Season info */}
        {show.nowPlaying && show.currentSeasonDate ? (
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: thisMonth ? 'hsl(145 60% 55%)' : 'hsl(265 80% 70%)',
          }}>
            Season {show.seasons} · {show.currentSeasonDate}
            {thisMonth && (
              <span style={{
                marginLeft: 6,
                padding: '1px 6px', borderRadius: 4,
                backgroundColor: 'hsl(145 60% 15%)',
                color: 'hsl(145 60% 60%)',
                fontSize: 10,
              }}>This Month</span>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: 'hsl(220 8% 50%)' }}>
            Season {show.seasons} now streaming
          </div>
        )}

        {/* Genre */}
        <div style={{
          display: 'inline-block', alignSelf: 'flex-start',
          padding: '2px 8px', borderRadius: 4,
          backgroundColor: 'hsl(220 14% 18%)',
          color: 'hsl(220 8% 65%)', fontSize: 11, fontWeight: 500,
        }}>{show.genre}</div>
      </div>
    </div>
  );
}
