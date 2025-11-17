import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {type TextInput} from 'react-native';

interface UseAutoFocusParams {
  inputRef: React.RefObject<TextInput | null>;
  delay?: number;
}

/**
 * Focuses the provided input whenever the screen gains focus.
 */
export const useAutoFocus = ({inputRef, delay = 100}: UseAutoFocusParams): void => {
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, delay);

      return () => clearTimeout(timer);
    }, [delay, inputRef]),
  );
};

