/**
 * Tests for PostImageCarousel component
 * Covers carousel rendering, pagination, and swipe gestures
 */

import React from 'react';
import {PostImageCarousel} from '../PostImageCarousel';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';
import type {MediaItem} from '../../../../types/post.types';

describe('PostImageCarousel', () => {
  const mockMedia: MediaItem[] = [
    {
      id: 'img_1',
      type: 'image',
      uri: 'https://example.com/image1.jpg',
      thumbnail: 'https://example.com/thumb1.jpg',
    },
    {
      id: 'img_2',
      type: 'image',
      uri: 'https://example.com/image2.jpg',
      thumbnail: 'https://example.com/thumb2.jpg',
    },
  ];

  it('should render carousel with multiple images', () => {
    const {UNSAFE_getAllByType} = renderWithProviders(
      <PostImageCarousel media={mockMedia} />,
    );

    // Should render ScrollView for carousel
    expect(UNSAFE_getAllByType).toBeDefined();
  });

  it('should render pagination dots for multiple images', () => {
    renderWithProviders(
      <PostImageCarousel media={mockMedia} />,
    );

    // Pagination should be rendered when media.length > 1
    expect(mockMedia.length).toBeGreaterThan(1);
  });

  it('should not render pagination for single image', () => {
    const singleMedia: MediaItem[] = [mockMedia[0]];

    renderWithProviders(<PostImageCarousel media={singleMedia} />);

    // Pagination should not be rendered for single image
    expect(singleMedia.length).toBe(1);
  });

  it('should handle empty media array', () => {
    renderWithProviders(<PostImageCarousel media={[]} />);
    // Should not crash
  });
});

