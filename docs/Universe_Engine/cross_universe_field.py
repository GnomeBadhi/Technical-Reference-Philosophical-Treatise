# cross_universe_field.py
"""
Cross‑Universe Coherence Field (A vs B)

Visualizes:
- dual‑universe coherence fields
- ΔC_global vector field
- phase‑aware halos for both universes
- canonical circular geometry

Dependencies:
- utils.loaders
- utils.layout
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt
import numpy as np

from utils.loaders import load_dual
from utils.layout import canonical_layout
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Cross‑Universe Field Renderer
# -------------------------------------------------------------
def cross_universe_field(pathA: str, pathB: str, frame: int = -1):
    """
    Render a cross‑universe coherence field for a single frame.
    frame = -1 → last synchronized frame
    """
    histA, histB, L = load_dual(pathA, pathB)

    if frame < 0:
        frame = L - 1

    dataA = histA[frame]
    dataB = histB[frame]

    C_A = np.array(dataA["C_values"])
    C_B = np.array(dataB["C_values"])
    A_A = np.array(dataA["A_values"])
    A_B = np.array(dataB["A_values"])

    phaseA = Phase(dataA["phase"])
    phaseB = Phase(dataB["phase"])

    tick = dataA["tick"]

    N = len(C_A)
    x, y = canonical_layout(N)

    # ΔC_global per‑agent
    dC = C_A - C_B

    fig, ax = plt.subplots(figsize=(10, 10))

    # ---------------------------------------------------------
    # Phase halos
    # ---------------------------------------------------------
    ax.add_patch(plt.Circle(
        (0, 0),
        1.35,
        color=PHASE_COLORS[phaseA],
        alpha=0.10,
        zorder=0
    ))

    ax.add_patch(plt.Circle(
        (0, 0),
        1.10,
        color=PHASE_COLORS[phaseB],
        alpha=0.10,
        zorder=0
    ))

    # ---------------------------------------------------------
    # Universe A scatter (coherence-coded)
    # ---------------------------------------------------------
    sizesA = 60 + 120 * A_A
    scA = ax.scatter(
        x, y,
        c=C_A,
        cmap="Blues",
        s=sizesA,
        edgecolors="white",
        linewidths=0.4,
        alpha=0.85,
        zorder=3,
        label="Universe A"
    )

    # ---------------------------------------------------------
    # Universe B scatter (coherence-coded)
    # ---------------------------------------------------------
    sizesB = 60 + 120 * A_B
    scB = ax.scatter(
        x * 0.92, y * 0.92,   # slight inward offset for clarity
        c=C_B,
        cmap="Greens",
        s=sizesB,
        edgecolors="white",
        linewidths=0.4,
        alpha=0.85,
        zorder=3,
        label="Universe B"
    )

    # ---------------------------------------------------------
    # ΔC_global vector field
    # ---------------------------------------------------------
    for xi, yi, d in zip(x, y, dC):
        ax.arrow(
            xi, yi,
            0.12 * d * xi,
            0.12 * d * yi,
            head_width=0.03,
            head_length=0.05,
            color="#ff00ff",
            alpha=0.7,
            linewidth=1.2,
            zorder=4
        )

    # ---------------------------------------------------------
    # Title + formatting
    # ---------------------------------------------------------
    ax.set_title(
        f"Cross‑Universe Coherence Field — Tick {tick}\n"
        f"Phase A: {phaseA.name} | Phase B: {phaseB.name}",
        fontsize=14
    )

    ax.set_aspect("equal")
    ax.axis("off")

    # Colorbars
    cbarA = plt.colorbar(scA, ax=ax, fraction=0.046, pad=0.04)
    cbarA.set_label("Coherence (A)", fontsize=12)

    cbarB = plt.colorbar(scB, ax=ax, fraction=0.046, pad=0.08)
    cbarB.set_label("Coherence (B)", fontsize=12)

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    cross_universe_field("universe_A.jsonl", "universe_B.jsonl")
