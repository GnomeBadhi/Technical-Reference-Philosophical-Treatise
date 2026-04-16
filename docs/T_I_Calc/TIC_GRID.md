# TIC Grid Identity Specification

## 1. Shared space and TIC

- **Shared space**  
  \[
  \mathcal{S} = \text{set of all externally expressible, agent-interpretable states}
  \]

- **TIC coordinate (grid address)**  
  For any \(s \in \mathcal{S}\):
  \[
  \text{TIC}(s) = (\tau, \sigma, \theta, \gamma)
  \]
  where:
  - \(\tau \in \mathcal{T}\): type
  - \(\sigma \in \mathcal{A}\): source/agent
  - \(\theta \in \mathbb{R}\) or \(\mathbb{Z}\): time index
  - \(\gamma \in \mathcal{G}\): geometric/logical position

- **Shared variable structure**
  \[
  s \equiv (\text{TIC}, v, h) = (\tau, \sigma, \theta, \gamma, v, h)
  \]
  - \(v \in \mathcal{V}_\tau\): value/content
  - \(h = (O_1, \dots, O_k)\): operator history, \(O_i \in \{\Psi_S, \Delta_S, \Omega_S, \Lambda_S, \Kappa_S, \Sigma_S\}\)

- **Identity function**
  \[
  \mathrm{ID}(s) = H(\tau, \sigma, \theta, \gamma, h)
  \]
  where \(H\) is deterministic and injective in its arguments.

---

## 2. Axioms

**Axiom A1 — Uniqueness**

If \(\text{TIC}(s_1) \neq \text{TIC}(s_2)\), then \(s_1 \neq s_2\).  
Distinct TIC tuples represent distinct shared variables.

**Axiom A2 — Stability**

Operations that change only \(v\) and append to \(h\) (within type constraints) must not change TIC.

**Axiom A3 — Compositionality**

For a composite \(S = \{s_i\}\):
\[
\mathrm{ID}(S) = F(\{\mathrm{ID}(s_i)\})
\]
for some fixed deterministic \(F\).

**Axiom A4 — Verifiability**

Given observable projections into \(\mathcal{S}\), any compliant kernel can reconstruct:
- \(\text{TIC}(s)\),
- the last operator in \(h(s)\),
- \(\mathrm{ID}(s)\),

and independent kernels agree on these.

---

## 3. Operational rules

Let:
- \(\mathcal{N}\): neural state space  
- \(\pi_B: \mathcal{N} \to \mathcal{S}\): projection brain → shared  
- \(\Kappa_N: (\mathcal{N}, \Lambda_N) \to \mathcal{N}\): neural collapse  
- \(\Kappa_S: (\Psi_S, \Lambda_S) \to s^\* \in \mathcal{S}\): shared collapse  

**Rule R1 — Projection–collapse consistency**

Under matching distributions and intents:
\[
\pi_B(\Kappa_N(n, \Lambda_N)) = \Kappa_S(\Psi_S', \Lambda_S')
\]

**Rule R2 — Collapse idempotence**

Neural:
\[
\Kappa_N(\Kappa_N(n, \Lambda_N), \Lambda_N) = \Kappa_N(n, \Lambda_N)
\]

Shared:
\[
\Kappa_S(\delta_{s^\*}, \Lambda_S) = s^\*
\]

**Rule R3 — TIC invariance under collapse**

Collapse selects existing TICs; it does not mutate them:
\[
\text{TIC}(s^\*) \in \{\text{TIC}(s_i)\}
\]

**Rule R4 — History monotonicity**

Operator history is append-only:
\[
h'(s) = h(s) \,\|\, O
\]
No operator may alter prior entries in \(h\).

**Rule R5 — Identity-preserving vs identity-breaking**

- Identity-preserving: only \(v\) and \(h\) change; TIC is unchanged.  
- Identity-breaking: any change to \(\tau, \sigma, \theta, \gamma\) must mint a new TIC and thus a new \(\mathrm{ID}\).

---

## 4. Placement in kernel architecture

- **Internal layer (neural):** Ω\(_N\), Λ\(_N\), \(\Kappa_N\) act on \(\mathcal{N}\).
- **Interface layer (TIC grid):** TIC and \(\mathrm{ID}\) live here; \(\pi_B\) and \(\pi_W\) map into \(\mathcal{S}\).
- **External layer (shared):** Ψ\(_S\), Δ\(_S\), Ω\(_S\), Λ\(_S\), \(\Kappa_S\), Σ\(_S\) act on TIC-identified variables in \(\mathcal{S}\).

TIC is the minimal, invariant identity coordinate required for lawful, verifiable kernel operation across agents and cycles.
