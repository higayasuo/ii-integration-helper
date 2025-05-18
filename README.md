# II Integration Helpers

A TypeScript library that provides helper functions for implementing the Proxy Web App component of Internet Identity (II) integration for mobile applications. This library follows the secure integration pattern described in the [Internet Computer documentation](https://internetcomputer.org/docs/building-apps/security/iam#integrating-internet-identity-on-mobile-devices).

## Overview

This library implements the Proxy Web App component of the secure Internet Identity integration pattern for mobile applications. It helps create a secure bridge between mobile applications and Internet Identity by:

1. Generating an intermediate session key
2. Initiating the II client authentication protocol using this intermediate key
3. Creating a delegation chain that allows the mobile application to use their session key
4. Returning the delegation chain to the mobile app using app links/universal links and URI fragments

This approach prevents delegation theft attacks that could occur with naive implementations.

## Installation

```bash
npm install ii-integration-helpers
```

## Dependencies

### Peer Dependencies

These dependencies need to be installed in your project:

```bash
npm install @dfinity/agent @dfinity/identity @dfinity/auth-client canister-manager expo-icp-app-connect-helpers expo-icp-frontend-helpers
```

- `@dfinity/agent`: For Internet Computer agent functionality
- `@dfinity/identity`: For identity and delegation management
- `@dfinity/auth-client`: For authentication client functionality
- `canister-manager`: For canister URL management
- `expo-icp-app-connect-helpers`: For app connection functionality
- `expo-icp-frontend-helpers`: For deep link and URL parsing functionality

### Regular Dependencies

The following dependencies are included in the package:

- None (all dependencies are peer dependencies)

## Features

- Secure Internet Identity authentication integration for mobile applications
- Intermediate session key generation and management
- Delegation chain creation and verification
- Public key handling
- Error formatting and rendering
- Button setup and event handling
- Deep link and URL parsing functionality

## Usage

```typescript
import {
  renderError,
  formatError,
  buildParams,
  prepareButtons,
  setupLoginButtonHandler,
} from 'ii-integration-helpers';
import { ERROR_MESSAGES } from './constants';
import {
  LOCAL_IP_ADDRESS,
  DFX_NETWORK,
  CANISTER_ID_INTERNET_IDENTITY,
  CANISTER_ID_FRONTEND,
  EXPO_SCHEME,
} from './env.generated';

const main = async (): Promise<void> => {
  try {
    // Build parameters for II integration
    const { deepLink, appPublicKey, internetIdentityURL, sessionId } =
      buildParams({
        localIPAddress: LOCAL_IP_ADDRESS,
        dfxNetwork: DFX_NETWORK,
        internetIdentityCanisterId: CANISTER_ID_INTERNET_IDENTITY,
        frontendCanisterId: CANISTER_ID_FRONTEND,
        expoScheme: EXPO_SCHEME,
      });

    // Prepare buttons
    const { iiLoginButton, backToAppButton } = prepareButtons();

    // Setup login button handler
    await setupLoginButtonHandler({
      iiLoginButton,
      backToAppButton,
      deepLink,
      sessionId,
      appPublicKey,
      internetIdentityURL,
      ttlMs: 1000 * 60 * 15, // 15 minutes until authentication expires
    });
  } catch (error) {
    renderError(formatError(ERROR_MESSAGES.INITIALIZATION, error));
  }
};

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  main();
});
```

## API Reference

### Core Functions

- `buildParams`: Builds parameters for II integration
- `buildAppPublicKey`: Converts a hex string to a PublicKey
- `buildDelegationString`: Converts a DelegationChain to a string
- `buildMiddleToAppDelegationChain`: Creates a delegation chain
- `buildURIFragment`: Builds a URI fragment for delegation

### Authentication Functions

- `prepareLogin`: Prepares the login process and returns a function to get delegation identity
- `setupLoginButtonHandler`: Sets up the login button handler for II authentication
  - Parameters:
    - `ttlMs`: number - Time to live in milliseconds until authentication expires

### Delegation Return Functions

- `handleAppDelegation`: Returns delegation chain to the app via deep link or postMessage

### UI Functions

- `prepareButtons`: Prepares and validates UI buttons
- `renderError`: Renders error messages
- `formatError`: Formats error messages

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run tests with coverage
npm run test:coverage
```

## License

MIT
