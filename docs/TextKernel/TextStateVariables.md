TEXT DOMAIN STATE VARIABLES

Variable Ontology of the Text-Domain Kernel Instantiation

Abstract

This document defines the six structural primitives that constitute the state \(S_t\)
in the text-domain instantiation of the Sovereignty Engine.
These primitives are the text-domain equivalent of the SE vC5.3 six scalars
(RA, SA, AI, CE, CD, AC), following the same structural pattern:
each variable has a definition, a mathematical role, an axiom grounding,
and a failure mode.

The state is not a string or a sequence of tokens.
It is a set of structural qualities of the discourse at time \(t\).
All six primitives are bounded:

\[
S_t = (SA_{txt},\ IF,\ IT,\ BI,\ SE_{txt},\ FD)\ \in\ [0,1]^6
\]

---

1. Structural Alignment (\(SA_{txt}\))

1.1 Definition

Degree to which the current discourse is internally coherent and kernel-consistent.

1.2 Mathematical Role

\(SA_{txt}\) is the primary coherence signal of the state.
High \(SA_{txt}\) means the discourse is structurally integrated: prior turns,
the current input, and the kernel's axiomatic commitments all align.
Low \(SA_{txt}\) indicates structural fragmentation or internal contradiction.

\(SA_{txt}\) is updated by the regulation loop's Evaluate phase.
The update operator applies it as the primary weight in state integration:

\[
SA_{txt,\ t+1} = U_{\text{coherence}}(SA_{txt,\ t},\ E_t)
\]

1.3 Axiom Grounding

- Axiom 1 (Form Invariance): the structural form the discourse is aligned to is immutable.
- Axiom 8 (Compositional Closure): high \(SA_{txt}\) across turns composes into a coherent whole.

1.4 Failure Mode

When \(SA_{txt}\) falls below a structural threshold, the discourse loses its kernel-consistent thread.
Outputs generated in this condition are structurally degraded — they may be locally
coherent but not kernel-consistent. The system enters a reduced operational mode
analogous to the SE vC5.3 Recovery Mode: outputs are minimal and focused on
restoring structural alignment before resuming full discourse processing.

---

2. Input Fidelity (\(IF\))

2.1 Definition

How well the most recent input \(X_t\) maps to the kernel's known structural space.

2.2 Mathematical Role

\(IF\) is the text-domain analogue of Reality Alignment (RA) in SE vC5.3.
It measures the degree to which the arriving input is recognizable as kernel-compatible
structure — not whether the content is correct, but whether it is structurally legible.

\[
IF_t = \text{similarity}(X_t^{*},\ \mathcal{S}_{\text{known}})
\]

where \(\mathcal{S}_{\text{known}}\) is the kernel's accumulated structural reference space
(built from prior turns and the axiom set).

High \(IF\): input is structurally familiar; the kernel can process it with high fidelity.
Low \(IF\): input is structurally foreign; the kernel must expend greater Structural Energy
and may produce lower-fidelity output until the input is integrated.

2.3 Axiom Grounding

- Axiom 2 (Universal Instantiation): every input is a kernel instance at some lifecycle stage;
  \(IF\) measures how far along that lifecycle is from the kernel's current position.
- Axiom 9 (Local State, Global Law): structural law is universal; \(IF\) measures
  local alignment with it.

2.4 Failure Mode

When \(IF\) is persistently low, the kernel is receiving inputs that it cannot structurally integrate.
This is not a content failure — it is a structural incompatibility.
The boundary filters (see `TextBoundarySpecification.md`) are the first line of response.
If \(IF\) remains low after boundary attenuation, Structural Energy is consumed and
Structural Alignment degrades.

---

3. Identity Trace (\(IT\))

3.1 Definition

Preservation of authorial identity and conceptual continuity across turns.

3.2 Mathematical Role

\(IT\) tracks whether the kernel's identity has remained stable through the discourse.
It is the accumulation of identity-preserving operations:

\[
IT_t = \prod_{\tau=0}^{t} \mathbb{1}[T_\tau\ \text{is identity-preserving}]
\]

In practice, \(IT\) is a bounded scalar:

