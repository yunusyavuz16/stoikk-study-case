/**
 * Tests for Redux Store
 * Covers store configuration and middleware
 */

import {store} from '../store';
import {setSession, clearSession} from '../slices/authSlice';
import {createMockUser} from '../../__tests__/utils/testUtils';

describe('Redux Store', () => {
  it('should have correct initial state', () => {
    const state = store.getState();

    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('network');
    expect(state).toHaveProperty('api');

    expect(state.auth).toEqual({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it('should dispatch actions correctly', () => {
    const user = createMockUser();
    const accessToken = 'test_token';

    store.dispatch(setSession({user, accessToken}));

    const state = store.getState();
    expect(state.auth.user).toEqual(user);
    expect(state.auth.accessToken).toBe(accessToken);
    expect(state.auth.isAuthenticated).toBe(true);
  });

  it('should handle session clearing', () => {
    const user = createMockUser();
    const accessToken = 'test_token';

    store.dispatch(setSession({user, accessToken}));
    store.dispatch(clearSession());

    const state = store.getState();
    expect(state.auth.user).toBeNull();
    expect(state.auth.accessToken).toBeNull();
    expect(state.auth.isAuthenticated).toBe(false);
  });

  it('should have RTK Query API reducer', () => {
    const state = store.getState();

    expect(state).toHaveProperty('api');
    expect(state.api).toBeDefined();
  });
});

