import {StyleSheet} from 'react-native';
import type {Theme} from '@styles/theme';
import type {Breakpoint} from '@utils/breakpoints';
import {getResponsiveSpacing, getResponsiveFontSize} from '@styles/theme';

/**
 * Create styles based on theme with responsive values
 */
export const createStyles = (theme: Theme, breakpoint: Breakpoint) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: getResponsiveSpacing('lg', breakpoint),
    },
    columnWrapper: {
      justifyContent: 'space-between',
      paddingHorizontal: 0,
      marginBottom: getResponsiveSpacing('md', breakpoint),
    },
    footerLoader: {
      paddingVertical: getResponsiveSpacing('md', breakpoint),
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: getResponsiveSpacing('xxl', breakpoint),
    },
    emptyText: {
      fontSize: getResponsiveFontSize('md', breakpoint),
      color: theme.colors.textSecondary,
    },
    endMessage: {
      paddingVertical: getResponsiveSpacing('md', breakpoint),
      alignItems: 'center',
    },
    endMessageText: {
      fontSize: getResponsiveFontSize('sm', breakpoint),
      color: theme.colors.textSecondary,
    },
    errorContainer: {
      padding: getResponsiveSpacing('md', breakpoint),
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(255, 69, 58, 0.2)'
          : 'rgba(255, 59, 48, 0.125)',
    },
    errorText: {
      fontSize: getResponsiveFontSize('sm', breakpoint),
      color: theme.colors.error,
    },
  });

