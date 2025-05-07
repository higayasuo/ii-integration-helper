import { PublicKey } from '@dfinity/agent';
import { buildAppPublicKey } from './buildAppPublicKey';
import { buildIIUri } from './buildIIUri';
import {
  DeepLinkType,
  isDeepLinkType,
  buildDeepLink,
  parseURL,
} from 'expo-icp-frontend-helpers';

/**
 * Parameters required to build the parameters for the application.
 */
type BuildParamsParams = {
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

  /**
   * The canister ID for the frontend.
   */
  frontendCanisterId: string;

  /**
   * The Expo scheme.
   */
  expoScheme: string;
};

/**
 * Interface representing the result of the buildParams function.
 */
export interface BuildParamsResult {
  appPublicKey: PublicKey;
  iiUri: string;
  deepLink: string;
  sessionId: string;
}

type SearchParams = {
  pubkey?: string;
  'deep-link-type'?: string;
  'session-id'?: string;
};

/**
 * Builds the parameters required for the application.
 *
 * @param {BuildParamsParams} params - Configuration object containing necessary parameters.
 * @returns {BuildParamsResult} The built parameters including identity, iiUri, and deepLink.
 * @throws Will throw an error if pubkey or deep-link-type is missing in query string or if deep-link-type is not a valid DeepLinkType.
 */
export const buildParams = ({
  localIPAddress,
  dfxNetwork,
  internetIdentityCanisterId,
  frontendCanisterId,
  expoScheme,
}: BuildParamsParams): BuildParamsResult => {
  const { searchParams } = parseURL<SearchParams>(window.location.href);
  const pubkey = searchParams.pubkey;
  const deepLinkType = searchParams['deep-link-type'] as DeepLinkType;
  const sessionId = searchParams['session-id'];
  if (!pubkey || !deepLinkType || !sessionId) {
    throw new Error(
      'Missing pubkey, deep-link-type or session-id in query string',
    );
  }

  if (!isDeepLinkType(deepLinkType)) {
    throw new Error(`Invalid deep-link-type: ${deepLinkType}`);
  }

  const appPublicKey = buildAppPublicKey(pubkey);
  const iiUri = buildIIUri({
    localIPAddress,
    dfxNetwork,
    internetIdentityCanisterId,
  });
  const deepLink = buildDeepLink({
    deepLinkType,
    localIPAddress,
    dfxNetwork,
    frontendCanisterId,
    expoScheme,
  });

  return {
    appPublicKey,
    iiUri,
    deepLink,
    sessionId,
  };
};
