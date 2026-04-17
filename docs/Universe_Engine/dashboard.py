# dashboard.py
"""
Single‑Universe Dashboard

Visualizes:
- Global coherence C_global(t)
- Coherence energy E_coh(t)
- Binding energy E_bind(t)
- Δ3(t) = E_coh - E_bind
- Phase timeline

Dependencies:
- utils.loaders
- utils.operators
- utils.colors
"""

import matplotlib.pyplot as plt

from utils.loaders import load_jsonl
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Dashboard
# -------------------------------------------------------------
def dashboard(path: str = "universe_single.jsonl"):
    """
    Render a single‑universe dashboard from a JSONL log.
    """
    history = load_jsonl(path)

    ticks = [h["tick"] for h in history]
    Cg = [h["C_global"] for h in history]
    E_coh = [h["E_coh"] for h in history]
    E_bind = [h["E_bind"] for h in history]
    delta3 = [h["delta3"] for h in history]
    phases = [Phase(h["phase"]) for h in history]

    fig = plt.figure(figsize=(16, 10))
    fig.suptitle("Universe Dashboard", fontsize=16)

    # ---------------------------------------------------------
    # Panel 1: Global Coherence
    # ---------------------------------------------------------
    ax1 = fig.add_subplot(2, 2, 1)
    ax1.plot(ticks, Cg, color="#2ca02c", linewidth=2)
    ax1.set_title("Global Coherence C_global(t)")
    ax1.set_ylabel("C_global")

    # Phase shading
    for i in range(len(ticks) - 1):
        ax1.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.15,
        )

    # ---------------------------------------------------------
    # Panel 2: Energies
    # ---------------------------------------------------------
    ax2 = fig.add_subplot(2, 2, 2)
    ax2.plot(ticks, E_coh, color="#1f77b4", label="E_coh", linewidth=2)
    ax2.plot(ticks, E_bind, color="#d62728", label="E_bind", linewidth=2)
    ax2.set_title("Energies")
    ax2.legend()

    for i in range(len(ticks) - 1):
        ax2.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.15,
        )

    # ---------------------------------------------------------
    # Panel 3: Δ3(t)
    # ---------------------------------------------------------
    ax3 = fig.add_subplot(2, 2, 3)
    ax3.plot(ticks, delta3, color="#ff7f0e", linewidth=2)
    ax3.axhline(0, color="white", linestyle="--")
    ax3.set_title("Δ3(t) = E_coh - E_bind")
    ax3.set_ylabel("Δ3")

    for i in range(len(ticks) - 1):
        ax3.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.15,
        )

    # ---------------------------------------------------------
    # Panel 4: Phase Timeline
    # ---------------------------------------------------------
    ax4 = fig.add_subplot(2, 2, 4)
    ax4.plot(ticks, [p.value for p in phases], color="#9467bd", linewidth=2)
    ax4.set_title("Phase Timeline")
    ax4.set_ylabel("Phase Index")
    ax4.set_xlabel("Tick")

    for i in range(len(ticks) - 1):
        ax4.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.15,
        )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    dashboard()
