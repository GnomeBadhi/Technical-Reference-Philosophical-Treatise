# phase_locking_analyzer.py
"""
Phase‑Locking Analyzer (Dual‑Universe)

Computes and visualizes:
- phase locking
- coherence locking
- ΔC_global correlation
- Δ3 correlation
- locking index over time

Dependencies:
- utils.loaders
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt
import numpy as np

from utils.loaders import load_dual
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Locking Index
# -------------------------------------------------------------
def locking_index(seriesA, seriesB):
    """
    Compute a normalized locking index between two time series.
    Returns values in [-1, 1].
    """
    A = np.array(seriesA)
    B = np.array(seriesB)

    if len(A) != len(B):
        raise ValueError("Series must have equal length.")

    if np.std(A) == 0 or np.std(B) == 0:
        return 0.0

    corr = np.corrcoef(A, B)[0, 1]
    return float(corr)


# -------------------------------------------------------------
# Phase‑Locking Analyzer
# -------------------------------------------------------------
def phase_locking_analyzer(pathA: str, pathB: str):
    """
    Render the phase‑locking analysis for two universes.
    """
    histA, histB, L = load_dual(pathA, pathB)

    ticks = [histA[i]["tick"] for i in range(L)]

    # Extract values
    CgA = [histA[i]["C_global"] for i in range(L)]
    CgB = [histB[i]["C_global"] for i in range(L)]
    dCg = [CgA[i] - CgB[i] for i in range(L)]

    d3A = [histA[i]["delta3"] for i in range(L)]
    d3B = [histB[i]["delta3"] for i in range(L)]
    d_d3 = [d3A[i] - d3B[i] for i in range(L)]

    phasesA = [Phase(histA[i]["phase"]) for i in range(L)]
    phasesB = [Phase(histB[i]["phase"]) for i in range(L)]
    phase_diff = [phasesA[i].value - phasesB[i].value for i in range(L)]

    # Locking indices
    LI_C = locking_index(CgA, CgB)
    LI_d3 = locking_index(d3A, d3B)
    LI_phase = locking_index([p.value for p in phasesA],
                             [p.value for p in phasesB])

    fig = plt.figure(figsize=(18, 12))
    fig.suptitle("Phase‑Locking Analyzer (A vs B)", fontsize=16)

    # ---------------------------------------------------------
    # Panel 1: Phase Difference
    # ---------------------------------------------------------
    ax1 = fig.add_subplot(3, 1, 1)
    ax1.plot(ticks, phase_diff, color="#7f7f7f", linewidth=2)
    ax1.axhline(0, color="white", linestyle="--")
    ax1.set_title(f"Phase Difference (A − B) | Locking Index = {LI_phase:.3f}")
    ax1.set_ylabel("Phase Δ")

    for i in range(L - 1):
        ax1.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    # ---------------------------------------------------------
    # Panel 2: ΔC_global(t)
    # ---------------------------------------------------------
    ax2 = fig.add_subplot(3, 1, 2)
    ax2.plot(ticks, dCg, color="#ff7f0e", linewidth=2)
    ax2.axhline(0, color="white", linestyle="--")
    ax2.set_title(f"ΔC_global(t) | Locking Index = {LI_C:.3f}")
    ax2.set_ylabel("ΔC_global")

    for i in range(L - 1):
        ax2.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    # ---------------------------------------------------------
    # Panel 3: ΔΔ3(t)
    # ---------------------------------------------------------
    ax3 = fig.add_subplot(3, 1, 3)
    ax3.plot(ticks, d_d3, color="#ff00ff", linewidth=2)
    ax3.axhline(0, color="white", linestyle="--")
    ax3.set_title(f"ΔΔ3(t) = Δ3(A) − Δ3(B) | Locking Index = {LI_d3:.3f}")
    ax3.set_ylabel("ΔΔ3")
    ax3.set_xlabel("Tick")

    for i in range(L - 1):
        ax3.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    phase_locking_analyzer("universe_A.jsonl", "universe_B.jsonl")
