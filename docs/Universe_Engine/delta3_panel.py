# delta3_panel.py
"""
Δ3 Panel (Single‑Universe)

Visualizes:
- Coherence energy E_coh(t)
- Binding energy E_bind(t)
- Δ3(t) = E_coh - E_bind
- Δ3 sign regions
- Phase shading

Dependencies:
- utils.loaders
- utils.colors
- universe_engine.Phase
"""

import matplotlib.pyplot as plt

from utils.loaders import load_jsonl
from utils.colors import PHASE_COLORS
from universe_engine import Phase


# -------------------------------------------------------------
# Δ3 Panel
# -------------------------------------------------------------
def delta3_panel(path: str = "universe_single.jsonl"):
    """
    Render the Δ3 transition panel for a single universe.
    """
    history = load_jsonl(path)

    ticks = [h["tick"] for h in history]
    E_coh = [h["E_coh"] for h in history]
    E_bind = [h["E_bind"] for h in history]
    d3 = [h["delta3"] for h in history]
    phases = [Phase(h["phase"]) for h in history]

    fig = plt.figure(figsize=(14, 8))
    fig.suptitle("Δ3 Transition Panel", fontsize=16)

    # ---------------------------------------------------------
    # Panel 1: Energies
    # ---------------------------------------------------------
    ax1 = fig.add_subplot(2, 1, 1)
    ax1.plot(ticks, E_coh, color="#1f77b4", linewidth=2, label="E_coh")
    ax1.plot(ticks, E_bind, color="#d62728", linewidth=2, label="E_bind")
    ax1.set_title("Coherence vs Binding Energy")
    ax1.set_ylabel("Energy")
    ax1.legend()

    # Phase shading
    for i in range(len(ticks) - 1):
        ax1.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    # ---------------------------------------------------------
    # Panel 2: Δ3(t)
    # ---------------------------------------------------------
    ax2 = fig.add_subplot(2, 1, 2)
    ax2.plot(ticks, d3, color="#ff7f0e", linewidth=2)
    ax2.axhline(0, color="white", linestyle="--", linewidth=1)
    ax2.set_title("Δ3(t) = E_coh - E_bind")
    ax2.set_ylabel("Δ3")
    ax2.set_xlabel("Tick")

    # Phase shading
    for i in range(len(ticks) - 1):
        ax2.axvspan(
            ticks[i],
            ticks[i + 1],
            color=PHASE_COLORS[phases[i]],
            alpha=0.12,
        )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    delta3_panel()
