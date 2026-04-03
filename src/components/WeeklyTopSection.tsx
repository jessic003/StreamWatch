import { useState } from 'react';
import { Plus, Check, RefreshCw, TrendingUp, Star } from 'lucide-react';
import { useWeeklyTop } from '@/hooks/useWeeklyTop';
import { useMyList } from '@/hooks/useMyList';
import type { Platform } from '@/types/show';
import type { WeeklyShow } from '@/hooks/useWeeklyTop';

const PLATFORMS: { key: Platform; label: string; color: string }[] = [
  { key: 'netflix', label: 'Netflix',    color: '#E50914' },
  { key: 'hulu',    label: 'Hulu',       color: '#1CE783' },
  { key: 'apple',   label: 'Apple TV+',  color: '#A0A0A0' },
  { key: 'prime',   label: 'Prime Video',color: '#00A8E1' },
];

function formatWeekOf(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const end = new Date(dateStr);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `Week of ${d.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}

function ShowRow({ show, onToggle, added }: {
  show: WeeklyShow;
  onToggle: (s: WeeklyShow) => void;
  added: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 12px', borderRadius: '10px',
        backgroundColor: hovered ? 'hsl(220 14% 14%)' : 'hsl(220 14% 11%)',
        border: `1px solid ${added ? 'hsl(145 60% 30% / 0.5)' : 'hsl(220 14% 18%)'}`,
        transition: 'background-color 0.15s, border-color 0.15s',
        cursor: 'default',
      }}
    >
      {/* Poster */}
      <img
        src={show.image}
        alt={show.title}
        style={{ width: 42, height: 60, objectFit: 'cover', borderRadius: 5, flexShrink: 0 }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'hsl(0 0% 92%)', marginBottom: 3,
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {show.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {show.rating > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'hsl(30 90% 60%)' }}>
              <Star size={11} fill="hsl(30 90% 55%)" color="hsl(30 90% 55%)" />
              {show.rating.toFixed(1)}
            </span>
          )}
          {show.genres[0] && (
            <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4,
              backgroundColor: 'hsl(220 14% 18%)', color: 'hsl(220 8% 55%)' }}>
              {show.genres[0]}
            </span>
          )}
          <span style={{ fontSize: 11, color: show.status === 'Running' ? 'hsl(145 60% 50%)' : 'hsl(220 8% 45%)' }}>
            {show.status}
          </span>
        </div>
      </div>

      {/* Add / Added button */}
      <button
        onClick={() => onToggle(show)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 12px', borderRadius: 8, flexShrink: 0,
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          backgroundColor: added ? 'hsl(145 60% 12%)' : 'hsl(265 80% 20%)',
          border: `1px solid ${added ? 'hsl(145 60% 35%)' : 'hsl(265 80% 45%)'}`,
          color: added ? 'hsl(145 60% 55%)' : 'hsl(265 80% 80%)',
          transition: 'all 0.15s',
        }}
      >
        {added ? <Check size={13} /> : <Plus size={13} />}
        {added ? 'Added' : 'Add'}
      </button>
    </div>
  );
}

export function WeeklyTopSection() {
  const { data, loading, weekOf, refresh } = useWeeklyTop();
  const { myList, isAdded, toggle } = useMyList();
  const [activeTab, setActiveTab] = useState<Platform>('netflix');

  const activeShows = data[activeTab] ?? [];
  const hasShows    = activeShows.length > 0;

  return (
    <section style={{ paddingTop: '48px', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, margin: '0 0 5px',
            color: 'hsl(0 0% 95%)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={24} color="hsl(30 90% 55%)" />
            Top 5 This Week
          </h2>
          <p style={{ fontSize: 13, color: 'hsl(220 8% 45%)', margin: 0 }}>
            {loading ? 'Loading this week\'s shows…' : weekOf ? formatWeekOf(weekOf) : 'Highest rated new episodes per platform'}
            {myList.length > 0 && (
              <span style={{ marginLeft: 10, padding: '1px 8px', borderRadius: 4,
                backgroundColor: 'hsl(145 60% 12%)', color: 'hsl(145 60% 55%)',
                fontSize: 11, fontWeight: 600 }}>
                {myList.length} added to my list
              </span>
            )}
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            backgroundColor: 'hsl(220 14% 15%)',
            border: '1px solid hsl(220 14% 25%)',
            color: loading ? 'hsl(220 8% 40%)' : 'hsl(0 0% 85%)',
            fontSize: 13, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Platform tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {PLATFORMS.map(p => {
          const count = (data[p.key] ?? []).length;
          const isActive = activeTab === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setActiveTab(p.key)}
              style={{
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                backgroundColor: isActive ? p.color + '22' : 'hsl(220 14% 13%)',
                border: `1px solid ${isActive ? p.color + '80' : 'hsl(220 14% 22%)'}`,
                color: isActive ? p.color : 'hsl(220 8% 60%)',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
              {count > 0 && (
                <span style={{ marginLeft: 6, fontSize: 11,
                  color: isActive ? p.color : 'hsl(220 8% 40%)' }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Show list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
        {loading && [1,2,3,4,5].map(i => (
          <div key={i} style={{ height: 82, borderRadius: 10, backgroundColor: 'hsl(220 14% 13%)',
            border: '1px solid hsl(220 14% 18%)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}

        {!loading && !hasShows && (
          <div style={{ padding: '28px 20px', textAlign: 'center', borderRadius: 12,
            backgroundColor: 'hsl(220 14% 11%)', border: '1px solid hsl(220 14% 18%)' }}>
            <TrendingUp size={26} color="hsl(220 8% 30%)" style={{ marginBottom: 10 }} />
            <p style={{ color: 'hsl(220 8% 50%)', margin: 0, fontSize: 14 }}>
              No new episodes found for {PLATFORMS.find(p => p.key === activeTab)?.label} this week.
            </p>
          </div>
        )}

        {!loading && hasShows && activeShows.map((show, i) => (
          <div key={show.tvmazeId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, textAlign: 'right', fontSize: 13, fontWeight: 700,
              color: i < 3 ? 'hsl(30 90% 55%)' : 'hsl(220 8% 40%)', flexShrink: 0 }}>
              {i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <ShowRow show={show} onToggle={toggle} added={isAdded(show.tvmazeId)} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </section>
  );
}
