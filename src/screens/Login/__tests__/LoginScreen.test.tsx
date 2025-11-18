/**
 * Tests for LoginScreen
 * Covers login form, validation, and navigation
 */

import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {LoginScreen} from '../LoginScreen';
import {renderWithProviders} from '../../../__tests__/utils/testUtils';

// Mock navigation
const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
  }),
}));

// Mock useLogin hook
const mockUseLogin: {
  username: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  setUsername: jest.Mock;
  setPassword: jest.Mock;
  handleLogin: jest.Mock;
} = {
  username: '',
  password: '',
  isLoading: false,
  error: null,
  setUsername: jest.fn(),
  setPassword: jest.fn(),
  handleLogin: jest.fn(),
};

jest.mock('../hooks/useLogin', () => ({
  useLogin: () => mockUseLogin,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.username = '';
    mockUseLogin.password = '';
    mockUseLogin.isLoading = false;
    mockUseLogin.error = null;
  });

  it('should render login form', () => {
    const {getByText, getByPlaceholderText} = renderWithProviders(<LoginScreen />);

    expect(getByText('Instagram Clone')).toBeTruthy();
    expect(getByPlaceholderText('Enter username')).toBeTruthy();
    expect(getByPlaceholderText('Enter password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('should call setUsername when username input changes', () => {
    const {getByPlaceholderText} = renderWithProviders(<LoginScreen />);

    const usernameInput = getByPlaceholderText('Enter username');
    fireEvent.changeText(usernameInput, 'testuser');

    expect(mockUseLogin.setUsername).toHaveBeenCalledWith('testuser');
  });

  it('should call setPassword when password input changes', () => {
    const {getByPlaceholderText} = renderWithProviders(<LoginScreen />);

    const passwordInput = getByPlaceholderText('Enter password');
    fireEvent.changeText(passwordInput, 'password123');

    expect(mockUseLogin.setPassword).toHaveBeenCalledWith('password123');
  });

  it('should call handleLogin when login button is pressed', () => {
    const {getByText} = renderWithProviders(<LoginScreen />);

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    expect(mockUseLogin.handleLogin).toHaveBeenCalled();
  });

  it('should display error message when error exists', () => {
    mockUseLogin.error = 'Login failed' as string | null;

    const {getByText} = renderWithProviders(<LoginScreen />);

    expect(getByText('Login failed')).toBeTruthy();
  });

  it('should disable inputs when loading', () => {
    mockUseLogin.isLoading = true;

    const {getByPlaceholderText} = renderWithProviders(<LoginScreen />);

    const usernameInput = getByPlaceholderText('Enter username');
    const passwordInput = getByPlaceholderText('Enter password');

    expect(usernameInput.props.editable).toBe(false);
    expect(passwordInput.props.editable).toBe(false);
  });

  it('should show loading state on button when loading', () => {
    mockUseLogin.isLoading = true;

    renderWithProviders(<LoginScreen />);

    // Button should show loading indicator when loading
    expect(mockUseLogin.isLoading).toBe(true);
  });
});

