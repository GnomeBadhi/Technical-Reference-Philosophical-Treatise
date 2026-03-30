# Block Format  
## Sovereignty Kernel Ledger (SKL)

This document defines the canonical block format for the Sovereignty Kernel Ledger (SKL).  
The block format ensures deterministic encoding, hashing, validation, and state progression across all nodes.

Blocks must be:
- deterministic  
- minimal  
- unambiguous  
- fully recomputable  
- free of optional or variable‑interpretation fields  

---

# 1. Block Structure Overview

A block consists of two components:

1. **Header** — deterministic metadata  
2. **Body** — ordered list of transactions  

The block format is designed to preserve:
- linear time  
- kernel purity  
- deterministic state transitions  
- immediate finality  

---

# 2. Block Header

The block header contains the following fields in this exact order:

| Field | Description | Type | Notes |
|-------|-------------|------|-------|
| `index` | Block height \(t\) | 64‑bit integer | Must equal previous index + 1 |
| `prev_hash` | Hash of previous block header | 32 bytes | SHA‑256 |
| `f_E` | Environment signal \(f_E(t)\) | Fixed‑point 64‑bit | Verified via oracle |
| `merkle_root` | Merkle root of transactions | 32 bytes | Deterministic ordering |
| `state_root` | Hash of global state after applying block | 32 bytes | Deterministic |

All fields are required.  
No optional fields are permitted.

---

# 3. Block Body

The block body contains:

\[
\{\tau_0, \tau_1, \dots, \tau_n\}
\]

Where each \(\tau_k\) is a valid transaction encoded according to the canonical transaction format.

## 3.1 Transaction Ordering

Transactions must be sorted by:
1. `sender_pubkey` (lexicographically)  
2. `receiver_pubkey`  
3. `sigma_k`  

This ensures:
- deterministic Merkle roots  
- reproducible block hashes  
- no ordering manipulation  

---

# 4. Merkle Tree Construction

The Merkle tree is constructed from the SHA‑256 hashes of the serialized transactions.

Rules:
- leaves are transaction hashes  
- tree is binary  
- if odd number of leaves, duplicate last leaf  
- internal nodes are SHA‑256(left || right)  
- root is stored in the block header  

This ensures deterministic verification.

---

# 5. State Root

The state root is a hash of the complete global state after applying all transactions in the block.

State includes:
- all agent states \(f_a(t)\)  
- all sovereignty balances \(S_a(t)\)  
- global sovereignty \(S_{\text{tot}}(t)\)  
- token supply \(T(t)\)  

The state must be serialized deterministically before hashing.

---

# 6. Block Encoding

Blocks must be encoded using a deterministic, length‑prefixed binary format.

Recommended:
- CBOR or RLP  
- No compression  
- No optional fields  
- No whitespace or formatting differences  

All implementations must use the same encoding.

---

# 7. Block Hash

The block hash is:

\[
H(\text{block}) = \text{SHA‑256}(\text{serialized header})
\]

Only the header is hashed.  
The body is included indirectly through the Merkle root.

---

# 8. Block Validation Rules

A block at index \(t\) is valid if and only if:

## 8.1 Index Validity
\[
t = t_{\text{prev}} + 1
\]

## 8.2 Previous Hash Validity
`prev_hash` must match the hash of the previous block.

## 8.3 Oracle Verification
`f_E` must:
- match the oracle value for index \(t\)  
- have a valid oracle signature  

## 8.4 Transaction Validity
All transactions must be valid according to the transaction format.

## 8.5 Merkle Root Validity
Nodes recompute the Merkle root and compare it to the header.

## 8.6 State Transition Validity
Nodes must recompute:
- sovereignty gains  
- agent states  
- sovereignty balances  
- token supply  

The resulting state root must match the header.

## 8.7 Deterministic Ordering
Transactions must be sorted correctly.

Blocks failing any rule are invalid.

---

# 9. Genesis Block Exception

The genesis block:
- has index 0  
- has `prev_hash = 0`  
- contains no transactions  
- uses the environment baseline \(f_E(0)\)  
- defines the initial state root  

It is the only block not produced through consensus.

---

# 10. Summary

The block format ensures:
- deterministic encoding  
- deterministic hashing  
- deterministic state transitions  
- kernel‑pure sovereignty computation  
- immediate finality  
- global consistency  

This format is minimal, unambiguous, and fully aligned with the mathematical specification of the Sovereignty Kernel Ledger.
