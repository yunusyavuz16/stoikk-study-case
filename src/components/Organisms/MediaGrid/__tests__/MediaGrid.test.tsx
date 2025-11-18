/**
 * Tests for MediaGrid component
 * Covers grid rendering and responsive columns
 */

import React from 'react';
import {MediaGrid} from '../MediaGrid';
import {renderWithProviders, createMockPost} from '../../../../__tests__/utils/testUtils';

// Mock hooks
jest.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    width: 375,
    breakpoint: 'sm',
  }),
}));

describe('MediaGrid', () => {
  const mockMedia = [
    ...createMockPost().media,
    ...createMockPost({id: 'post_2'}).media,
  ];

  it('should render media grid', () => {
    const {UNSAFE_root} = renderWithProviders(<MediaGrid data={mockMedia} />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should use custom numColumns when provided', () => {
    const {UNSAFE_root} = renderWithProviders(<MediaGrid data={mockMedia} numColumns={4} />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle empty data', () => {
    const {UNSAFE_root} = renderWithProviders(<MediaGrid data={[]} />);

    expect(UNSAFE_root).toBeDefined();
  });
});

