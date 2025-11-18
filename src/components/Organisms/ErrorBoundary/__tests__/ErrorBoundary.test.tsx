/**
 * Tests for ErrorBoundary component
 * Covers error boundary functionality
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {ErrorBoundary} from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({shouldThrow}: {shouldThrow: boolean}) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return null;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for error boundary tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render children when no error occurs', () => {
    const {getByText} = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
        <Text>Test Content</Text>
      </ErrorBoundary>,
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should call onError callback when error occurs', () => {
    const mockOnError = jest.fn();

    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Error boundary should catch the error
    expect(mockOnError).toHaveBeenCalled();
  });

  it('should display error fallback when error occurs', () => {
    const {getByText} = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // ErrorFallback should be displayed
    expect(getByText('Something went wrong')).toBeTruthy();
  });
});

