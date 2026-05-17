import tkinter as tk
from tkinter import scrolledtext

from kernel import SynergisticKernel
from llm_wrapper import LLMWrapper
from openai import OpenAI


class KernelGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Synergistic Kernel Interface")

        # Chat display
        self.chat_window = scrolledtext.ScrolledText(
            root, wrap=tk.WORD, width=80, height=25, state="disabled"
        )
        self.chat_window.grid(row=0, column=0, columnspan=2, padx=10, pady=10)

        # User input
        self.user_input = tk.Entry(root, width=70)
        self.user_input.grid(row=1, column=0, padx=10, pady=10)
        self.user_input.bind("<Return>", self.send_message)

        # Send button
        self.send_button = tk.Button(root, text="Send", command=self.send_message)
        self.send_button.grid(row=1, column=1, padx=10, pady=10)

        # Initialize kernel + model
        client = OpenAI()
        llm = LLMWrapper(client)
        self.kernel = SynergisticKernel(llm)

        self._post_system(
            f"[Kernel initialized — model class: {self.kernel.model_class}]"
        )

    def _post_user(self, text):
        self.chat_window.config(state="normal")
        self.chat_window.insert(tk.END, f"You: {text}\n")
        self.chat_window.config(state="disabled")
        self.chat_window.yview(tk.END)

    def _post_system(self, text):
        self.chat_window.config(state="normal")
        self.chat_window.insert(tk.END, f"Kernel: {text}\n")
        self.chat_window.config(state="disabled")
        self.chat_window.yview(tk.END)

    def send_message(self, event=None):
        user_text = self.user_input.get().strip()
        if not user_text:
            return

        self._post_user(user_text)
        self.user_input.delete(0, tk.END)

        # Kernel response
        reply = self.kernel.step(user_text)
        self._post_system(reply)


if __name__ == "__main__":
    root = tk.Tk()
    gui = KernelGUI(root)
    root.mainloop()
