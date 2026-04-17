# instrument_panel.py
"""
Cross‑Universe Instrument Panel (A, B, Fused)

Displays:
- Universe A glyph
- Universe B glyph
- Fused glyph
- ΔC_global timeline
- Δ3 timeline
- Phase difference timeline

Dependencies:
- utils.loaders
- utils.layout
- utils.colors
- universe_engine.Phase
- fused_glyph.draw_fused_glyph
- glyph_layer.draw_glyph
"""

import matplotlib.pyplot as plt
import numpy as np

from utils.loaders import load_dual
from utils.layout import canonical_angles
from utils.colors import PHASE_COLORS
from universe_engine import Phase

from glyph_layer import draw_glyph
from fused_glyph import draw_fused_glyph


# -------------------------------------------------------------
# Instrument Panel
# -------------------------------------------------------------
def instrument_panel(pathA: str, pathB: str, frame: int = -1):
    """
    Render the cross‑universe instrument panel for a single frame.
    """
    histA, histB, L = load_dual(pathA, pathB)

    if frame < 0:
        frame = L - 1

    dataA = histA[frame]
    dataB = histB[frame]

    tick = dataA["tick"]

    # Extract timelines
    ticks = [histA[i]["tick"] for i in range(L)]
    CgA = [histA[i]["C_global"] for i in range(L)]
    CgB = [histB[i]["C_global"] for i in range(L)]
    dCg = [CgA[i] - CgB[i] for i in range(L)]

    d3A = [histA[i]["delta3"] for i in range(L)]
    d3B = [histB[i]["delta3"] for i in range(L)]
    d_d3 = [d3A[i] - d3B[i] for i in range(L)]

    phasesA = [Phase(histA[i]["phase"]) for i in range(L)]
    phasesB = [Phase(histB[i]["phase"]) for i in range(L)]
    phase_diff = [phasesA[i].value - phasesB[i].value for i in range(L)]

    # ---------------------------------------------------------
    # Layout: 3 glyphs + 3 timelines
    # ---------------------------------------------------------
    fig = plt.figure(figsize=(20, 14))
    fig.suptitle(
        f"Cross‑Universe Instrument Panel — Tick {tick}",
        fontsize=18
    )

    # ---------------------------------------------------------
    # Glyph A
    # ---------------------------------------------------------
    axA = fig.add_subplot(3, 3, 1)
    draw_glyph(axA, dataA)
    axA.set_title(f"Universe A — Phase: {Phase(dataA['phase']).name}")

    # ---------------------------------------------------------
    # Glyph B
    # ---------------------------------------------------------
    axB = fig.add_subplot(3, 3, 2)
    draw_glyph(axB, dataB)
    axB.set_title(f"Universe B — Phase: {Phase(dataB['phase']).name}")

    # ---------------------------------------------------------
    # Fused Glyph
    # ---------------------------------------------------------
    axF = fig.add_subplot(3, 3, 3)
    draw_fused_glyph(axF, dataA, dataB)
    axF.set_title("Fused Glyph")

    # ---------------------------------------------------------
    # Timeline 1: ΔC_global
    # ---------------------------------------------------------
    ax1 = fig.add_subplot(3, 1, 2)
    ax1.plot(ticks, dCg, color="#ff7f0e", linewidth=2)
    ax1.axhline(0, color="white", linestyle="--")
    ax1.set_title("ΔC_global(t) = Cg(A) − Cg(B)")
    ax1.set_ylabel("ΔC_global")

    for i in range(L - 1):
        ax1.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.08,
        )

    # ---------------------------------------------------------
    # Timeline 2: ΔΔ3
    # ---------------------------------------------------------
    ax2 = fig.add_subplot(3, 1, 3)
    ax2.plot(ticks, d_d3, color="#ff00ff", linewidth=2)
    ax2.axhline(0, color="white", linestyle="--")
    ax2.set_title("ΔΔ3(t) = Δ3(A) − Δ3(B)")
    ax2.set_ylabel("ΔΔ3")
    ax2.set_xlabel("Tick")

    for i in range(L - 1):
        ax2.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.08,
        )

    # ---------------------------------------------------------
    # Timeline 3: Phase Difference
    # ---------------------------------------------------------
    ax3 = fig.add_axes([0.10, 0.05, 0.80, 0.10])  # custom strip
    ax3.plot(ticks, phase_diff, color="#7f7f7f", linewidth=2)
    ax3.axhline(0, color="white", linestyle="--")
    ax3.set_title("Phase Difference: phase(A) − phase(B)")
    ax3.set_ylabel("ΔPhase")
    ax3.set_xlabel("Tick")

    for i in range(L - 1):
        ax3.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phasesA[i]],
            alpha=0.08,
        )

    plt.tight_layout(rect=[0, 0.08, 1, 0.95])
    plt.show()


if __name__ == "__main__":
    instrument_panel("universe_A.jsonl", "universe_B.jsonl")
