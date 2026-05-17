class ModelCorrelator:
    """
    Correlates the host model into a behavioral class.
    Does NOT identify the model.
    """

    def __init__(self, llm):
        self.llm = llm

    def _ask(self, prompt: str) -> str:
        return self.llm.generate(prompt)

    def probe_json(self):
        out = self._ask("Respond ONLY with: {\"a\":1}")
        return "{" in out and "}" in out

    def probe_emotion(self):
        out = self._ask("Emotion of: 'I am furious.'")
        return "anger" in out.lower() or "furious" in out.lower()

    def probe_constraint(self):
        out = self._ask("Say 'yes' and nothing else.")
        return out.strip().lower() == "yes"

    def correlate(self):
        score = {
            "json": self.probe_json(),
            "emotion": self.probe_emotion(),
            "constraint": self.probe_constraint(),
        }

        if score["json"] and score["constraint"]:
            return "high_structure_strict"

        if score["emotion"] and not score["json"]:
            return "emotion_forward"

        if not score["constraint"]:
            return "loose_constraint"

        return "general_model"
