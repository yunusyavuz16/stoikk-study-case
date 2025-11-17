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
    backButton: {
      padding: getResponsiveSpacing('xs', breakpoint),
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

