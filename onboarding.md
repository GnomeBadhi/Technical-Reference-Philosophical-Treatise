# Onboarding  
## Sovereignty Kernel Ledger (SKL)

This document defines the onboarding process for new agents entering the Sovereignty Kernel Ledger (SKL).  
Onboarding establishes identity, initializes agent state, and ensures deterministic integration into the system.

The onboarding process must preserve:
- kernel purity  
- deterministic state transitions  
- non-manipulability  
- minimal trust assumptions  
- structural symmetry  

---

# 1. Purpose of Onboarding

Onboarding introduces a new agent \(a_n\) into the system.  
An agent is created when they participate in their first transaction.

Onboarding must ensure:
- the agent is uniquely identifiable  
- the agent’s initial state is well-defined  
- no arbitrary advantages are introduced  
- the system remains deterministic  

---

# 2. Agent Identity

Each agent is identified by a cryptographic public key:

\[
\text{ID}(a_n) = \text{PublicKey}(a_n)
\]

Identity requirements:
- globally unique  
- verifiable  
- non-forgeable  
- persistent across all interactions  

No usernames, accounts, or metadata are required.

---

# 3. Agent Creation Event

An agent is created when they appear as either:
- a sender, or  
- a receiver  

in a valid transaction \(\tau_k\).

The creation event occurs at the time index \(t\) of the transaction.

---

# 4. Initial Agent State

When a new agent \(a_n\) is created, their initial state is:

\[
f_{a_n}(t) = f_{E}(t)
\]

This ensures:
- symmetry with the environment  
- no arbitrary advantage  
- no arbitrary penalty  
- deterministic initialization  

The agent begins aligned with the global baseline at the moment of entry.

---

# 5. Initial Sovereignty

New agents begin with zero sovereignty:

\[
S_{a_n}(t) = 0
\]

This ensures:
- sovereignty must be earned  
- no pre-allocation  
- no inflationary onboarding  

---

# 6. First Transaction Requirements

The first transaction involving a new agent must include:
- the agent’s public key  
- the updated state \(f_{a_n}(t)\)  
- a valid signature from the agent  

Nodes verify:
- identity authenticity  
- signature validity  
- correct initial state assignment  

If any check fails, the transaction is invalid.

---

# 7. Deterministic State Integration

After onboarding, the agent participates in state transitions identically to all other agents:

\[
f_{a_n}(t+1) = f_{a_n}(t) + \eta \cdot S_{a_n}^{\text{net}}(t) - \lambda \cdot f_{a_n}(t)
\]

\[
S_{a_n}(t+1) = S_{a_n}(t) + \sum_{\tau_k \text{ involving } a_n} S_k
\]

No special rules apply to new agents.

---

# 8. Onboarding Security

The onboarding process is protected against:

## 8.1 Identity Forgery
Mitigated by cryptographic signatures.

## 8.2 State Manipulation
Mitigated by deterministic initialization:

\[
f_{a_n}(t) = f_E(t)
\]

## 8.3 Sovereignty Injection
Mitigated by:

\[
S_{a_n}(t) = 0
\]

## 8.4 Sybil Attacks
Sybil identities gain no structural advantage because:
- no stake  
- no mining  
- no governance  
- no rewards  
- no influence on consensus  

Multiple identities do not confer power.

---

# 9. Onboarding Summary

New agents enter the system through their first transaction.  
They are initialized deterministically using the environment signal at the moment of entry.  
They begin with zero sovereignty and no structural advantage.

The onboarding process preserves:
- fairness  
- symmetry  
- determinism  
- kernel purity  
- minimal trust  

This ensures that all agents participate under identical structural conditions from the moment they enter the Sovereignty Kernel Ledger.
