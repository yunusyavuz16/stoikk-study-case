/**
 * Test utilities for React Native Testing Library
 * Provides helpers for rendering components with providers
 */

import React, {ReactElement, ReactNode} from 'react';
import {render, RenderOptions} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';
import type {RootState} from '@store/store';
import type {Store} from '@reduxjs/toolkit';
import {NetInfoStateType} from '@react-native-community/netinfo';
import {baseApi} from '@store/api/baseApi';
import {authSlice} from '@store/slices/authSlice';
import networkReducer from '@store/slices/networkSlice';
import type {NetworkState} from '../../types/network.types';

/**
 * Creates a test store with optional preloaded state
 */
export function createTestStore(
  preloadedState?: Partial<RootState>,
) {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authSlice.reducer,
      network: networkReducer,
    } as any,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
    preloadedState: preloadedState as any,
  });
}

/**
 * Default test state
 */
export const defaultTestState: Partial<RootState> = {
  auth: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
  },
  network: {
    state: {
      isConnected: true,
      isInternetReachable: true,
      type: NetInfoStateType.wifi,
      isWifiEnabled: true,
      isCellularEnabled: false,
    } as NetworkState,
    isInitialized: true,
  },
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: Store;
}

/**
 * Custom render function that includes all necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = defaultTestState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {},
) {
  const Wrapper = ({children}: {children: ReactNode}) => {
    return (
      <Provider store={store}>
        <SafeAreaProvider
          initialMetrics={{
            frame: {x: 0, y: 0, width: 375, height: 812},
            insets: {top: 44, left: 0, bottom: 34, right: 0},
          }}>
          <ThemeProvider>{children}</ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    );
  };

  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}

/**
 * Mock navigation props for testing screens
 */
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  setOptions: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
};

/**
 * Mock route props for testing screens
 */
export const mockRoute = {
  key: 'test-route',
  name: 'TestScreen',
  params: {},
  path: undefined,
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0));

/**
 * Create mock post data
 */
export const createMockPost = (overrides?: Partial<any>) => ({
  id: 'post_1',
  userId: 'user_1',
  username: 'testuser',
  userAvatar: undefined,
  type: 'images' as const,
  media: [
    {
      id: 'img_1',
      type: 'image' as const,
      uri: 'https://example.com/image1.jpg',
      thumbnail: 'https://example.com/thumb1.jpg',
    },
    {
      id: 'img_2',
      type: 'image' as const,
      uri: 'https://example.com/image2.jpg',
      thumbnail: 'https://example.com/thumb2.jpg',
    },
  ],
  caption: 'Test caption',
  likes: 100,
  comments: 10,
  timestamp: Date.now(),
  isLiked: false,
  ...overrides,
});

/**
 * Create mock video post
 */
export const createMockVideoPost = (overrides?: Partial<any>) =>
  createMockPost({
    type: 'video',
    media: [
      {
        id: 'video_1',
        type: 'video' as const,
        uri: 'https://example.com/video.mp4',
        thumbnail: 'https://example.com/video-thumb.jpg',
        duration: 30,
      },
    ],
    ...overrides,
  });

/**
 * Create mock user
 */
export const createMockUser = (overrides?: Partial<any>) => ({
  id: 'user_1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: undefined,
  ...overrides,
});

