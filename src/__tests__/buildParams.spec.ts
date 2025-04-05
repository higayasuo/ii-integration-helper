import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildParams } from '../buildParams';
import { buildAppPublicKey } from '../buildAppPublicKey';
import { buildIIUri } from '../buildIIUri';
import { buildDeepLink } from '../buildDeepLink';

// Mock the helper functions
vi.mock('../buildAppPublicKey', () => ({
  buildAppPublicKey: vi.fn(),
}));

vi.mock('../buildIIUri', () => ({
  buildIIUri: vi.fn(),
}));

vi.mock('../buildDeepLink', () => ({
  buildDeepLink: vi.fn(),
}));

describe('buildParams', () => {
  const mockPublicKey = { toDer: vi.fn() };
  const mockIIUri = 'https://internetcomputer.org';
  const mockDeepLink = 'https://example.com';
  const mockWindow = {
    location: new URL(
      'https://example.com?pubkey=test-pubkey&deep-link-type=icp',
    ),
  } as unknown as Window & typeof globalThis;

  const defaultArgs = {
    localIPAddress: '127.0.0.1',
    dfxNetwork: 'local',
    internetIdentityCanisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
    frontendCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    expoScheme: 'myapp',
    window: mockWindow,
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
  });

  it('should successfully build params with valid query parameters', () => {
    const result = buildParams(defaultArgs);

    expect(result).toEqual({
      appPublicKey: mockPublicKey,
      iiUri: mockIIUri,
      deepLink: mockDeepLink,
    });

    expect(buildAppPublicKey).toHaveBeenCalledWith('test-pubkey');
    expect(buildIIUri).toHaveBeenCalledWith({
      localIPAddress: defaultArgs.localIPAddress,
      dfxNetwork: defaultArgs.dfxNetwork,
      internetIdentityCanisterId: defaultArgs.internetIdentityCanisterId,
    });
    expect(buildDeepLink).toHaveBeenCalledWith({
      deepLinkType: 'icp',
      localIPAddress: defaultArgs.localIPAddress,
      dfxNetwork: defaultArgs.dfxNetwork,
      frontendCanisterId: defaultArgs.frontendCanisterId,
      expoScheme: defaultArgs.expoScheme,
    });
  });

  it('should throw error when pubkey is missing', () => {
    const args = {
      ...defaultArgs,
      window: {
        location: new URL('https://example.com?deep-link-type=icp'),
      } as unknown as Window & typeof globalThis,
    };

    expect(() => buildParams(args)).toThrow(
      'Missing pubkey or deep-link-type in query string',
    );
  });

  it('should throw error when deep-link-type is missing', () => {
    const args = {
      ...defaultArgs,
      window: {
        location: new URL('https://example.com?pubkey=test-pubkey'),
      } as unknown as Window & typeof globalThis,
    };

    expect(() => buildParams(args)).toThrow(
      'Missing pubkey or deep-link-type in query string',
    );
  });

  it('should throw error when deep-link-type is invalid', () => {
    const args = {
      ...defaultArgs,
      window: {
        location: new URL(
          'https://example.com?pubkey=test-pubkey&deep-link-type=invalid-type',
        ),
      } as unknown as Window & typeof globalThis,
    };

    expect(() => buildParams(args)).toThrow(
      'Invalid deep-link-type: invalid-type',
    );
  });
});
