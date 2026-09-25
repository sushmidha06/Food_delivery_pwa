import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility', () => {
  it('combines simple class names', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('handles conditional class names', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });

  it('resolves conflicting Tailwind CSS classes correctly', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('filters out falsy and undefined values', () => {
    expect(cn('item', undefined, null, false, '', 'item-visible')).toBe('item item-visible');
  });
});
