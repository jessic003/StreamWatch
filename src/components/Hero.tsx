const BG_IMAGES = [
  'https://picsum.photos/seed/show-1/400/600',
  'https://picsum.photos/seed/show-2/400/600',
  'https://picsum.photos/seed/show-3/400/600',
  'https://picsum.photos/seed/show-4/400/600',
  'https://picsum.photos/seed/show-5/400/600',
  'https://picsum.photos/seed/show-6/400/600',
  'https://picsum.photos/seed/show-7/400/600',
  'https://picsum.photos/seed/show-8/400/600',
  'https://picsum.photos/seed/show-9/400/600',
  'https://picsum.photos/seed/show-10/400/600',
  'https://picsum.photos/seed/show-11/400/600',
  'https://picsum.photos/seed/show-12/400/600',
];

export function Hero() {
  return (
    <section style={{
      position: 'relative',
      height: '80vh',
      minHeight: '520px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      {/* Mosaic background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '3px',
      }}>
        {BG_IMAGES.map((src, i) => (
          <div key={i} style={{ overflow: 'hidden', position: 'relative' }}>
            <img
              src={src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.55)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Left gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, hsl(220 14% 6% / 0.97) 0%, hsl(220 14% 6% / 0.85) 38%, hsl(220 14% 6% / 0.4) 65%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(0deg, hsl(220 14% 8%) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', paddingBottom: '60px', maxWidth: '600px' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '999px',
          border: '1px solid hsl(265 80% 50% / 0.5)',
          backgroundColor: 'hsl(265 80% 20% / 0.6)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'hsl(265 80% 80%)',
          marginBottom: '20px',
          backdropFilter: 'blur(4px)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          <span style={{ fontSize: '14px' }}>✦</span>
          New This Week
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 5.5vw, 68px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          margin: '0 0 20px',
          color: '#fff',
        }}>
          What's{' '}
          <span style={{
            background: 'linear-gradient(135deg, hsl(265 80% 70%) 0%, hsl(290 80% 65%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Streaming
          </span>
          <br />Now
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(14px, 1.6vw, 17px)',
          color: 'hsl(220 8% 68%)',
          lineHeight: 1.65,
          margin: '0 0 28px',
          maxWidth: '480px',
        }}>
          Discover the hottest new series across Netflix, Hulu, Apple TV+, and Prime Video.
          Stay updated with release dates and ratings.
        </p>

        {/* Stat */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '14px',
          color: 'hsl(220 8% 60%)',
        }}>
          <span style={{ color: 'hsl(145 60% 50%)', fontSize: '16px' }}>↗</span>
          <span>13 new releases this week</span>
        </div>
      </div>
    </section>
  );
}
