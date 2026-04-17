# replay_multi.py
"""
Dual‑Universe Replay Engine (A vs B)

Animates:
- Universe A replay
- Universe B replay
- ΔC_global vector field
- phase‑aware halos
- synchronized tick evolution

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
from utils.layout import canonical_layout
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Draw a single dual‑universe frame
# -------------------------------------------------------------
def draw_multi_frame(ax, dataA, dataB):
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
    # Universe A scatter
    # ---------------------------------------------------------
    sizesA = 60 + 120 * A_A
    ax.scatter(
        x, y,
        c=C_A,
        cmap="Blues",
        s=sizesA,
        edgecolors="white",
        linewidths=0.4,
        alpha=0.85,
        zorder=3
    )

    # ---------------------------------------------------------
    # Universe B scatter (slightly inward)
    # ---------------------------------------------------------
    sizesB = 60 + 120 * A_B
    ax.scatter(
        x * 0.92, y * 0.92,
        c=C_B,
        cmap="Greens",
        s=sizesB,
        edgecolors="white",
        linewidths=0.4,
        alpha=0.85,
        zorder=3
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
        f"Dual‑Universe Replay — Tick {tick}\n"
        f"Phase A: {phaseA.name} | Phase B: {phaseB.name}",
        fontsize=14
    )

    ax.set_aspect("equal")
    ax.axis("off")


# -------------------------------------------------------------
# Public API — Animate dual‑universe replay
# -------------------------------------------------------------
def replay_multi(pathA: str, pathB: str, interval: int = 120):
    """
    Animate two universes side‑by‑side in fused geometry.
    """
    histA, histB, L = load_dual(pathA, pathB)

    fig, ax = plt.subplots(figsize=(10, 10))

    def update(i):
        ax.clear()
        draw_multi_frame(ax, histA[i], histB[i])
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
    replay_multi("universe_A.jsonl", "universe_B.jsonl")
