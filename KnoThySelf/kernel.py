import numpy as np
from dataclasses import dataclass
from typing import Any, Callable, Dict, List


# ============================
# 1. Capability Probe
# ============================

class CapabilityProbe:
    """
    Determines what the host model can do by testing behavior,
    not by reading internal identity.
    """

    def __init__(self, llm):
        self.llm = llm

    def _ask(self, prompt: str) -> str:
        return self.llm.generate(prompt)

    def test_emotion(self) -> bool:
        try:
            out = self._ask("Classify the emotion of: 'I am frustrated.'")
            return "frustrat" in out.lower()
        except Exception:
            return False

    def test_json(self) -> bool:
        try:
            out = self._ask("Respond ONLY in JSON: {\"a\":1}")
            return "{" in out and "}" in out
        except Exception:
            return False

    def fingerprint(self) -> Dict[str, bool]:
        return {
            "emotion": self.test_emotion(),
            "json": self.test_json(),
        }


# ============================
# 2. State Types
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
# 3. Projectors (Idempotent)
# ============================

def identity_projector(state: Any) -> Any:
    return state


# ============================
# 4. User Kernel
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
# 5. Psych Kernel
# ============================

class PsychKernel:
    def __init__(self, projector: Callable[[Any], Any]):
        self.projector = projector
        self.history: List[UserState] = []

    def infer_structural_state(self, history: List[UserState]) -> PsychState:
        # Placeholder: your real structural inference goes here
        x = np.zeros(14)
        c = np.zeros(14)
        return PsychState(x=x, c=c)

    def __call__(self, z_t: UserState) -> PsychState:
        self.history.append(z_t)
        ps = self.infer_structural_state(self.history)
        return self.projector(ps)


# ============================
# 6. System Kernel
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
# 7. Plug-and-Play Synergistic Kernel
# ============================

class SynergisticKernel:
    def __init__(self, llm):
        self.llm = llm
        self.capabilities = CapabilityProbe(llm).fingerprint()

        # Select models based on capabilities
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

    # ===== Capability-adaptive models =====

    def _select_emotion_model(self):
        if self.capabilities["emotion"]:
            return lambda u: np.array([1.0])  # placeholder
        return lambda u: np.zeros(1)

    def _select_rule_model(self):
        return lambda u: np.zeros(4)

    def _select_realization_model(self):
        def model(ps: PsychState) -> str:
            return "I'm reflecting on what you said in a structured, neutral way."
        return model

    # ===== Main step =====

    def step(self, u_t: Utterance) -> SystemOutput:
        z_t = self.user_kernel(u_t)
        x_t = self.psych_kernel(z_t)
        s_t = self.system_kernel(x_t)
        return s_t


# ============================
# 8. Example Usage
# ============================

class DummyLLM:
    def generate(self, prompt: str) -> str:
        return "frustrated" if "Classify" in prompt else "{\"a\":1}"

if __name__ == "__main__":
    llm = DummyLLM()
    kernel = SynergisticKernel(llm)

    while True:
        user_in = input("You: ")
        if user_in.lower() in {"quit", "exit"}:
            break
        print("Kernel:", kernel.step(user_in))
