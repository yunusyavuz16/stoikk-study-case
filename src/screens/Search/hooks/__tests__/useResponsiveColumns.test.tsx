/**
 * Tests for useResponsiveColumns hook
 * Covers responsive column calculation
 */

import {renderHook} from '@testing-library/react-native';
import {useResponsiveColumns} from '../useResponsiveColumns';

describe('useResponsiveColumns', () => {
  it('should return 5 columns for xl breakpoint', () => {
    const {result} = renderHook(() => useResponsiveColumns({breakpoint: 'xl'}));
    expect(result.current).toBe(5);
  });

  it('should return 5 columns for lg breakpoint', () => {
    const {result} = renderHook(() => useResponsiveColumns({breakpoint: 'lg'}));
    expect(result.current).toBe(5);
  });

  it('should return 4 columns for md breakpoint', () => {
    const {result} = renderHook(() => useResponsiveColumns({breakpoint: 'md'}));
    expect(result.current).toBe(4);
  });

  it('should return 3 columns for sm breakpoint', () => {
    const {result} = renderHook(() => useResponsiveColumns({breakpoint: 'sm'}));
    expect(result.current).toBe(3);
  });

  it('should return 3 columns for xs breakpoint', () => {
    const {result} = renderHook(() => useResponsiveColumns({breakpoint: 'xs'}));
    expect(result.current).toBe(3);
  });
});

