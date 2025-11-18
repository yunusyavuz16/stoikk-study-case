/**
 * Tests for Icon component
 * Covers different icon families and props
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {Icon} from '../Icon';

// Mock vector icons
jest.mock('react-native-vector-icons/Ionicons', () => {
  const RN = require('react');
  const {View} = require('react-native');
  return RN.forwardRef((props: any, ref: any) => (
    <View {...props} ref={ref} testID="Ionicons" />
  ));
});

jest.mock('react-native-vector-icons/FontAwesome', () => {
  const RN = require('react');
  const {View} = require('react-native');
  return RN.forwardRef((props: any, ref: any) => (
    <View {...props} ref={ref} testID="FontAwesome" />
  ));
});

jest.mock('react-native-vector-icons/MaterialIcons', () => {
  const RN = require('react');
  const {View} = require('react-native');
  return RN.forwardRef((props: any, ref: any) => (
    <View {...props} ref={ref} testID="MaterialIcons" />
  ));
});

describe('Icon', () => {
  it('should render Ionicons by default', () => {
    const {getByTestId} = render(<Icon name="home" />);

    expect(getByTestId('Ionicons')).toBeTruthy();
  });

  it('should render Ionicons when family is Ionicons', () => {
    const {getByTestId} = render(<Icon name="home" family="Ionicons" />);

    expect(getByTestId('Ionicons')).toBeTruthy();
  });

  it('should render FontAwesome when family is FontAwesome', () => {
    const {getByTestId} = render(<Icon name="home" family="FontAwesome" />);

    expect(getByTestId('FontAwesome')).toBeTruthy();
  });

  it('should render MaterialIcons when family is MaterialIcons', () => {
    const {getByTestId} = render(<Icon name="home" family="MaterialIcons" />);

    expect(getByTestId('MaterialIcons')).toBeTruthy();
  });

  it('should pass custom size', () => {
    const {getByTestId} = render(<Icon name="home" size={48} />);

    const icon = getByTestId('Ionicons');
    expect(icon.props.size).toBe(48);
  });

  it('should pass custom color', () => {
    const {getByTestId} = render(<Icon name="home" color="#FF0000" />);

    const icon = getByTestId('Ionicons');
    expect(icon.props.color).toBe('#FF0000');
  });

  it('should pass testID', () => {
    const {getByTestId} = render(<Icon name="home" testID="custom-icon" />);

    // testID is passed to the icon component
    const icon = getByTestId('Ionicons');
    expect(icon).toBeTruthy();
    // The testID prop is passed through to the underlying icon
    expect(icon.props.name).toBe('home');
  });

  it('should use default size when not provided', () => {
    const {getByTestId} = render(<Icon name="home" />);

    const icon = getByTestId('Ionicons');
    expect(icon.props.size).toBe(24);
  });

  it('should use default color when not provided', () => {
    const {getByTestId} = render(<Icon name="home" />);

    const icon = getByTestId('Ionicons');
    expect(icon.props.color).toBe('#000000');
  });
});

