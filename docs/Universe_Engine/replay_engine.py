# replay_engine.py
"""
Single‑Universe Replay Engine

Provides a time‑evolving visualization of:
- per‑agent coherence values
- canonical circular layout
- phase‑aware background shading
- global coherence and phase indicators

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
from utils.layout import canonical_layout
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Draw a single frame
# -------------------------------------------------------------
def draw_frame(ax, frame_data):
    ax.clear()

    C_values = frame_data["C_values"]
    A_values = frame_data["A_values"]
    phase = Phase(frame_data["phase"])
    tick = frame_data["tick"]

    N = len(C_values)
    x, y = canonical_layout(N)

    # ---------------------------------------------------------
    # Phase halo
    # ---------------------------------------------------------
    ax.add_patch(plt.Circle(
        (0, 0),
        1.25,
        color=PHASE_COLORS[phase],
        alpha=0.12,
        zorder=0
    ))

    # ---------------------------------------------------------
    # Agent scatter (coherence-coded)
    # ---------------------------------------------------------
    sizes = 80 + 150 * np.array(A_values)

    sc = ax.scatter(
        x, y,
        c=C_values,
        cmap="viridis",
        s=sizes,
        edgecolors="white",
        linewidths=0.5,
        alpha=0.9,
        zorder=3
    )

    # ---------------------------------------------------------
    # Title + labels
    # ---------------------------------------------------------
    ax.set_title(
        f"Universe Replay — Tick {tick} | Phase: {phase.name}",
        fontsize=14
    )

    ax.set_aspect("equal")
    ax.axis("off")


# -------------------------------------------------------------
# Replay Animation
# -------------------------------------------------------------
def replay(path: str = "universe_single.jsonl", interval: int = 120):
    """
    Animate a universe from a JSONL log.
    """
    history = load_jsonl(path)

    fig, ax = plt.subplots(figsize=(8, 8))

    def update(i):
        draw_frame(ax, history[i])
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
    replay()
