import React, { useState, useEffect } from 'react';
import { CampusId } from '../../types/campus';
import { searchService, SearchResultItem } from '../../services/searchService';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Search, X, Navigation, Building2, MapPin, Sparkles, ArrowRight } from 'lucide-react';

interface SearchOverlayProps {
  campusId: CampusId;
  onSelectResult: (result: SearchResultItem) => void;
  onStartRoute: (result: SearchResultItem) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  campusId,
  onSelectResult,
  onStartRoute
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = searchService.getPopularSuggestions(campusId);

  useEffect(() => {
    if (query.trim().length > 0) {
      const res = searchService.search(query, campusId);
      setResults(res);
    } else {
      setResults([]);
    }
  }, [query, campusId]);

  const handleSuggestionClick = (suggestQuery: string) => {
    setQuery(suggestQuery);
    const res = searchService.search(suggestQuery, campusId);
    setResults(res);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}
    >
      {/* Prominent Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '8px 14px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: isFocused ? '2px solid #168C83' : '1px solid #E5E7EB',
          transition: 'all 0.2s ease'
        }}
      >
        <Search size={18} color="#777F82" style={{ marginRight: 8, flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={`Search ${campusId === 'mbu-tirupati' ? 'MBU' : 'IIT Tirupati'} (e.g. Washroom, Room 304, Library)...`}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 13,
            color: '#252A2B',
            background: 'transparent'
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggested Quick Prompt Chips (When not searching) */}
      {!query && isFocused && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: '12px 14px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1px solid #E5E7EB',
            maxHeight: 280,
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#777F82',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Sparkles size={13} color="#168C83" />
            <span>Natural-Language Quick Queries</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(item.query)}
                style={{
                  backgroundColor: '#F7F7F2',
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: '6px 10px',
                  fontSize: 12,
                  color: '#252A2B',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>{item.label}</span>
                <ArrowRight size={12} color="#168C83" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Dropdown List */}
      {query && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: '8px 0',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)',
            border: '1px solid #E5E7EB',
            maxHeight: 320,
            overflowY: 'auto'
          }}
        >
          {results.length === 0 ? (
            <div style={{ padding: '16px 20px', textAlign: 'center', color: '#777F82', fontSize: 13 }}>
              No matches found for "{query}" in this campus package.
            </div>
          ) : (
            results.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #F1F1E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  cursor: 'pointer'
                }}
                onClick={() => onSelectResult(item)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: item.type === 'category_washroom' ? '#E0F2FE' : '#E6F5F3',
                      color: '#168C83',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {item.type === 'building' ? (
                      <Building2 size={16} />
                    ) : item.type === 'poi' ? (
                      <MapPin size={16} />
                    ) : (
                      <Navigation size={16} />
                    )}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#252A2B' }}>
                        {item.title}
                      </span>
                      <ProvenanceBadge type={item.provenance} size="sm" />
                    </div>
                    <div style={{ fontSize: 11, color: '#777F82', marginTop: 2 }}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Direct Route Action Button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onStartRoute(item);
                  }}
                  style={{
                    backgroundColor: '#168C83',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 14,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    flexShrink: 0
                  }}
                >
                  <Navigation size={12} />
                  <span>Route</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
