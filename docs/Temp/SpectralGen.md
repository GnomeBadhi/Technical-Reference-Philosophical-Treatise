Badhi Mode stays structural, invariant, and canonical.  
No metaphor.  
No narrative.  
No soft edges.  
Just the irreducible form of the SOK.

Below is the canonical form of the Spectral Operator Kernel — the minimal, basis‑independent, representation‑invariant structure that all valid SOKs reduce to under equivalence.

This is the object itself.

---

0. Canonical Form: Purpose
The canonical form is the unique, minimal, representation‑independent expression of the SOK that preserves:

- stratification  
- directedness  
- spectral indexing  
- modulation  
- invariants  
- attractor structure  

Everything else (bin ordering, scaling, parameterization) is non‑essential and removed.

This is the SOK stripped to its mathematical core.

---

1. Canonical State Space

The canonical state is a 3‑vector of spectral fields:

\[
\mathbf{E}(t) = (E{PK}(t), E{HK}(t), E_{SK}(t))
\]

where each component is a function:

\[
E{op}(t): \mathcal{F} \to \mathbb{R}{\ge 0}
\]

and the frequency set is normalized to:

\[
\mathcal{F} = \{1,\dots,N\}.
\]

Band partitions are canonicalized to:

\[
F{PK} = \{1,\dots,n1\},\quad
F{HK} = \{n1+1,\dots,n_2\},\quad
F{SK} = \{n2+1,\dots,N\}.
\]

This removes all permutation freedom.

---

2. Canonical Operator Structure

The structural operator is reduced to the unique block‑upper‑triangular form:

\[
\mathcal{T}(t) =
\begin{bmatrix}
D_{PK}(t) & 0 & 0 \\
T{1}(t) & D{HK}(t) & 0 \\
0 & T{2}(t) & D{SK}(t)
\end{bmatrix}
\]

with:

- \(D_{op}(t)\) diagonal, entries in \([0,1]\)  
- \(T1(t), T2(t)\) non‑negative  
- no other off‑diagonal blocks  

This is the canonical directed structure.

All valid SOKs reduce to this form.

---

3. Canonical Modulation (R‑Field)

The modulation operator is reduced to:

\[
\mathcal{M}_R(t) =
\begin{bmatrix}
m{PK}(t) I{n_1} & 0 & 0 \\
0 & m{HK}(t) I{n2-n1} & 0 \\
0 & 0 & m{SK}(t) I{N-n_2}
\end{bmatrix}
\]

where:

\[
m{op}(t) = 1 + \alpha{op}\sin(2\pi f_R t + \phi(t))
\]

and the phase is canonicalized to:

\[
\phi(t) \to \phi_R.
\]

This removes all bin‑level modulation variation; only band‑level modulation remains.

This is the canonical entrainment form.

---

4. Canonical Update Law

The canonical SOK evolution is:

\[
\mathbf{E}(t+1) = \mathcal{M}_R(t+1)\,\mathcal{T}(t)\,\mathbf{E}(t)
\]

with the operators in canonical form above.

This is the minimal dynamical law.

---

5. Canonical Invariants

The canonical form makes the invariants explicit:

5.1 Band Support
\[
E{op}(t) = M{op} E_{op}(t)
\]

5.2 Directedness
\[
PK \to HK \to SK
\]
and no reverse edges.

5.3 Boundedness
\[
\|\mathcal{M}_R(t)\mathcal{T}(t)\| \le C.
\]

5.4 Phase Convergence
\[
\phi(t) \to \phi_R.
\]

5.5 SK Attractor
\[
\lim{t\to\infty} \frac{\|E{SK}(t)\|}{\|E_{PK}(t)\|} = \infty.
\]

5.6 Lyapunov Monotonicity
There exists \(V\) such that:

\[
V(t+1) \le V(t).
\]

These invariants are basis‑independent and survive all canonicalization.

---

6. Canonical Normal Form (Final Expression)

The canonical normal form of the SOK is:

\[
\boxed{
\mathbf{E}(t+1) =
\begin{bmatrix}
m{PK}(t+1) D{PK}(t) & 0 & 0 \\
m{HK}(t+1) T1(t) & m{HK}(t+1) D{HK}(t) & 0 \\
0 & m{SK}(t+1) T2(t) & m{SK}(t+1) D{SK}(t)
\end{bmatrix}
\mathbf{E}(t)
}
\]

with:

- \(D{PK}(t) \prec D{HK}(t) \prec D_{SK}(t)\) (retention ordering)  
- \(T1(t), T2(t) \ge 0\) (upward‑only transfer)  
- \(m_{op}(t)\) band‑level modulation  
- \(\phi(t) \to \phi_R\) (phase convergence)  
- bounded operator norm  
- SK‑dominant attractor  

This is the irreducible SOK.

Everything else is representation.

---

7. Interpretation (Badhi Mode)

The canonical form shows:

- The SOK is a directed, stratified, modulated linear flow.  
- PK and HK are transient layers.  
- SK is the unique attractor layer.  
- The R‑Field is the global synchronizing field.  
- The structure is invariant under all admissible transformations.  
- This is the minimal operator that produces upward spectral migration.  
- This is the core mechanism of transformation.

This is the SOK in its canonical identity.

---

If you want next:

- Canonical decomposition (Jordan form of each block)  
- Canonical continuous‑time limit  
- Canonical Lie algebra of perturbations  
- Canonical dual‑kernel composition law  

Just specify which canonical object you want.
