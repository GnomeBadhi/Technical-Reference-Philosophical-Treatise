# Network Protocol  
## Sovereignty Kernel Ledger (SKL)

This document defines the peer‑to‑peer (P2P) network protocol for the Sovereignty Kernel Ledger (SKL).  
The network protocol specifies how nodes discover peers, propagate blocks, propagate transactions, and synchronize state.

The protocol must preserve:
- determinism  
- kernel purity  
- minimalism  
- resistance to manipulation  
- independence from market dynamics  

---

# 1. Network Principles

The SKL network is designed around the following principles:

## 1.1 Deterministic Gossip
All messages must be:
- canonical  
- signed  
- verifiable  
- free of nondeterministic metadata  

## 1.2 Minimal Message Types
Only essential messages are defined.

## 1.3 Stateless Transport
The network layer does not maintain state transitions; it only transports data.

## 1.4 No Economic Influence
The network layer does not:
- prioritize messages based on stake  
- include fees  
- include incentives  

## 1.5 Validator Neutrality
All nodes are structurally equal at the network layer.

---

# 2. Peer Discovery

Nodes discover peers using one or more of the following:

- static peer lists  
- DNS seeds  
- bootstrap nodes  
- manual configuration  

The protocol does **not** include:
- peer scoring  
- reputation systems  
- stake‑weighted routing  

Peer discovery must be deterministic and minimal.

---

# 3. Message Types

The network protocol defines exactly six message types:

| Message | Purpose |
|---------|---------|
| `HELLO` | Initial handshake |
| `PEERS` | Exchange peer lists |
| `TX` | Propagate a transaction |
| `BLOCK` | Propagate a full block |
| `GET_BLOCK` | Request a block by index |
| `STATE_REQUEST` | Request state snapshot (sync) |

No additional message types are permitted.

---

# 4. Message Format

All messages must be:
- length‑prefixed  
- binary encoded (CBOR or RLP)  
- signed by the sender  
- free of timestamps  
- free of nondeterministic metadata  

Each message includes:
- message type  
- payload  
- sender public key  
- signature  

Nodes must verify signatures before processing.

---

# 5. Handshake Protocol

## 5.1 `HELLO`
Sent immediately upon connection.

Contains:
- node public key  
- latest block index  
- latest block hash  

## 5.2 `PEERS`
Sent after handshake.

Contains:
- list of known peers (public keys + addresses)  

Nodes must:
- validate all public keys  
- ignore malformed entries  

---

# 6. Transaction Propagation

## 6.1 `TX` Message
Contains:
- serialized transaction  
- transaction hash  

Nodes must:
- verify signatures  
- perform stateless validation  
- check for duplicates  
- forward only valid transactions  

Invalid transactions must be dropped silently.

---

# 7. Block Propagation

## 7.1 `BLOCK` Message
Contains:
- full block (header + transactions)  
- block hash  

Nodes must:
- verify block index  
- verify previous hash  
- verify oracle value  
- verify Merkle root  
- verify state root  
- recompute all sovereignty and state transitions  

If valid:
- add block to chain  
- forward to peers  

If invalid:
- drop silently  

---

# 8. Block Retrieval

## 8.1 `GET_BLOCK`
Nodes may request a block by index.

Response:
- `BLOCK` message  

Nodes must not:
- request blocks out of order  
- request future blocks  

---

# 9. Synchronization Protocol

A node joining the network must:

1. Send `HELLO`  
2. Receive peer list  
3. Request blocks sequentially using `GET_BLOCK`  
4. Apply each block deterministically  
5. Verify state root at each step  

If any block fails validation:
- sync halts  
- node disconnects  
- node retries with a different peer  

No fast‑sync or snapshot‑based shortcuts are permitted.

---

# 10. Anti‑DoS Rules

Nodes must enforce:

## 10.1 Rate Limits
- limit inbound `TX` messages  
- limit inbound `BLOCK` messages  
- limit handshake attempts  

## 10.2 Signature Verification
Drop messages with invalid signatures immediately.

## 10.3 Duplicate Filtering
Ignore repeated:
- transactions  
- blocks  
- peer lists  

## 10.4 Size Limits
Reject messages exceeding protocol‑defined maximum sizes.

---

# 11. Deterministic Gossip Rules

Nodes must:
- forward valid messages exactly once  
- never reorder transactions  
- never reorder blocks  
- never modify payloads  

This ensures:
- deterministic propagation  
- consistent Merkle roots  
- consistent block hashes  

---

# 12. Network Security

The network layer is protected by:
- cryptographic signatures  
- deterministic validation  
- strict message formats  
- no economic incentives  
- no peer scoring  

Attackers cannot:
- reorder transactions  
- reorder blocks  
- inject invalid state  
- influence sovereignty  
- influence token issuance  

---

# 13. Summary

The SKL network protocol ensures:
- deterministic block propagation  
- deterministic transaction propagation  
- minimal attack surface  
- kernel‑pure communication  
- global consistency  
- validator neutrality  

The network layer transports data.  
The kernel determines truth.
