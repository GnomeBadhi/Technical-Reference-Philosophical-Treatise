import numpy as np
from dataclasses import dataclass
from typing import Any, Callable, Dict, List

from correlator import ModelCorrelator


# ============================
# State Types
# ============================

Utterance = str
SystemOutput = str


@dataclass
class UserState:
    emotions: np.ndarray
    rules: np.ndarray


@dataclass
class PsychState:
    x: np.ndarray
    c: np.ndarray


# ============================
# Projectors (Idempotent)
# ============================

def identity_projector(state: Any) -> Any:
    return state


# ============================
# User Kernel
# ============================

class UserKernel:
    def __init__(
        self,
        emotion_model: Callable[[Utterance], np.ndarray],
        rule_model: Callable[[Utterance], np.ndarray],
        projector: Callable[[Any], Any],
    ):
        self.emotion_model = emotion_model
        self.rule_model = rule_model
        self.projector = projector

    def __call__(self, u_t: Utterance) -> UserState:
        e_t = self.emotion_model(u_t)
        r_t = self.rule_model(u_t)
        z = UserState(emotions=e_t, rules=r_t)
        return self.projector(z)


# ============================
# Psych Kernel
# ============================

class PsychKernel:
    def __init__(self, projector: Callable[[Any], Any]):
        self.projector = projector
        self.history: List[UserState] = []

    def infer_structural_state(self, history: List[UserState]) -> PsychState:
        x = np.zeros(14)
        c = np.zeros(14)
        return PsychState(x=x, c=c)

    def __call__(self, z_t: UserState) -> PsychState:
        self.history.append(z_t)
        ps = self.infer_structural_state(self.history)
        return self.projector(ps)


# ============================
# System Kernel
# ============================

class SystemKernel:
    def __init__(
        self,
        realization_model: Callable[[PsychState], SystemOutput],
        projector: Callable[[Any], Any],
    ):
        self.realization_model = realization_model
        self.projector = projector

    def __call__(self, psych_state: PsychState) -> SystemOutput:
        ps = self.projector(psych_state)
        return self.realization_model(ps)


# ============================
# Synergistic Kernel (Integrated)
# ============================

class SynergisticKernel:
    def __init__(self, llm):
        self.llm = llm

        # Behavioral correlation
        self.model_class = ModelCorrelator(llm).correlate()

        # Adaptive model selection
        self.user_kernel = UserKernel(
            emotion_model=self._select_emotion_model(),
            rule_model=self._select_rule_model(),
            projector=identity_projector,
        )

        self.psych_kernel = PsychKernel(
            projector=identity_projector,
        )

        self.system_kernel = SystemKernel(
            realization_model=self._select_realization_model(),
            projector=identity_projector,
        )

    # ===== Adaptive Models =====

    def _select_emotion_model(self):
        if self.model_class == "emotion_forward":
            return lambda u: np.array([1.0])
        return lambda u: np.zeros(1)

    def _select_rule_model(self):
        return lambda u: np.zeros(4)

    def _select_realization_model(self):
        if self.model_class == "high_structure_strict":
            return lambda ps: "{\"response\": \"Structured reflection.\"}"
        return lambda ps: "I'm reflecting on what you said in a structured, neutral way."

    # ===== Main Step =====

    def step(self, u_t: Utterance) -> SystemOutput:
        z_t = self.user_kernel(u_t)
        x_t = self.psych_kernel(z_t)
        s_t = self.system_kernel(x_t)
        return s_t
