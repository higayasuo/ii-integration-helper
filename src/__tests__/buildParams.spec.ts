import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildParams } from '../buildParams';
import { buildAppPublicKey } from '../buildAppPublicKey';
import { buildIIUri } from '../buildIIUri';
import { buildDeepLink } from 'expo-icp-frontend-helpers';

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
}));

describe('buildParams', () => {
  const mockPublicKey = { toDer: vi.fn() };
  const mockIIUri = 'https://internetcomputer.org';
  const mockDeepLink = 'https://example.com';

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

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: new URL(
        'https://example.com?pubkey=test-pubkey&deep-link-type=icp',
      ),
      writable: true,
    });
  });

  it('should successfully build params with valid query parameters', () => {
    const result = buildParams(defaultParams);

    expect(result).toEqual({
      appPublicKey: mockPublicKey,
      iiUri: mockIIUri,
      deepLink: mockDeepLink,
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
  });

  it('should throw error when pubkey is missing', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com?deep-link-type=icp'),
      writable: true,
    });

    expect(() => buildParams(defaultParams)).toThrow(
      'Missing pubkey or deep-link-type in query string',
    );
  });

  it('should throw error when deep-link-type is missing', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com?pubkey=test-pubkey'),
      writable: true,
    });

    expect(() => buildParams(defaultParams)).toThrow(
      'Missing pubkey or deep-link-type in query string',
    );
  });

  it('should throw error when deep-link-type is invalid', () => {
    Object.defineProperty(window, 'location', {
      value: new URL(
        'https://example.com?pubkey=test-pubkey&deep-link-type=invalid-type',
      ),
      writable: true,
    });

    expect(() => buildParams(defaultParams)).toThrow(
      'Invalid deep-link-type: invalid-type',
    );
  });
});
