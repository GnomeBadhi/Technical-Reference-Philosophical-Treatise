# WiFi‑Kernel Adapter  
A minimal event‑to‑Wi‑Fi relay interface

This module provides a small, deterministic interface for converting generic application events into encoded signals and forwarding them to a Wi‑Fi–based relay. It is intentionally minimal and does not prescribe any specific encoding, protocol, or application logic.

The goal is to offer a clean separation between:

- Event generation (your application)
- Signal encoding (pluggable, user‑defined)
- Wi‑Fi relay transport (stub or real implementation)

This keeps the adapter flexible, testable, and implementation‑agnostic.

---

## Design Goals

- Minimal surface area  
- Deterministic behavior  
- Pluggable encoding  
- Pluggable relay  
- Safe for open‑source  
- No sensitive or application‑specific logic

---

## Core Interfaces

### Event Structure

```cpp
struct Event {
    std::string id;
    std::string type;
    std::string channel;
    std::string payload;
    uint64_t    timestamp;
};
