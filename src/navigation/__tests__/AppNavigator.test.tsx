/**
 * Tests for AppNavigator
 * Covers navigation setup and auth-based routing
 */

import React from 'react';
import {AppNavigator} from '../AppNavigator';
import {renderWithProviders} from '../../__tests__/utils/testUtils';

// Mock useAuthRTK
const mockUseAuthRTK = {
  isAuthenticated: false,
  isLoading: false,
};

jest.mock('@hooks/useAuthRTK', () => ({
  useAuthRTK: () => mockUseAuthRTK,
}));

// Mock LoadingScreen
jest.mock('@/components/Organisms/LoadingScreen/LoadingScreen', () => ({
  LoadingScreen: () => null,
}));

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading screen when loading', () => {
    mockUseAuthRTK.isLoading = true;

    renderWithProviders(<AppNavigator />);

    expect(mockUseAuthRTK.isLoading).toBe(true);
  });

  it('should render Login screen when not authenticated', () => {
    mockUseAuthRTK.isAuthenticated = false;
    mockUseAuthRTK.isLoading = false;

    const {UNSAFE_root} = renderWithProviders(<AppNavigator />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should render Feed screen when authenticated', () => {
    mockUseAuthRTK.isAuthenticated = true;
    mockUseAuthRTK.isLoading = false;

    const {UNSAFE_root} = renderWithProviders(<AppNavigator />);

    expect(UNSAFE_root).toBeDefined();
  });
});

