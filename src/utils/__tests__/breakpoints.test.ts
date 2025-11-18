/**
 * Tests for breakpoints utility
 * Covers responsive breakpoint calculations
 */

import {BREAKPOINTS, getBreakpoint, isTablet, isPhone} from '../breakpoints';

describe('breakpoints', () => {
  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.xs).toBe(0);
      expect(BREAKPOINTS.sm).toBe(375);
      expect(BREAKPOINTS.md).toBe(768);
      expect(BREAKPOINTS.lg).toBe(1024);
      expect(BREAKPOINTS.xl).toBe(1440);
    });
  });

  describe('getBreakpoint', () => {
    it('should return xs for small widths', () => {
      expect(getBreakpoint(0)).toBe('xs');
      expect(getBreakpoint(100)).toBe('xs');
      expect(getBreakpoint(374)).toBe('xs');
    });

    it('should return sm for medium-small widths', () => {
      expect(getBreakpoint(375)).toBe('sm');
      expect(getBreakpoint(500)).toBe('sm');
      expect(getBreakpoint(767)).toBe('sm');
    });

    it('should return md for medium widths', () => {
      expect(getBreakpoint(768)).toBe('md');
      expect(getBreakpoint(900)).toBe('md');
      expect(getBreakpoint(1023)).toBe('md');
    });

    it('should return lg for large widths', () => {
      expect(getBreakpoint(1024)).toBe('lg');
      expect(getBreakpoint(1200)).toBe('lg');
      expect(getBreakpoint(1439)).toBe('lg');
    });

    it('should return xl for extra large widths', () => {
      expect(getBreakpoint(1440)).toBe('xl');
      expect(getBreakpoint(2000)).toBe('xl');
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet sizes', () => {
      expect(isTablet(768)).toBe(true);
      expect(isTablet(1024)).toBe(true);
      expect(isTablet(1440)).toBe(true);
    });

    it('should return false for phone sizes', () => {
      expect(isTablet(767)).toBe(false);
      expect(isTablet(375)).toBe(false);
    });
  });

  describe('isPhone', () => {
    it('should return true for phone sizes', () => {
      expect(isPhone(767)).toBe(true);
      expect(isPhone(375)).toBe(true);
      expect(isPhone(0)).toBe(true);
    });

    it('should return false for tablet sizes', () => {
      expect(isPhone(768)).toBe(false);
      expect(isPhone(1024)).toBe(false);
    });
  });
});

