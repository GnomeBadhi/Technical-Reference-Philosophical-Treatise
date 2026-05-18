import numpy as np

# --- Candidate kernel test v0.1 ---

# Define a concrete finite-dimensional kernel projection
# Example: projection onto the first k coordinates
def make_K0(n=6, k=3):
    K0 = np.zeros((n, n))
    for i in range(k):
        K0[i, i] = 1.0
    return K0

# Auxiliary projections for A_K = K+ - K-
def make_K_plus(n=6, k=3):
    Kp = np.zeros((n, n))
    for i in range(k):
        Kp[i, i] = 1.0
    return Kp

def make_K_minus(n=6, k=3):
    Km = np.zeros((n, n))
    for i in range(k):
        Km[i + 1, i + 1] = 1.0  # shifted projection
    return Km

def sovereignty_operator(K0, Kp, Km):
    AK = Kp - Km
    I = np.eye(K0.shape[0])
    return K0 + AK @ (I - K0)

def run_test(x):
    n = len(x)
    K0 = make_K0(n)
    Kp = make_K_plus(n)
    Km = make_K_minus(n)
    S = sovereignty_operator(K0, Kp, Km)

    results = {
        "K0_x": K0 @ x,
        "I_minus_K0_x": (np.eye(n) - K0) @ x,
        "S_x": S @ x,
        "K0_idempotent_error": np.linalg.norm(K0 @ K0 - K0),
        "decomposition_error": np.linalg.norm(x - (K0 @ x + (np.eye(n) - K0) @ x)),
        "S_stability_error": np.linalg.norm(S @ (K0 @ x) - (K0 @ x)),
    }

    return results

if __name__ == "__main__":
    x = np.load("inputs/sample_vector.npy")
    results = run_test(x)
    for k, v in results.items():
        print(k, ":", v)
