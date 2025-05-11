import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildURIFragment } from '../buildURIFragment';
import { buildDelegationString } from '../buildDelegationString';
import { DelegationChain } from '@dfinity/identity';
import { updateParams } from 'expo-icp-frontend-helpers';

// Mock the buildDelegationString function
vi.mock('../buildDelegationString', () => ({
  buildDelegationString: vi.fn(),
}));

// Mock expo-icp-frontend-helpers
vi.mock('expo-icp-frontend-helpers', () => ({
  updateParams: vi.fn(),
}));

describe('buildURIFragment', () => {
  const mockDelegationChain = {
    toJSON: vi.fn(),
  } as unknown as DelegationChain;

  const mockDelegationString = 'mock-delegation-string';
  const mockSessionId = 'test-session-id';
  const mockHashParams = {
    toString: vi
      .fn()
      .mockReturnValue(
        'delegation=mock-delegation-string&session-id=test-session-id',
      ),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (
      buildDelegationString as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(mockDelegationString);
    vi.spyOn(global, 'URLSearchParams').mockImplementation(
      () => mockHashParams as any,
    );
  });

  it('should build a URI fragment with the encoded delegation string and session ID', () => {
    const result = buildURIFragment({
      delegationChain: mockDelegationChain,
      sessionId: mockSessionId,
    });

    expect(buildDelegationString).toHaveBeenCalledWith(mockDelegationChain);
    expect(updateParams).toHaveBeenCalledWith(mockHashParams, {
      delegation: mockDelegationString,
      sessionId: mockSessionId,
    });
    expect(result).toBe(
      'delegation=mock-delegation-string&session-id=test-session-id',
    );
  });
});
