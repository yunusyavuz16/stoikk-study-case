import {StyleSheet} from 'react-native';
import {theme} from '@styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchBarContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  profileButton: {
    padding: theme.spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  endMessage: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  endMessageText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 59, 48, 0.125)', // theme.colors.error with 20% opacity
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
  },
});

