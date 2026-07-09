import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DiseaseCard from '../components/library/DiseaseCard';
import diseaseData from '../data/diseaseData';
import './LibraryPage.css';

/**
 * Disease Library Page — comprehensive encyclopedia of banana leaf diseases.
 * Features search, filter by type, and expandable disease cards.
 */
export default function LibraryPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const highlightedDisease = searchParams.get('disease');

  // Scroll to highlighted disease if navigated from scan results
  useEffect(() => {
    if (highlightedDisease) {
      setTimeout(() => {
        const el = document.getElementById(`disease-${highlightedDisease}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [highlightedDisease]);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Fungal', label: 'Fungal' },
    { value: 'Viral', label: 'Viral' },
    { value: 'Normal', label: 'Healthy' },
  ];

  const filteredDiseases = useMemo(() => {
    return diseaseData.filter((disease) => {
      // Filter by type
      if (typeFilter !== 'all' && disease.type !== typeFilter) return false;

      // Filter by search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          disease.name.toLowerCase().includes(query) ||
          disease.scientificName?.toLowerCase().includes(query) ||
          disease.description.toLowerCase().includes(query) ||
          disease.symptoms?.some((s) => s.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [searchQuery, typeFilter]);

  return (
    <div className="library-page">
      {/* Page Header */}
      <div className="library-page__header animate-fade-in-up">
        <div className="section-header">
          <span className="section-eyebrow">Knowledge Base</span>
          <h1 className="section-title">Disease Library</h1>
          <p className="section-subtitle">
            Comprehensive reference guide for banana leaf diseases. Learn about
            symptoms, treatments, and prevention strategies.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="library-page__toolbar animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <div className="library-page__search">
          <svg
            className="library-page__search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="library-page__search-input"
            placeholder="Search diseases, symptoms, treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search disease library"
          />
          {searchQuery && (
            <button
              className="library-page__search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="library-page__filters">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              className={`library-page__filter-btn ${typeFilter === option.value ? 'library-page__filter-btn--active' : ''}`}
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="library-page__stats animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <span className="library-page__stat-text">
          Showing {filteredDiseases.length} of {diseaseData.length} entries
        </span>
      </div>

      {/* Disease Cards */}
      <div className="library-page__grid stagger-children">
        {filteredDiseases.map((disease) => (
          <div key={disease.id} id={`disease-${disease.id}`}>
            <DiseaseCard
              disease={disease}
              defaultExpanded={highlightedDisease === disease.id}
            />
          </div>
        ))}

        {filteredDiseases.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h3 className="empty-state-title">No diseases found</h3>
            <p className="empty-state-text">
              Try adjusting your search terms or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
