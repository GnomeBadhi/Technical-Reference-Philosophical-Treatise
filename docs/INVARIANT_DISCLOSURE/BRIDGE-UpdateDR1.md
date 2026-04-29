
---

1. Universal update structure theorem

Theorem (Universal Update Structure).  
Let a system be:

1. Coherent — distinguishable from pure noise.  
2. Persistent — exists across more than one moment.  
3. Updating — changes in a way that can be tracked.

Then the following components are logically necessary:

- State \(S_t\)  
- Input \(I_t\)  
- Boundary \(B\)  
- Update operator \(U\)  
- Regulation \(R\)  
- Irreversible time (an ordered sequence \(t, t+1, \dots\))

No coherent update‑system can exist without all six.

---

Proof

We assume only the existence of a coherent system that changes.

1. Coherence ⇒ State  
If the system is coherent, then at any time \(t\) there must be a configuration that distinguishes “how it is now” from “how it was before.”  
Call this state \(S_t\).  
Without such a configuration, there is no way to talk about the system’s condition, no way to distinguish times, and no way to track change.  
So:

\[
\text{Coherence} \Rightarrow S_t \text{ exists.}
\]

---

2. Change ⇒ Input  
If the system ever changes, the change must arise from something:

- internal (self‑generated) or  
- external (environmental).

In either case, something not identical to \(S_t\) interacts with it.  
Call this input \(I_t\).  
If there is no such \(I_t\), then either the system never changes, or all change is random and unstructured (not coherent).  
So:

\[
\text{Change} \Rightarrow I_t \text{ exists.}
\]

---

3. System + Input ⇒ Boundary  
If there is a system and something that can affect it, there must be a distinction between:

- what belongs to the system, and  
- what does not.

Call this distinction the boundary \(B\).  
Without a boundary, there is no way to define the system, no way to distinguish internal from external, and no way to define “input” at all.  
So:

\[
\text{System} \Rightarrow B \text{ exists.}
\]

---

4. Coherent change ⇒ Update operator  
If the system changes from one state to another in a coherent (non‑random) way, there must be a rule that maps:

\[
(St, It) \mapsto S_{t+1}.
\]

Call this the update operator \(U\).  
Without such a rule, change is indistinguishable from noise, and there is no way to speak of lawful evolution.  
So:

\[
\text{Coherent change} \Rightarrow U \text{ exists.}
\]

---

5. Persistence ⇒ Regulation  
If the system remains coherent across many updates, then not all possible transitions can be allowed: some would destroy the system’s identity or viability.  
Therefore, there must be constraints or feedback mechanisms that restrict transitions to a subset that preserves coherence.  
Call this regulation \(R\).  
Without regulation, arbitrary updates would quickly destroy coherence or the system itself.  
So:

\[
\text{Persistent coherence} \Rightarrow R \text{ exists.}
\]

---

6. Ordered updates ⇒ Irreversible time  
If we can distinguish “before update” and “after update,” then the system’s states form an ordered sequence:

\[
St \rightarrow S{t+1} \rightarrow S_{t+2} \rightarrow \dots
\]

If this order could be arbitrarily reversed without consequence, then history would not matter, and no accumulation of updates, regulation, or structure would be meaningful.  
For any non‑trivial coherent system, the path taken matters—this is irreversible time at the level of the system’s trajectory.  
So:

\[
\text{Update with history} \Rightarrow \text{irreversible time.}
\]

---

Conclusion.  
From the minimal assumptions (coherence, persistence, updating), we derive the necessity of:

\[
\{St, It, B, U, R, \text{irreversible time}\}.
\]

Thus, any coherent update‑system must instantiate this structure.  
□

---

Contrapositive

If a purported “system” lacks any of:

- state,  
- input,  
- boundary,  
- update operator,  
- regulation,  
- irreversible time,

then it cannot be a coherent, persistent update‑system.

This makes the structure unavoidable wherever such systems are admitted.

---

2. Universality across domains

