// /src/pages/SearchPage.tsx
import { useState, useCallback } from 'react';
import '../assets/css/SearchPage.css';

// Type definition matching the C# model
interface SpaceImage {
  nasaId: string;
  title: string;
  description?: string;
  previewUrl?: string;
  dateCreated?: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<SpaceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasSearched, setHasSearched] = useState(false); // Track if user has searched

  const ITEMS_PER_PAGE = 20;
  const API_BASE = 'http://localhost:5001/api/NasaImages/search';

  // Fetch images from API
  const fetchImages = useCallback(async (searchQuery: string, pageNum: number, append = false) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}?q=${encodeURIComponent(searchQuery)}&page=${pageNum}&take=${ITEMS_PER_PAGE}&excludeEarth=true`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats (array or wrapped object)
      let imageArray: SpaceImage[] = [];
      if (Array.isArray(data)) {
        imageArray = data;
      } else if (data && typeof data === 'object') {
        // API returns { query, returned, items: [...] }
        imageArray = data.items || data.data || data.results || [];
      }

      // Use API's returned count or array length to check for more
      const returnedCount = data.returned ?? imageArray.length;
      setHasMore(returnedCount === ITEMS_PER_PAGE);
      
      // Append or replace images
      setImages(prev => append ? [...prev, ...imageArray] : imageArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    setHasSearched(true);
    fetchImages(query, 1);
  };

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(query, nextPage, true);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="search-page-container">
      {/* Background stars effect */}
      <div className="search-page-stars"></div>
      <div className="search-page-stars2"></div>

      {/* Header with search */}
      <header className="search-page-header">
        <h1 className="search-page-title">Explore the Cosmos</h1>
        <p className="search-page-subtitle">Search NASA's image library</p>

        <form onSubmit={handleSearch} className="search-page-form">
          <div className="search-page-input-wrapper">
            <svg
              className="search-page-input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for galaxies, planets, nebulae..."
              className="search-page-input"
            />
            <button
              type="submit"
              className="search-page-btn"
              disabled={loading || !query.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </header>

      {/* Error message */}
      {error && (
        <div className="search-page-error">
          <p>⚠️ {error}</p>
          <button onClick={() => fetchImages(query, page)} className="search-page-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Results count */}
      {images.length > 0 && (
        <p className="search-page-results-count">
          Showing {images.length} result{images.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Image grid */}
      <div className="search-page-grid">
        {images.map((image) => (
          <article key={image.nasaId} className="search-page-card">
            <div className="search-page-card-image-wrapper">
              {image.previewUrl ? (
                <img
                  src={image.previewUrl}
                  alt={image.title}
                  className="search-page-card-image"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231a1a2e" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%234a4a6a" font-size="12">No Image</text></svg>';
                  }}
                />
              ) : (
                <div className="search-page-card-placeholder">
                  <span>No Preview</span>
                </div>
              )}
              <div className="search-page-card-overlay">
                <span className="search-page-card-date">{formatDate(image.dateCreated)}</span>
              </div>
            </div>
            <div className="search-page-card-content">
              <h3 className="search-page-card-title">{image.title}</h3>
              {image.description && (
                <p className="search-page-card-description">
                  {image.description.length > 120
                    ? `${image.description.substring(0, 120)}...`
                    : image.description}
                </p>
              )}
              <span className="search-page-card-id">ID: {image.nasaId}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Empty state */}
      {!loading && images.length === 0 && !error && (
        <div className="search-page-empty">
          <div className="search-page-empty-icon">{hasSearched ? '🔭' : '🚀'}</div>
          <p>
            {hasSearched
              ? 'No images found. Try a different search term!'
              : 'Enter a search term to explore NASA\'s image library'}
          </p>
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="search-page-loading">
          <div className="search-page-spinner"></div>
          <p>Searching the cosmos...</p>
        </div>
      )}

      {/* Load more button */}
      {!loading && images.length > 0 && hasMore && (
        <div className="search-page-load-more">
          <button onClick={handleLoadMore} className="search-page-load-more-btn">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;