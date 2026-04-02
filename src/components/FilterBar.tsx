import { Search } from 'lucide-react';
import type { Platform } from '@/types/show';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedPlatforms: Platform[];
  onPlatformToggle: (p: Platform) => void;
  selectedGenre: string;
  onGenreChange: (g: string) => void;
}

const platforms: { id: Platform; label: string; color: string }[] = [
  { id: 'netflix', label: 'Netflix', color: '#E50914' },
  { id: 'hulu', label: 'Hulu', color: '#1CE783' },
  { id: 'apple', label: 'Apple TV+', color: '#A0A0A0' },
  { id: 'prime', label: 'Prime Video', color: '#00A8E1' },
];

const genres = ['Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Action', 'Fantasy', 'Crime', 'Documentary'];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedPlatforms,
  onPlatformToggle,
  selectedGenre,
  onGenreChange,
}: FilterBarProps) {
  return (
    <div style={{
      position: 'sticky',
      top: '64px',
      zIndex: 40,
      backgroundColor: 'hsl(220 14% 9% / 0.97)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid hsl(220 14% 18%)',
      padding: '14px 0',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Search input */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: '180px', maxWidth: '360px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(220 8% 50%)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search shows..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 38px',
                borderRadius: '8px',
                border: '1px solid hsl(220 14% 22%)',
                backgroundColor: 'hsl(220 14% 13%)',
                color: 'hsl(0 0% 90%)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Platform toggles */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {platforms.map(p => {
              const active = selectedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => onPlatformToggle(p.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: `1px solid ${active ? p.color : 'hsl(220 14% 22%)'}`,
                    backgroundColor: active ? `${p.color}20` : 'hsl(220 14% 13%)',
                    color: active ? p.color : 'hsl(220 8% 55%)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Genre dropdown */}
          <select
            value={selectedGenre}
            onChange={e => onGenreChange(e.target.value)}
            style={{
              padding: '8px 32px 8px 12px',
              borderRadius: '8px',
              border: '1px solid hsl(220 14% 22%)',
              backgroundColor: 'hsl(220 14% 13%)',
              color: selectedGenre ? 'hsl(0 0% 90%)' : 'hsl(220 8% 55%)',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
            }}
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
