/**
 * Tests for OfflineNotification component
 * Covers offline state display and positioning
 */

import React from 'react';
import {OfflineNotification} from '../OfflineNotification';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

// Mock useNetwork
const mockUseNetwork = {
  isOnline: false,
  isInitialized: true,
  networkState: {
    isConnected: false,
    isInternetReachable: false,
    type: 'none',
  },
};

jest.mock('@hooks/useNetwork', () => ({
  useNetwork: () => mockUseNetwork,
}));

describe('OfflineNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNetwork.isOnline = false;
    mockUseNetwork.isInitialized = true;
  });

  it('should render when offline', () => {
    const {getByTestId, getByText} = renderWithProviders(<OfflineNotification />);

    expect(getByTestId('offline-notification')).toBeTruthy();
    expect(getByText('No internet connection')).toBeTruthy();
  });

  it('should not render when online', () => {
    mockUseNetwork.isOnline = true;

    const {queryByTestId} = renderWithProviders(<OfflineNotification />);

    expect(queryByTestId('offline-notification')).toBeNull();
  });

  it('should not render when not initialized', () => {
    mockUseNetwork.isInitialized = false;

    const {queryByTestId} = renderWithProviders(<OfflineNotification />);

    expect(queryByTestId('offline-notification')).toBeNull();
  });

  it('should render at top position by default', () => {
    const {getByTestId} = renderWithProviders(<OfflineNotification position="top" />);

    expect(getByTestId('offline-notification')).toBeTruthy();
  });

  it('should render at bottom position', () => {
    const {getByTestId} = renderWithProviders(<OfflineNotification position="bottom" />);

    expect(getByTestId('offline-notification')).toBeTruthy();
  });
});

