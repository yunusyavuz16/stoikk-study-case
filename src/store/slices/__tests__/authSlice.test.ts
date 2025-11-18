/**
 * Tests for AuthSlice
 * Covers authentication state management
 */

import {authSlice, setSession, clearSession, setLoading} from '../authSlice';
import {createMockUser} from '../../../__tests__/utils/testUtils';

describe('AuthSlice', () => {
  const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  };

  it('should return initial state', () => {
    expect(authSlice.reducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  describe('setSession', () => {
    it('should set user session', () => {
      const user = createMockUser();
      const accessToken = 'test_access_token';

      const action = setSession({user, accessToken});
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toEqual(user);
      expect(state.accessToken).toBe(accessToken);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should update existing session', () => {
      const existingUser = createMockUser({username: 'olduser'});
      const existingState = {
        user: existingUser,
        accessToken: 'old_token',
        isAuthenticated: true,
        isLoading: false,
      };

      const newUser = createMockUser({username: 'newuser'});
      const newToken = 'new_token';

      const action = setSession({user: newUser, accessToken: newToken});
      const state = authSlice.reducer(existingState, action);

      expect(state.user).toEqual(newUser);
      expect(state.accessToken).toBe(newToken);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('clearSession', () => {
    it('should clear user session', () => {
      const existingState = {
        user: createMockUser(),
        accessToken: 'test_token',
        isAuthenticated: true,
        isLoading: false,
      };

      const action = clearSession();
      const state = authSlice.reducer(existingState, action);

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle clearing already empty session', () => {
      const action = clearSession();
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      const action = setLoading(true);
      const state = authSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      const loadingState = {...initialState, isLoading: true};
      const action = setLoading(false);
      const state = authSlice.reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
    });
  });
});

