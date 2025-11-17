import {StyleSheet} from 'react-native';
import type {Theme} from '@styles/theme';
import type {Breakpoint} from '@utils/breakpoints';
import {getResponsiveSpacing, getResponsiveFontSize} from '@styles/theme';

/**
 * Create styles based on theme with responsive values
 */
export const createStyles = (theme: Theme, breakpoint: Breakpoint = 'sm') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      paddingHorizontal: getResponsiveSpacing('lg', breakpoint),
    },
    title: {
      fontSize: getResponsiveFontSize('xxxl', breakpoint),
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: getResponsiveSpacing('xl', breakpoint),
      textAlign: 'center',
    },
    form: {
      width: '100%',
      maxWidth: 400, // Limit form width on tablets/desktop for better UX
      alignSelf: 'center',
    },
    button: {
      marginTop: getResponsiveSpacing('md', breakpoint),
    },
    errorText: {
      fontSize: getResponsiveFontSize('sm', breakpoint),
      color: theme.colors.error,
      marginTop: getResponsiveSpacing('sm', breakpoint),
      textAlign: 'center',
    },
  });

