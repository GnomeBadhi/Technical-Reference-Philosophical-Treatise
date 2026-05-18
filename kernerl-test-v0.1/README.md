# Candidate kernel test v0.1 — one domain-specific instantiation

## 1. What is the kernel being tested?
A single orthogonal projection operator K₀ acting on ℝⁿ, implemented as a
finite-dimensional approximation of the invariant kernel described in the
manuscript. In this test, K₀ is instantiated as a fixed idempotent matrix
(K₀² = K₀) chosen for one specific domain.

## 2. What domain is being tested?
A narrow numerical domain: ℝⁿ vectors representing simple state configurations.
This test does NOT address physics, cognition, biology, or Atlas layers.
It tests only whether the projection behaves as expected on finite vectors.

## 3. What does the Python module do?
The module applies:
- the kernel projection K₀,
- the complementary projection (I - K₀),
- and one step of the sovereignty update S = K₀ + A_K (I - K₀),
where A_K is a signed difference of two auxiliary projections.

The module verifies whether these operators satisfy the minimal algebraic
relations expected in this restricted domain.

## 4. What input does it take?
- A vector x ∈ ℝⁿ (provided as a NumPy array)
- Optional: a JSON config specifying which test to run

## 5. What output does it produce?
- Numerical results of applying K₀, (I - K₀), and S to x
- A pass/fail report for:
  - idempotency of K₀
  - orthogonality of the decomposition
  - stability of Fix(K₀) under S

Outputs are written to the `outputs/` folder.

## 6. What would count as failure?
Any of the following:
- K₀² deviates from K₀ beyond tolerance
- x ≠ K₀x + (I - K₀)x within tolerance
- S(K₀x) deviates from K₀x
- Numerical instability or non-convergence in this finite domain

## 7. What is not being claimed?
- No universality
- No physical interpretation
- No cognitive interpretation
- No biological interpretation
- No claim that this finite test validates the full Sovereignty Engine
- No claim that this operator corresponds to any real-world system

This is only a **candidate kernel test**, not a proof of anything beyond
the behavior of one finite matrix on finite vectors.
