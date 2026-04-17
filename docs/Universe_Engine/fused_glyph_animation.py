# fused_glyph_animation.py
"""
Fused SKL Glyph Animation (Dual‑Universe)

Animates:
- Universe A glyph
- Universe B glyph
- fused ΔC_global spokes
- dual‑phase halo transitions
- invariant fused core evolution

Dependencies:
- utils.loaders
- utils.layout
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np

from utils.loaders import load_dual
from utils.layout import canonical_angles
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Draw a single fused glyph frame
# -------------------------------------------------------------
def draw_fused_frame(ax, dataA, dataB):
    C_A = np.array(dataA["C_values"])
    C_B = np.array(dataB["C_values"])
    A_A = np.array(dataA["A_values"])
    A_B = np.array(dataB["A_values"])

    phaseA = Phase(dataA["phase"])
    phaseB = Phase(dataB["phase"])

    tick = dataA["tick"]

    N = len(C_A)
    angles = canonical_angles(N)

    # ΔC_global per‑agent
    dC = C_A - C_B

    # ---------------------------------------------------------
    # Dual‑phase halo
    # ---------------------------------------------------------
    ax.add_patch(plt.Circle(
        (0, 0),
        1.40,
        color=PHASE_COLORS[phaseA],
        alpha=0.10,
        zorder=0
    ))

    ax.add_patch(plt.Circle(
        (0, 0),
        1.15,
        color=PHASE_COLORS[phaseB],
        alpha=0.10,
        zorder=0
    ))

    # ---------------------------------------------------------
    # Invariant fused core
    # ---------------------------------------------------------
    CgA = dataA["C_global"]
    CgB = dataB["C_global"]

    Cg_fused = 0.5 * (CgA + CgB)
    core_radius = 0.20 + 0.25 * Cg_fused

    ax.add_patch(plt.Circle(
        (0, 0),
        core_radius,
        color="white",
        alpha=0.9,
        zorder=5
    ))

    # ---------------------------------------------------------
    # Awareness ring (fused)
    # ---------------------------------------------------------
    A_mean = float(np.mean(0.5 * (A_A + A_B)))
    A_var = float(np.var(0.5 * (A_A + A_B)))

    ax.add_patch(plt.Circle(
        (0, 0),
        0.48 + 0.30 * A_mean,
        fill=False,
        linewidth=2 + 6 * A_var,
        edgecolor="white",
        alpha=0.8,
        zorder=3
    ))

    # ---------------------------------------------------------
    # Coherence ring (fused)
    # ---------------------------------------------------------
    C_mean = float(np.mean(0.5 * (C_A + C_B)))
    C_var = float(np.var(0.5 * (C_A + C_B)))

    outer_radius = 0.92 + 0.40 * C_mean

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
    # Spokes (ΔC‑weighted)
    # ---------------------------------------------------------
    for angle, d, A1, A2 in zip(angles, dC, A_A, A_B):
        A_fused = 0.5 * (A1 + A2)
        L = outer_radius * abs(d)
        direction = np.sign(d)

        x1 = direction * L * np.cos(angle)
        y1 = direction * L * np.sin(angle)

        ax.plot(
            [0, x1],
            [0, y1],
            color="#ff00ff",
            linewidth=0.5 + 3 * A_fused,
            alpha=0.8,
            zorder=2
        )

    # ---------------------------------------------------------
    # Title + formatting
    # ---------------------------------------------------------
    ax.set_title(
        f"Fused SKL Glyph Animation — Tick {tick}\n"
        f"Phase A: {phaseA.name} | Phase B: {phaseB.name}",
        fontsize=14
    )

    ax.set_aspect("equal")
    ax.axis("off")


# -------------------------------------------------------------
# Public API — Animate fused glyph across time
# -------------------------------------------------------------
def fused_glyph_animation(pathA: str, pathB: str, interval: int = 120):
    """
    Animate the fused SKL glyph across synchronized time.
    """
    histA, histB, L = load_dual(pathA, pathB)

    fig, ax = plt.subplots(figsize=(8, 8))

    def update(i):
        ax.clear()
        draw_fused_frame(ax, histA[i], histB[i])
        return []

    ani = animation.FuncAnimation(
        fig,
        update,
        frames=L,
        interval=interval,
        blit=False
    )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    fused_glyph_animation("universe_A.jsonl", "universe_B.jsonl")
