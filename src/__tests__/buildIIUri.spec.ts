import { describe, it, expect, vi } from 'vitest';
import { buildIIUri } from '../buildIIUri';
import { CanisterManager } from 'canister-manager';

vi.mock('canister-manager', () => {
  return {
    CanisterManager: vi.fn().mockImplementation(() => ({
      getInternetIdentityURL: vi
        .fn()
        .mockReturnValue(
          `http://127.0.0.1:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
        ),
    })),
  };
});

const defaultArgs = {
  localIPAddress: '127.0.0.1',
  dfxNetwork: 'local',
  internetIdentityCanisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
};

describe('buildIIUri', () => {
  it('should return the correct Internet Identity URL', () => {
    const expectedUrl = `http://127.0.0.1:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`;
    const result = buildIIUri(defaultArgs);
    expect(result).toBe(expectedUrl);
  });

  it('should create CanisterManager with correct parameters', () => {
    buildIIUri(defaultArgs);
    expect(CanisterManager).toHaveBeenCalledWith({
      localIPAddress: '127.0.0.1',
      dfxNetwork: 'local',
    });
  });
});
