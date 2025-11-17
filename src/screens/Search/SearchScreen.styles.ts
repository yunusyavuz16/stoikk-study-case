import {StyleSheet} from 'react-native';
import type {Theme} from '@styles/theme';
import type {Breakpoint} from '@utils/breakpoints';
import {getResponsiveSpacing} from '@styles/theme';

/**
 * Create styles based on theme with responsive values
 */
export const createStyles = (theme: Theme, breakpoint: Breakpoint = 'sm') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getResponsiveSpacing('md', breakpoint),
      paddingVertical: getResponsiveSpacing('sm', breakpoint),
      gap: getResponsiveSpacing('sm', breakpoint),
    },
    backButton: {
      padding: getResponsiveSpacing('xs', breakpoint),
    },
    searchBarContainer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.colors.error,
    },
  });

