# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-04-25

### Added

- Initial release of the II Integration Helpers library
- Core functions for II integration:
  - `buildParams`: Builds parameters for II integration
  - `buildIIUri`: Builds the Internet Identity URI
  - `buildAppPublicKey`: Converts a hex string to a PublicKey
  - `buildDelegationString`: Converts a DelegationChain to a string
  - `buildMiddleToAppDelegationChain`: Creates a delegation chain
  - `buildURIFragment`: Builds a URI fragment for delegation
- Authentication functions:
  - `prepareLogin`: Prepares the login process
  - `setupLoginButtonHandler`: Sets up the login button handler
- Delegation return functions:
  - `handleNativeAppDelegation`: Returns delegation chain to native app
  - `sendDelegationToParent`: Returns delegation chain to parent window
- UI functions:
  - `prepareButtons`: Prepares and validates UI buttons
  - `renderError`: Renders error messages
  - `formatError`: Formats error messages
