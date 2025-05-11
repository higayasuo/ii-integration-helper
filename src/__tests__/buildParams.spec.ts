import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildParams } from '../buildParams';
import { buildAppPublicKey } from '../buildAppPublicKey';
import { buildIIUri } from '../buildIIUri';
import { buildDeepLink, parseParams } from 'expo-icp-frontend-helpers';

// Mock the helper functions
vi.mock('../buildAppPublicKey', () => ({
  buildAppPublicKey: vi.fn(),
}));

vi.mock('../buildIIUri', () => ({
  buildIIUri: vi.fn(),
}));

vi.mock('expo-icp-frontend-helpers', () => ({
  buildDeepLink: vi.fn(),
  isDeepLinkType: (type: string) => type === 'icp',
  parseParams: vi.fn(),
}));

describe('buildParams', () => {
  const mockPublicKey = { toDer: vi.fn() };
  const mockIIUri = 'https://internetcomputer.org';
  const mockDeepLink = 'https://example.com/';
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
    (buildIIUri as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockIIUri,
    );
    (buildDeepLink as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDeepLink,
    );
    (parseParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pubkey: 'test-pubkey',
      deepLinkType: 'icp',
      sessionId: mockSessionId,
    });
  });

  it('should successfully build params with valid query parameters', () => {
    const result = buildParams(defaultParams);

    expect(result).toEqual({
      appPublicKey: mockPublicKey,
      iiUri: mockIIUri,
      deepLink: mockDeepLink,
      sessionId: mockSessionId,
    });

    expect(buildAppPublicKey).toHaveBeenCalledWith('test-pubkey');
    expect(buildIIUri).toHaveBeenCalledWith({
      localIPAddress: defaultParams.localIPAddress,
      dfxNetwork: defaultParams.dfxNetwork,
      internetIdentityCanisterId: defaultParams.internetIdentityCanisterId,
    });
    expect(buildDeepLink).toHaveBeenCalledWith({
      deepLinkType: 'icp',
      localIPAddress: defaultParams.localIPAddress,
      dfxNetwork: defaultParams.dfxNetwork,
      frontendCanisterId: defaultParams.frontendCanisterId,
      expoScheme: defaultParams.expoScheme,
    });
    expect(parseParams).toHaveBeenCalledWith(
      window.location.search,
      'pubkey',
      'deepLinkType',
      'sessionId',
    );
  });

  it('should throw error when deep-link-type is invalid', () => {
    (parseParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pubkey: 'test-pubkey',
      deepLinkType: 'invalid-type',
      sessionId: mockSessionId,
    });

    expect(() => buildParams(defaultParams)).toThrow(
      'Invalid deep-link-type: invalid-type',
    );
  });
});
