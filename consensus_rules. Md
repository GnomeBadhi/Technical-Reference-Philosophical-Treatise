# Consensus Rules  
## Sovereignty Kernel Ledger (SKL)

This document defines the consensus rules for the Sovereignty Kernel Ledger (SKL).  
Consensus determines how nodes agree on the canonical chain, validate blocks, and maintain deterministic state progression.

The SKL consensus model is designed to preserve:
- linear time
- deterministic state transitions
- kernel purity
- non-manipulability
- independence from market dynamics

---

# 1. Consensus Purpose

Consensus in SKL serves a single function:

\[
\textbf{Consensus determines ordering, not value.}
\]

All value-related quantities (sovereignty, state transitions, token issuance) are computed deterministically by the kernel and are not subject to voting, governance, or market influence.

---

# 2. Deterministic State Machine

SKL is a deterministic state machine defined by:

- the time index \(t\)
- the environment signal \(f_E(t)\)
- the set of transactions \(\{\tau_k\}\)
- the sovereignty kernel \(S_k\)
- the agent state function \(f_a(t)\)
- the token issuance rule \(T(t)\)

Given a valid block at time \(t\), the next state at time \(t+1\) is uniquely determined.

Consensus ensures all nodes agree on:
- the next block index
- the block contents
- the environment signal
- the resulting state root

---

# 3. Block Acceptance Conditions

A block at time \(t\) is accepted if and only if all of the following conditions hold:

## 3.1 Linear Time
\[
t = t_{\text{prev}} + 1
\]

No forks may violate monotonic time.

## 3.2 Valid Environment Signal
The block must include:

\[
f_E(t)
\]

Nodes verify this against the consensus oracle.

## 3.3 Valid Transactions
Every transaction \(\tau_k\) must satisfy:

1. Sender and receiver exist or are newly created  
2. Previous states \(f_i(t-1)\), \(f_j(t-1)\) are known  
3. Updated states \(f_i(t)\), \(f_j(t)\) are provided  
4. Sovereignty gain recomputes exactly:

\[
S_k = \beta \cdot |\Delta f_i - \Delta f_j| \cdot \gamma(f_E(t))
\]

5. Signature recomputes exactly:

\[
\sigma_k = H(t, f_E(t), f_i(t), f_j(t))
\]

## 3.4 Valid Merkle Root
The Merkle root of all transactions must match the header.

## 3.5 Valid State Transition
Nodes recompute:

\[
f_a(t+1)
\]
\[
S_a(t+1)
\]
\[
S_{\text{tot}}(t+1)
\]

All must match the block’s state root.

## 3.6 Valid Token Issuance
Nodes recompute:

\[
T(t+1) = T(t) + \alpha \sum S_k
\]

The result must match the block’s token supply.

---

# 4. Fork Choice Rule

SKL uses a deterministic fork choice rule:

\[
\textbf{The valid chain with the highest block index is canonical.}
\]

Because time is linear and deterministic:
- no probabilistic finality is required  
- no longest-chain heuristic is used  
- no stake or hash power influences ordering  

If two blocks claim the same index \(t\):
- nodes reject both until a single valid block is produced  
- the first valid block at index \(t\) becomes canonical  

---

# 5. Consensus Mechanism Compatibility

SKL is compatible with any consensus mechanism that guarantees:
- single block production per time index
- deterministic ordering
- resistance to equivocation

Suitable mechanisms include:
- Byzantine Fault Tolerant (BFT) consensus
- Proof-of-Authority (PoA)
- Delegated BFT
- Rotating leader BFT
- Permissioned validator sets

SKL does **not** require:
- Proof-of-Work  
- Proof-of-Stake  
- Economic penalties  
- Governance voting  

Consensus is structural, not economic.

---

# 6. Environment Oracle Integration

The environment signal \(f_E(t)\) must be:
- globally available  
- verifiable  
- tamper-resistant  
- consistent across nodes  

Consensus requires that all nodes agree on the oracle output for each \(t\).  
If the oracle fails or produces inconsistent values, block production halts until consistency is restored.

---

# 7. Finality

Finality is immediate and absolute.

A block is final when:
- it satisfies all validation rules  
- it is accepted at index \(t\)  
- the next block \(t+1\) is produced  

No reorgs are possible because:
- time cannot regress  
- state transitions are deterministic  
- fork choice is index-based  

---

# 8. Security Properties

The consensus model ensures:

### 8.1 Non-manipulability
No validator can alter:
- sovereignty  
- agent states  
- token issuance  
- environmental weighting  

All values are recomputed independently.

### 8.2 Deterministic Convergence
All honest nodes converge to the same state.

### 8.3 Oracle Integrity
The only external dependency is the environment signal.

### 8.4 No Economic Attacks
Because:
- no mining  
- no staking  
- no rewards  
- no slashing  
- no governance  

There are no economic vectors for manipulation.

---

# 9. Summary

The SKL consensus model ensures:
- deterministic block production  
- linear time  
- immutable ordering  
- kernel purity  
- immediate finality  
- independence from markets  
- independence from governance  

Consensus determines ordering.  
The kernel determines value.

This separation is fundamental to the integrity of the Sovereignty Kernel Ledger.
