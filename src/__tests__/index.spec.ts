import { describe, it, expect } from 'vitest';
import { version } from '../index';

describe('II Integration Helper', () => {
  it('should have the correct version', () => {
    expect(version).toBe('1.0.0');
  });
});