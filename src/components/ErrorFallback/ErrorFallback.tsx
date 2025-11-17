import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {createTheme} from '@styles/theme';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Error fallback UI component
 * Displays user-friendly error message with retry option
 * Uses fallback theme to work even when ThemeProvider is not available
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  // Use fallback theme since ErrorBoundary is outside ThemeProvider
  const theme = createTheme('light');
  const styles = createStyles(theme);
  const isDev = __DEV__;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        We're sorry, but something unexpected happened. Please try again.
      </Text>
      {isDev && (
        <View style={styles.errorDetails}>
          <Text style={styles.errorText}>{error.message}</Text>
          {error.stack && (
            <Text style={styles.stackTrace}>{error.stack}</Text>
          )}
        </View>
      )}
      <Pressable
        onPress={resetErrorBoundary}
        style={({pressed}) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof createTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    message: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    errorDetails: {
      width: '100%',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    errorText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.error,
      fontFamily: 'monospace',
      marginBottom: theme.spacing.sm,
    },
    stackTrace: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      fontFamily: 'monospace',
    },
    button: {
      minWidth: 120,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.white,
    },
  });

