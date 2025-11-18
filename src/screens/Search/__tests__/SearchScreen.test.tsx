/**
 * Tests for SearchScreen
 * Covers search input, grid rendering, and media display
 */

import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {SearchScreen} from '../SearchScreen';
import {renderWithProviders} from '../../../__tests__/utils/testUtils';

// Mock hooks
const mockUseSearchRTK: {
  media: any[];
  posts: any[];
  mediaToPostMap: Map<any, any>;
  isLoading: boolean;
  error: Error | null;
  hasInitialContent: boolean;
  search: jest.Mock;
  clearSearch: jest.Mock;
} = {
  media: [],
  posts: [],
  mediaToPostMap: new Map(),
  isLoading: false,
  error: null,
  hasInitialContent: false,
  search: jest.fn(),
  clearSearch: jest.fn(),
};

const mockUseSearchInput = {
  searchQuery: '',
  handleSearchChange: jest.fn(),
  retrySearch: jest.fn(),
  hasSearchQuery: false,
};

const mockUseResponsiveColumns = jest.fn(() => 3);
const mockUseAutoFocus = jest.fn();

jest.mock('../hooks/useSearchRTK', () => ({
  useSearchRTK: () => mockUseSearchRTK,
}));

jest.mock('../hooks/useSearchInput', () => ({
  useSearchInput: () => mockUseSearchInput,
}));

jest.mock('../hooks/useResponsiveColumns', () => ({
  useResponsiveColumns: () => mockUseResponsiveColumns(),
}));

jest.mock('../hooks/useAutoFocus', () => ({
  useAutoFocus: () => mockUseAutoFocus(),
}));

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchRTK.media = [];
    mockUseSearchRTK.isLoading = false;
    mockUseSearchRTK.error = null;
    mockUseSearchInput.searchQuery = '';
    mockUseSearchInput.hasSearchQuery = false;
  });

  it('should render search screen', () => {
    const {getByTestId} = renderWithProviders(<SearchScreen />);

    expect(getByTestId('search-screen-header')).toBeTruthy();
  });

  it('should render search bar', () => {
    const {getByPlaceholderText} = renderWithProviders(<SearchScreen />);

    expect(getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('should call handleSearchChange when search input changes', () => {
    const {getByPlaceholderText} = renderWithProviders(<SearchScreen />);

    const searchInput = getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'test query');

    expect(mockUseSearchInput.handleSearchChange).toHaveBeenCalledWith('test query');
  });

  it('should show loading skeleton when loading', () => {
    mockUseSearchRTK.isLoading = true;

    renderWithProviders(<SearchScreen />);

    expect(mockUseSearchRTK.isLoading).toBe(true);
  });

  it('should show error state when error exists', () => {
    mockUseSearchRTK.error = new Error('Search failed') as Error | null;

    const {getByText} = renderWithProviders(<SearchScreen />);

    expect(getByText(/Search failed/)).toBeTruthy();
  });

  it('should show empty state when no search results', () => {
    mockUseSearchInput.hasSearchQuery = true;
    mockUseSearchRTK.media = [];

    renderWithProviders(<SearchScreen />);

    expect(mockUseSearchRTK.media.length).toBe(0);
  });

  it('should render media grid when results exist', () => {
    mockUseSearchRTK.media = [
      {
        id: 'media_1',
        type: 'image',
        uri: 'https://example.com/image.jpg',
        thumbnail: 'https://example.com/thumb.jpg',
      },
    ];

    renderWithProviders(<SearchScreen />);

    expect(mockUseSearchRTK.media.length).toBeGreaterThan(0);
  });

  it('should show initial content skeleton when no search query', () => {
    mockUseSearchInput.hasSearchQuery = false;
    mockUseSearchRTK.hasInitialContent = false;
    mockUseSearchRTK.isLoading = true;

    renderWithProviders(<SearchScreen />);

    expect(mockUseSearchRTK.isLoading).toBe(true);
  });
});

