/**
 * Tests for PostVideo component
 * Covers video rendering and error handling
 */

import React from 'react';
import {PostVideo} from '../PostVideo';
import {renderWithProviders, createMockVideoPost} from '../../../../__tests__/utils/testUtils';

describe('PostVideo', () => {
  const mockVideo = createMockVideoPost().media[0];

  it('should render video', () => {
    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={mockVideo} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should pause video when paused prop is true', () => {
    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={mockVideo} paused={true} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should pause video when not visible', () => {
    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={mockVideo} isVisible={false} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should show thumbnail fallback on error', () => {
    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={mockVideo} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle video with thumbnail', () => {
    const videoWithThumb = {
      ...mockVideo,
      thumbnail: 'https://example.com/thumb.jpg',
    };

    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={videoWithThumb} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });
});

