import { DelegationChain } from '@dfinity/identity';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendDelegationToParent } from '../sendDelegationToParent';
import { buildDelegationString } from '../buildDelegationString';

// Mock buildDelegationString
vi.mock('../buildDelegationString', () => ({
  buildDelegationString: vi.fn().mockReturnValue('mocked-delegation-string'),
}));

describe('sendDelegationToParent', () => {
  const mockPostMessage = vi.fn();
  const mockConsoleLog = vi.fn();

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock window.parent.postMessage
    Object.defineProperty(window, 'parent', {
      value: {
        postMessage: mockPostMessage,
      },
      writable: true,
    });

    // Mock console.log
    Object.defineProperty(window, 'console', {
      value: {
        log: mockConsoleLog,
      },
      writable: true,
    });
  });

  it('should send delegation to parent window with correct message and origin', () => {
    // Setup
    const mockDeepLink = 'https://example.com/callback';
    const mockDelegationChain = {} as DelegationChain;

    // Execute
    sendDelegationToParent({
      deepLink: mockDeepLink,
      delegationChain: mockDelegationChain,
    });

    // Verify
    expect(buildDelegationString).toHaveBeenCalledWith(mockDelegationChain);
    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        kind: 'success',
        delegation: 'mocked-delegation-string',
      },
      'https://example.com',
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Web browser detected, using postMessage',
    );
  });
});
