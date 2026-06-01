def stress_schedule(t):
    # Low stress initially, then a burst, then back down
    if 40 <= t < 70:
        return 1.0   # high stress burst
    else:
        return 0.2   # baseline stress

def reality_schedule(t):
    # Shared reality drifts upward slightly over time
    return clamp(0.7 + 0.002 * t)

def user_model_schedule(t):
    # User model is somewhat misaligned and drifts downward
    return clamp(0.6 - 0.002 * t)

def run_simulation(steps=150):
    log = []
    for t in range(steps):
        S = stress_schedule(t)
        R = reality_schedule(t)
        U = user_model_schedule(t)
        obs = simulation_tick(U, R, S)
        obs["t"] = t
        obs["Stress"] = S
        obs["Reality_Input"] = R
        obs["User_Input"] = U
        log.append(obs)
    return log

if __name__ == "__main__":
    log = run_simulation(steps=150)

    # Print a compact CSV-like view of key variables
    print("t,Stress,Recovery,RA,SA,CE,AI,EP")
    for row in log:
        print(
            f"{row['t']},"
            f"{row['Stress']:.2f},"
            f"{int(row['Recovery_Mode'])},"
            f"{row['Reality_Alignment']:.3f},"
            f"{row['Shared_Awareness']:.3f},"
            f"{row['Cognitive_Energy']:.3f},"
            f"{row['Autonomy_Integrity']:.3f},"
            f"{row['Emergent_Preservation']:.3f}"
        )
