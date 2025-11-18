/**
 * Jest setup file for React Native Testing Library
 * Configures mocks and global test utilities
 */

// Mock react-native-worklets first (required by reanimated)
jest.mock('react-native-worklets', () => ({
  scheduleOnRN: jest.fn((fn, ...args) => fn(...args)),
  createSerializable: jest.fn(() => ({})),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const {View, Text, ScrollView, FlatList} = require('react-native');

  return {
    default: {
      View: View,
      Text: Text,
      ScrollView: ScrollView,
      FlatList: FlatList,
      Code: View,
      call: jest.fn(),
    },
    View: View,
    Text: Text,
    ScrollView: ScrollView,
    FlatList: FlatList,
    Code: View,
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
    },
    Extrapolate: {
      IDENTITY: 'identity',
      CLAMP: 'clamp',
      EXTEND: 'extend',
    },
    runOnJS: jest.fn(fn => fn),
    runOnUI: jest.fn(fn => fn),
    useSharedValue: jest.fn(initial => ({value: initial})),
    useAnimatedStyle: jest.fn(style => style),
    useAnimatedScrollHandler: jest.fn(() => jest.fn()),
    withTiming: jest.fn((toValue, config, callback) => {
      if (callback) callback({finished: true});
      return toValue;
    }),
    withSpring: jest.fn((toValue, config, callback) => {
      if (callback) callback({finished: true});
      return toValue;
    }),
    withRepeat: jest.fn((animation, iterations, reverse) => animation),
    withSequence: jest.fn((...animations) => animations[0]),
    cancelAnimation: jest.fn(),
    measure: jest.fn(() => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      pageX: 0,
      pageY: 0,
    })),
    scrollTo: jest.fn(),
  };
});

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

// Mock react-native-fast-image
const FastImagePriority = {
  low: 'low',
  normal: 'normal',
  high: 'high',
};

jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const {Image} = require('react-native');
  const FastImageComponent = React.forwardRef(({source, ...props}, ref) => {
    const imageSource = typeof source === 'object' && source?.uri ? {uri: source.uri} : source;
    return React.createElement(Image, {
      ...props,
      source: imageSource,
      ref,
    });
  });
  FastImageComponent.displayName = 'FastImage';
  FastImageComponent.priority = FastImagePriority;
  const resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
  };
  FastImageComponent.resizeMode = resizeMode;
  return {
    __esModule: true,
    default: FastImageComponent,
    FastImage: FastImageComponent,
    priority: FastImagePriority,
    preload: jest.fn(() => Promise.resolve()),
    clearDiskCache: jest.fn(() => Promise.resolve()),
    clearMemoryCache: jest.fn(() => Promise.resolve()),
    resizeMode: resizeMode,
  };
});

// Mock react-native-video
jest.mock('react-native-video', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      return React.createElement(View, {
        ...props,
        ref,
        testID: props.testID || 'video',
      });
    }),
  };
});

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(() =>
      Promise.resolve({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
      }),
    ),
    addEventListener: jest.fn(() => jest.fn()),
  },
  NetInfoStateType: {
    unknown: 'unknown',
    none: 'none',
    cellular: 'cellular',
    wifi: 'wifi',
    bluetooth: 'bluetooth',
    ethernet: 'ethernet',
    wimax: 'wimax',
    vpn: 'vpn',
    other: 'other',
  },
}));

// Mock react-native-orientation-locker
jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
  unlockAllOrientations: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
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
    }),
    useRoute: () => ({
      key: 'test-route',
      name: 'TestScreen',
      params: {},
    }),
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock timers
jest.useFakeTimers();

