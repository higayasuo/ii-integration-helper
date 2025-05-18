import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthClient } from '@dfinity/auth-client';
import { DelegationIdentity, ECDSAKeyIdentity } from '@dfinity/identity';
import { prepareLogin } from '../prepareLogin';

vi.mock('@dfinity/auth-client');
vi.mock('@dfinity/identity');

describe('prepareLogin', () => {
  const mockInternetIdentityURL = new URL('https://test.ic0.app');
  const mockArgs = {
    internetIdentityURL: mockInternetIdentityURL,
  };

  const mockAuthClient = {
    login: vi.fn(),
    getIdentity: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (
      AuthClient.create as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockAuthClient);
    (
      ECDSAKeyIdentity.generate as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});
  });

  it('should return a function that handles login process', async () => {
    const loginFunction = await prepareLogin(mockArgs);
    expect(typeof loginFunction).toBe('function');
  });

  it('should return delegation identity on successful login', async () => {
    const mockDelegationIdentity = {} as DelegationIdentity;
    mockAuthClient.getIdentity.mockReturnValue(mockDelegationIdentity);
    mockAuthClient.login.mockImplementation(({ onSuccess }) => {
      onSuccess();
    });

    const loginFunction = await prepareLogin(mockArgs);
    const result = await loginFunction();

    expect(result).toBe(mockDelegationIdentity);
    expect(mockAuthClient.login).toHaveBeenCalledWith({
      identityProvider: mockInternetIdentityURL.toString(),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('should throw error on login failure', async () => {
    const errorMessage = 'Login failed';
    mockAuthClient.login.mockImplementation(({ onError }) => {
      onError(errorMessage);
    });

    const loginFunction = await prepareLogin(mockArgs);

    await expect(loginFunction()).rejects.toThrow(errorMessage);
  });
});
