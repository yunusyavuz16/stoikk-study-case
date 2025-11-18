/**
 * Tests for SecureStorageService
 * Covers secure storage operations
 */

import {secureStorageService} from '../secureStorageService';
import * as Keychain from 'react-native-keychain';

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

describe('SecureStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store item successfully', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);

      const result = await secureStorageService.setItem('test_key', 'test_value');

      expect(result).toBe(true);
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith('test_key', 'test_value', {
        service: 'StoikkKeychain',
      });
    });

    it('should handle storage errors gracefully', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await secureStorageService.setItem('test_key', 'test_value');

      expect(result).toBe(false);
    });
  });

  describe('getItem', () => {
    it('should retrieve item successfully', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'test_key',
        password: 'test_value',
      });

      const result = await secureStorageService.getItem('test_key');

      expect(result).toBe('test_value');
    });

    it('should return null when no credentials found', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await secureStorageService.getItem('test_key');

      expect(result).toBeNull();
    });

    it('should return null when key does not match', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'other_key',
        password: 'test_value',
      });

      const result = await secureStorageService.getItem('test_key');

      expect(result).toBeNull();
    });

    it('should handle retrieval errors gracefully', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('Retrieval error'));

      const result = await secureStorageService.getItem('test_key');

      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove item when it exists', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'test_key',
        password: 'test_value',
      });

      await secureStorageService.removeItem('test_key');

      expect(Keychain.resetGenericPassword).toHaveBeenCalled();
    });

    it('should handle removal when item does not exist', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      await secureStorageService.removeItem('test_key');

      // Should not throw
      expect(Keychain.resetGenericPassword).not.toHaveBeenCalled();
    });

    it('should handle removal errors gracefully', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('Error'));

      await expect(secureStorageService.removeItem('test_key')).resolves.not.toThrow();
    });
  });

  describe('storeCredentials', () => {
    it('should store credentials successfully', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);

      const result = await secureStorageService.storeCredentials('username', 'password');

      expect(result).toBe(true);
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith('username', 'password', {
        service: 'StoikkKeychain',
      });
    });

    it('should handle storage errors', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(new Error('Error'));

      const result = await secureStorageService.storeCredentials('username', 'password');

      expect(result).toBe(false);
    });
  });

  describe('getCredentials', () => {
    it('should retrieve credentials successfully', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'username',
        password: 'password',
      });

      const result = await secureStorageService.getCredentials();

      expect(result).toEqual({username: 'username', password: 'password'});
    });

    it('should return null when no credentials found', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await secureStorageService.getCredentials();

      expect(result).toBeNull();
    });
  });

  describe('clearCredentials', () => {
    it('should clear credentials successfully', async () => {
      await secureStorageService.clearCredentials();

      expect(Keychain.resetGenericPassword).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockRejectedValue(new Error('Error'));

      await expect(secureStorageService.clearCredentials()).resolves.not.toThrow();
    });
  });

  describe('storeRefreshToken', () => {
    it('should store refresh token', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);

      const result = await secureStorageService.storeRefreshToken('token123');

      expect(result).toBe(true);
    });
  });

  describe('getRefreshToken', () => {
    it('should retrieve refresh token', async () => {
      const {STORAGE_KEYS} = require('@constants/storage.constants');
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: STORAGE_KEYS.REFRESH_TOKEN,
        password: 'token123',
      });

      const result = await secureStorageService.getRefreshToken();

      expect(result).toBe('token123');
    });
  });

  describe('clearRefreshToken', () => {
    it('should clear refresh token', async () => {
      await secureStorageService.clearRefreshToken();

      expect(Keychain.getGenericPassword).toHaveBeenCalled();
    });
  });
});

