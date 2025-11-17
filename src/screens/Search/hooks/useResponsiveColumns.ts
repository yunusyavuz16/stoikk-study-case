import { type Breakpoint } from '@utils/breakpoints';

interface UseResponsiveColumnsParams {
  breakpoint: Breakpoint;
}

/**
 * Returns responsive grid column count for the search screen layout.
 */
export const useResponsiveColumns = ({ breakpoint }: UseResponsiveColumnsParams): number => {
  return (() => {
    if (breakpoint === 'xl' || breakpoint === 'lg') {
      return 5;
    }

    if (breakpoint === 'md') {
      return 4;
    }

    return 3;
  })();
};
