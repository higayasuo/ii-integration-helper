import { CanisterManager } from 'canister-manager';

/**
 * Parameters required to build the Internet Identity URI.
 */
type BuildIIUriParams = {
  /**
   * The local IP address.
   */
  localIPAddress: string;

  /**
   * The DFX network.
   */
  dfxNetwork: string;

  /**
   * The canister ID for Internet Identity.
   */
  internetIdentityCanisterId: string;
};

/**
 * Builds the Internet Identity URI using the CanisterManager.
 *
 * @param {BuildIIUriParams} args - Configuration object containing necessary parameters.
 * @returns {string} The Internet Identity URI.
 */
export const buildIIUri = ({
  localIPAddress,
  dfxNetwork,
  internetIdentityCanisterId,
}: BuildIIUriParams): string => {
  const canisterManager = new CanisterManager({
    localIPAddress,
    dfxNetwork,
  });

  return canisterManager.getInternetIdentityURL(internetIdentityCanisterId);
};
