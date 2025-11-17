import { STORAGE_KEYS } from '@constants/storage.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme, type Theme, type ThemeMode } from '@styles/theme';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

/**
 * Theme context interface
 */
interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => Promise<void>;
  isInitialized: boolean;
}

/**
 * Theme context
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider component
 * Manages theme state and persistence
 * Loads theme from storage on mount, falls back to system theme if no stored preference
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Load theme from storage
   */
  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);

      if (storedTheme === 'light' || storedTheme === 'dark') {
        // Valid stored theme exists - use it
        setMode(storedTheme);
        setIsInitialized(true);
        return;
      }

      // No stored theme - detect system theme
      const systemColorScheme = Appearance.getColorScheme();
      const systemTheme: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light';

      // Store system theme as initial preference
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, systemTheme);
      setMode(systemTheme);
      setIsInitialized(true);
    } catch (error) {
      // On error, fall back to system theme without storing
      console.error('Error loading theme:', error);
      const systemColorScheme = Appearance.getColorScheme();
      const systemTheme: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light';
      setMode(systemTheme);
      setIsInitialized(true);
    }
  };

  /**
   * Set theme and persist to storage
   */
  const setTheme = async (newMode: ThemeMode) => {
    try {
      setMode(newMode);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
      // Still update the state even if storage fails
    }
  };

  /**
   * Load theme on mount
   */
  useEffect(() => {
    loadTheme();
  }, []);

  const theme = createTheme(mode);

  const value: ThemeContextValue = {
    theme,
    mode,
    setTheme,
    isInitialized,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
