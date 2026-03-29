# Validator Specification  
## Sovereignty Kernel Ledger (SKL)

This document defines the responsibilities, requirements, and behavior of validators in the Sovereignty Kernel Ledger (SKL).  
Validators maintain the integrity of the system by enforcing deterministic rules, verifying oracle inputs, validating blocks, and ensuring global state consistency.

Validators do **not** influence:
- sovereignty  
- token issuance  
- state transitions  
- economic outcomes  
- governance  

Their role is strictly structural.

---

# 1. Validator Purpose

Validators perform three essential functions:

1. **Verify the environment signal**  
2. **Validate blocks and transactions**  
3. **Maintain deterministic state progression**

Validators do **not**:
- vote  
- stake  
- mine  
- adjust parameters  
- influence ordering beyond producing a block at their assigned time  

---

# 2. Validator Requirements

Validators must satisfy the following:

## 2.1 Deterministic Execution
All computations must be:
- deterministic  
- reproducible  
- free of floating‑point operations  

## 2.2 Full State Storage
Validators must store:
- all agent states  
- all sovereignty balances  
- global sovereignty  
- token supply  
- environment signal history  

## 2.3 Oracle Verification
Validators must verify:
- oracle signatures  
- index alignment  
- format correctness  

## 2.4 Block Production Capability
Validators must be able to:
- construct a valid block  
- compute Merkle roots  
- compute state roots  
- serialize blocks deterministically  

---

# 3. Validator Responsibilities

Validators must perform the following tasks for every block:

### 3.1 Receive Environment Signal
Obtain \(f_E(t)\) from the oracle and verify its signature.

### 3.2 Validate Block Index
Ensure:
\[
t = t_{\text{prev}} + 1
\]

### 3.3 Validate Previous Hash
Ensure the block’s `prev_hash` matches the hash of the previous block.

### 3.4 Validate Transactions
For each transaction:
- verify signatures  
- recompute sovereignty  
- recompute updated states  
- recompute spacetime signature  
- ensure deterministic ordering  

### 3.5 Recompute Merkle Root
Recompute the Merkle root from the ordered transaction list.

### 3.6 Recompute State Transition
Recompute:
- agent states  
- sovereignty balances  
- global sovereignty  
- token supply  

### 3.7 Validate State Root
Ensure:
\[
\text{StateRoot}(t) = H(\mathcal{S}(t))
\]

### 3.8 Accept or Reject Block
If any check fails, the block is invalid.

---

# 4. Block Production

Validators produce blocks according to the consensus mechanism (e.g., BFT, PoA).

A valid block must include:
- correct index  
- correct previous hash  
- correct environment signal  
- deterministically ordered transactions  
- correct Merkle root  
- correct state root  

Validators must not:
- reorder transactions  
- modify sovereignty  
- modify agent states  
- modify token supply  
- include invalid transactions  

---

# 5. Validator Misbehavior

Validators may misbehave by:
- producing invalid blocks  
- producing multiple blocks for the same index  
- withholding blocks  
- submitting malformed transactions  

Mitigation:
- invalid blocks are rejected deterministically  
- equivocation is detectable  
- block production rotates or is distributed  
- no economic incentives exist to manipulate the system  

Validators cannot:
- alter sovereignty  
- alter state transitions  
- alter token issuance  
- influence the oracle  
- influence ordering beyond their assigned slot  

---

# 6. Validator Security Requirements

Validators must secure:
- private keys  
- signing infrastructure  
- network interfaces  
- state storage  

Recommended:
- hardware security modules (HSMs)  
- isolated signing processes  
- authenticated RPC interfaces  
- redundant storage  

---

# 7. Validator Liveness

Validators must:
- remain online  
- maintain network connectivity  
- process blocks in real time  
- respond to consensus messages  

If a validator becomes unavailable:
- the next validator in the rotation produces the block  
- no reorgs occur  
- no penalties or slashing exist  

---

# 8. Validator Independence

Validators do **not** rely on:
- token balances  
- stake weight  
- mining power  
- governance votes  

All validators are structurally equal.

---

# 9. Summary

Validators in SKL:
- enforce determinism  
- verify oracle inputs  
- validate blocks  
- maintain global state  
- ensure linear time  
- guarantee kernel purity  

They do **not** influence value, economics, or governance.  
Their role is structural, minimal, and essential to the integrity of the Sovereignty Kernel Ledger.
