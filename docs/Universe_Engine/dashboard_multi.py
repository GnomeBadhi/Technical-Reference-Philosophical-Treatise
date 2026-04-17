# dashboard_multi.py
"""
Dual‑Universe Dashboard (A vs B)

Visualizes:
- C_global(A) vs C_global(B)
- ΔC_global(t)
- Δ3(A) vs Δ3(B)
- ΔΔ3(t)
- Phase difference timeline
- Synchronized ticks

Dependencies:
- utils.loaders
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt

from utils.loaders import load_dual
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Dual‑Universe Dashboard
# -------------------------------------------------------------
def dashboard_multi(pathA: str, pathB: str):
    """
    Render a synchronized dual‑universe dashboard.
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

    fig = plt.figure(figsize=(18, 12))
    fig.suptitle("Dual‑Universe Dashboard (A vs B)", fontsize=16)

    # ---------------------------------------------------------
    # Panel 1: C_global(A) vs C_global(B)
    # ---------------------------------------------------------
    ax1 = fig.add_subplot(3, 2, 1)
    ax1.plot(ticks, CgA, color="#1f77b4", linewidth=2, label="C_global (A)")
    ax1.plot(ticks, CgB, color="#2ca02c", linewidth=2, label="C_global (B)")
    ax1.set_title("Global Coherence: A vs B")
    ax1.set_ylabel("C_global")
    ax1.legend()

    # Phase shading (Universe A)
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
    ax2 = fig.add_subplot(3, 2, 2)
    ax2.plot(ticks, dCg, color="#ff7f0e", linewidth=2)
    ax2.axhline(0, color="white", linestyle="--")
    ax2.set_title("ΔC_global(t) = Cg(A) - Cg(B)")
    ax2.set_ylabel("ΔC_global")

    for i in range(L - 1):
        ax2.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    # ---------------------------------------------------------
    # Panel 3: Δ3(A) vs Δ3(B)
    # ---------------------------------------------------------
    ax3 = fig.add_subplot(3, 2, 3)
    ax3.plot(ticks, d3A, color="#9467bd", linewidth=2, label="Δ3 (A)")
    ax3.plot(ticks, d3B, color="#d62728", linewidth=2, label="Δ3 (B)")
    ax3.axhline(0, color="white", linestyle="--")
    ax3.set_title("Δ3 Comparison")
    ax3.set_ylabel("Δ3")
    ax3.legend()

    for i in range(L - 1):
        ax3.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    # ---------------------------------------------------------
    # Panel 4: ΔΔ3(t)
    # ---------------------------------------------------------
    ax4 = fig.add_subplot(3, 2, 4)
    ax4.plot(ticks, d_d3, color="#ff00ff", linewidth=2)
    ax4.axhline(0, color="white", linestyle="--")
    ax4.set_title("ΔΔ3(t) = Δ3(A) - Δ3(B)")
    ax4.set_ylabel("ΔΔ3")

    for i in range(L - 1):
        ax4.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    # ---------------------------------------------------------
    # Panel 5: Phase Difference Timeline
    # ---------------------------------------------------------
    ax5 = fig.add_subplot(3, 2, 5)
    ax5.plot(ticks, phase_diff, color="#7f7f7f", linewidth=2)
    ax5.axhline(0, color="white", linestyle="--")
    ax5.set_title("Phase Difference: phase(A) - phase(B)")
    ax5.set_ylabel("Phase Δ")

    for i in range(L - 1):
        ax5.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    # ---------------------------------------------------------
    # Panel 6: Phase Timeline (A and B)
    # ---------------------------------------------------------
    ax6 = fig.add_subplot(3, 2, 6)
    ax6.plot(ticks, [p.value for p in phasesA], color="#1f77b4", linewidth=2, label="Phase (A)")
    ax6.plot(ticks, [p.value for p in phasesB], color="#2ca02c", linewidth=2, label="Phase (B)")
    ax6.set_title("Phase Timelines")
    ax6.set_ylabel("Phase Index")
    ax6.set_xlabel("Tick")
    ax6.legend()

    for i in range(L - 1):
        ax6.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.10,
        )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    dashboard_multi("universe_A.jsonl", "universe_B.jsonl")
