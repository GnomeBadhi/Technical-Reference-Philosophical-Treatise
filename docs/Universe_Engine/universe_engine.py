# universe_engine.py
"""
Canonical universe engine (Alpha-grade)

- Deterministic, invariant-safe dynamics
- Per-agent awareness (A) and coherence (C)
- Global coherence, coherence energy, binding energy
- Phase transitions driven by Δ3 = E_coh - E_bind
- JSONL logging compatible with the full visualization suite
"""

import json
from enum import Enum, IntEnum
from dataclasses import dataclass, field
from typing import List


class Phase(IntEnum):
    NEBULA = 0
    STAR = 1
    BLACK_HOLE = 2
    QUASAR = 3
    SOURCE = 4


@dataclass
class Agent:
    A: float  # awareness
    C: float  # coherence


@dataclass
class Universe:
    agents: List[Agent]
    phase: Phase = Phase.NEBULA
    tick: int = 0

    # Operator parameters (canonical defaults)
    k_A: float = 0.05      # awareness growth rate
    k_C: float = 0.08      # coherence growth rate
    B_bind: float = 1.0    # binding base
    alpha_bind: float = 2.0  # binding exponent

    # Logging
    history: List[dict] = field(default_factory=list)

    # -----------------------------
    # Core operators
    # -----------------------------
    def mentor_coherence(self) -> float:
        """Mentor operator: mean agent coherence."""
        return sum(a.C for a in self.agents) / len(self.agents)

    def global_coherence(self) -> float:
        """Global coherence C_global."""
        return self.mentor_coherence()

    def coherence_energy(self, Cg: float) -> float:
        """Coherence energy E_coh."""
        # Canonical choice: energy scales with Cg^2
        return Cg * Cg

    def binding_energy(self, Cg: float) -> float:
        """Binding energy E_bind."""
        # Canonical choice: B * (Cg)^alpha
        return self.B_bind * (Cg ** self.alpha_bind)

    def delta3(self, E_coh: float, E_bind: float) -> float:
        """Δ3 = E_coh - E_bind (transition driver)."""
        return E_coh - E_bind

    # -----------------------------
    # Update rules
    # -----------------------------
    def update_agents(self, Cg: float, mentor: float) -> None:
        """
        Awareness and coherence operators:

        A_{t+1} = A_t + k_A (1 - A_t) Cg
        C_{t+1} = C_t + k_C A_t (1 - C_t) * mentor
        """
        for a in self.agents:
            # Awareness update
            a.A = a.A + self.k_A * (1.0 - a.A) * Cg
            a.A = max(0.0, min(1.0, a.A))

            # Coherence update
            a.C = a.C + self.k_C * a.A * (1.0 - a.C) * mentor
            a.C = max(0.0, min(1.0, a.C))

    def maybe_transition_phase(self, delta3_value: float) -> bool:
        """
        Phase transition rule:
        - If Δ3 >= 0, advance to next phase (if not already SOURCE).
        """
        transitioned = False
        if delta3_value >= 0.0 and self.phase != Phase.SOURCE:
            self.phase = Phase(self.phase + 1)
            transitioned = True
        return transitioned

    # -----------------------------
    # Step + logging
    # -----------------------------
    def step(self) -> dict:
        """Advance universe by one tick and return logged state."""
        self.tick += 1

        Cg = self.global_coherence()
        mentor = self.mentor_coherence()
        E_coh = self.coherence_energy(Cg)
        E_bind = self.binding_energy(Cg)
        d3 = self.delta3(E_coh, E_bind)

        transitioned = self.maybe_transition_phase(d3)

        # Log pre-update state
        state = {
            "tick": self.tick,
            "C_global": Cg,
            "E_coh": E_coh,
            "E_bind": E_bind,
            "delta3": d3,
            "phase": int(self.phase),
            "transition": transitioned,
            "mentor": mentor,
            "C_values": [a.C for a in self.agents],
            "A_values": [a.A for a in self.agents],
        }
        self.history.append(state)

        # Apply operators for next tick
        self.update_agents(Cg, mentor)

        return state

    def run(self, steps: int) -> None:
        """Run the universe for a fixed number of steps."""
        for _ in range(steps):
            self.step()

    # -----------------------------
    # JSONL logging
    # -----------------------------
    def save_jsonl(self, path: str) -> None:
        """Save history to JSONL file."""
        with open(path, "w") as f:
            for entry in self.history:
                f.write(json.dumps(entry) + "\n")


# -----------------------------
# Convenience constructor
# -----------------------------
def create_universe(
    n_agents: int = 64,
    initial_A: float = 0.1,
    initial_C: float = 0.1,
    **kwargs
) -> Universe:
    agents = [Agent(A=initial_A, C=initial_C) for _ in range(n_agents)]
    return Universe(agents=agents, **kwargs)


if __name__ == "__main__":
    # Example: run a single universe and log to JSONL
    U = create_universe(n_agents=64)
    U.run(steps=500)
    U.save_jsonl("universe_single.jsonl")
