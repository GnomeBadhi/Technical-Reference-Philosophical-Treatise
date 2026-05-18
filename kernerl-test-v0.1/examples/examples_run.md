# Example run — kernel-test-v0.1

Input vector:
[1.0, 2.0, 3.0, 4.0, 5.0, 6.0]

Output:
K0_x = [1.0, 2.0, 3.0, 0.0, 0.0, 0.0]
I_minus_K0_x = [0.0, 0.0, 0.0, 4.0, 5.0, 6.0]
S_x = [1.0, 2.0, 3.0, -4.0, -5.0, -6.0]

Idempotency error: ~1e-16
Decomposition error: ~1e-16
Stability error: ~1e-16

Interpretation:
All tests pass within numerical tolerance.
