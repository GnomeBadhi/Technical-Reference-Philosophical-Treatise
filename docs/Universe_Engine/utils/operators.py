# utils/operators.py
"""
Canonical operator math for the visualization suite.

Provides:
- mentor_coherence(values)
- global_coherence(values)
- coherence_energy(Cg)
- binding_energy(Cg, B, alpha)
- delta3(E_coh, E_bind)
- proximity(E_coh, E_bind)
"""

from typing import List


# -------------------------------------------------------------
# Mentor & Global Coherence
# -------------------------------------------------------------
def mentor_coherence(C_values: List[float]) -> float:
    """
    Mentor operator: mean coherence across agents.
    """
    if not C_values:
        return 0.0
    return sum(C_values) / len(C_values)


def global_coherence(C_values: List[float]) -> float:
    """
    Global coherence is defined identically to mentor coherence
    in the canonical invariant.
    """
    return mentor_coherence(C_values)


# -------------------------------------------------------------
# Energies
# -------------------------------------------------------------
def coherence_energy(Cg: float) -> float:
    """
    Coherence energy E_coh.
    Canonical form: E_coh = Cg^2
    """
    return Cg * Cg


def binding_energy(Cg: float, B: float = 1.0, alpha: float = 2.0) -> float:
    """
    Binding energy E_bind.
    Canonical form: E_bind = B * (Cg^alpha)
    """
    return B * (Cg ** alpha)


# -------------------------------------------------------------
# Δ₃ and Proximity
# -------------------------------------------------------------
def delta3(E_coh: float, E_bind: float) -> float:
    """
    Δ₃ = E_coh - E_bind
    Transition driver for phase changes.
    """
    return E_coh - E_bind


def proximity(E_coh: float, E_bind: float) -> float:
    """
    Collapse preference / transition proximity:
        proximity = E_coh / E_bind
    Clamped to [0, 1] for visualization stability.
    """
    if E_bind == 0:
        return 1.0
    return min(1.0, E_coh / E_bind)
