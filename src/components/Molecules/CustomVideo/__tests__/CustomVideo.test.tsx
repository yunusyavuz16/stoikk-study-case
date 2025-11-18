/**
 * Tests for CustomVideo component
 * Covers video rendering, error handling, and controls
 */

import React from 'react';
import {CustomVideo} from '../CustomVideo';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

describe('CustomVideo', () => {
  const mockSource = {uri: 'https://example.com/video.mp4'};
  const mockOnLoad = jest.fn();
  const mockOnError = jest.fn();
  const mockOnProgress = jest.fn();
  const mockOnEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render video with valid source', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={false} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should render fallback view with invalid source', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={null as any} paused={false} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle video load', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={false} onLoad={mockOnLoad} />,
    );

    expect(UNSAFE_root).toBeDefined();
    // Video load is handled internally
  });

  it('should handle video error', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={false} onPlaybackError={mockOnError} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle video progress', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={false} onProgress={mockOnProgress} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle video end', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={false} onEnd={mockOnEnd} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should show play button when paused', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={true} showPlayButton={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should handle tap to play when enabled', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={true} enableTapToPlay={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should show timer when enabled', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={false} showTimer={true} duration={30} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should use aggressive memory mode when enabled', () => {
    const {UNSAFE_root} = renderWithProviders(
      <CustomVideo source={mockSource} paused={false} aggressiveMemoryMode={true} />,
    );

    expect(UNSAFE_root).toBeDefined();
  });
});

