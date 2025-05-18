import { DelegationIdentity, ECDSAKeyIdentity } from '@dfinity/identity';
import { AuthClient } from '@dfinity/auth-client';

/**
 * Parameters required for preparing the login process.
 *
 * @typedef {Object} PrepareLoginParams
 * @property {string} internetIdentityURL - The Internet Identity URL.
 */
type PrepareLoginParams = {
  internetIdentityURL: URL;
};

/**
 * Prepares the login process by creating an identity and an authentication client.
 * Returns a function that initiates the login process when called.
 *
 * @param {PrepareLoginParams} params - The parameters required to prepare the login.
 * @returns {Promise<() => Promise<DelegationIdentity>>} A promise that resolves to a function which handles the login process and returns the delegation identity.
 */
export const prepareLogin = async ({
  internetIdentityURL,
}: PrepareLoginParams): Promise<() => Promise<DelegationIdentity>> => {
  const identity = await ECDSAKeyIdentity.generate();
  const authClient = await AuthClient.create({ identity });

  return async () => {
    return new Promise<DelegationIdentity>((resolve, reject) => {
      authClient.login({
        identityProvider: internetIdentityURL.toString(),
        onSuccess: () => {
          const middleDelegationIdentity =
            authClient.getIdentity() as DelegationIdentity;
          resolve(middleDelegationIdentity);
        },
        onError: (error?: string) => {
          reject(new Error(error || 'Unknown error'));
        },
      });
    });
  };
};
