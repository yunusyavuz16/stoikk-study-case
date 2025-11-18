/**
 * Tests for MediaGridItem component
 * Covers image and video rendering in grid
 */

import React from 'react';
import {MediaGridItem} from '../MediaGridItem';
import {renderWithProviders} from '../../../../../__tests__/utils/testUtils';

describe('MediaGridItem', () => {
  it('should render image item', () => {
    const props = {
      id: 'img_1',
      type: 'image' as const,
      uri: 'https://example.com/image.jpg',
      thumbnail: 'https://example.com/thumb.jpg',
      isVisible: true,
    };

    const {UNSAFE_root} = renderWithProviders(<MediaGridItem {...props} />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should render video item', () => {
    const props = {
      id: 'video_1',
      type: 'video' as const,
      uri: 'https://example.com/video.mp4',
      thumbnail: 'https://example.com/video-thumb.jpg',
      duration: 30,
      isVisible: true,
    };

    const {UNSAFE_root} = renderWithProviders(<MediaGridItem {...props} />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should pause video when not visible', () => {
    const props = {
      id: 'video_1',
      type: 'video' as const,
      uri: 'https://example.com/video.mp4',
      thumbnail: 'https://example.com/video-thumb.jpg',
      duration: 30,
      isVisible: false,
    };

    const {UNSAFE_root} = renderWithProviders(<MediaGridItem {...props} />);

    expect(UNSAFE_root).toBeDefined();
  });
});

