import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ShowGrid } from '@/components/ShowGrid';
import { PlatformSection } from '@/components/PlatformSection';
import { FilterBar } from '@/components/FilterBar';
import { ComingSoonSection } from '@/components/ComingSoonSection';
import { RenewalSection } from '@/components/RenewalSection';
import { WeeklyTopSection } from '@/components/WeeklyTopSection';
import { shows, topRanked, newReleases, comingSoon } from '@/data/shows';
import type { Platform } from '@/types/show';

const Index = () => {
  const platforms: Platform[] = ['netflix', 'hulu', 'apple', 'prime'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const hasActiveFilters = searchQuery || selectedPlatforms.length > 0 || selectedGenre;

  const filteredShows = useMemo(() => {
    return shows.filter(show => {
      const matchesSearch = !searchQuery ||
        show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform = selectedPlatforms.length === 0 ||
        selectedPlatforms.includes(show.platform);

      const matchesGenre = !selectedGenre || show.genre === selectedGenre;

      return matchesSearch && matchesPlatform && matchesGenre;
    });
  }, [searchQuery, selectedPlatforms, selectedGenre]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <Hero />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPlatforms={selectedPlatforms}
          onPlatformToggle={handlePlatformToggle}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        <div className="container">
          {hasActiveFilters ? (
            <>
              <div className="py-8">
                <p className="text-muted-foreground mb-4">
                  Found {filteredShows.length} show{filteredShows.length !== 1 ? 's' : ''}
                </p>
                {filteredShows.length > 0 ? (
                  <ShowGrid
                    shows={filteredShows}
                    title="Search Results"
                  />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">No shows found matching your filters</p>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <ShowGrid
                shows={topRanked}
                title="🏆 Top Ranked Shows"
                subtitle="The highest rated series across all platforms"
              />

              <ShowGrid
                shows={newReleases}
                title="✨ New Releases"
                subtitle="Fresh releases you can watch now"
              />

              <WeeklyTopSection />

              <RenewalSection />

              <ComingSoonSection shows={comingSoon} />

              <div className="border-t border-border mt-8 pt-8">
                <h2 className="font-display text-3xl font-bold mb-8">Browse by Platform</h2>
                {platforms.map(platform => (
                  <PlatformSection key={platform} platform={platform} />
                ))}
              </div>
            </>
          )}
        </div>

        <footer className="border-t border-border mt-16 py-8">
          <div className="container text-center text-sm text-muted-foreground">
            <p>StreamWatch — Your guide to the best shows across streaming platforms</p>
            <p className="mt-2">Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
