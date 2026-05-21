Triadic State Space

---

1. State space and basic operators

- State space:
  \[
  \mathcal{T} = \{T_k \in \mathbb{R}^3 : k \in \mathbb{Z}\}.
  \]

- Shift operator \(S\) on sequences \((Tk){k\in\mathbb{Z}}\):
  \[
  (S T)k := T{k+1}.
  \]

- Increment operator \(I_\Delta\) (add fixed triad \(\Delta\)):
  \[
  (I\Delta T)k := T_k + \Delta.
  \]

- Dissonance operator \(D\) (stepwise deviation sequence):
  \[
  Dk := T{k+1} - (T_k + \Delta),
  \quad\text{i.e.}\quad
  (D T)k := T{k+1} - T_k - \Delta.
  \]

Then your single‑step law is:

\[
(S T)k = (I\Delta T)k + (D T)k.
\]

Equivalently, as an operator identity on sequences:

\[
S = I_\Delta + D.
\]

---

2. Evolution operator

Define the n‑step evolution operator \(E_n\) by:

\[
(En T)k := T_{k+n}.
\]

Since \(En = S^n\), and \(S = I\Delta + D\), your main law

\[
T{k+n} = Tk + n\Delta + D^{(n)}_k
\]

can be written operatorially as:

\[
(En T)k
= Tk + n\Delta + \sum{i=0}^{n-1} (D T)_{k+i}.
\]

So, as an operator on sequences:

\[
E_n
= \mathrm{Id}
+ n\,I_\Delta
+ A_n,
\]

where

\[
(An T)k := \sum{i=0}^{n-1} (D T){k+i}.
\]

Here \(A_n\) is the accumulated‑dissonance operator.

---

3. Symmetry operator

Define the triadic symmetry operator \(P:\mathbb{R}^3 \to \mathbb{R}^3\):

\[
P(A,B,C) = (B,C,A), \quad P^3 = \mathrm{Id}.
\]

Lift it pointwise to sequences:

\[
(P T)k := P(Tk).
\]

Your condition \(P(\Delta) = \Delta\) means:

\[
P \circ I\Delta = I\Delta \circ P.
\]

And the evolution is equivariant if:

\[
P \circ S = S \circ P
\quad\Longleftrightarrow\quad
P \circ En = En \circ P \quad \forall n.
\]

This is exactly your statement:

\[
P(T{k+n}) = P(Tk) + n\Delta + P(D^{(n)}_k).
\]

---

4. Operator‑form summary

You can now summarize the whole framework as:

- State: sequence \(T \in (\mathbb{R}^3)^{\mathbb{Z}}\).
- Shift: \(S\).
- Increment: \(I_\Delta\).
- Dissonance: \(D = S - I_\Delta\).
- Accumulated dissonance: \(An = \sum{i=0}^{n-1} S^i D\).
- Evolution: \(En = S^n = \mathrm{Id} + n I\Delta + A_n\).
- Symmetry: \(P\) with \(P^3 = \mathrm{Id}\), \(P(\Delta)=\Delta\), and \(P En = En P\).

That’s the operator‑level lift: your triadic evolution is now a clean operator algebra on sequence space.
