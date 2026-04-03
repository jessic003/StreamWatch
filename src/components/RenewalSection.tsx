import { RefreshCw, Bell, CalendarDays } from 'lucide-react';
import { useRenewals } from '@/hooks/useRenewals';
import type { Platform } from '@/types/show';

const platformConfig: Record<Platform, { label: string; color: string; bg: string }> = {
  netflix: { label: 'Netflix', color: '#E50914', bg: '#1a0203' },
  hulu:    { label: 'Hulu',    color: '#1CE783', bg: '#031a0e' },
  apple:   { label: 'Apple TV+', color: '#A0A0A0', bg: '#141414' },
  prime:   { label: 'Prime',   color: '#00A8E1', bg: '#011520' },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Date TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 2)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function RenewalSection() {
  const { renewals, loading, lastChecked, refresh } = useRenewals();

  return (
    <section style={{ paddingTop: '48px', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700,
            margin: '0 0 6px', color: 'hsl(0 0% 95%)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Bell size={24} color="hsl(265 80% 60%)" />
            Renewed for a New Season
          </h2>
          <p style={{ fontSize: '14px', color: 'hsl(220 8% 50%)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarDays size={13} />
            Checked weekly via TVMaze
            {lastChecked && (
              <span style={{ color: 'hsl(220 8% 40%)' }}>
                · last updated {timeAgo(lastChecked)}
              </span>
            )}
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            backgroundColor: 'hsl(220 14% 15%)',
            border: '1px solid hsl(220 14% 25%)',
            color: loading ? 'hsl(220 8% 40%)' : 'hsl(0 0% 85%)',
            fontSize: '13px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Checking...' : 'Check Now'}
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '100px', borderRadius: '10px',
              backgroundColor: 'hsl(220 14% 13%)',
              border: '1px solid hsl(220 14% 18%)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && renewals.length === 0 && (
        <div style={{
          padding: '32px', textAlign: 'center',
          borderRadius: '12px',
          backgroundColor: 'hsl(220 14% 11%)',
          border: '1px solid hsl(220 14% 18%)',
        }}>
          <Bell size={28} color="hsl(220 8% 35%)" style={{ marginBottom: '12px' }} />
          <p style={{ color: 'hsl(220 8% 50%)', margin: 0, fontSize: '15px' }}>
            No new renewals found from your watchlist right now.
          </p>
          <p style={{ color: 'hsl(220 8% 38%)', margin: '6px 0 0', fontSize: '13px' }}>
            Check back next week or hit "Check Now" to refresh.
          </p>
        </div>
      )}

      {/* Renewal cards */}
      {!loading && renewals.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {renewals.map(show => {
            const plat = platformConfig[show.platform as Platform];
            return (
              <div key={show.id} style={{
                display: 'flex', gap: '14px', alignItems: 'center',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: 'hsl(220 14% 11%)',
                border: '1px solid hsl(265 80% 30% / 0.5)',
                boxShadow: '0 0 16px hsl(265 80% 10% / 0.4)',
              }}>
                {/* Poster thumbnail */}
                <img
                  src={show.image}
                  alt={show.title}
                  style={{
                    width: '54px', height: '78px',
                    objectFit: 'cover', borderRadius: '6px',
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title */}
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'hsl(0 0% 95%)', marginBottom: '4px' }}>
                    {show.title}
                  </div>

                  {/* Platform */}
                  <div style={{
                    display: 'inline-block', padding: '1px 7px',
                    borderRadius: '4px', marginBottom: '8px',
                    backgroundColor: plat?.bg ?? '#111',
                    border: `1px solid ${plat?.color ?? '#555'}60`,
                    color: plat?.color ?? '#aaa',
                    fontSize: '11px', fontWeight: 600,
                  }}>
                    {plat?.label ?? show.platform}
                  </div>

                  {/* Season + date */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px',
                  }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px',
                      backgroundColor: 'hsl(265 80% 18%)',
                      color: 'hsl(265 80% 72%)',
                      fontWeight: 700, fontSize: '11px',
                    }}>
                      Season {show.nextSeason} ✓
                    </span>
                    <span style={{ color: 'hsl(220 8% 50%)' }}>
                      {formatDate(show.nextEpisodeDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
