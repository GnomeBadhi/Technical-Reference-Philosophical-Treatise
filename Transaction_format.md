# Transaction Format  
## Sovereignty Kernel Ledger (SKL)

This document defines the canonical transaction format for the Sovereignty Kernel Ledger (SKL).  
The format ensures deterministic encoding, decoding, hashing, and validation across all nodes.

Transactions must be:
- unambiguous  
- deterministic  
- minimal  
- fully recomputable  
- free of optional or variable‑interpretation fields  

---

# 1. Transaction Definition

A transaction \(\tau_k\) is defined mathematically as:

\[
\tau_k = (i, j, f_i(t), f_j(t), S_k, \sigma_k)
\]

The encoded transaction must contain:
1. Sender identity  
2. Receiver identity  
3. Updated sender state  
4. Updated receiver state  
5. Sovereignty gain  
6. Spacetime signature  
7. Cryptographic signatures  

All fields are required.  
No optional fields are permitted.

---

# 2. Encoding Format

Transactions must be encoded using a deterministic, length‑prefixed binary format.

Recommended encoding:
- **CBOR** or **RLP**  
- No compression  
- No variable‑length ambiguity  
- No optional fields  

All implementations must use the same encoding.

---

# 3. Field Layout

A transaction contains the following fields in this exact order:

| Field | Description | Type | Notes |
|-------|-------------|------|-------|
| `sender_pubkey` | Sender’s public key | 32 bytes | Ed25519 or equivalent |
| `receiver_pubkey` | Receiver’s public key | 32 bytes | Same format as sender |
| `f_i` | Updated state of sender | Fixed‑point 64‑bit | 32/32 integer/fraction |
| `f_j` | Updated state of receiver | Fixed‑point 64‑bit | Same format |
| `S_k` | Sovereignty gain | Fixed‑point 64‑bit | Must recompute exactly |
| `sigma_k` | Spacetime signature | 32 bytes | SHA‑256 hash |
| `sender_sig` | Signature by sender | 64 bytes | Ed25519 signature |
| `receiver_sig` | Signature by receiver | 64 bytes | Ed25519 signature |

Total size (typical): **~260 bytes per transaction**

---

# 4. Field Semantics

## 4.1 Sender and Receiver Public Keys
These identify the agents involved in the transaction.

Requirements:
- must be valid public keys  
- must be unique identifiers  
- must match the signatures  

## 4.2 Updated States \(f_i(t)\), \(f_j(t)\)
These are the post‑interaction states.

Nodes must:
- recompute the expected values  
- compare them to the encoded values  
- reject the transaction if mismatched  

## 4.3 Sovereignty Gain \(S_k\)
This value must satisfy:

\[
S_k = \beta \cdot |\Delta f_i - \Delta f_j| \cdot \gamma(f_E(t))
\]

Nodes recompute this value.  
If the encoded value differs, the transaction is invalid.

## 4.4 Spacetime Signature \(\sigma_k\)
Defined as:

\[
\sigma_k = H(t, f_E(t), f_i(t), f_j(t))
\]

This ensures:
- uniqueness  
- ordering  
- immutability  

Nodes recompute and verify.

## 4.5 Cryptographic Signatures
Both sender and receiver must sign the transaction.

Signatures cover:
- all fields except the signatures themselves  
- in the exact encoded order  

This prevents tampering.

---

# 5. Deterministic Serialization

Serialization rules:
- big‑endian for all integers  
- fixed‑length fields must not vary  
- no trailing zeros  
- no optional fields  
- no compression  
- no whitespace or formatting differences  

All nodes must serialize transactions identically.

---

# 6. Transaction Hash

The transaction hash is:

\[
H(\tau_k) = \text{SHA‑256}(\text{serialized transaction})
\]

This hash is used in:
- Merkle tree construction  
- block validation  
- transaction indexing  

---

# 7. Validation Rules

A transaction is valid if and only if:

1. Public keys are valid  
2. Signatures verify  
3. Updated states match recomputed values  
4. Sovereignty gain matches recomputed value  
5. Spacetime signature matches recomputed value  
6. Encoding is deterministic  
7. No fields are missing or malformed  

Invalid transactions must be rejected.

---

# 8. Deterministic Ordering

Transactions inside a block must be sorted by:
1. `sender_pubkey` (lexicographically)  
2. `receiver_pubkey`  
3. `sigma_k`  

This ensures:
- deterministic Merkle roots  
- reproducible block hashes  
- no ordering manipulation  

---

# 9. Summary

The transaction format ensures:
- deterministic encoding  
- deterministic hashing  
- deterministic validation  
- kernel‑pure sovereignty computation  
- cryptographic integrity  

This format is minimal, unambiguous, and fully aligned with the mathematical specification of the Sovereignty Kernel Ledger.
