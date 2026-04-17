# heatmap.py
"""
Single‑Universe Coherence Heatmap

Visualizes:
- per‑agent coherence values (C)
- canonical radial layout
- awareness‑weighted marker sizes
- phase‑aware halo

Dependencies:
- utils.loaders
- utils.layout
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt
import numpy as np

from utils.loaders import load_frame, load_jsonl
from utils.layout import canonical_layout
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Heatmap Renderer
# -------------------------------------------------------------
def heatmap(path: str = "universe_single.jsonl", frame: int = -1):
    """
    Render a coherence heatmap for a single universe frame.
    frame = -1 → last frame
    """
    history = load_jsonl(path)
    data = load_frame(history, frame)

    C_values = np.array(data["C_values"])
    A_values = np.array(data["A_values"])
    phase = Phase(data["phase"])
    tick = data["tick"]

    N = len(C_values)
    x, y = canonical_layout(N)

    fig, ax = plt.subplots(figsize=(8, 8))

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
    # Heatmap scatter
    # ---------------------------------------------------------
    sizes = 80 + 150 * A_values

    sc = ax.scatter(
        x, y,
        c=C_values,
        cmap="plasma",
        s=sizes,
        edgecolors="white",
        linewidths=0.5,
        alpha=0.9,
        zorder=3
    )

    # ---------------------------------------------------------
    # Title + formatting
    # ---------------------------------------------------------
    ax.set_title(
        f"Coherence Heatmap — Tick {tick} | Phase: {phase.name}",
        fontsize=14
    )

    ax.set_aspect("equal")
    ax.axis("off")

    # Colorbar
    cbar = plt.colorbar(sc, ax=ax, fraction=0.046, pad=0.04)
    cbar.set_label("Coherence (C)", fontsize=12)

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    heatmap()
