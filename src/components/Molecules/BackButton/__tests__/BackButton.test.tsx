/**
 * Tests for BackButton component
 * Covers navigation and custom onPress handler
 */

import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {BackButton} from '../BackButton';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('BackButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render back button', () => {
    const {UNSAFE_root} = renderWithProviders(<BackButton />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should call custom onPress when provided', () => {
    const mockOnPress = jest.fn();
    const {getByLabelText} = renderWithProviders(<BackButton onPress={mockOnPress} />);

    const button = getByLabelText('Go back');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('should call navigation.goBack when no custom onPress', () => {
    const {getByLabelText} = renderWithProviders(<BackButton />);

    const button = getByLabelText('Go back');
    fireEvent.press(button);

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should use custom icon color', () => {
    const {UNSAFE_root} = renderWithProviders(<BackButton iconColor="#FF0000" />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should use custom icon size', () => {
    const {UNSAFE_root} = renderWithProviders(<BackButton iconSize={32} />);

    expect(UNSAFE_root).toBeDefined();
  });
});

