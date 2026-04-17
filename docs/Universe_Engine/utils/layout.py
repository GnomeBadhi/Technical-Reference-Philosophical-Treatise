# utils/layout.py
"""
Canonical geometric layout utilities for the visualization suite.

Provides:
- canonical_angles(N): deterministic angular positions for agents
- canonical_layout(N): (x, y) positions on the unit circle
- radial_scale(value, base, scale): consistent radial mapping
"""

import numpy as np
from typing import Tuple


# -------------------------------------------------------------
# Canonical Angles
# -------------------------------------------------------------
def canonical_angles(N: int) -> np.ndarray:
    """
    Deterministic angular positions for N agents.
    Identity continuity is preserved across all visualizations.
    """
    return np.linspace(0, 2 * np.pi, N, endpoint=False)


# -------------------------------------------------------------
# Canonical Layout (Unit Circle)
# -------------------------------------------------------------
def canonical_layout(N: int) -> Tuple[np.ndarray, np.ndarray]:
    """
    Returns (x, y) coordinates for N agents placed on the unit circle.
    Used by:
    - heatmap
    - glyph layer
    - glyph fusion
    - cross-universe field
    """
    angles = canonical_angles(N)
    x = np.cos(angles)
    y = np.sin(angles)
    return x, y


# -------------------------------------------------------------
# Radial Scaling Helper
# -------------------------------------------------------------
def radial_scale(value: float, base: float = 1.0, scale: float = 1.0) -> float:
    """
    Deterministic radial scaling used for:
    - awareness rings
    - coherence rings
    - fused glyph distortions

    Example:
        radius = radial_scale(C_mean, base=0.9, scale=0.4)
    """
    return base + scale * value
