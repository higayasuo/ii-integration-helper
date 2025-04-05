import { describe, it, expect, vi } from 'vitest';
import { buildDeepLink } from '../buildDeepLink';
import { CanisterManager } from 'canister-manager';

// Mock CanisterManager
const mockCanisterManager = {
  dfxNetwork: 'local',
  localIPAddress: '127.0.0.1',
  replicaPort: 4943,
  canisterPort: 4943,
  getCanisterURL: vi.fn(),
  getBackendCanisterURL: vi.fn(),
  getFrontendCanisterURL: vi.fn().mockReturnValue('https://example.com'),
  getIdentityCanisterURL: vi.fn(),
  getInternetIdentityCanisterURL: vi.fn(),
  getCanisterId: vi.fn(),
} as unknown as CanisterManager;

vi.mock('canister-manager', () => ({
  CanisterManager: vi.fn().mockImplementation(() => mockCanisterManager),
}));

const defaultArgs = {
  localIPAddress: '127.0.0.1',
  dfxNetwork: 'local',
  frontendCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  expoScheme: 'myapp',
};

describe('buildDeepLink', () => {
  it('should return frontend canister URL for icp deep link type', () => {
    const result = buildDeepLink({ ...defaultArgs, deepLinkType: 'icp' });
    expect(result).toBe('https://example.com');
  });

  it('should return localhost URL for dev-server deep link type', () => {
    const result = buildDeepLink({
      ...defaultArgs,
      deepLinkType: 'dev-server',
    });
    expect(result).toBe('http://localhost:8081/');
  });

  it('should return expo URL for expo-go deep link type', () => {
    const result = buildDeepLink({ ...defaultArgs, deepLinkType: 'expo-go' });
    expect(result).toBe(`exp://${defaultArgs.localIPAddress}:8081/--/`);
  });

  it('should return expo scheme URL for legacy deep link type', () => {
    const result = buildDeepLink({ ...defaultArgs, deepLinkType: 'legacy' });
    expect(result).toBe(`${defaultArgs.expoScheme}://`);
  });

  it('should return frontend canister URL for modern deep link type when URL is HTTPS', () => {
    const result = buildDeepLink({ ...defaultArgs, deepLinkType: 'modern' });
    expect(result).toBe('https://example.com');
  });

  it('should throw error for modern deep link type when URL is not HTTPS', () => {
    // Mock CanisterManager to return non-HTTPS URL
    vi.mocked(CanisterManager).mockImplementationOnce(
      () =>
        ({
          ...mockCanisterManager,
          getFrontendCanisterURL: vi.fn().mockReturnValue('http://example.com'),
        } as unknown as CanisterManager),
    );

    expect(() =>
      buildDeepLink({ ...defaultArgs, deepLinkType: 'modern' }),
    ).toThrow('Frontend URL is not HTTPS: http://example.com');
  });

  it('should throw error for unsupported deep link type', () => {
    expect(() =>
      buildDeepLink({ ...defaultArgs, deepLinkType: 'invalid-type' as any }),
    ).toThrow('Not supported deep link type: invalid-type');
  });
});
