# API Reference  
## Sovereignty Kernel Ledger (SKL)

This document defines the canonical API for interacting with the Sovereignty Kernel Ledger (SKL).  
The API provides read‑only access to chain data and a deterministic interface for submitting transactions.

The API must preserve:
- kernel purity  
- determinism  
- non‑manipulability  
- minimalism  
- separation of concerns  

The API does **not** expose:
- governance  
- parameter changes  
- validator controls  
- market functions  

It exposes only what is necessary for clients to interact with the ledger.

---

# 1. API Principles

The SKL API is designed around the following principles:

## 1.1 Read‑Only by Default
All endpoints except transaction submission are read‑only.

## 1.2 Deterministic Responses
All responses must be:
- deterministic  
- canonical  
- free of nondeterministic fields (timestamps, random IDs, etc.)  

## 1.3 Minimal Surface Area
Only essential endpoints are exposed.

## 1.4 Statelessness
All endpoints are stateless and idempotent.

## 1.5 Kernel Separation
The API cannot modify:
- sovereignty  
- agent states  
- token supply  
- consensus rules  
- oracle values  

---

# 2. Endpoint Summary

| Category | Endpoint | Description |
|----------|----------|-------------|
| Chain | `/chain/head` | Returns the latest block index |
| Chain | `/chain/block/{t}` | Returns block at index `t` |
| Chain | `/chain/block/{t}/header` | Returns block header |
| Chain | `/chain/block/{t}/transactions` | Returns ordered transactions |
| State | `/state/agent/{pubkey}` | Returns agent state and sovereignty |
| State | `/state/global` | Returns global sovereignty and token supply |
| State | `/state/environment/{t}` | Returns environment signal at index `t` |
| Transactions | `/tx/submit` | Submits a new transaction |
| Transactions | `/tx/{hash}` | Returns transaction by hash |
| Utility | `/health` | Node health check |

All endpoints return deterministic JSON.

---

# 3. Chain Endpoints

## 3.1 `GET /chain/head`
Returns:
- latest block index  
- latest block hash  

Example response:
```json
{
  "index": 1284,
  "hash": "a3f9...c12e"
}
