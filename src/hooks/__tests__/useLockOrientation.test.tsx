/**
 * Tests for useLockOrientation hook
 * Covers orientation locking functionality
 */

import {renderHook} from '@testing-library/react-native';
import {useLockOrientation} from '../useLockOrientation';
import Orientation from 'react-native-orientation-locker';

jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
  unlockAllOrientations: jest.fn(),
}));

describe('useLockOrientation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should lock orientation to portrait on mount', () => {
    renderHook(() => useLockOrientation());

    expect(Orientation.lockToPortrait).toHaveBeenCalled();
  });

  it('should unlock orientation on unmount', () => {
    const {unmount} = renderHook(() => useLockOrientation());

    unmount();

    expect(Orientation.unlockAllOrientations).toHaveBeenCalled();
  });
});

