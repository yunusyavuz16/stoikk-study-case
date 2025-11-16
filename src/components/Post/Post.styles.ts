import {StyleSheet} from 'react-native';
import type {Theme} from '@styles/theme';

/**
 * Create styles based on theme
 */
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      marginBottom: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    avatarContainer: {
      marginRight: theme.spacing.md,
    },
    username: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    mediaContainer: {
      width: '100%',
      aspectRatio: 4 / 5, // 4:5 ratio for all media
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    actionButton: {
      marginRight: theme.spacing.md,
    },
    likes: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    caption: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    comments: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      paddingHorizontal: theme.spacing.md,
    },
  });

