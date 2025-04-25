import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupLoginButtonHandler } from '../setupLoginButtonHandler';
import { PublicKey } from '@dfinity/agent';
import { prepareLogin } from '../prepareLogin';
import { buildMiddleToAppDelegationChain } from '../buildMiddleToAppDelegationChain';
import { determineIframe } from 'expo-icp-frontend-helpers';
import { sendDelegationToParent } from '../sendDelegationToParent';
import { handleNativeAppDelegation } from '../handleNativeAppDelegation';
import { renderError } from '../renderError';
import { formatError } from '../formatError';
import { ERROR_MESSAGES } from '../constants';

// Mock all dependencies
vi.mock('../prepareLogin', () => ({
  prepareLogin: vi.fn(),
}));

vi.mock('../buildMiddleToAppDelegationChain', () => ({
  buildMiddleToAppDelegationChain: vi.fn(),
}));

vi.mock('expo-icp-frontend-helpers', () => ({
  determineIframe: vi.fn(),
}));

vi.mock('../sendDelegationToParent', () => ({
  sendDelegationToParent: vi.fn(),
}));

vi.mock('../handleNativeAppDelegation', () => ({
  handleNativeAppDelegation: vi.fn(),
}));

vi.mock('../renderError', () => ({
  renderError: vi.fn(),
}));

vi.mock('../formatError', () => ({
  formatError: vi.fn(),
}));

describe('setupLoginButtonHandler', () => {
  const mockIILoginButton = document.createElement('button');
  const mockBackToAppButton = document.createElement('button');
  const mockDeepLink = 'https://example.com';
  const mockAppPublicKey = {} as PublicKey;
  const mockIIUri = 'https://identity.ic0.app';
  const mockMiddleDelegationIdentity = {};
  const mockDelegationChain = {};
  const mockFormattedError = 'Formatted error message';

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset all mocks to their initial state
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should handle successful login in iframe (web browser)', async () => {
    // Setup mocks
    (prepareLogin as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      vi.fn().mockResolvedValue(mockMiddleDelegationIdentity),
    );
    (
      buildMiddleToAppDelegationChain as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockDelegationChain);
    (formatError as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockFormattedError,
    );
    (determineIframe as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      true,
    );

    // Execute
    await setupLoginButtonHandler({
      iiLoginButton: mockIILoginButton,
      backToAppButton: mockBackToAppButton,
      deepLink: mockDeepLink,
      appPublicKey: mockAppPublicKey,
      iiUri: mockIIUri,
    });

    // Simulate click
    mockIILoginButton.click();

    // Wait for all promises to resolve
    await vi.waitFor(() => {
      expect(prepareLogin).toHaveBeenCalledWith({ iiUri: mockIIUri });
      expect(buildMiddleToAppDelegationChain).toHaveBeenCalledWith({
        middleDelegationIdentity: mockMiddleDelegationIdentity,
        appPublicKey: mockAppPublicKey,
        expiration: expect.any(Date),
      });
      expect(sendDelegationToParent).toHaveBeenCalledWith({
        deepLink: mockDeepLink,
        delegationChain: mockDelegationChain,
      });
      expect(handleNativeAppDelegation).not.toHaveBeenCalled();
      expect(renderError).toHaveBeenCalledWith('');
    });
  });

  it('should handle successful login in WebView (native app)', async () => {
    // Setup mocks
    (prepareLogin as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      vi.fn().mockResolvedValue(mockMiddleDelegationIdentity),
    );
    (
      buildMiddleToAppDelegationChain as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockDelegationChain);
    (formatError as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockFormattedError,
    );
    (determineIframe as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      false,
    );

    // Execute
    await setupLoginButtonHandler({
      iiLoginButton: mockIILoginButton,
      backToAppButton: mockBackToAppButton,
      deepLink: mockDeepLink,
      appPublicKey: mockAppPublicKey,
      iiUri: mockIIUri,
    });

    // Simulate click
    mockIILoginButton.click();

    // Wait for all promises to resolve
    await vi.waitFor(() => {
      expect(prepareLogin).toHaveBeenCalledWith({ iiUri: mockIIUri });
      expect(buildMiddleToAppDelegationChain).toHaveBeenCalledWith({
        middleDelegationIdentity: mockMiddleDelegationIdentity,
        appPublicKey: mockAppPublicKey,
        expiration: expect.any(Date),
      });
      expect(handleNativeAppDelegation).toHaveBeenCalledWith({
        deepLink: mockDeepLink,
        delegationChain: mockDelegationChain,
        iiLoginButton: mockIILoginButton,
        backToAppButton: mockBackToAppButton,
      });
      expect(sendDelegationToParent).not.toHaveBeenCalled();
      expect(renderError).toHaveBeenCalledWith('');
    });
  });

  it('should handle login error in click handler', async () => {
    const mockIILoginButton = document.createElement('button');
    const mockBackToAppButton = document.createElement('button');
    const mockDeepLink = 'app://login';
    const mockAppPublicKey = {} as PublicKey;
    const mockIIUri = 'https://identity.ic0.app';

    // Mock prepareLogin to return a function that rejects
    vi.mocked(prepareLogin).mockResolvedValueOnce(async () => {
      throw new Error('Login failed');
    });

    // Mock determineIframe to return false (native app case)
    vi.mocked(determineIframe).mockReturnValueOnce(false);

    // Setup the login button handler
    await setupLoginButtonHandler({
      iiLoginButton: mockIILoginButton,
      backToAppButton: mockBackToAppButton,
      deepLink: mockDeepLink,
      appPublicKey: mockAppPublicKey,
      iiUri: mockIIUri,
    });

    // Trigger the click event
    mockIILoginButton.click();

    // Wait for all async operations to complete
    await vi.waitFor(() => {
      // Verify that the error was rendered
      expect(renderError).toHaveBeenCalledWith(
        formatError(ERROR_MESSAGES.LOGIN_PROCESS, new Error('Login failed')),
      );

      // Verify that buildMiddleToAppDelegationChain was not called
      expect(buildMiddleToAppDelegationChain).not.toHaveBeenCalled();

      // Verify that sendDelegationToParent was not called
      expect(sendDelegationToParent).not.toHaveBeenCalled();

      // Verify that handleNativeAppDelegation was not called
      expect(handleNativeAppDelegation).not.toHaveBeenCalled();
    });
  });
});
