# glyph_layer.py
"""
Canonical SKL Glyph Layer (Single‑Universe)

Visualizes:
- awareness ring
- coherence ring
- per‑agent spokes (coherence-weighted)
- phase halo
- invariant core

Dependencies:
- utils.loaders
- utils.layout
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt
import numpy as np

from utils.loaders import load_frame, load_jsonl
from utils.layout import canonical_angles
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Draw a single glyph
# -------------------------------------------------------------
def draw_glyph(ax, data):
    C_values = np.array(data["C_values"])
    A_values = np.array(data["A_values"])
    phase = Phase(data["phase"])
    tick = data["tick"]

    N = len(C_values)
    angles = canonical_angles(N)

    # ---------------------------------------------------------
    # Phase halo
    # ---------------------------------------------------------
    ax.add_patch(plt.Circle(
        (0, 0),
        1.35,
        color=PHASE_COLORS[phase],
        alpha=0.12,
        zorder=0
    ))

    # ---------------------------------------------------------
    # Invariant core
    # ---------------------------------------------------------
    Cg = data["C_global"]
    core_radius = 0.18 + 0.25 * Cg

    ax.add_patch(plt.Circle(
        (0, 0),
        core_radius,
        color="white",
        alpha=0.9,
        zorder=5
    ))

    # ---------------------------------------------------------
    # Awareness ring
    # ---------------------------------------------------------
    A_mean = float(np.mean(A_values))
    A_var = float(np.var(A_values))

    ax.add_patch(plt.Circle(
        (0, 0),
        0.45 + 0.3 * A_mean,
        fill=False,
        linewidth=2 + 6 * A_var,
        edgecolor="white",
        alpha=0.8,
        zorder=3
    ))

    # ---------------------------------------------------------
    # Coherence ring
    # ---------------------------------------------------------
    C_mean = float(np.mean(C_values))
    C_var = float(np.var(C_values))

    outer_radius = 0.9 + 0.4 * C_mean

    ax.add_patch(plt.Circle(
        (0, 0),
        outer_radius,
        fill=False,
        linewidth=2 + 6 * C_var,
        edgecolor="#aaaaaa",
        alpha=0.9,
        zorder=4
    ))

    # ---------------------------------------------------------
    # Spokes (coherence-weighted)
    # ---------------------------------------------------------
    for angle, C, A in zip(angles, C_values, A_values):
        L = outer_radius * C
        x1 = L * np.cos(angle)
        y1 = L * np.sin(angle)

        ax.plot(
            [0, x1],
            [0, y1],
            color="white",
            linewidth=0.5 + 3 * A,
            alpha=0.8,
            zorder=2
        )

    # ---------------------------------------------------------
    # Title + formatting
    # ---------------------------------------------------------
    ax.set_title(
        f"SKL Glyph — Tick {tick} | Phase: {phase.name}",
        fontsize=14
    )

    ax.set_aspect("equal")
    ax.axis("off")


# -------------------------------------------------------------
# Public API
# -------------------------------------------------------------
def glyph_layer(path: str = "universe_single.jsonl", frame: int = -1):
    """
    Render a canonical SKL glyph for a single universe frame.
    """
    history = load_jsonl(path)
    data = load_frame(history, frame)

    fig, ax = plt.subplots(figsize=(8, 8))
    draw_glyph(ax, data)
    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    glyph_layer()
