# Genesis Block  
## Sovereignty Kernel Ledger (SKL)

This document defines the genesis block of the Sovereignty Kernel Ledger (SKL).  
The genesis block establishes the initial state of the system and anchors all future state transitions.  
It is the only block that is not produced through consensus.

The genesis block must be:
- deterministic  
- minimal  
- free of arbitrary parameters  
- reconstructable from first principles  
- structurally aligned with the sovereignty kernel  

---

# 1. Purpose of the Genesis Block

The genesis block defines:
- the initial time index  
- the initial environment signal  
- the first agent  
- the initial agent state  
- the initial sovereignty  
- the initial token supply  
- the initial state root  
- the initial Merkle root  

All future blocks derive their validity from the invariants established here.

---

# 2. Genesis Time Index

The genesis block is assigned:

\[
t = 0
\]

This is the beginning of the linear, non‑cyclical timeline.  
There is no prior state.

---

# 3. Environment Baseline

The genesis block includes the initial environment signal:

\[
f_E(0) = f_{E,0}
\]

This value defines the long‑term baseline for the environmental weighting:

\[
\gamma(f_E(t)) = \frac{f_E(t)}{f_{E,0}}
\]

At genesis:

\[
\gamma(f_E(0)) = 1
\]

This ensures symmetry and prevents artificial inflation or deflation.

---

# 4. Initial Agent Set

The system begins with exactly one agent:

\[
\mathcal{A}(0) = \{ a_0 \}
\]

This agent represents the originator of the system.  
No other agents exist at genesis.

---

# 5. Initial Agent State

The initial state of the first agent is:

\[
f_{a_0}(0) = f_{E,0}
\]

This ensures:
- alignment with the environment  
- no arbitrary advantage  
- no arbitrary penalty  
- symmetry at system birth  

---

# 6. Initial Sovereignty

No interactions have occurred at genesis.  
Therefore:

\[
S_{a_0}(0) = 0
\]
\[
S_{\text{tot}}(0) = 0
\]

Sovereignty must be earned through transformation.  
None is pre‑allocated.

---

# 7. Initial Token Supply

No sovereignty has been generated, so:

\[
T(0) = 0
\]

Tokens are minted only through the sovereignty kernel.  
There is no pre‑mine, no founder allocation, and no inflation.

---

# 8. Genesis Transactions

The genesis block contains:

- no transactions  
- no signatures  
- no sovereignty gains  

It is a pure state definition.

---

# 9. Genesis Merkle Root

Because the transaction list is empty:

\[
\text{MerkleRoot}(0) = H(\text{empty})
\]

This value must be computed deterministically.

---

# 10. Genesis State Root

The state root is computed from:

- agent set  
- agent states  
- sovereignty balances  
- token supply  

At genesis:

\[
\text{StateRoot}(0) = H(a_0, f_{a_0}(0), S_{a_0}(0), T(0))
\]

This root anchors all future state transitions.

---

# 11. Genesis Block Header

The genesis block header contains:

- Block index: \(t = 0\)  
- Previous hash: 0 (or a fixed constant)  
- Environment signal: \(f_E(0)\)  
- Merkle root: hash of empty list  
- State root: hash of initial state  

All fields must be deterministic and reproducible.

---

# 12. Genesis Block Body

The body contains:

- an empty transaction list  

No additional data is permitted.

---

# 13. Deterministic Reconstruction

Any node must be able to reconstruct the genesis block from:
- the specification  
- the environment baseline \(f_{E,0}\)  
- the identity of the first agent \(a_0\)

No external data is required.

---

# 14. Summary

The genesis block establishes:
- linear time  
- environmental alignment  
- deterministic initialization  
- zero sovereignty  
- zero tokens  
- a single origin agent  
- a pure, minimal state  

This block defines the structural foundation upon which the entire Sovereignty Kernel Ledger is built.
