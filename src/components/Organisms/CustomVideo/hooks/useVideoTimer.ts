import { useEffect, useRef, useState } from 'react';
import { LOOP_THRESHOLD_SECONDS } from '../constants';

interface UseVideoTimerParams {
  duration?: number;
  showTimer?: boolean;
  hasError: boolean;
}

interface UseVideoTimerReturn {
  shouldShowTimer: boolean;
  formattedTime: string | null;
  updateFromProgress: (progress: number) => void;
  reset: () => void;
}

const isDurationValid = (duration?: number): duration is number =>
  typeof duration === 'number' && Number.isFinite(duration) && duration > 0;


export const useVideoTimer = ({
  duration,
  showTimer = true,
  hasError,
}: UseVideoTimerParams): UseVideoTimerReturn => {
  const validDuration = isDurationValid(duration);
  const [remainingTime, setRemainingTime] = useState<number | null>(() =>
    validDuration ? Math.floor(duration!) : null,
  );
  const lastProgressRef = useRef(0);

  const reset = () => {
    if (!validDuration) {
      setRemainingTime(null);
      lastProgressRef.current = 0;
      return;
    }

    setRemainingTime(Math.floor(duration!));
    lastProgressRef.current = 0;
  };

  const updateFromProgress = (progress: number) => {
    if (!validDuration) {
      return;
    }

    // Detect loop: progress restarting near zero after nearing duration end
    if (
      lastProgressRef.current > Math.max(duration! - 1, 1) &&
      progress <= LOOP_THRESHOLD_SECONDS
    ) {
      setRemainingTime(Math.floor(duration!));
    } else {
      setRemainingTime(Math.max(0, Math.floor(duration! - progress)));
    }

    lastProgressRef.current = progress;
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedTime = (() => {
    if (remainingTime === null) {
      return null;
    }
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  })();

  const shouldShowTimer = Boolean(
    showTimer && !hasError && validDuration && remainingTime !== null,
  );

  return {
    shouldShowTimer,
    formattedTime,
    updateFromProgress,
    reset,
  };
};
