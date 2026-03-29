# Mathematical Specification  
## Sovereignty Kernel Ledger (SKL)

This document defines the formal mathematical structure of the Sovereignty Kernel Ledger (SKL).  
It specifies the time model, environment model, agent state transitions, sovereignty kernel, transaction structure, block structure, validation rules, token issuance, and currency bridge function.

---

# 1. Time Model

Time is represented as a strictly increasing integer index:

\[
t \in \mathbb{N}, \quad t = 0,1,2,\dots
\]

There is no cyclical calendar.  
Time progresses linearly and monotonically.

---

# 2. Environment Signal

A global resonance signal is defined as:

\[
f_E(t)
\]

The baseline resonance is:

\[
f_{E,0} = f_E(0)
\]

Environmental weighting:

\[
\gamma(f_E(t)) = \frac{f_E(t)}{f_{E,0}}
\]

This ensures all transactions are anchored to a universal physical reference.

---

# 3. Agents

The set of agents at time \(t\):

\[
\mathcal{A}(t) = \{a_0, a_1, \dots\}
\]

Agents are added to the system upon their first interaction.

---

# 4. Agent State Function

Each agent has a scalar state:

\[
f_a(t)
\]

State evolves according to:

\[
f_a(t+1) = f_a(t) + \eta \cdot S_a^{\text{net}}(t) - \lambda \cdot f_a(t)
\]

Where:

- \(0 < \eta < 1\) is the learning/uptake rate  
- \(0 < \lambda < 1\) is the decay rate  
- \(S_a^{\text{net}}(t)\) is the net sovereignty gain for agent \(a\) at time \(t\):

\[
S_a^{\text{net}}(t) = \sum_{\tau_k \text{ involving } a \text{ at } t} S_k
\]

This is a discrete-time leaky integrator.

---

# 5. Transactions

A transaction at time \(t\) is defined as:

\[
\tau_k = (i, j, f_i(t), f_j(t), S_k, \sigma_k)
\]

Where:

- \(i\) = sender  
- \(j\) = receiver  
- \(f_i(t)\), \(f_j(t)\) = updated agent states  
- \(S_k\) = sovereignty gain  
- \(\sigma_k\) = spacetime signature  

---

# 6. Sovereignty Kernel

The sovereignty gain for transaction \(k\) is:

\[
S_k = \beta \cdot \left| \Delta f_i - \Delta f_j \right| \cdot \gamma(f_E(t))
\]

Where:

\[
\Delta f_i = f_i(t) - f_i(t-1)
\]
\[
\Delta f_j = f_j(t) - f_j(t-1)
\]

\(\beta\) is a fixed genesis constant.

This kernel measures boundary-aligned transformation between agents.

---

# 7. Spacetime Signature

Each transaction includes a deterministic signature:

\[
\sigma_k = H(t, f_E(t), f_i(t), f_j(t))
\]

This ensures uniqueness, ordering, and immutability.

---

# 8. Sovereignty Balances

Agent sovereignty:

\[
S_a(t+1) = S_a(t) + \sum_{\tau_k \text{ involving } a} S_k
\]

Global sovereignty:

\[
S_{\text{tot}}(t+1) = S_{\text{tot}}(t) + \sum_{\tau_k \text{ at } t} S_k
\]

---

# 9. Token Supply

Tokens are minted deterministically:

\[
T(t+1) = T(t) + \alpha \sum_{\tau_k \text{ at } t} S_k
\]

Where \(\alpha\) is a fixed genesis constant.

No mining, inflation, or governance adjustments exist.

---

# 10. Currency Bridge Function

The price of one sovereign token in external currency \(C\):

\[
P_C(t) = \frac{S_{\text{tot}}(t)}{T(t)} \cdot D_C(t)
\]

Where:

- \(\frac{S_{\text{tot}}}{T}\) = intrinsic sovereignty density  
- \(D_C(t)\) = external demand in currency \(C\)

This separates the truth layer (kernel) from the market layer (demand).

---

# 11. Block Structure

## Header
- Block index \(t\)  
- Previous block hash  
- Earth resonance \(f_E(t)\)  
- Merkle root of transactions  
- State root (hash of all \(f_a(t)\), \(S_a(t)\), \(T(t)\))

## Body
- Ordered list of valid transactions \(\{\tau_k\}\)

---

# 12. Block Validation Rules

A block at time \(t\) is valid if:

1. \(t = t_{\text{prev}} + 1\)  
2. \(f_E(t)\) matches the consensus oracle  
3. All transactions are valid  
4. Merkle root is correct  
5. State transitions recompute exactly  
6. Token supply recomputes exactly  

Nodes recompute all values deterministically.

---

# 13. Genesis Block

At \(t = 0\):

- \(\mathcal{A}(0) = \{a_0\}\)  
- \(f_{a_0}(0) = f_{E,0}\)  
- \(S_{a_0}(0) = 0\)  
- \(T(0) = 0\)  
- No transactions  
- Previous hash = 0  
- Merkle root = hash of empty set  

This defines the initial state of the system.

---

# 14. System Properties

- Deterministic  
- Linear time  
- Non-speculative  
- Non-manipulable  
- Universal  
- Minimal and compositional  

This specification defines the complete mathematical foundation of the Sovereignty Kernel Ledger.
