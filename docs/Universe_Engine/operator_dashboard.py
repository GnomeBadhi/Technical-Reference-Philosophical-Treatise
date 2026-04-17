# operator_dashboard.py
"""
Operator Dashboard (Single‑Universe)

Visualizes:
- Awareness operator (A_mean)
- Coherence operator (C_mean)
- Coherence energy E_coh
- Binding energy E_bind
- Δ3 = E_coh - E_bind
- Phase timeline

Dependencies:
- utils.loaders
- utils.operators
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt
import numpy as np

from utils.loaders import load_jsonl
from utils.colors import PHASE_COLORS
from utils.operators import (
    mentor_coherence,
    global_coherence,
    coherence_energy,
    binding_energy,
    delta3,
)
from universe_engine import Phase


# -------------------------------------------------------------
# Operator Dashboard
# -------------------------------------------------------------
def operator_dashboard(path: str = "universe_single.jsonl"):
    """
    Render the operator dashboard for a single universe.
    """
    history = load_jsonl(path)

    ticks = [h["tick"] for h in history]
    phases = [Phase(h["phase"]) for h in history]

    # Extract arrays
    Cg = [h["C_global"] for h in history]
    E_coh = [h["E_coh"] for h in history]
    E_bind = [h["E_bind"] for h in history]
    d3 = [h["delta3"] for h in history]

    # Awareness and coherence operators (per-frame)
    A_mean = [float(np.mean(h["A_values"])) for h in history]
    C_mean = [float(np.mean(h["C_values"])) for h in history]

    fig = plt.figure(figsize=(16, 12))
    fig.suptitle("Operator Dashboard", fontsize=16)

    # ---------------------------------------------------------
    # Panel 1: Awareness Operator
    # ---------------------------------------------------------
    ax1 = fig.add_subplot(3, 2, 1)
    ax1.plot(ticks, A_mean, color="#1f77b4", linewidth=2)
    ax1.set_title("Awareness Operator (A_mean)")
    ax1.set_ylabel("A_mean")

    for i in range(len(ticks) - 1):
        ax1.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    # ---------------------------------------------------------
    # Panel 2: Coherence Operator
    # ---------------------------------------------------------
    ax2 = fig.add_subplot(3, 2, 2)
    ax2.plot(ticks, C_mean, color="#2ca02c", linewidth=2)
    ax2.set_title("Coherence Operator (C_mean)")
    ax2.set_ylabel("C_mean")

    for i in range(len(ticks) - 1):
        ax2.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    # ---------------------------------------------------------
    # Panel 3: Coherence Energy
    # ---------------------------------------------------------
    ax3 = fig.add_subplot(3, 2, 3)
    ax3.plot(ticks, E_coh, color="#9467bd", linewidth=2)
    ax3.set_title("Coherence Energy (E_coh)")
    ax3.set_ylabel("E_coh")

    for i in range(len(ticks) - 1):
        ax3.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    # ---------------------------------------------------------
    # Panel 4: Binding Energy
    # ---------------------------------------------------------
    ax4 = fig.add_subplot(3, 2, 4)
    ax4.plot(ticks, E_bind, color="#d62728", linewidth=2)
    ax4.set_title("Binding Energy (E_bind)")
    ax4.set_ylabel("E_bind")

    for i in range(len(ticks) - 1):
        ax4.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    # ---------------------------------------------------------
    # Panel 5: Δ3 (Transition Pressure)
    # ---------------------------------------------------------
    ax5 = fig.add_subplot(3, 2, 5)
    ax5.plot(ticks, d3, color="#ff7f0e", linewidth=2)
    ax5.axhline(0, color="white", linestyle="--")
    ax5.set_title("Δ3 = E_coh - E_bind")
    ax5.set_ylabel("Δ3")

    for i in range(len(ticks) - 1):
        ax5.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    # ---------------------------------------------------------
    # Panel 6: Phase Timeline
    # ---------------------------------------------------------
    ax6 = fig.add_subplot(3, 2, 6)
    ax6.plot(ticks, [p.value for p in phases], color="#7f7f7f", linewidth=2)
    ax6.set_title("Phase Timeline")
    ax6.set_ylabel("Phase Index")
    ax6.set_xlabel("Tick")

    for i in range(len(ticks) - 1):
        ax6.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    operator_dashboard()
