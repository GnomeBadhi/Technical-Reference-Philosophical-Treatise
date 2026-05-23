Synthetic State Space Kernel Engine (v1 skeleton)

Refactored from universe_engine.py into a kernel-valid simulation architecture.

Goals
-----
- explicit identity per agent
- validation/projection layer (K0)
- triadic interaction pipeline: encode -> medium -> decode
- deterministic bounded dynamics
- append-only operator history
- JSONL logging compatible with the visualization suite

Notes
-----
This is intentionally a *skeleton*: the math is minimal but the architectural seams
are present so later work can replace simple defaults with stronger operators.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from enum import IntEnum
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------
# Regimes / phases
# ---------------------------------------------------------------------
class Phase(IntEnum):
    NEBULA = 0
    STAR = 1
    BLACK_HOLE = 2
    QUASAR = 3
    SOURCE = 4


# ---------------------------------------------------------------------
# Core runtime objects
# ---------------------------------------------------------------------
@dataclass
class KernelMessage:
    """Minimal signal payload for v1 triadic coherence interactions."""
    sender_id: str
    A: float
    C: float
    phase: int


@dataclass
class Agent:
    """
    Kernel-like local unit.

    Fields
    ------
    id : persistent identity token
    A  : awareness / activation in [0, 1]
    C  : coherence in [0, 1]
    phase : local regime label (optional; often mirrors universe phase in v1)
    valid : whether the most recent committed state satisfied validation
    dissonance : magnitude of correction applied by the validator
    history : append-only operator history
    """
    id: str
    A: float
    C: float
    phase: Phase = Phase.NEBULA
    valid: bool = True
    dissonance: float = 0.0
    history: List[str] = field(default_factory=list)


