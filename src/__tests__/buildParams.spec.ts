import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildParams } from '../buildParams';
import { buildAppPublicKey } from '../buildAppPublicKey';
import { buildDeepLink } from 'expo-icp-frontend-helpers';
import {
  parseDeepLinkConnectionParams,
  buildInternetIdentityURL,
} from 'expo-icp-app-connect-helpers';

// Mock the helper functions
vi.mock('../buildAppPublicKey', () => ({
  buildAppPublicKey: vi.fn(),
}));

vi.mock('expo-icp-app-connect-helpers', () => ({
  parseDeepLinkConnectionParams: vi.fn(),
  buildInternetIdentityURL: vi.fn(),
}));

vi.mock('expo-icp-frontend-helpers', () => ({
  buildDeepLink: vi.fn(),
}));

describe('buildParams', () => {
  const mockPublicKey = { toDer: vi.fn() };
  const mockInternetIdentityURL = new URL('https://internetcomputer.org');
  const mockDeepLink = new URL('https://example.com/');
  const mockSessionId = 'test-session-id';

  const defaultParams = {
    localIPAddress: '127.0.0.1',
    dfxNetwork: 'local',
    internetIdentityCanisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
    frontendCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    expoScheme: 'myapp',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (buildAppPublicKey as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockPublicKey,
    );
    (
      buildInternetIdentityURL as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(mockInternetIdentityURL);
    (buildDeepLink as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDeepLink,
    );
    (
      parseDeepLinkConnectionParams as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      pubkey: 'test-pubkey',
      deepLinkType: 'icp',
      sessionId: mockSessionId,
      pathname: '/',
    });
  });

  it('should successfully build params with valid query parameters', () => {
    const result = buildParams(defaultParams);

    expect(result).toEqual({
      appPublicKey: mockPublicKey,
      internetIdentityURL: mockInternetIdentityURL,
      deepLink: mockDeepLink,
      sessionId: mockSessionId,
    });

    expect(buildAppPublicKey).toHaveBeenCalledWith('test-pubkey');
    expect(buildInternetIdentityURL).toHaveBeenCalledWith({
      localIPAddress: defaultParams.localIPAddress,
      dfxNetwork: defaultParams.dfxNetwork,
      targetCanisterId: defaultParams.internetIdentityCanisterId,
    });
    expect(buildDeepLink).toHaveBeenCalledWith({
      deepLinkType: 'icp',
      localIPAddress: defaultParams.localIPAddress,
      dfxNetwork: defaultParams.dfxNetwork,
      frontendCanisterId: defaultParams.frontendCanisterId,
      expoScheme: defaultParams.expoScheme,
      pathname: '/',
    });
    expect(parseDeepLinkConnectionParams).toHaveBeenCalledWith(
      window.location.search,
      'pubkey',
    );
  });
});
