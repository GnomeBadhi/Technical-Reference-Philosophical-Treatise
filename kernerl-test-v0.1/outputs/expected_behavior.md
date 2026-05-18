# Expected behavior — kernel-test-v0.1

- K₀ should cleanly split any vector into its first k coordinates and the rest.
- (I - K₀) should recover the complementary part.
- S should leave K₀x unchanged.
- Numerical errors should remain below 1e-12.

Any deviation above tolerance counts as failure.
