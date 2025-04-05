# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-04-05

### Added

- Initial release of the II Integration Helper library
- Core functionality for Internet Identity integration
  - Parameter building for II integration
  - Deep linking support for various platforms
  - Delegation chain management
  - Public key handling
- UI helper functions
  - Button preparation and validation
  - Login process setup
  - Error handling and rendering
- Environment detection utilities
  - Iframe detection
  - Native app delegation handling
  - Parent window communication
- Comprehensive test coverage
- TypeScript type definitions
- Documentation and examples

### Dependencies

#### Peer Dependencies

- @dfinity/agent: For Internet Computer agent functionality
- @dfinity/identity: For identity and delegation management
- @dfinity/auth-client: For authentication client functionality

These peer dependencies must be installed in your project for the library to function properly.

#### Regular Dependencies

- canister-manager: For canister URL management
