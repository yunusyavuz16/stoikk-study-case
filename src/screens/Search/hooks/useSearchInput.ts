import { useState } from 'react';

interface UseSearchInputParams {
  search: (query: string) => void;
  clearSearch: () => void;
}

interface UseSearchInputReturn {
  searchQuery: string;
  handleSearchChange: (text: string) => void;
  retrySearch: () => void;
  hasSearchQuery: boolean;
}

/**
 * Manages search input state and triggers search/clear actions.
 */
export const useSearchInput = ({
  search,
  clearSearch,
}: UseSearchInputParams): UseSearchInputReturn => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    const trimmed = text.trim();

    if (trimmed) {
      search(trimmed);
    } else {
      clearSearch();
    }
  };

  const retrySearch = () => {
    const trimmed = searchQuery.trim();

    if (trimmed) {
      search(trimmed);
    }
  };

  return {
    searchQuery,
    handleSearchChange,
    retrySearch,
    hasSearchQuery: Boolean(searchQuery.trim()),
  };
};
