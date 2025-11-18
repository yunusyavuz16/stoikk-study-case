/**
 * Tests for useMediaCarousel hook
 * Covers carousel navigation and state management
 */

import {renderHook, act} from '@testing-library/react-native';
import {useMediaCarousel} from '../useMediaCarousel';
import type {MediaItem} from '../../../../../types/post.types';

describe('useMediaCarousel', () => {
  const mockMedia: MediaItem[] = [
    {id: 'img_1', type: 'image', uri: 'https://example.com/image1.jpg'},
    {id: 'img_2', type: 'image', uri: 'https://example.com/image2.jpg'},
    {id: 'img_3', type: 'image', uri: 'https://example.com/image3.jpg'},
  ];

  it('should initialize with initial index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 1));

    expect(result.current.currentIndex).toBe(1);
  });

  it('should set current index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 0));

    act(() => {
      result.current.setCurrentIndex(2);
    });

    expect(result.current.currentIndex).toBe(2);
  });

  it('should go to next index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 0));

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should not go beyond last index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 2));

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(2);
  });

  it('should go to previous index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 1));

    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.currentIndex).toBe(0);
  });

  it('should not go before first index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 0));

    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.currentIndex).toBe(0);
  });

  it('should go to specific index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 0));

    act(() => {
      result.current.goToIndex(2);
    });

    expect(result.current.currentIndex).toBe(2);
  });

  it('should not go to invalid index', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 1));

    act(() => {
      result.current.goToIndex(-1);
    });

    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.goToIndex(10);
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should indicate if can go next', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 0));

    expect(result.current.canGoNext).toBe(true);

    act(() => {
      result.current.setCurrentIndex(2);
    });

    expect(result.current.canGoNext).toBe(false);
  });

  it('should indicate if can go previous', () => {
    const {result} = renderHook(() => useMediaCarousel(mockMedia, 2));

    expect(result.current.canGoPrevious).toBe(true);

    act(() => {
      result.current.setCurrentIndex(0);
    });

    expect(result.current.canGoPrevious).toBe(false);
  });
});

