import { useState } from 'react';
import { Plus, Check, RefreshCw, TrendingUp, Star, Zap, RotateCcw } from 'lucide-react';
import { useWeeklyTop } from '@/hooks/useWeeklyTop';
import { useMyList } from '@/hooks/useMyList';
import type { Platform } from '@/types/show';
import type { WeeklyShow } from '@/hooks/useWeeklyTop';

const PLATFORMS: { key: Platform; label: string; color: string }[] = [
  { key: 'netflix', label: 'Netflix',     color: '#E50914' },
  { key: 'hulu',    label: 'Hulu',        color: '#1CE783' },
  { key: 'apple',   label: 'Apple TV+',   color: '#A2AAAD' },
  { key: 'prime',   label: 'Prime Video', color: '#00A8E1' },
];

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeekOf(dateStr: string) {
  if (!dateStr) return '';
  const d   = new Date(dateStr + 'T00:00:00');
  const end = new Date(dateStr + 'T00:00:00');
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${d.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}

/* ─── Single show row card ─── */
function ShowCard({
  show, onToggle, added, rank,
}: {
  show: WeeklyShow;
  onToggle: (s: WeeklyShow) => void;
  added: boolean;
  rank?: number;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 14,
      backgroundColor: 'hsl(220 14% 11%)',
      border: `1px solid ${added ? 'hsl(145 60% 28% / 0.7)' : 'hsl(220 14% 17%)'}`,
      transition: 'border-color 0.15s',
    }}>
      {/* Rank badge */}
      {rank !== undefined && (
        <span style={{
          width: 22, textAlign: 'center', flexShrink: 0,
          fontSize: 15, fontWeight: 800,
          color: rank < 3 ? 'hsl(30 90% 58%)' : 'hsl(220 8% 38%)',
        }}>
          {rank + 1}
        </span>
      )}

      {/* Poster */}
      <img
        src={show.image}
        alt={show.title}
        style={{
          width: 46, height: 64, objectFit: 'cover', borderRadius: 7,
          flexShrink: 0, backgroundColor: 'hsl(220 14% 16%)',
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: 'hsl(0 0% 93%)',
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          marginBottom: 5,
        }}>
          {show.title}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px' }}>
          {show.rating > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'hsl(30 90% 60%)' }}>
              <Star size={11} fill="hsl(30 90% 55%)" color="hsl(30 90% 55%)" />
              {show.rating.toFixed(1)}
            </span>
          )}
          <span style={{ fontSize: 12, color: 'hsl(220 8% 50%)' }}>
            S{show.currentSeason} E{show.currentEpisode}
            {show.airdate ? ` · ${formatDate(show.airdate)}` : ''}
          </span>
          {show.isSeriesPremiere && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
              backgroundColor: 'hsl(265 80% 18%)', color: 'hsl(265 80% 72%)',
            }}>NEW SERIES</span>
          )}
          {show.isNewSeason && !show.isSeriesPremiere && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
              backgroundColor: 'hsl(145 60% 10%)', color: 'hsl(145 60% 52%)',
            }}>NEW SEASON</span>
          )}
          {show.genres[0] && (
            <span style={{
              fontSize: 11, padding: '1px 6px', borderRadius: 4,
              backgroundColor: 'hsl(220 14% 18%)', color: 'hsl(220 8% 50%)',
            }}>
              {show.genres[0]}
            </span>
          )}
        </div>
      </div>

      {/* Add / Added button — icon only for compactness on mobile */}
      <button
        onClick={() => onToggle(show)}
        aria-label={added ? 'Remove from my list' : 'Add to my list'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 38, height: 38, borderRadius: 10, flexShrink: 0, cursor: 'pointer',
          backgroundColor: added ? 'hsl(145 60% 12%)' : 'hsl(265 80% 20%)',
          border: `1.5px solid ${added ? 'hsl(145 60% 35%)' : 'hsl(265 80% 45%)'}`,
          color: added ? 'hsl(145 60% 55%)' : 'hsl(265 80% 80%)',
          transition: 'all 0.15s',
        }}
      >
        {added ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </div>
  );
}

