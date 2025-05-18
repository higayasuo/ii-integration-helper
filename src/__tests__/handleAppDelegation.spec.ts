import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleAppDelegation } from '../handleAppDelegation';
import { buildURIFragment } from '../buildURIFragment';
import { DelegationChain } from '@dfinity/identity';

// Mock the helper functions
vi.mock('../buildURIFragment', () => ({
  buildURIFragment: vi.fn(),
}));

describe('handleAppDelegation', () => {
  const mockDelegationChain = {} as DelegationChain;
  const mockUriFragment = 'test-fragment';
  const mockDeepLink = new URL('https://example.com');
  const mockSessionId = 'test-session-id';
  const mockIILoginButton = document.createElement('button');
  const mockBackToAppButton = document.createElement('button');
  const originalLocation = window.location;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (buildURIFragment as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUriFragment,
    );

    // Mock window.location
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: '',
      hash: '',
    };
  });

  afterEach(() => {
    // Restore window.location and console.log
    window.location = originalLocation;
  });

  it('should set up UI elements and add click event listener for app delegation', () => {
    // Call the function
    handleAppDelegation({
      deepLink: mockDeepLink,
      delegationChain: mockDelegationChain,
      sessionId: mockSessionId,
      iiLoginButton: mockIILoginButton,
      backToAppButton: mockBackToAppButton,
    });

    // Verify buildURIFragment was called with correct parameters
    expect(buildURIFragment).toHaveBeenCalledWith({
      delegationChain: mockDelegationChain,
      sessionId: mockSessionId,
    });

    // Verify UI elements were updated
    expect(mockIILoginButton.style.display).toBe('none');
    expect(mockBackToAppButton.style.display).toBe('block');

    // Simulate click event
    mockBackToAppButton.click();

    // Verify button state was updated
    expect(mockBackToAppButton.textContent).toBe('Processing...');
    expect(mockBackToAppButton.style.opacity).toBe('0.7');
    expect(mockBackToAppButton.style.cursor).toBe('wait');
  });
});
