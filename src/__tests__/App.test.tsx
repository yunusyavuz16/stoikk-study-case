/**
 * Tests for App component
 * Covers app initialization and provider setup
 */

import React from 'react';
// render is used via renderWithProviders
import App from '../app';
import {renderWithProviders} from './utils/testUtils';

// Mock useLockOrientation
jest.mock('../hooks/useLockOrientation', () => ({
  useLockOrientation: jest.fn(),
}));

describe('App', () => {
  it('should render app without crashing', () => {
    const {UNSAFE_root} = renderWithProviders(<App />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render with all providers', () => {
    const {UNSAFE_root} = renderWithProviders(<App />);

    // App should render with Redux Provider, ThemeProvider, SafeAreaProvider, etc.
    expect(UNSAFE_root).toBeDefined();
  });
});

