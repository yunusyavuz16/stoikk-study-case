import {useState, useCallback} from 'react';
import type {ViewToken} from 'react-native';

interface UseMediaPlayerVisibilityReturn {
  visibleItems: Set<number>;
  onViewableItemsChanged: (info: {viewableItems: ViewToken[]}) => void;
  isItemVisible: (index: number) => boolean;
}

/**
 * Hook for tracking visible media items in a grid/list
 * Optimizes video autoplay by only playing visible items
 * Uses intersection observer pattern for memory efficiency
 */
export const useMediaPlayerVisibility = (
  _itemVisiblePercentThreshold: number = 50,
): UseMediaPlayerVisibilityReturn => {
  // Initialize with first few items visible to prevent black screen on mount
  // This ensures videos autoplay immediately when feed loads
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set([0, 1]));

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      const newVisibleItems = new Set<number>();
      viewableItems.forEach((item) => {
        if (item.index !== null && item.isViewable) {
          newVisibleItems.add(item.index);
        }
      });
      setVisibleItems(newVisibleItems);
    },
    [],
  );

  const isItemVisible = useCallback(
    (index: number): boolean => {
      return visibleItems.has(index);
    },
    [visibleItems],
  );

  return {
    visibleItems,
    onViewableItemsChanged,
    isItemVisible,
  };
};

