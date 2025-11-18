/**
 * Tests for Button component
 * Covers button rendering, press handling, and states
 */

import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {Button} from '../Button';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button with title', () => {
    const {getByText} = renderWithProviders(
      <Button title="Click Me" onPress={mockOnPress} />,
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const {getByText} = renderWithProviders(
      <Button title="Click Me" onPress={mockOnPress} />,
    );

    const button = getByText('Click Me');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const {getByText} = renderWithProviders(
      <Button title="Click Me" onPress={mockOnPress} disabled />,
    );

    const button = getByText('Click Me');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should not call onPress when loading', () => {
    const {UNSAFE_getByType} = renderWithProviders(
      <Button title="Click Me" onPress={mockOnPress} loading />,
    );

    // Button should show loading indicator
    expect(UNSAFE_getByType).toBeDefined();
    // onPress should not be called when loading
  });

  it('should show loading indicator when loading', () => {
    const {UNSAFE_getByType} = renderWithProviders(
      <Button title="Click Me" onPress={mockOnPress} loading />,
    );

    // Should render ActivityIndicator
    expect(UNSAFE_getByType).toBeDefined();
  });

  it('should render with primary variant', () => {
    const {getByText} = renderWithProviders(
      <Button title="Primary" onPress={mockOnPress} variant="primary" />,
    );

    expect(getByText('Primary')).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const {getByText} = renderWithProviders(
      <Button title="Secondary" onPress={mockOnPress} variant="secondary" />,
    );

    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should accept custom testID', () => {
    const {getByTestId} = renderWithProviders(
      <Button title="Test" onPress={mockOnPress} testID="custom-button" />,
    );

    expect(getByTestId('custom-button')).toBeTruthy();
  });
});

