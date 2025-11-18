/**
 * Tests for Input component
 * Covers input rendering, focus states, and error handling
 */

import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {Input} from '../Input';
import {renderWithProviders} from '../../../../__tests__/utils/testUtils';

describe('Input', () => {
  it('should render with label', () => {
    const {getByText} = renderWithProviders(
      <Input label="Username" value="" onChangeText={() => {}} />,
    );

    expect(getByText('Username')).toBeTruthy();
  });

  it('should render without label', () => {
    const {queryByText} = renderWithProviders(
      <Input value="" onChangeText={() => {}} />,
    );

    expect(queryByText('Username')).toBeNull();
  });

  it('should display error message', () => {
    const {getByText} = renderWithProviders(
      <Input
        label="Username"
        value=""
        onChangeText={() => {}}
        error="This field is required"
      />,
    );

    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const {getByTestId} = renderWithProviders(
      <Input
        testID="input"
        label="Username"
        value=""
        onChangeText={onChangeText}
      />,
    );

    const input = getByTestId('input');
    fireEvent.changeText(input, 'testuser');

    expect(onChangeText).toHaveBeenCalledWith('testuser');
  });

  it('should handle focus and blur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const {getByTestId} = renderWithProviders(
      <Input
        testID="input"
        label="Username"
        value=""
        onChangeText={() => {}}
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    );

    const input = getByTestId('input');
    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalled();

    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalled();
  });

  it('should support secure text entry', () => {
    const {getByTestId} = renderWithProviders(
      <Input
        testID="input"
        label="Password"
        value=""
        onChangeText={() => {}}
        secureTextEntry
      />,
    );

    const input = getByTestId('input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should be editable when not disabled', () => {
    const {getByTestId} = renderWithProviders(
      <Input testID="input" label="Username" value="" onChangeText={() => {}} />,
    );

    const input = getByTestId('input');
    expect(input.props.editable).not.toBe(false);
  });

  it('should be disabled when editable is false', () => {
    const {getByTestId} = renderWithProviders(
      <Input
        testID="input"
        label="Username"
        value=""
        onChangeText={() => {}}
        editable={false}
      />,
    );

    const input = getByTestId('input');
    expect(input.props.editable).toBe(false);
  });
});

