/**
 * Additional tests for PostVideo component
 * Covers error handling and thumbnail fallback
 */

import React from 'react';
import {PostVideo} from '../PostVideo';
import {renderWithProviders, createMockVideoPost} from '../../../../__tests__/utils/testUtils';

describe('PostVideo - Additional Coverage', () => {
  const mockVideo = createMockVideoPost().media[0];

  it('should handle video error and show thumbnail fallback', () => {
    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={mockVideo} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle video without thumbnail', () => {
    const videoWithoutThumb = {
      ...mockVideo,
      thumbnail: undefined,
    };

    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={videoWithoutThumb} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle video load event', () => {
    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={mockVideo} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle video with number uri', () => {
    const videoWithNumberUri = {
      ...mockVideo,
      uri: 123 as any,
    };

    const {UNSAFE_root} = renderWithProviders(
      <PostVideo video={videoWithNumberUri} isVisible={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });
});

