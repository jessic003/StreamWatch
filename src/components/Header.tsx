import { Tv } from 'lucide-react';

export function Header() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'hsl(220 14% 8% / 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid hsl(220 14% 18%)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, hsl(265 80% 60%), hsl(30 90% 55%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Tv size={20} color="white" />
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, hsl(265 80% 70%), hsl(30 90% 65%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            StreamWatch
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['Home', 'Top Rated', 'New Releases'].map(link => (
            <a
              key={link}
              href="#"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'hsl(220 8% 55%)',
                textDecoration: 'none',
                transition: 'color 0.2s, background-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLAnchorElement).style.color = 'hsl(0 0% 95%)';
                (e.target as HTMLAnchorElement).style.backgroundColor = 'hsl(220 14% 15%)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLAnchorElement).style.color = 'hsl(220 8% 55%)';
                (e.target as HTMLAnchorElement).style.backgroundColor = 'transparent';
              }}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
