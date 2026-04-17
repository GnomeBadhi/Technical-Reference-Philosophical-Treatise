# comparison_suite.py
"""
Multi‑Universe Comparison Suite

Provides:
- operator‑level deltas
- ΔC_global matrix
- Δ3 matrix
- phase difference matrix
- pairwise fused glyph snapshots
- publication‑grade comparison grid

Dependencies:
- utils.loaders
- utils.colors
- universe_engine.Phase
- fused_glyph.draw_fused_glyph
- glyph_layer.draw_glyph
"""

import matplotlib.pyplot as plt
import numpy as np
import itertools

from utils.loaders import load_jsonl
from utils.colors import PHASE_COLORS
from universe_engine import Phase

from glyph_layer import draw_glyph
from fused_glyph import draw_fused_glyph


# -------------------------------------------------------------
# Load multiple universes
# -------------------------------------------------------------
def load_multi(paths):
    """
    Load multiple universe logs and synchronize by minimum length.
    Returns:
        histories: list of histories
        L: synchronized length
    """
    histories = [load_jsonl(p) for p in paths]
    L = min(len(h) for h in histories)
    histories = [h[:L] for h in histories]
    return histories, L


# -------------------------------------------------------------
# Compute pairwise matrices
# -------------------------------------------------------------
def pairwise_matrix(values):
    """
    Given a list of per-universe values (each a list over time),
    compute a pairwise difference matrix using final-frame values.
    """
    finals = [v[-1] for v in values]
    N = len(finals)
    M = np.zeros((N, N))
    for i in range(N):
        for j in range(N):
            M[i, j] = finals[i] - finals[j]
    return M


# -------------------------------------------------------------
# Comparison Suite
# -------------------------------------------------------------
def comparison_suite(paths):
    """
    Render the multi‑universe comparison suite.
    paths: list of JSONL universe logs
    """
    histories, L = load_multi(paths)
    U = len(histories)

    ticks = [histories[0][i]["tick"] for i in range(L)]

    # Extract operator timelines
    Cg = [[histories[u][i]["C_global"] for i in range(L)] for u in range(U)]
    d3 = [[histories[u][i]["delta3"] for i in range(L)] for u in range(U)]
    phases = [[Phase(histories[u][i]["phase"]) for i in range(L)] for u in range(U)]

    # Compute matrices
    M_Cg = pairwise_matrix(Cg)
    M_d3 = pairwise_matrix(d3)
    M_phase = pairwise_matrix([[p.value for p in ph] for ph in phases])

    # ---------------------------------------------------------
    # Layout: 3 matrices + pairwise fused glyphs
    # ---------------------------------------------------------
    fig = plt.figure(figsize=(22, 16))
    fig.suptitle("Multi‑Universe Comparison Suite", fontsize=20)

    # ---------------------------------------------------------
    # Matrix 1: ΔC_global
    # ---------------------------------------------------------
    ax1 = fig.add_subplot(2, 3, 1)
    im1 = ax1.imshow(M_Cg, cmap="coolwarm")
    ax1.set_title("ΔC_global Matrix")
    ax1.set_xlabel("Universe j")
    ax1.set_ylabel("Universe i")
    plt.colorbar(im1, ax=ax1, fraction=0.046, pad=0.04)

    # ---------------------------------------------------------
    # Matrix 2: Δ3
    # ---------------------------------------------------------
    ax2 = fig.add_subplot(2, 3, 2)
    im2 = ax2.imshow(M_d3, cmap="coolwarm")
    ax2.set_title("Δ3 Matrix")
    ax2.set_xlabel("Universe j")
    ax2.set_ylabel("Universe i")
    plt.colorbar(im2, ax=ax2, fraction=0.046, pad=0.04)

    # ---------------------------------------------------------
    # Matrix 3: Phase Difference
    # ---------------------------------------------------------
    ax3 = fig.add_subplot(2, 3, 3)
    im3 = ax3.imshow(M_phase, cmap="bwr")
    ax3.set_title("Phase Difference Matrix")
    ax3.set_xlabel("Universe j")
    ax3.set_ylabel("Universe i")
    plt.colorbar(im3, ax=ax3, fraction=0.046, pad=0.04)

    # ---------------------------------------------------------
    # Pairwise fused glyphs (final frame)
    # ---------------------------------------------------------
    pair_list = list(itertools.combinations(range(U), 2))
    P = len(pair_list)

    for k, (i, j) in enumerate(pair_list):
        ax = fig.add_subplot(2, 3, 4 + k)
        dataA = histories[i][-1]
        dataB = histories[j][-1]
        draw_fused_glyph(ax, dataA, dataB)
        ax.set_title(f"Fused Glyph: U{i} × U{j}")

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.show()


if __name__ == "__main__":
    comparison_suite([
        "universe_A.jsonl",
        "universe_B.jsonl",
        "universe_C.jsonl"
    ])