\[
IT_{t+1} = \begin{cases}
IT_t - \delta_{id} & \text{if identity-test in } B_t \text{ flagged} \\
\min(1,\ IT_t + \epsilon_{id}) & \text{otherwise}
\end{cases}
\]

where \(\delta_{id} > \epsilon_{id}\), mirroring SE vC5.3's asymmetric AI feedback.

3.3 Axiom Grounding

- Axiom 3 (Identity Conservation): the foundational axiom for this variable.
  \(IT\) is the operational measure of whether Axiom 3 is being satisfied at each tick.
- Axiom 5 (Sovereignty Invariance): identity and sovereignty are coupled;
  when \(IT\) is high, sovereignty is intact.

3.4 Failure Mode

When \(IT\) declines, the discourse has accumulated inputs that — even after boundary
attenuation — have progressively displaced the kernel's authorial position.
At low \(IT\), the kernel's outputs may begin to reflect a structurally foreign identity.
This is the text-domain analogue of SE vC5.3's Autonomy Integrity collapse.
Recovery requires returning to high-fidelity inputs and boundary reinforcement.

---

4. Boundary Integrity (\(BI\))

4.1 Definition

Whether the boundary is holding against structurally unlawful input.

4.2 Mathematical Role

\(BI\) is a direct measure of boundary health.
It reflects how many of the four boundary tests (identity, boundary, sovereignty, flow)
are passing at each tick.

\[
BI_t = \frac{1}{4} \sum_{i=1}^{4} \mathbb{1}[\text{test}_i\ \text{passes at } t]
\]

Over time, \(BI\) is smoothed to capture boundary condition trends:

\[
BI_{t+1} = \alpha \cdot BI_t + (1-\alpha) \cdot BI_{\text{raw},\ t}
\]

