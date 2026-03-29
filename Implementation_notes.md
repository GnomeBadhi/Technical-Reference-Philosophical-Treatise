# Implementation Notes  
## Sovereignty Kernel Ledger (SKL)

This document provides implementation guidance for developers building the Sovereignty Kernel Ledger (SKL).  
It covers data structures, hashing formats, precision requirements, block layout, transaction encoding, and node responsibilities.

The goal is to ensure that any implementation remains:
- deterministic  
- kernel‑pure  
- auditable  
- minimal  
- free of arbitrary choices  

---

# 1. Numeric Precision

All scalar values should use fixed‑precision decimal encoding.

Recommended format:
- 64‑bit fixed‑point  
- 32 bits integer, 32 bits fractional  
- No floating‑point operations  

This ensures:
- deterministic computation across platforms  
- reproducible sovereignty calculations  
- no rounding drift  

---

# 2. Hashing

All hashes should use a stable, widely supported cryptographic hash function.

Recommended:
- SHA‑256 for block headers  
- SHA‑256 for Merkle trees  
- SHA‑256 for spacetime signatures  

Hash inputs must be:
- byte‑serialized  
- length‑prefixed  
- deterministic  

---

# 3. Transaction Encoding

A transaction \(\tau_k\) must be encoded as a deterministic byte sequence containing:

1. Sender public key  
2. Receiver public key  
3. Previous states (implicit from chain)  
4. Updated states \(f_i(t)\), \(f_j(t)\)  
5. Sovereignty gain \(S_k\)  
6. Spacetime signature \(\sigma_k\)  
7. Agent signatures  

Recommended encoding:
- CBOR or RLP  
- No optional fields  
- No variable‑length ambiguity  

---

# 4. Block Layout

A block consists of:

## 4.1 Header
- Block index \(t\)  
- Previous block hash  
- Environment signal \(f_E(t)\)  
- Merkle root of transactions  
- State root (hash of all agent states and sovereignty balances)  

## 4.2 Body
- Ordered list of transactions \(\{\tau_k\}\)  

Blocks must be encoded deterministically.

---

# 5. State Storage

Each node maintains:

- Agent states \(f_a(t)\)  
- Agent sovereignty balances \(S_a(t)\)  
- Global sovereignty \(S_{\text{tot}}(t)\)  
- Token supply \(T(t)\)  
- Environment signal history \(f_E(t)\)  

Recommended storage:
- Key‑value store (e.g., RocksDB, LevelDB)  
- State root stored in block header  

---

# 6. Deterministic Execution

Nodes must recompute:
- sovereignty gains  
- state transitions  
- token issuance  
- Merkle roots  
- state roots  

No values may be taken from block data except:
- updated agent states  
- sovereignty gains  
- signatures  

Everything else must be recomputed.

---

# 7. Node Responsibilities

Each node must:

1. Receive the environment signal \(f_E(t)\)  
2. Validate block index  
3. Validate oracle signature  
4. Validate all transactions  
5. Recompute sovereignty  
6. Recompute state transitions  
7. Recompute token issuance  
8. Recompute Merkle root  
9. Recompute state root  
10. Accept or reject the block  

Nodes do **not**:
- vote  
- stake  
- mine  
- adjust parameters  
- influence value  

---

# 8. Deterministic Ordering

Transactions inside a block must be sorted by:
1. Sender public key (lexicographically)  
2. Receiver public key  
3. Spacetime signature  

This ensures:
- deterministic Merkle roots  
- reproducible block hashes  
- no ordering manipulation  

---

# 9. Environment Signal Integration

Nodes must:
- verify oracle signature  
- verify index alignment  
- reject blocks with incorrect \(f_E(t)\)  

No fallback or estimation is permitted.

---

# 10. Genesis Block Implementation

The genesis block must be hard‑coded with:

- \(t = 0\)  
- \(f_E(0) = f_{E,0}\)  
- One agent \(a_0\)  
- \(f_{a_0}(0) = f_{E,0}\)  
- \(S_{a_0}(0) = 0\)  
- \(T(0) = 0\)  
- Empty transaction list  
- Merkle root = hash of empty list  
- Previous hash = 0  

This ensures deterministic reconstruction.

---

# 11. Error Handling

Nodes must reject blocks that fail any of the following:

- invalid oracle value  
- invalid signatures  
- incorrect sovereignty computation  
- incorrect state transitions  
- incorrect token issuance  
- incorrect Merkle root  
- incorrect state root  
- incorrect block index  

No partial acceptance is allowed.

---

# 12. Performance Considerations

## 12.1 Sovereignty Computation
Sovereignty calculations are lightweight:
- two state differences  
- one absolute value  
- one multiplication  
- one division  

## 12.2 State Updates
State updates are linear in the number of agents involved in transactions.

## 12.3 Storage
State size grows with number of agents, not number of transactions.

## 12.4 Parallelization
Transaction validation can be parallelized, but ordering must remain deterministic.

---

# 13. Implementation Summary

These notes ensure that any SKL implementation remains:

- deterministic  
- auditable  
- kernel‑pure  
- structurally minimal  
- free of arbitrary choices  

The implementation must reflect the mathematical specification exactly, without modification or interpretation.