@dataclass
class KernelEngine:
    agents: List[Agent]
    phase: Phase = Phase.NEBULA
    tick: int = 0

    # Canonical deterministic parameters (safe defaults)
    k_A: float = 0.05
    k_C: float = 0.08
    B_bind: float = 1.0
    alpha_bind: float = 1.5  # avoids degenerate E_coh == E_bind for all Cg
    epsilon_phase: float = 1e-6

    # Channel / interaction defaults
    default_channel_gain: float = 1.0

    # Optional topology: adjacency list keyed by agent index
    adjacency: Optional[Dict[int, List[int]]] = None

    # Logging
    history: List[dict] = field(default_factory=list)

    # -----------------------------------------------------------------
    # Identity / kernel validity
    # -----------------------------------------------------------------
    def validate_agent(self, agent: Agent) -> Agent:
        """
        K0-like projection for a single agent.

        v1 validation rules:
        - A in [0, 1]
        - C in [0, 1]
        - phase is a defined Phase
        - history remains append-only (enforced by design)

        The validator records a simple dissonance score equal to the total
        absolute correction applied to bounded numeric fields.
        """
        old_A, old_C = agent.A, agent.C

        agent.A = max(0.0, min(1.0, float(agent.A)))
        agent.C = max(0.0, min(1.0, float(agent.C)))

        # normalize phase if callers passed an int
        if not isinstance(agent.phase, Phase):
            agent.phase = Phase(int(agent.phase))

        agent.dissonance = abs(agent.A - old_A) + abs(agent.C - old_C)
        agent.valid = (agent.dissonance == 0.0)
        agent.history.append("validate")
        return agent

    def validate_all(self) -> None:
        for agent in self.agents:
            self.validate_agent(agent)

    # -----------------------------------------------------------------
    # Topology helpers
    # -----------------------------------------------------------------
    def neighbors_of(self, idx: int) -> List[int]:
        """
        Return neighbor indices for agent idx.

        If no explicit adjacency is provided, use a ring topology.
        """
        n = len(self.agents)
        if n <= 1:
            return []

        if self.adjacency is not None:
            return list(self.adjacency.get(idx, []))

        # default ring
        return [((idx - 1) % n), ((idx + 1) % n)]

    # -----------------------------------------------------------------
    # Global observables
    # -----------------------------------------------------------------
    def mentor_coherence(self) -> float:
        if not self.agents:
            return 0.0
        return sum(a.C for a in self.agents) / len(self.agents)

    def global_coherence(self) -> float:
        return self.mentor_coherence()

    def global_activation(self) -> float:
        if not self.agents:
            return 0.0
        return sum(a.A for a in self.agents) / len(self.agents)

    def coherence_energy(self, Cg: float) -> float:
        # non-degenerate default from the simulation spec
        return Cg * (1.0 + Cg)

    def binding_energy(self, Cg: float) -> float:
        return self.B_bind * (Cg ** self.alpha_bind)

    def delta3(self, E_coh: float, E_bind: float) -> float:
        return E_coh - E_bind

    # -----------------------------------------------------------------
    # Triadic coherence pipeline
    # -----------------------------------------------------------------
    def encode(self, sender: Agent) -> KernelMessage:
        sender.history.append("encode")
        return KernelMessage(
            sender_id=sender.id,
            A=sender.A,
            C=sender.C,
            phase=int(sender.phase),
        )

    def medium_transform(
        self,
        message: KernelMessage,
        channel_gain: Optional[float] = None,
    ) -> KernelMessage:
        """
        Medium operator (◇): applies deterministic attenuation.

        v1 keeps this simple and deterministic. Future versions can add noise,
        distance, topology-dependent attenuation, or validation of channels.
        """
        g = self.default_channel_gain if channel_gain is None else float(channel_gain)

        return KernelMessage(
            sender_id=message.sender_id,
            A=max(0.0, min(1.0, g * message.A)),
            C=max(0.0, min(1.0, g * message.C)),
            phase=message.phase,
        )

    def decode(self, receiver: Agent, message: KernelMessage) -> Dict[str, float]:
        """
        Receiver-side reconstructed signal.

        v1 uses a simple decoded payload and leaves the actual update rule to
        propose_local_update().
        """
        receiver.history.append("decode")
        return {
            "sender_id": message.sender_id,
            "A_in": message.A,
            "C_in": message.C,
            "phase_in": message.phase,
        }

    def interaction_influence(self, idx: int) -> float:
        """
        Aggregate decoded coherence influence from neighbors.

        Returns a scalar mentor-like neighborhood coherence term M_i.
        """
        nbrs = self.neighbors_of(idx)
        if not nbrs:
            return 0.0

        receiver = self.agents[idx]
        decoded_C: List[float] = []

        for j in nbrs:
            sender = self.agents[j]
            msg = self.encode(sender)
            msg_t = self.medium_transform(msg)
            payload = self.decode(receiver, msg_t)
            decoded_C.append(payload["C_in"])

        return sum(decoded_C) / len(decoded_C)

    # -----------------------------------------------------------------
    # Local update proposal
    # -----------------------------------------------------------------
    def propose_local_update(self, idx: int, Cg: float) -> Tuple[float, float]:
        """
        Propose next (A, C) for one agent before validation.

        Default v1 update family:
            A' = A + k_A (1 - A) Cg
            C' = C + k_C A (1 - C) M_i

        where M_i is neighborhood coherence influence.
        """
        agent = self.agents[idx]
        M_i = self.interaction_influence(idx)

        A_next = agent.A + self.k_A * (1.0 - agent.A) * Cg
        C_next = agent.C + self.k_C * agent.A * (1.0 - agent.C) * M_i
        return A_next, C_next

    def update_agents(self, Cg: float) -> None:
        """
        Two-phase commit:
        1. propose all updates from the current state
        2. validate + commit
        """
        proposals = [self.propose_local_update(i, Cg) for i in range(len(self.agents))]

        for agent, (A_next, C_next) in zip(self.agents, proposals):
            agent.history.append("update_A")
            agent.history.append("update_C")
            agent.A = A_next
            agent.C = C_next
            self.validate_agent(agent)

    # -----------------------------------------------------------------
    # Phase / regime update
    # -----------------------------------------------------------------
    def maybe_transition_phase(self, delta3_value: float) -> bool:
        """
        Conservative phase rule.

        - advance if delta3 > +epsilon_phase and not already SOURCE
        - otherwise hold in place

        Future versions can add regression/collapse regimes.
        """
        transitioned = False
        if delta3_value > self.epsilon_phase and self.phase != Phase.SOURCE:
            self.phase = Phase(self.phase + 1)
            transitioned = True
        return transitioned

    # -----------------------------------------------------------------
    # Representation / logging
    # -----------------------------------------------------------------
    def global_state(
        self,
        transitioned: bool,
        Cg: float,
        Ag: float,
        E_coh: float,
        E_bind: float,
        d3: float,
    ) -> dict:
        valid_fraction = 0.0 if not self.agents else sum(1 for a in self.agents if a.valid) / len(self.agents)
        return {
            "tick": self.tick,
            "C_global": Cg,
            "A_global": Ag,
            "E_coh": E_coh,
            "E_bind": E_bind,
            "delta3": d3,
            "phase": int(self.phase),
            "transition": transitioned,
            "mentor": Cg,
            "valid_fraction": valid_fraction,
            "C_values": [a.C for a in self.agents],
            "A_values": [a.A for a in self.agents],
            "ids": [a.id for a in self.agents],
            "dissonance_values": [a.dissonance for a in self.agents],
        }

    def per_agent_state(self) -> Listrows = []
        for i, a in enumerate(self.agents):
            rows.append(
                {
                    "tick": self.tick,
                    "id": a.id,
                    "A": a.A,
                    "C": a.C,
                    "phase": int(a.phase),
                    "valid": a.valid,
                    "dissonance": a.dissonance,
                    "history": list(a.history),
                    "neighbors": self.neighbors_of(i),
                }
            )
        return rows

    # -----------------------------------------------------------------
    # Step / run
    # -----------------------------------------------------------------
    def step(self) -> dict:
        """
        Advance the engine by one tick.

        Tick semantics:
        - compute observables from current state
        - update global phase based on current observables
        - log pre-update global state
        - apply local updates for the next tick
        """
        self.tick += 1

        Cg = self.global_coherence()
        Ag = self.global_activation()
        E_coh = self.coherence_energy(Cg)
        E_bind = self.binding_energy(Cg)
        d3 = self.delta3(E_coh, E_bind)

        transitioned = self.maybe_transition_phase(d3)

        # mirror global phase into local phase in v1
        for a in self.agents:
            a.phase = self.phase

        state = self.global_state(transitioned, Cg, Ag, E_coh, E_bind, d3)
        self.history.append(state)

        # apply local updates for next tick
        self.update_agents(Cg)

        return state

    def run(self, steps: int) -> None:
        for _ in range(steps):
            self.step()

    # -----------------------------------------------------------------
    # JSONL export
    # -----------------------------------------------------------------
    def save_jsonl(self, path: str) -> None:
        with open(path, "w", encoding="utf-8") as f:
            for entry in self.history:
                f.write(json.dumps(entry) + "\n")

    def save_agents_jsonl(self, path: str) -> None:
        """
        Writes the current per-agent state. If you want full historical per-agent
        snapshots, the next step is to store them explicitly inside step().
        """
        with open(path, "w", encoding="utf-8") as f:
            for row in self.per_agent_state():
                f.write(json.dumps(row) + "\n")


# ---------------------------------------------------------------------
# Convenience constructor
# ---------------------------------------------------------------------
def create_kernel_engine(
    n_agents: int = 64,
    initial_A: float = 0.1,
    initial_C: float = 0.1,
    adjacency: Optional[Dict[int, List[int]]] = None,
    **kwargs,
) -> KernelEngine:
    agents = [
        Agent(id=f"agent_{i:02d}", A=initial_A, C=initial_C)
        for i in range(n_agents)
    ]
    engine = KernelEngine(agents=agents, adjacency=adjacency, **kwargs)
    engine.validate_all()
    return engine


if __name__ == "__main__":
    K = create_kernel_engine(n_agents=16)
    K.run(steps=10)
    K.save_jsonl("kernel_universe.jsonl")
