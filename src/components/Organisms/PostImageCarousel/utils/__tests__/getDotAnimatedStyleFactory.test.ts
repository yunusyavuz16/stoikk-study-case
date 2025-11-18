/**
 * Tests for getDotAnimatedStyleFactory
 * Covers pagination dot animation style factory
 */

import {getDotAnimatedStyleFactory} from '../getDotAnimatedStyleFactory';

// Mock reanimated
jest.mock('react-native-reanimated', () => ({
  interpolate: jest.fn((_value, _inputRange, outputRange) => {
    // Simple mock - return middle value for testing
    return outputRange[1];
  }),
}));

describe('getDotAnimatedStyleFactory', () => {
  it('should return a worklet function', () => {
    const mockScrollX = {value: 0};
    const factory = getDotAnimatedStyleFactory({
      scrollX: mockScrollX as any,
      screenWidth: 375,
      index: 0,
    });

    expect(typeof factory).toBe('function');
  });

  it('should return style with transform and opacity', () => {
    const mockScrollX = {value: 375};
    const factory = getDotAnimatedStyleFactory({
      scrollX: mockScrollX as any,
      screenWidth: 375,
      index: 1,
    });

    const style = factory();

    expect(style).toHaveProperty('transform');
    expect(style).toHaveProperty('opacity');
    expect(style.transform).toBeInstanceOf(Array);
  });
});

