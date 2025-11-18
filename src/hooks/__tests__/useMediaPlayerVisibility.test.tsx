/**
 * Tests for useMediaPlayerVisibility hook
 * Covers media visibility tracking
 */

import {renderHook, act} from '@testing-library/react-native';
import {useMediaPlayerVisibility} from '../useMediaPlayerVisibility';

describe('useMediaPlayerVisibility', () => {
  it('should initialize with first items visible', () => {
    const {result} = renderHook(() => useMediaPlayerVisibility());

    expect(result.current.visibleItems.has(0)).toBe(true);
    expect(result.current.visibleItems.has(1)).toBe(true);
  });

  it('should track visible items', () => {
    const {result} = renderHook(() => useMediaPlayerVisibility());

    act(() => {
      result.current.onViewableItemsChanged({
        viewableItems: [
          {index: 2, isViewable: true} as any,
          {index: 3, isViewable: true} as any,
        ],
      });
    });

    expect(result.current.isItemVisible(2)).toBe(true);
    expect(result.current.isItemVisible(3)).toBe(true);
    expect(result.current.isItemVisible(0)).toBe(false);
  });

  it('should ignore non-viewable items', () => {
    const {result} = renderHook(() => useMediaPlayerVisibility());

    act(() => {
      result.current.onViewableItemsChanged({
        viewableItems: [
          {index: 2, isViewable: false} as any,
          {index: 3, isViewable: true} as any,
        ],
      });
    });

    expect(result.current.isItemVisible(2)).toBe(false);
    expect(result.current.isItemVisible(3)).toBe(true);
  });

  it('should ignore items with null index', () => {
    const {result} = renderHook(() => useMediaPlayerVisibility());

    act(() => {
      result.current.onViewableItemsChanged({
        viewableItems: [
          {index: null, isViewable: true} as any,
          {index: 4, isViewable: true} as any,
        ],
      });
    });

    expect(result.current.isItemVisible(4)).toBe(true);
  });
});

