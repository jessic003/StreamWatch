import { useTVMazeImage } from '@/hooks/useTVMazeImage';
import { shows } from '@/data/shows';

// Pick 13 shows for the hero — 1 featured + 12 grid
const FEATURED_SHOW = shows.find(s => s.id === 'show-17')!; // Shogun
const GRID_SHOWS    = [
  shows.find(s => s.id === 'show-4')!,  // Severance
  shows.find(s => s.id === 'show-2')!,  // The Bear
  shows.find(s => s.id === 'show-5')!,  // The Boys
  shows.find(s => s.id === 'show-3')!,  // Stranger Things
  shows.find(s => s.id === 'show-11')!, // House of the Dragon
  shows.find(s => s.id === 'show-12')!, // Ted Lasso
  shows.find(s => s.id === 'show-16')!, // Fallout
  shows.find(s => s.id === 'show-1')!,  // Dark Matter
  shows.find(s => s.id === 'show-6')!,  // Wednesday
  shows.find(s => s.id === 'show-14')!, // The Penguin
  shows.find(s => s.id === 'show-19')!, // The Diplomat
  shows.find(s => s.id === 'show-9')!,  // Reacher
];

/** Single poster cell — uses the same TVMaze hook as ShowCard */
function PosterCell({ title, fallback, dim = false }: { title: string; fallback: string; dim?: boolean }) {
  const url = useTVMazeImage(title, fallback);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      <img
        src={url}
        alt=""
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: dim ? 'brightness(0.38)' : 'brightness(0.52)',
          display: 'block',
        }}
      />
      {/* Purple / dark tint so it reads as "streaming app" */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'hsl(255 60% 12% / 0.45)',
        mixBlendMode: 'multiply',
      }} />
    </div>
  );
}

export function Hero() {
  return (
    <section style={{
      position: 'relative',
      height: '72vh',
      minHeight: '480px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
    }}>

      {/* ── Featured poster (left ~42%) ── */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '42%' }}>
        <PosterCell title={FEATURED_SHOW.title} fallback={FEATURED_SHOW.image} />
      </div>

      {/* ── Show poster grid (right 65%) — 4 cols × 3 rows ── */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '65%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '3px',
      }}>
        {GRID_SHOWS.map(show => (
          <PosterCell key={show.id} title={show.title} fallback={show.image} dim />
        ))}
      </div>

      {/* ── Gradient: dark left edge → transparent centre → dark right edge ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, hsl(220 14% 6% / 0.97) 0%, hsl(220 14% 6% / 0.72) 30%, hsl(220 14% 6% / 0.1) 58%, hsl(220 14% 8% / 0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Bottom fade into page background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(0deg, hsl(220 14% 8%) 0%, transparent 36%)',
        pointerEvents: 'none',
      }} />

      {/* ── Text content ── */}
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '56px', maxWidth: '560px' }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 999,
          border: '1px solid hsl(265 80% 50% / 0.55)',
          backgroundColor: 'hsl(265 80% 18% / 0.65)',
          fontSize: 11, fontWeight: 700,
          color: 'hsl(265 80% 82%)',
          marginBottom: 18,
          backdropFilter: 'blur(6px)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span style={{ fontSize: 13 }}>✦</span>
          New This Week
        </div>

        <h1 style={{
          fontSize: 'clamp(34px, 5vw, 64px)',
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-0.03em',
          margin: '0 0 18px', color: '#fff',
        }}>
          What's{' '}
          <span style={{
            background: 'linear-gradient(135deg, hsl(270 80% 72%) 0%, hsl(300 75% 65%) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Streaming</span>
          <br />Now
        </h1>

        <p style={{
          fontSize: 'clamp(13px, 1.5vw, 16px)',
          color: 'hsl(220 8% 65%)', lineHeight: 1.65,
          margin: '0 0 24px', maxWidth: '460px',
        }}>
          Discover the hottest new series across Netflix, Hulu, Apple TV+, and Prime Video.
          Stay updated with release dates and ratings.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'hsl(220 8% 58%)' }}>
          <span style={{ color: 'hsl(145 60% 50%)', fontSize: 15 }}>↗</span>
          <span>5 new seasons in 2026</span>
        </div>
      </div>
    </section>
  );
}
