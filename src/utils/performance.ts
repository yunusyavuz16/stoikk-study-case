/**
 * Performance monitoring utilities
 * Only active in development mode
 */

let fpsCounter = 0;
let lastTime = Date.now();
let frameCount = 0;
let fpsHistory: number[] = [];

/**
 * Monitor FPS (Frames Per Second)
 * Should be called in requestAnimationFrame or similar
 */
export const monitorFPS = (): void => {
  if (!__DEV__) {
    return;
  }

  frameCount++;
  const currentTime = Date.now();
  const delta = currentTime - lastTime;

  if (delta >= 1000) {
    fpsCounter = Math.round((frameCount * 1000) / delta);
    fpsHistory.push(fpsCounter);
    if (fpsHistory.length > 60) {
      fpsHistory.shift();
    }

    // Log if FPS drops below 55 (indicates performance issues)
    if (fpsCounter < 55) {
      console.warn(`⚠️ Low FPS detected: ${fpsCounter} FPS`);
    }

    frameCount = 0;
    lastTime = currentTime;
  }
};

/**
 * Get current FPS
 */
export const getCurrentFPS = (): number => {
  return fpsCounter;
};

/**
 * Get average FPS from history
 */
export const getAverageFPS = (): number => {
  if (fpsHistory.length === 0) {
    return 0;
  }
  const sum = fpsHistory.reduce((a, b) => a + b, 0);
  return Math.round(sum / fpsHistory.length);
};

/**
 * Get FPS history
 */
export const getFPSHistory = (): number[] => {
  return [...fpsHistory];
};

/**
 * Reset FPS monitoring
 */
export const resetFPSMonitoring = (): void => {
  fpsCounter = 0;
  frameCount = 0;
  lastTime = Date.now();
  fpsHistory = [];
};

/**
 * Measure render time of a function
 */
export const measureRenderTime = <T>(fn: () => T, label?: string): T => {
  if (!__DEV__) {
    return fn();
  }

  const start = Date.now();
  const result = fn();
  const end = Date.now();
  const duration = end - start;

  if (duration > 16) {
    // More than one frame (16ms at 60fps)
    console.warn(`⚠️ Slow render${label ? ` (${label})` : ''}: ${duration.toFixed(2)}ms`);
  }

  return result;
};

/**
 * Monitor memory usage (Android only, requires native module)
 */
export const getMemoryUsage = (): {used: number; total: number} | null => {
  if (!__DEV__) {
    return null;
  }

  // This would require a native module for actual memory monitoring
  // For now, return null as placeholder
  return null;
};

