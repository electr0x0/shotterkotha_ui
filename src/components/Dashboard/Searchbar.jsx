"use client";
import { useState, useRef, useEffect } from 'react';
import { IconSearch, IconClock, IconTrendingUp } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

function Searchbar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'Nature photography',
    'Street art',
    'Urban lifestyle',
  ]); // Placeholder data
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulated API call for suggestions
  const fetchSuggestions = async (searchTerm) => {
    // TODO: Replace with actual API call
    return [
      `${searchTerm} in nature`,
      `${searchTerm} photography`,
      `${searchTerm} art`,
    ];
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (value.length > 0) {
      const fetchedSuggestions = await fetchSuggestions(value);
      setSuggestions(fetchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchItemClick = (term) => {
    setQuery(term);
    setIsOpen(false);
    // TODO: Handle search
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative flex items-center">
        <IconSearch className="absolute left-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..."
          className="w-full py-2 pl-10 pr-4 text-sm bg-secondary rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-popover rounded-md shadow-lg border border-border overflow-hidden z-50">
          {/* Suggestions */}
          {query && suggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
                <IconTrendingUp className="w-4 h-4" />
                <span>Suggestions</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchItemClick(suggestion)}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent rounded-sm flex items-center gap-2 group"
                >
                  <IconSearch className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="flex items-center justify-between px-3 py-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconClock className="w-4 h-4" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={() => setRecentSearches([])}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchItemClick(term)}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent rounded-sm flex items-center gap-2 group"
                >
                  <IconClock className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {query && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Searchbar;