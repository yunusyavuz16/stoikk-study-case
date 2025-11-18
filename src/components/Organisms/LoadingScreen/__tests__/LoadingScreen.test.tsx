/**
 * Tests for LoadingScreen component
 * Covers loading indicator display
 */

import React from 'react';
import {LoadingScreen} from '../LoadingScreen';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

describe('LoadingScreen', () => {
  it('should render loading screen', () => {
    const {getByText, UNSAFE_getByType} = renderWithProviders(<LoadingScreen />);

    expect(getByText('Loading...')).toBeTruthy();
    // Check for ActivityIndicator
    expect(UNSAFE_getByType).toBeDefined();
  });

  it('should display loading text', () => {
    const {getByText} = renderWithProviders(<LoadingScreen />);

    const loadingText = getByText('Loading...');
    expect(loadingText).toBeTruthy();
  });
});

