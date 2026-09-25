import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatTimeAgo } from '../formatters';

describe('formatters utility', () => {
  describe('formatCurrency', () => {
    it('formats numbers into Indian Rupee (INR) currency format', () => {
      const formatted = formatCurrency(250);
      expect(formatted).toMatch(/₹\s?250/);
    });

    it('handles zero correctly', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toMatch(/₹\s?0/);
    });

    it('formats large numbers with commas', () => {
      const formatted = formatCurrency(12500);
      expect(formatted).toContain('12,500');
    });
  });

  describe('formatDate', () => {
    it('returns empty string when dateString is missing or empty', () => {
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('formats a valid ISO string into a readable date string', () => {
      const dateStr = '2026-04-15T10:30:00Z';
      const formatted = formatDate(dateStr);
      expect(formatted).toContain('2026');
      expect(formatted).toMatch(/Apr|04/);
    });
  });

  describe('formatTimeAgo', () => {
    it('returns empty string when input is undefined', () => {
      expect(formatTimeAgo(undefined)).toBe('');
    });

    it('returns "Just now" for dates less than 1 minute ago', () => {
      const now = new Date();
      expect(formatTimeAgo(now.toISOString())).toBe('Just now');
    });

    it('returns "X mins ago" for dates within an hour', () => {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
      expect(formatTimeAgo(tenMinsAgo.toISOString())).toBe('10 mins ago');
    });

    it('returns "X hours ago" for dates within 24 hours', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(formatTimeAgo(threeHoursAgo.toISOString())).toBe('3 hours ago');
    });

    it('falls back to formatDate for dates older than 24 hours', () => {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const result = formatTimeAgo(twoDaysAgo.toISOString());
      expect(result).not.toContain('ago');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
