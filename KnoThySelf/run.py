from kernel import SynergisticKernel
from llm_wrapper import LLMWrapper
from openai import OpenAI

def main():
    client = OpenAI()
    llm = LLMWrapper(client)
    kernel = SynergisticKernel(llm)

    print("Synergistic Kernel ready.")

    while True:
        user_in = input("You: ")
        if user_in.lower() in {"quit", "exit"}:
            break
        reply = kernel.step(user_in)
        print("Kernel:", reply)

if __name__ == "__main__":
    main()
