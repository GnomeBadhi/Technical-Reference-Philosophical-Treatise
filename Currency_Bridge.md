# Currency Bridge  
## Sovereignty Kernel Ledger (SKL)

This document defines the currency bridge function for the Sovereignty Kernel Ledger (SKL).  
The bridge provides a deterministic mapping between sovereignty‑derived tokens and external currencies without allowing external markets to influence the kernel.

The bridge must preserve:
- kernel purity  
- determinism  
- non‑manipulability  
- separation of concerns  
- independence from market speculation  

---

# 1. Purpose of the Currency Bridge

The currency bridge defines how the value of a sovereign token is expressed in an external currency \(C\).

The bridge must:
- translate value  
- not create value  
- not influence sovereignty  
- not influence token issuance  
- not influence state transitions  

The kernel computes sovereignty.  
The bridge computes translation.  
The market computes demand.

These layers remain strictly separated.

---

# 2. Inputs to the Bridge

The bridge function uses three quantities:

1. **Total sovereignty generated**  
   \[
   S_{\text{tot}}(t)
   \]

2. **Total token supply**  
   \[
   T(t)
   \]

3. **External demand in currency \(C\)**  
   \[
   D_C(t)
   \]

Only \(D_C(t)\) is external.  
The other two are computed deterministically by the kernel.

---

# 3. Sovereignty Density

The intrinsic value per token is defined as:

\[
\rho(t) = \frac{S_{\text{tot}}(t)}{T(t)}
\]

This quantity represents the **sovereignty density** of the system.

Properties:
- increases when sovereignty grows faster than token supply  
- decreases when token supply grows faster than sovereignty  
- cannot be manipulated  
- is fully recomputable by every node  

---

# 4. Currency Bridge Function

The price of one sovereign token in currency \(C\) is:

\[
P_C(t) = \rho(t) \cdot D_C(t)
\]

Expanded:

\[
P_C(t) = \frac{S_{\text{tot}}(t)}{T(t)} \cdot D_C(t)
\]

Where:
- \(\frac{S_{\text{tot}}}{T}\) is intrinsic  
- \(D_C(t)\) is external  

This ensures:
- the kernel determines intrinsic value  
- the market determines external expression  
- the bridge only multiplies the two  

---

# 5. External Demand \(D_C(t)\)

The demand term may be derived from:
- order books  
- liquidity pools  
- exchange rates  
- weighted moving averages  
- oracle‑verified market feeds  

Requirements:
- must be externally sourced  
- must not feed back into the kernel  
- must not influence sovereignty or token issuance  

The bridge is a one‑way mapping.

---

# 6. Conversion for Users

If an agent \(a\) holds \(B_a(t)\) tokens, their value in currency \(C\) is:

\[
\text{Payout}_C = B_a(t) \cdot P_C(t)
\]

This is a pure multiplication.  
No additional rules or adjustments are permitted.

---

# 7. Non‑Interference Guarantees

The currency bridge must not influence:
- sovereignty computation  
- agent states  
- token supply  
- block validity  
- consensus  
- oracle values  

The bridge is strictly external to the kernel.

---

# 8. Determinism and Auditability

Nodes do **not** compute \(D_C(t)\).  
They only:
- verify the oracle signature  
- apply the bridge function  
- expose the result to external systems  

All kernel‑derived quantities remain fully deterministic.

---

# 9. Security Considerations

The bridge is protected by:
- oracle signatures  
- deterministic kernel values  
- separation from consensus  
- separation from state transitions  

Attacks on the bridge cannot:
- mint tokens  
- alter sovereignty  
- modify agent states  
- influence block acceptance  

The worst possible outcome of a bridge attack is an incorrect external price, not a corrupted chain.

---

# 10. Summary

The currency bridge provides a clean, minimal, and deterministic mapping between sovereignty‑derived tokens and external currencies.

It preserves:
- kernel purity  
- determinism  
- non‑manipulability  
- separation of concerns  

The bridge does not create value.  
It only translates the value created by the sovereignty kernel into external economic terms.