/* ─── Section block with header + list ─── */
function Section({
  icon, title, accentColor, shows, onToggle, isAdded,
  numbered, emptyMsg, loading, skeletonCount = 3,
}: {
  icon: React.ReactNode;
  title: string;
  accentColor: string;
  shows: WeeklyShow[];
  onToggle: (s: WeeklyShow) => void;
  isAdded: (id: number) => boolean;
  numbered?: boolean;
  emptyMsg: string;
  loading: boolean;
  skeletonCount?: number;
}) {
  return (
    <div style={{
      borderRadius: 16,
      backgroundColor: 'hsl(220 14% 10%)',
      border: '1px solid hsl(220 14% 17%)',
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '14px 16px',
        borderBottom: '1px solid hsl(220 14% 15%)',
        backgroundColor: 'hsl(220 14% 12%)',
      }}>
        <span style={{ color: accentColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {icon}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'hsl(0 0% 92%)', flex: 1 }}>
          {title}
        </span>
        {!loading && shows.length > 0 && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            padding: '3px 9px', borderRadius: 20,
            backgroundColor: accentColor + '22',
            color: accentColor,
          }}>
            {shows.length}
          </span>
        )}
      </div>

      {/* Cards */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading && Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} style={{
            height: 88, borderRadius: 14,
            backgroundColor: 'hsl(220 14% 14%)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}

        {!loading && shows.length === 0 && (
          <p style={{
            fontSize: 13, color: 'hsl(220 8% 40%)',
            margin: 0, padding: '14px 4px', textAlign: 'center',
          }}>
            {emptyMsg}
          </p>
        )}

        {!loading && shows.map((show, i) => (
          <ShowCard
            key={show.tvmazeId}
            show={show}
            onToggle={onToggle}
            added={isAdded(show.tvmazeId)}
            rank={numbered ? i : undefined}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export function WeeklyTopSection() {
  const { data, loading, weekOf, refresh } = useWeeklyTop();
  const { myList, isAdded, toggle }         = useMyList();
  const [activePlatform, setActivePlatform] = useState<Platform>('netflix');

  const platConfig  = PLATFORMS.find(p => p.key === activePlatform)!;
  const platData    = data[activePlatform];

  return (
    <section style={{ paddingTop: 48, paddingBottom: 32 }}>

      {/* ── Page header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 22,
      }}>
        <div>
          <h2 style={{
            fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 800, margin: '0 0 5px',
            color: 'hsl(0 0% 95%)', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <TrendingUp size={22} color="hsl(30 90% 55%)" />
            This Week on Streaming
          </h2>
          <p style={{ fontSize: 13, color: 'hsl(220 8% 45%)', margin: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {loading ? 'Loading…' : weekOf ? formatWeekOf(weekOf) : 'Live from TVMaze'}
            {myList.length > 0 && (
              <span style={{
                padding: '2px 8px', borderRadius: 20,
                backgroundColor: 'hsl(145 60% 12%)', color: 'hsl(145 60% 55%)',
                fontSize: 11, fontWeight: 700,
              }}>
                {myList.length} saved
              </span>
            )}
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 10,
            backgroundColor: 'hsl(220 14% 14%)',
            border: '1px solid hsl(220 14% 24%)',
            color: loading ? 'hsl(220 8% 38%)' : 'hsl(0 0% 85%)',
            fontSize: 13, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* ── Platform dropdown ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 320 }}>
          <select
            value={activePlatform}
            onChange={e => setActivePlatform(e.target.value as Platform)}
            style={{
              width: '100%',
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '12px 44px 12px 16px',
              borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              backgroundColor: 'hsl(220 14% 13%)',
              border: `1.5px solid ${platConfig.color}90`,
              color: platConfig.color,
              outline: 'none',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {PLATFORMS.map(p => (
              <option
                key={p.key} value={p.key}
                style={{ backgroundColor: 'hsl(220 14% 13%)', color: 'hsl(0 0% 90%)' }}
              >
                {p.label}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 10 6" style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            width: 13, height: 13, pointerEvents: 'none',
            fill: 'none', stroke: platConfig.color,
            strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
          }}>
            <polyline points="1,1 5,5 9,1" />
          </svg>
        </div>
      </div>

      {/* ── Three sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 1. New This Week */}
        <Section
          icon={<Zap size={17} />}
          title="New This Week"
          accentColor="hsl(45 95% 55%)"
          shows={platData.newThisWeek}
          onToggle={toggle}
          isAdded={isAdded}
          emptyMsg={`No new episodes found for ${platConfig.label} this week.`}
          loading={loading}
          skeletonCount={4}
        />

        {/* 2. New Season in 2026 */}
        <Section
          icon={<RotateCcw size={17} />}
          title="New Season Premieres"
          accentColor={platConfig.color}
          shows={platData.newSeasons}
          onToggle={toggle}
          isAdded={isAdded}
          emptyMsg={`No season premieres on ${platConfig.label} this week.`}
          loading={loading}
          skeletonCount={2}
        />

        {/* 3. Top 5 This Week */}
        <Section
          icon={<TrendingUp size={17} />}
          title="Top 5 This Week"
          accentColor="hsl(30 90% 55%)"
          shows={platData.topFive}
          onToggle={toggle}
          isAdded={isAdded}
          numbered
          emptyMsg={`No ranked shows found for ${platConfig.label} this week.`}
          loading={loading}
          skeletonCount={5}
        />

      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </section>
  );
}
