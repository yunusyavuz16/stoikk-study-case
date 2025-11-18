/**
 * Tests for FeedHeader component
 * Covers navigation handlers
 */

import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {FeedHeader} from '../FeedHeader';
import {renderWithProviders} from '../../../../../__tests__/utils/testUtils';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('FeedHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render feed header', () => {
    const {UNSAFE_root} = renderWithProviders(<FeedHeader />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should navigate to Search when search is pressed', () => {
    const {getByLabelText} = renderWithProviders(<FeedHeader />);

    const searchButton = getByLabelText('Go to search');
    fireEvent.press(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('Search');
  });

  it('should navigate to Profile when profile button is pressed', () => {
    const {getByLabelText} = renderWithProviders(<FeedHeader />);

    const profileButton = getByLabelText('Go to profile');
    fireEvent.press(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });
});

