# Changelog
All notable changes to this project will be documented in this file.

This project follows a simple, manual changelog format.  
Dates use YYYY‑MM‑DD.

---

## [0.1.0] - 2026-04-16
### Added
- Initial public release of the WiFi‑Kernel Adapter module.
- Introduced `Event` and `EncodedSignal` data structures.
- Added `IEventSignalEncoder` interface for pluggable signal encoding.
- Added `IWifiRelay` interface for pluggable Wi‑Fi relay implementations.
- Implemented `KernelWifiAdapter` for event → signal → relay processing.
- Added `WifiRelayStub` as a simple console‑based relay for testing.
- Added example `main.cpp` demonstrating basic usage.
- Added `CMakeLists.txt` for building the static library and example.
- Added `.gitignore` for common C++ and build artifacts.
- Added `WifiK-README.md` describing module purpose and design goals.

---

## [Unreleased]
### Planned
- Optional unit tests for adapter and stub relay.
- Additional example encoders (non‑functional placeholders).
- Expanded documentation for integration patterns.