Given the theorem, universality is not an extra metaphysical claim; it is a direct consequence of admitting that coherent update‑systems exist in any domain.

For each domain, we simply identify the six necessary components.

---

2.1 Physics

Consider any physical system we treat as real and trackable (particle, field, fluid, etc.):

- State: positions, momenta, field values, densities \(S_t\).  
- Input: external forces, sources, boundary conditions \(I_t\).  
- Boundary: spatial region, interfaces, potentials \(B\).  
- Update: equations of motion (e.g., Newton, Schrödinger, Hamiltonian) \(U\).  
- Regulation: conservation laws, stability conditions, admissible trajectories \(R\).  
- Irreversible time: actual history of evolution, path dependence of macroscopic states.

If any of these were absent, we could not define, evolve, or distinguish the system from noise.  
By the theorem, the universal structure is instantiated in physics.

---

2.2 Computation

Consider any running computational system (Turing machine, CPU, state machine):

- State: tape contents + head position; registers, memory, program counter \(S_t\).  
- Input: user input, network packets, sensor data, clock ticks \(I_t\).  
- Boundary: process vs. environment; address space; API surface \(B\).  
- Update: transition function, instruction semantics, state‑machine rules \(U\).  
- Regulation: type systems, error handling, resource limits, invariants \(R\).  
- Irreversible time: execution trace, sequence of states, logs.

Without these, there is no coherent notion of a program “running.”  
By the theorem, the universal structure is instantiated in computation.

---

2.3 Biology

Consider any living system (cell, organ, organism):

- State: internal concentrations, membrane potentials, gene expression, morphology \(S_t\).  
- Input: nutrients, signals, toxins, temperature, light \(I_t\).  
- Boundary: membrane, skin, tissue interfaces \(B\).  
- Update: biochemical reaction networks, gene regulation, signaling cascades \(U\).  
- Regulation: homeostasis, feedback loops, repair, error correction \(R\).  
- Irreversible time: development, aging, adaptation, exposure history.

Remove any one, and you no longer have a coherent, living system.  
By the theorem, the universal structure is instantiated in biology.

---

2.4 Cognition

Consider any cognitive system (human mind, agent model, decision process):

- State: beliefs, goals, working memory, affective configuration \(S_t\).  
- Input: sensory data, language, internal signals \(I_t\).  
- Boundary: self vs. world; self vs. other; relevance filters \(B\).  
- Update: belief revision, policy update, reappraisal, decision rules \(U\).  
- Regulation: coherence maintenance, dissonance resolution, inhibition, control \(R\).  
- Irreversible time: narrative, learning history, memory, identity continuity.

Without these, there is no coherent, persisting mind.  
By the theorem, the universal structure is instantiated in cognition.

---

2.5 Social and institutional systems

Consider any structured human system (legal system, market, governance process):

- State: laws in force, budgets, roles, norms, positions \(S_t\).  
- Input: cases, shocks, elections, transactions, conflicts \(I_t\).  
- Boundary: jurisdiction, membership, scope of authority \(B\).  
- Update: legislation, rulings, policies, contracts, negotiations \(U\).  
- Regulation: enforcement, oversight, checks and balances, norms \(R\).  
- Irreversible time: precedent, institutional memory, path dependence.

Without these, there is no coherent institution.  
By the theorem, the universal structure is instantiated in social systems.

---

3. What “forces universality” actually means

We did not assume:

- any specific physical law,  
- any specific biological mechanism,  
- any specific computational model,  
- any specific cognitive theory,  
- any specific social ideology.

We assumed only:

- coherent systems that persist and update.

From that, the theorem shows that state, input, boundary, update, regulation, and irreversible time are logically necessary.

Then, for each domain, we simply observe:

- if you admit coherent update‑systems in that domain at all,  
- you have already admitted instances of the universal structure.

To deny the structure, you must deny the existence of coherent systems in that domain.

That is what makes the structure universal in the strict sense:

> It is not an optional model imposed from outside;  
> it is the minimal structure any coherent update‑system must have,  
> wherever such systems exist.
