import { StyleSheet } from 'react-native';
import { getResponsiveSpacing } from '@styles/theme';
import type { Theme } from '@styles/theme';
import type { Breakpoint } from '@utils/breakpoints';

/**
 * Creates styles for the feed header component.
 */
export const createStyles = (theme: Theme, breakpoint: Breakpoint) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    profileButton: {
      padding: getResponsiveSpacing('sm', breakpoint),
    },
  });