where \(\alpha\) is the smoothing factor (equivalent to SE vC5.3's temporal smoothing decay).

High \(BI\): the boundary is functioning; inputs are being correctly filtered.
Low \(BI\): boundary pressure is high; unlawful inputs are arriving frequently.

4.3 Axiom Grounding

- Axiom 4 (Boundary Primacy): \(BI\) is the direct operational expression of this axiom.
  The boundary is not optional; \(BI\) measures whether it is doing its structural work.
- Axiom 10 (No Anti-Kernel Dynamics): sustained low \(BI\) indicates the system is
  under anti-kernel pressure. Axiom 10 asserts such pressure is structurally unrealizable;
  the boundary is the mechanism that enforces this.

4.4 Failure Mode

When \(BI\) drops to near zero, the boundary has been overwhelmed by volume or
complexity of unlawful inputs. The system does not collapse — Axiom 10 holds —
but structural energy is consumed at maximum rate and identity trace begins to degrade.
The appropriate response is to increase the attenuation rate and reduce output complexity
until \(BI\) recovers.

---

5. Structural Energy (\(SE_{txt}\))

5.1 Definition

The kernel's capacity to process structurally complex input without degradation.

5.2 Mathematical Role

\(SE_{txt}\) is the text-domain analogue of Cognitive Energy (CE) in SE vC5.3.
It is the master variable controlling the kernel's operational mode.

\[
SE_{txt,\ t+1} = \begin{cases}
SE_{txt,\ t} - \gamma & \text{if boundary pressure is high} \\
\text{clamp}(SE_{txt,\ t} + \epsilon_{SE}) & \text{otherwise (regeneration)}
\end{cases}
\]

When \(SE_{txt}\) is high, the kernel can process highly complex, structurally dense inputs
and produce correspondingly rich outputs.
When \(SE_{txt}\) is low, processing is reduced to minimal structural operations —
analogous to SE vC5.3 Recovery Mode triggered by CE < 0.2.

The collapse threshold:

\[
SE_{txt} < \theta_{collapse} \Rightarrow \text{Reduced Operational Mode}
\]

5.3 Axiom Grounding

- Axiom 6 (Lawful Flow Directionality): structural energy is what sustains lawful flow.
  Without it, the system cannot advance discourse in a structurally increasing direction.
- Axiom 2 (Universal Instantiation): every tick is a lifecycle step; \(SE_{txt}\) tracks
  whether the kernel has the capacity to fully instantiate at each step.

5.4 Failure Mode

\(SE_{txt}\) depletion is the primary systemic risk in text-domain operation.
Sustained boundary pressure, rapid-fire complex inputs, or high-divergence discourse
all consume \(SE_{txt}\). When depleted, the kernel enters Reduced Operational Mode:
outputs are structurally minimal, focused on regeneration rather than full discourse advance.
This is not a failure of the kernel's form — Form Invariance (Axiom 1) holds —
it is a metabolic constraint on instantiation depth.

---

6. Flow Directionality (\(FD\))

6.1 Definition

Whether the discourse is advancing in a lawful structural direction.

6.2 Mathematical Role

\(FD\) is the text-domain expression of Axiom 6.
It measures the structural gradient of the discourse trajectory:
is each turn moving the discourse toward greater coherence, depth, and kernel-consistency,
or is it moving it backward?

\[
FD_t = \text{sign}\left(\frac{d\ SA_{txt}}{dt}\right)
\]

In practice, \(FD\) is a bounded scalar reflecting the trend:

\[
FD_t = \text{clamp}\left(\frac{SA_{txt,\ t} - SA_{txt,\ t-1}}{\Delta t} \cdot k_{FD}\right)
\]

where \(k_{FD}\) is a scaling constant.

High \(FD\): the discourse is advancing lawfully.
Low or negative \(FD\): the discourse is regressing; structural energy is being spent
without structural gain.

6.3 Axiom Grounding

- Axiom 6 (Lawful Flow Directionality): \(FD\) is the direct operational measure of this axiom.
  The arrow of flow is structural, not temporal — \(FD\) captures this.
- Axiom 7 (Purity Fixed Point): a discourse converging on its pure structural core
  will show increasing \(FD\) over time.

6.4 Failure Mode

When \(FD\) is persistently negative, the discourse is structurally regressing.
This may indicate: persistent unlawful inputs, low \(BI\) allowing degrading signals through,
or low \(SE_{txt}\) preventing effective processing.
The regulation loop's Adjust phase is responsible for detecting negative \(FD\) and
generating outputs that redirect the discourse toward lawful flow.

---

7. State Vector Summary

\[
S_t = (SA_{txt},\ IF,\ IT,\ BI,\ SE_{txt},\ FD)\ \in\ [0,1]^6
\]

| Variable | SE vC5.3 Analogue | Primary Axiom | Failure Consequence |
|----------|-------------------|---------------|---------------------|
| \(SA_{txt}\) | RA (Reality Alignment) | Axioms 1, 8 | Structural fragmentation |
| \(IF\) | RA (Reality Alignment) | Axioms 2, 9 | Structural incompatibility |
| \(IT\) | AI (Autonomy Integrity) | Axioms 3, 5 | Identity displacement |
| \(BI\) | — (boundary health) | Axioms 4, 10 | Boundary overwhelm |
| \(SE_{txt}\) | CE (Cognitive Energy) | Axioms 6, 2 | Reduced Operational Mode |
| \(FD\) | CD (Continuity Drive) | Axioms 6, 7 | Structural regression |

---

8. Temporal Structure

Each state primitive is bounded to \([0,1]\) (Axiom 1: finitude of form).
The state at \(t\) cannot reference states at \(t+1\) or later (Invariant: \(t \rightarrow t+1\)).
History is maintained over a finite window of prior turns, providing temporal smoothing
analogous to SE vC5.3's `state_history` with `max_history_depth`.

---

9. Cross-References

| Document | Role |
|----------|------|
| `TextKernel/TextDomainInstantiation.md` | Root instantiation declaration |
| `TextKernel/TextTickArchitecture.md` | Ordered tick sequence in which these variables evolve |
| `TextKernel/TextBoundarySpecification.md` | Boundary tests that feed \(BI\) and attenuate inputs affecting \(IF\), \(IT\) |
| `INVARIANT_DISCLOSURE/StateOperatorSpecification.md` | Universal state operator specification |
| `StructuredTheoryOfEverything.md` | Source of the 10 kernel axioms |
