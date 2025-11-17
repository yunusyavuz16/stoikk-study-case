import {useWindowDimensions} from 'react-native';
import {getBreakpoint, isTablet, isPhone, type Breakpoint} from '@utils/breakpoints';

interface UseBreakpointReturn {
  breakpoint: Breakpoint;
  isTablet: boolean;
  isPhone: boolean;
  width: number;
  height: number;
}

/**
 * Hook for responsive breakpoint detection
 * Uses useWindowDimensions for automatic updates on dimension changes
 * Returns current breakpoint, device type, and screen dimensions
 */
export const useBreakpoint = (): UseBreakpointReturn => {
  const {width, height} = useWindowDimensions();

  const breakpoint = getBreakpoint(width);
  const tablet = isTablet(width);
  const phone = isPhone(width);

  return {
    breakpoint,
    isTablet: tablet,
    isPhone: phone,
    width,
    height,
  };
};

