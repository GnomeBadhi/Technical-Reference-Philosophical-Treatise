class LLMWrapper:
    """
    Wraps any LLM into a simple .generate(prompt) interface.
    """

    def __init__(self, client):
        self.client = client

    def generate(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message["content"]
