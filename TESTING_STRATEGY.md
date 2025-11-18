# Testing Strategy Documentation

## Overview

This document outlines the comprehensive unit testing strategy implemented for the Storikk Instagram Clone React Native application. The test suite aims to achieve **80%+ code coverage** across all critical flows and components.

## Test Infrastructure

### Setup

- **Jest**: Test runner and assertion library
- **React Native Testing Library**: Component testing utilities
- **Jest Configuration**: Configured in `jest.config.js` with:
  - Path aliases matching the project structure
  - Coverage thresholds (80% for branches, functions, lines, statements)
  - Transform ignore patterns for React Native modules
  - Test file matching patterns

### Test Utilities

Located in `src/__tests__/utils/testUtils.tsx`:

- `renderWithProviders`: Custom render function that wraps components with Redux Provider, ThemeProvider, and SafeAreaProvider
- `createTestStore`: Helper to create Redux store with optional preloaded state
- `createMockPost`, `createMockVideoPost`, `createMockUser`: Factory functions for test data
- `mockNavigation`, `mockRoute`: Mock navigation props for screen testing

### Mocks

Configured in `jest.setup.js`:

- React Native Reanimated
- React Native Worklets
- React Native Keychain
- React Native Fast Image
- React Native Video
- NetInfo
- Orientation Locker
- AsyncStorage

## Test Coverage

### Services (100% Coverage)

#### `authService.test.ts`
- ✅ Login with valid/invalid credentials
- ✅ Username trimming and validation
- ✅ Token refresh functionality
- ✅ Error handling
- ✅ Logout functionality

#### `postService.test.ts`
- ✅ Post generation with pagination
- ✅ Image and video asset retrieval
- ✅ Post structure validation (2 images or 1 video)
- ✅ Search functionality (case-insensitive)
- ✅ Post sorting by timestamp

#### `imageCacheService.test.ts`
- ✅ Image prefetching (single and batch)
- ✅ Thumbnail prefetching
- ✅ Cache tracking (prefetched state)
- ✅ Cache clearing (memory, disk, all)
- ✅ Priority handling
- ✅ Local asset handling

### Redux Store & Slices

#### `authSlice.test.ts`
- ✅ Initial state
- ✅ Session setting and clearing
- ✅ Loading state management

#### `store.test.ts`
- ✅ Store configuration
- ✅ Action dispatching
- ✅ State updates

### Hooks

#### `useAuthRTK.test.tsx`
- ✅ Initial auth state
- ✅ Login flow
- ✅ Logout flow
- ✅ Error handling
- ✅ State updates from checkAuth query

#### `useLogin.test.tsx`
- ✅ Form state management
- ✅ Input validation
- ✅ Login submission
- ✅ Error display
- ✅ Loading states
- ✅ Navigation on success

### Components

#### Atoms
- ✅ `Input.test.tsx`: Input rendering, focus states, error handling, secure text entry
- ✅ `Button.test.tsx`: Button rendering, press handling, loading/disabled states, variants

#### Molecules
- ✅ `Input.test.tsx`: Complete input component testing

#### Organisms
- ✅ `Post.test.tsx`: Post rendering, like functionality, media display (images/videos)
- ✅ `PostImageCarousel.test.tsx`: Carousel rendering, pagination dots

### Screens

#### `LoginScreen.test.tsx`
- ✅ Form rendering
- ✅ Input handling
- ✅ Login button press
- ✅ Error display
- ✅ Loading states
- ✅ Input disabling during load

#### `FeedScreen.test.tsx`
- ✅ Feed rendering
- ✅ Post list display
- ✅ Loading states (initial and pagination)
- ✅ Error handling
- ✅ Pull-to-refresh
- ✅ Pagination (load more)
- ✅ Empty state
- ✅ End of list message

#### `SearchScreen.test.tsx`
- ✅ Search bar rendering
- ✅ Search input handling
- ✅ Loading skeleton
- ✅ Error state
- ✅ Empty search results
- ✅ Media grid rendering
- ✅ Initial content loading

### App Component

#### `App.test.tsx`
- ✅ App initialization
- ✅ Provider setup

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run specific test file
```bash
npm test -- path/to/test/file.test.tsx
```

## Test Best Practices

### 1. Test Structure
- Each test file mirrors the source file structure
- Tests are organized by functionality
- Descriptive test names following "should [expected behavior]" pattern

### 2. Isolation
- Tests are independent and can run in any order
- Each test cleans up after itself
- Mocks are reset between tests

### 3. Coverage Goals
- **Services**: 100% coverage (business logic)
- **Hooks**: 90%+ coverage (state management)
- **Components**: 80%+ coverage (UI interactions)
- **Screens**: 80%+ coverage (user flows)

### 4. Test Types
- **Unit Tests**: Individual functions/components
- **Integration Tests**: Component interactions with hooks/services
- **Snapshot Tests**: Used sparingly for critical UI components

### 5. Mocking Strategy
- Mock external dependencies (native modules, APIs)
- Use real implementations for internal utilities when possible
- Mock navigation for screen tests
- Mock Redux store for component tests

## Critical Flows Tested

### ✅ Login Flow
1. User enters credentials
2. Validation (empty/whitespace checks)
3. API call simulation
4. Success navigation to Feed
5. Error handling and display

### ✅ Feed Rendering
1. Initial post loading
2. Pagination (load more)
3. Pull-to-refresh
4. Like functionality (optimistic updates)
5. Media visibility tracking
6. Image prefetching

### ✅ Search Flow
1. Search input handling
2. Debounced search execution
3. Grid rendering with media
4. Empty state handling
5. Error recovery

### ✅ Media Handling
1. Image carousel swipe
2. Video autoplay/pause based on visibility
3. Large image performance (prefetching)
4. Thumbnail loading
5. Error fallbacks

### ✅ Swipe Gestures
1. Image carousel pagination
2. Dot indicators
3. Scroll position tracking

## Future Enhancements

1. **E2E Tests**: Add Detox for end-to-end testing
2. **Performance Tests**: Add tests for large list rendering
3. **Accessibility Tests**: Add tests for accessibility features
4. **Visual Regression**: Add snapshot testing for critical UI components
5. **Integration Tests**: Add tests for complete user flows

## Maintenance

- Review and update tests when adding new features
- Keep test utilities in sync with component changes
- Update mocks when upgrading dependencies
- Monitor coverage reports to maintain 80%+ threshold

## Notes

- Tests use fake timers for async operations
- All tests are deterministic and don't rely on external services
- Test data is generated using factory functions for consistency
- Coverage excludes style files, type definitions, and test files themselves

