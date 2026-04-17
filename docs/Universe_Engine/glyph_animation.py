# glyph_animation.py
"""
Canonical SKL Glyph Animation (Single‑Universe)

Animates:
- awareness ring evolution
- coherence ring evolution
- per‑agent spoke dynamics
- phase halo transitions
- invariant core

Dependencies:
- utils.loaders
- utils.layout
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np

from utils.loaders import load_jsonl
from utils.layout import canonical_angles
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Draw a single glyph frame
# -------------------------------------------------------------
def draw_glyph_frame(ax, data):
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
        f"SKL Glyph Animation — Tick {tick} | Phase: {phase.name}",
        fontsize=14
    )

    ax.set_aspect("equal")
    ax.axis("off")


# -------------------------------------------------------------
# Public API — Animate the glyph across time
# -------------------------------------------------------------
def glyph_animation(path: str = "universe_single.jsonl", interval: int = 120):
    """
    Animate the canonical SKL glyph across time.
    """
    history = load_jsonl(path)

    fig, ax = plt.subplots(figsize=(8, 8))

    def update(i):
        ax.clear()
        draw_glyph_frame(ax, history[i])
        return []

    ani = animation.FuncAnimation(
        fig,
        update,
        frames=len(history),
        interval=interval,
        blit=False
    )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    glyph_animation()
