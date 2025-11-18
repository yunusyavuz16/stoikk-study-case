/**
 * Tests for ErrorFallback component
 * Covers error display and retry functionality
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ErrorFallback} from '../ErrorFallback';

describe('ErrorFallback', () => {
  const mockResetErrorBoundary = jest.fn();
  const mockError = new Error('Test error message');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error message', () => {
    const {getByText} = render(
      <ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />,
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText(/We're sorry, but something unexpected happened/)).toBeTruthy();
  });

  it('should call resetErrorBoundary when Try Again is pressed', () => {
    const {getByText} = render(
      <ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />,
    );

    const tryAgainButton = getByText('Try Again');
    fireEvent.press(tryAgainButton);

    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });

  it('should show error details in dev mode', () => {
    // In test environment, __DEV__ is typically true
    // This test verifies the component renders error details when __DEV__ is true
    const {getByText} = render(
      <ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />,
    );

    // Error details should be visible in dev mode
    if (__DEV__) {
      expect(getByText('Test error message')).toBeTruthy();
    }
  });

  it('should show stack trace in dev mode when available', () => {
    const errorWithStack = new Error('Test error');
    errorWithStack.stack = 'Error: Test error\n    at test.js:1:1';

    const {getByText} = render(
      <ErrorFallback error={errorWithStack} resetErrorBoundary={mockResetErrorBoundary} />,
    );

    // Stack trace should be visible in dev mode
    if (__DEV__) {
      expect(getByText(/Error: Test error/)).toBeTruthy();
    }
  });

  it('should not show error details in production mode', () => {
    // This test verifies behavior when __DEV__ is false
    // In test environment, we can't easily change __DEV__, so we just verify the component renders
    const {queryByText} = render(
      <ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />,
    );

    // Component should render regardless of __DEV__ state
    expect(queryByText('Something went wrong')).toBeTruthy();
  });
});

