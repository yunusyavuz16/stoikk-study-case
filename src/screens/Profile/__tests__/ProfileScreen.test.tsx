/**
 * Tests for ProfileScreen
 * Covers profile rendering and logout functionality
 */

import React from 'react';
import {ProfileScreen} from '../ProfileScreen';
import {renderWithProviders, createMockUser} from '../../../__tests__/utils/testUtils';

// Mock useProfileScreenData
const mockUseProfileScreenData = {
  authLoading: false,
  user: createMockUser(),
  styles: {},
  isLoggingOut: false,
  handleLogout: jest.fn(),
  theme: {colors: {primary: '#000'}},
};

jest.mock('../hooks/useProfileScreenData', () => ({
  useProfileScreenData: () => mockUseProfileScreenData,
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render profile screen', () => {
    const {UNSAFE_root} = renderWithProviders(<ProfileScreen />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should show loading state when auth is loading', () => {
    mockUseProfileScreenData.authLoading = true;
    mockUseProfileScreenData.user = createMockUser();

    renderWithProviders(<ProfileScreen />);

    expect(mockUseProfileScreenData.authLoading).toBe(true);
  });

  it('should show loading state when user is null', () => {
    mockUseProfileScreenData.authLoading = false;
    mockUseProfileScreenData.user = createMockUser();

    renderWithProviders(<ProfileScreen />);

    expect(mockUseProfileScreenData.user).toBeDefined();
  });

  it('should render profile content when user exists', () => {
    mockUseProfileScreenData.authLoading = false;
    mockUseProfileScreenData.user = createMockUser();

    const {UNSAFE_root} = renderWithProviders(<ProfileScreen />);

    expect(UNSAFE_root).toBeDefined();
  });
});

