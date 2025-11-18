/**
 * Tests for EmptyState component
 * Covers different empty state types
 */

import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {EmptyState} from '../EmptyState';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

describe('EmptyState', () => {
  it('should render generic empty state', () => {
    const {getByText} = renderWithProviders(<EmptyState type="generic" />);

    expect(getByText('Nothing here')).toBeTruthy();
    expect(getByText('There is no content to display')).toBeTruthy();
  });

  it('should render search empty state', () => {
    const {getByText} = renderWithProviders(<EmptyState type="search" />);

    expect(getByText('No results found')).toBeTruthy();
    expect(getByText('Try searching with different keywords')).toBeTruthy();
  });

  it('should render feed empty state', () => {
    const {getByText} = renderWithProviders(<EmptyState type="feed" />);

    expect(getByText('No posts yet')).toBeTruthy();
    expect(getByText('Check back later for new content')).toBeTruthy();
  });

  it('should render network empty state', () => {
    const {getByText} = renderWithProviders(<EmptyState type="network" />);

    expect(getByText('Connection error')).toBeTruthy();
    expect(getByText('Please check your internet connection and try again')).toBeTruthy();
  });

  it('should show retry button for network type', () => {
    const mockRetry = jest.fn();
    const {getByText} = renderWithProviders(
      <EmptyState type="network" onRetry={mockRetry} />,
    );

    const retryHint = getByText('Tap to retry');
    fireEvent.press(retryHint);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should use custom title and message', () => {
    const {getByText} = renderWithProviders(
      <EmptyState type="generic" title="Custom Title" message="Custom Message" />,
    );

    expect(getByText('Custom Title')).toBeTruthy();
    expect(getByText('Custom Message')).toBeTruthy();
  });
});

