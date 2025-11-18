/**
 * Tests for useSearchInput hook
 * Covers search input state management
 */

import {renderHook, act} from '@testing-library/react-native';
import {useSearchInput} from '../useSearchInput';

describe('useSearchInput', () => {
  const mockSearch = jest.fn();
  const mockClearSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty query', () => {
    const {result} = renderHook(() =>
      useSearchInput({
        search: mockSearch,
        clearSearch: mockClearSearch,
      }),
    );

    expect(result.current.searchQuery).toBe('');
    expect(result.current.hasSearchQuery).toBe(false);
  });

  it('should update search query and trigger search', () => {
    const {result} = renderHook(() =>
      useSearchInput({
        search: mockSearch,
        clearSearch: mockClearSearch,
      }),
    );

    act(() => {
      result.current.handleSearchChange('test query');
    });

    expect(result.current.searchQuery).toBe('test query');
    expect(result.current.hasSearchQuery).toBe(true);
    expect(mockSearch).toHaveBeenCalledWith('test query');
  });

  it('should clear search when query is empty', () => {
    const {result} = renderHook(() =>
      useSearchInput({
        search: mockSearch,
        clearSearch: mockClearSearch,
      }),
    );

    act(() => {
      result.current.handleSearchChange('test');
    });

    act(() => {
      result.current.handleSearchChange('');
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.hasSearchQuery).toBe(false);
    expect(mockClearSearch).toHaveBeenCalled();
  });

  it('should trim whitespace when triggering search', () => {
    const {result} = renderHook(() =>
      useSearchInput({
        search: mockSearch,
        clearSearch: mockClearSearch,
      }),
    );

    act(() => {
      result.current.handleSearchChange('  test  ');
    });

    expect(mockSearch).toHaveBeenCalledWith('test');
  });

  it('should retry search with current query', () => {
    const {result} = renderHook(() =>
      useSearchInput({
        search: mockSearch,
        clearSearch: mockClearSearch,
      }),
    );

    act(() => {
      result.current.handleSearchChange('test query');
    });

    jest.clearAllMocks();

    act(() => {
      result.current.retrySearch();
    });

    expect(mockSearch).toHaveBeenCalledWith('test query');
  });

  it('should not retry if query is empty', () => {
    const {result} = renderHook(() =>
      useSearchInput({
        search: mockSearch,
        clearSearch: mockClearSearch,
      }),
    );

    act(() => {
      result.current.retrySearch();
    });

    expect(mockSearch).not.toHaveBeenCalled();
  });
});

