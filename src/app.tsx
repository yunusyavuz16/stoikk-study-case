import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import { ThemedView } from '@/components/Atoms/ThemedView/ThemedView';
import { OfflineNotification } from '@/components/Molecules/OfflineNotification/OfflineNotification';
import { ErrorBoundary } from '@/components/Organisms/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '@contexts/ThemeContext';
import { useTheme } from '@hooks/useTheme';
import { AppNavigator } from '@navigation/AppNavigator';
import { store } from '@store/store';
import { createTheme } from '@styles/theme';
import { styles } from './app.styles';

/**
 * App content component that uses theme
 * Separated to access theme context
 */
const AppContent: React.FC = () => {
  const { theme, isInitialized } = useTheme();

  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // Use current theme or fallback to light theme during initialization
  const currentTheme = isInitialized ? theme : createTheme('light');
  const isDarkMode = currentTheme.mode === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.background}
        translucent={false}
      />
      <ThemedView style={styles.container}>
        <OfflineNotification position="top" />
        {isInitialized ? <AppNavigator /> : <ThemedView style={styles.container} />}
      </ThemedView>
    </>
  );
};

/**
 * Main app entry point
 */
function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
