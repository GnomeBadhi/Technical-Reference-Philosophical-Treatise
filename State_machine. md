# State Machine  
## Sovereignty Kernel Ledger (SKL)

This document defines the deterministic state machine of the Sovereignty Kernel Ledger (SKL).  
The state machine specifies how the global state transitions from time index \(t\) to time index \(t+1\) when a valid block is applied.

The state machine must be:
- deterministic  
- recomputable  
- minimal  
- kernel‑pure  
- independent of market dynamics  
- independent of validator behavior  

---

# 1. State Definition

The global state at time \(t\) is:

\[
\mathcal{S}(t) = \left(
\{f_a(t)\},\;
\{S_a(t)\},\;
S_{\text{tot}}(t),\;
T(t),\;
f_E(t)
\right)
\]

Where:

- \(f_a(t)\): agent states  
- \(S_a(t)\): agent sovereignty balances  
- \(S_{\text{tot}}(t)\): total sovereignty  
- \(T(t)\): token supply  
- \(f_E(t)\): environment signal  

This state is fully determined by the genesis block and all valid blocks up to index \(t\).

---

# 2. Inputs to the State Transition

To compute \(\mathcal{S}(t+1)\), the state machine requires:

1. The previous state \(\mathcal{S}(t)\)  
2. The environment signal \(f_E(t+1)\)  
3. The ordered list of valid transactions \(\{\tau_k\}\) in block \(t+1\)  

No other inputs are permitted.

---

# 3. Transaction Application

Each transaction \(\tau_k\) contains:

\[
(i, j, f_i(t+1), f_j(t+1), S_k, \sigma_k)
\]

Nodes must recompute:

### 3.1 State Differences
\[
\Delta f_i = f_i(t+1) - f_i(t)
\]
\[
\Delta f_j = f_j(t+1) - f_j(t)
\]

### 3.2 Sovereignty Gain
\[
S_k = \beta \cdot |\Delta f_i - \Delta f_j| \cdot \gamma(f_E(t+1))
\]

### 3.3 Spacetime Signature
\[
\sigma_k = H(t+1, f_E(t+1), f_i(t+1), f_j(t+1))
\]

If any recomputed value differs from the encoded value, the transaction is invalid.

---

# 4. Agent State Update

After applying all transactions at time \(t+1\), each agent’s state is updated using:

\[
f_a(t+2) = f_a(t+1) + \eta \cdot S_a^{\text{net}}(t+1) - \lambda \cdot f_a(t+1)
\]

Where:

\[
S_a^{\text{net}}(t+1) = \sum_{\tau_k \text{ involving } a} S_k
\]

This is a discrete‑time leaky integrator.

---

# 5. Sovereignty Update

### 5.1 Per‑Agent Sovereignty
\[
S_a(t+1) = S_a(t) + \sum_{\tau_k \text{ involving } a} S_k
\]

### 5.2 Global Sovereignty
\[
S_{\text{tot}}(t+1) = S_{\text{tot}}(t) + \sum_{\tau_k} S_k
\]

Sovereignty is strictly additive and cannot decrease.

---

# 6. Token Supply Update

Tokens are minted deterministically:

\[
T(t+1) = T(t) + \alpha \sum_{\tau_k} S_k
\]

No other minting or burning is permitted.

---

# 7. Agent Onboarding

If a transaction introduces a new agent \(a_n\):

\[
f_{a_n}(t+1) = f_E(t+1)
\]
\[
S_{a_n}(t+1) = 0
\]

This ensures deterministic initialization.

---

# 8. State Root Computation

After all updates, the state is serialized deterministically and hashed:

\[
\text{StateRoot}(t+1) = H(\mathcal{S}(t+1))
\]

This value must match the block header.

---

# 9. Deterministic Transition Function

The state machine defines a pure function:

\[
\mathcal{S}(t+1) = F(\mathcal{S}(t), f_E(t+1), \{\tau_k\})
\]

Where \(F\) is:
- total  
- deterministic  
- recomputable  
- free of side effects  

All nodes must compute the same result.

---

# 10. Invalid State Transitions

A block is invalid if:

- any transaction fails validation  
- sovereignty does not recompute  
- agent states do not recompute  
- token supply does not recompute  
- state root does not match  
- environment signal is incorrect  
- ordering is incorrect  

Invalid blocks must be rejected.

---

# 11. Summary

The SKL state machine ensures:

- deterministic evolution  
- kernel‑pure sovereignty computation  
- linear time  
- immediate finality  
- global consistency  
- independence from markets and governance  

This state machine is the core of the Sovereignty Kernel Ledger.
