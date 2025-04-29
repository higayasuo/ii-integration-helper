import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  const mockDeepLink = 'https://example.com';
  const mockIILoginButton = document.createElement('button');
  const mockBackToAppButton = document.createElement('button');
  const mockOpen = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (buildURIFragment as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUriFragment,
    );

    // Mock window.open
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true,
    });
  });

  it('should set up UI elements and add click event listener for app delegation', () => {
    // Call the function
    handleAppDelegation({
      deepLink: mockDeepLink,
      delegationChain: mockDelegationChain,
      iiLoginButton: mockIILoginButton,
      backToAppButton: mockBackToAppButton,
    });

    // Verify buildURIFragment was called with correct parameters
    expect(buildURIFragment).toHaveBeenCalledWith(mockDelegationChain);

    // Verify UI elements were updated
    expect(mockIILoginButton.style.display).toBe('none');
    expect(mockBackToAppButton.style.display).toBe('block');

    // Simulate click event
    mockBackToAppButton.click();

    // Verify button state was updated
    expect(mockBackToAppButton.textContent).toBe('Processing...');
    expect(mockBackToAppButton.style.opacity).toBe('0.7');
    expect(mockBackToAppButton.style.cursor).toBe('wait');

    // Verify window.open was called with correct parameters
    expect(mockOpen).toHaveBeenCalledWith(
      `${mockDeepLink}#${mockUriFragment}`,
      '_self',
    );
  });
});
