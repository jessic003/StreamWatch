import type { Show } from '@/types/show';
import { ShowCard } from '@/components/ShowCard';

interface ShowGridProps {
  shows: Show[];
  title: string;
  subtitle?: string;
}

export function ShowGrid({ shows, title, subtitle }: ShowGridProps) {
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
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '15px', color: 'hsl(220 8% 55%)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
      }}>
        {shows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </section>
  );
}
