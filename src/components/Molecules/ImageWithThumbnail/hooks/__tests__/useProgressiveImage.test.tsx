/**
 * Tests for useProgressiveImage hook
 * Covers progressive image loading logic
 */

import {renderHook, act} from '@testing-library/react-native';
import {useProgressiveImage} from '../useProgressiveImage';

describe('useProgressiveImage', () => {
  it('should initialize with image not loaded', () => {
    const {result} = renderHook(() =>
      useProgressiveImage('https://example.com/image.jpg', 'https://example.com/thumb.jpg'),
    );

    expect(result.current.isFullImageLoaded).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.imageUri).toBe('https://example.com/image.jpg');
    expect(result.current.thumbnailUri).toBe('https://example.com/thumb.jpg');
  });

  it('should handle image load', () => {
    const {result} = renderHook(() =>
      useProgressiveImage('https://example.com/image.jpg'),
    );

    act(() => {
      result.current.onLoad();
    });

    expect(result.current.isFullImageLoaded).toBe(true);
    expect(result.current.hasError).toBe(false);
  });

  it('should handle image error', () => {
    const {result} = renderHook(() =>
      useProgressiveImage('https://example.com/image.jpg'),
    );

    act(() => {
      result.current.onError();
    });

    expect(result.current.hasError).toBe(true);
  });

  it('should reset state when URI changes', () => {
    const {result, rerender} = renderHook(
      (props: {uri: string}) => useProgressiveImage(props.uri),
      {initialProps: {uri: 'https://example.com/image1.jpg'}},
    );

    act(() => {
      result.current.onLoad();
    });

    expect(result.current.isFullImageLoaded).toBe(true);

    rerender({uri: 'https://example.com/image2.jpg'});

    expect(result.current.isFullImageLoaded).toBe(false);
  });

  it('should reset state when thumbnail URI changes', () => {
    const {result, rerender} = renderHook(
      (props: {uri: string; thumb?: string}) => useProgressiveImage(props.uri, props.thumb),
      {
        initialProps: {
          uri: 'https://example.com/image.jpg',
          thumb: 'https://example.com/thumb1.jpg',
        },
      },
    );

    act(() => {
      result.current.onLoad();
    });

    rerender({
      uri: 'https://example.com/image.jpg',
      thumb: 'https://example.com/thumb2.jpg',
    });

    expect(result.current.isFullImageLoaded).toBe(false);
  });

  it('should return null thumbnail when not provided', () => {
    const {result} = renderHook(() => useProgressiveImage('https://example.com/image.jpg'));

    expect(result.current.thumbnailUri).toBeNull();
  });
});

