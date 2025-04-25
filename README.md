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
npm install @dfinity/agent @dfinity/identity @dfinity/auth-client canister-manager
```

- `@dfinity/agent`: For Internet Computer agent functionality
- `@dfinity/identity`: For identity and delegation management
- `@dfinity/auth-client`: For authentication client functionality
- `canister-manager`: For canister URL management

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

## Usage

### Basic Usage

```typescript
import {
  buildParams,
  setupLoginButtonHandler,
  prepareButtons,
} from 'ii-integration-helpers';

// Build parameters for II integration
const params = buildParams({
  localIPAddress: '127.0.0.1',
  dfxNetwork: 'local',
  internetIdentityCanisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  frontendCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  expoScheme: 'myapp',
});

// Prepare buttons
const { iiLoginButton, backToAppButton } = prepareButtons();

// Setup login button handler
await setupLoginButtonHandler({
  iiLoginButton,
  backToAppButton,
  deepLink: params.deepLink,
  appPublicKey: params.appPublicKey,
  iiUri: params.iiUri,
});
```

### Delegation Chain

```typescript
import {
  buildMiddleToAppDelegationChain,
  buildURIFragment,
} from 'ii-integration-helpers';

// Build a delegation chain
const delegationChain = await buildMiddleToAppDelegationChain({
  middleDelegationIdentity,
  appPublicKey,
  expiration: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
});

// Build a URI fragment for the delegation
const uriFragment = buildURIFragment(delegationChain);
```

## API Reference

### Core Functions

- `buildParams`: Builds parameters for II integration
- `buildIIUri`: Builds the Internet Identity URI
- `buildAppPublicKey`: Converts a hex string to a PublicKey
- `buildDelegationString`: Converts a DelegationChain to a string
- `buildMiddleToAppDelegationChain`: Creates a delegation chain
- `buildURIFragment`: Builds a URI fragment for delegation

### Authentication Functions

- `prepareLogin`: Prepares the login process and returns a function to get delegation identity
- `setupLoginButtonHandler`: Sets up the login button handler for II authentication

### Delegation Return Functions

- `handleNativeAppDelegation`: Returns delegation chain to native app via deep link
- `sendDelegationToParent`: Returns delegation chain to parent window via postMessage

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
