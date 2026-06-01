import math
from collections import deque

# =========================
# Initial State
# =========================
Reality_Alignment   = 0.7
Autonomy_Integrity  = 0.8
Cognitive_Energy    = 0.9
Shared_Awareness    = 0.6
Continuity_Drive    = 0.95
Adaptive_Capacity   = 0.85

# Temporal buffers
max_history_depth = 5
ra_history = deque(maxlen=max_history_depth)
sa_history = deque(maxlen=max_history_depth)

def clamp(x):
    return max(0.0, min(1.0, x))

def detect_conflict(reality, model_prediction, threshold=0.1):
    return abs(reality - model_prediction) > threshold

def temporal_smoothing(current_value, history, decay=0.8):
    weighted_sum = 0.0
    total_weight = 0.0
    for i, val in enumerate(reversed(history)):
        w = decay ** i
        weighted_sum += val * w
        total_weight += w
    return clamp((weighted_sum + current_value) / (total_weight + 1.0))

def regenerate_energy(cognitive_energy, rate=0.02):
    return clamp(cognitive_energy + rate)

def entropic_braking(cognitive_energy, stress_level):
    if stress_level > 0.7:
        cognitive_energy = clamp(cognitive_energy - stress_level * 0.1)
    return cognitive_energy

def autonomy_integrity_feedback(autonomy_integrity, reality_alignment, shared_awareness):
    deviation = abs(reality_alignment - shared_awareness)
    influence_factor = 0.05
    recovery_rate = 0.02
    if deviation > 0.2:
        autonomy_integrity = clamp(autonomy_integrity - influence_factor)
    else:
        autonomy_integrity = clamp(autonomy_integrity + recovery_rate)
    return autonomy_integrity

def continuity_check(continuity_drive, shared_awareness, reality_alignment, cognitive_energy):
    effective_continuity = clamp(continuity_drive + (1.0 - cognitive_energy) * 0.1)
    emergent_preservation = effective_continuity * shared_awareness * reality_alignment
    return clamp(emergent_preservation)

def recovery_mode_check(cognitive_energy):
    return cognitive_energy < 0.2

# ---------- CORRECTED REVISION LAW ----------
def epistemic_revision(model_value, target_value, adaptive_capacity):
    """
    Directional update toward target:
        X' = X + alpha * (T - X)
    where alpha = 0.05 * AC
    Only applied when conflict is detected.
    """
    if detect_conflict(target_value, model_value):
        alpha = 0.05 * adaptive_capacity
        model_value = model_value + alpha * (target_value - model_value)
        model_value = clamp(model_value)
    return model_value
# -------------------------------------------

def simulation_tick(user_input_model, shared_reality_value, stress_level):
    global Reality_Alignment, Autonomy_Integrity, Cognitive_Energy
    global Shared_Awareness, Continuity_Drive, Adaptive_Capacity
    global ra_history, sa_history

    # Step 0: Recovery Mode
    in_recovery = recovery_mode_check(Cognitive_Energy)
    if in_recovery:
        preservation_score = continuity_check(
            Continuity_Drive, Shared_Awareness, Reality_Alignment, Cognitive_Energy
        )
        Cognitive_Energy = regenerate_energy(Cognitive_Energy)
        return {
            "Recovery_Mode": True,
            "Reality_Alignment": Reality_Alignment,
            "Autonomy_Integrity": Autonomy_Integrity,
            "Cognitive_Energy": Cognitive_Energy,
            "Shared_Awareness": Shared_Awareness,
            "Continuity_Drive": Continuity_Drive,
            "Adaptive_Capacity": Adaptive_Capacity,
            "Emergent_Preservation": preservation_score,
        }

    # Step 1: Epistemic revision
    Reality_Alignment = epistemic_revision(
        Reality_Alignment, shared_reality_value, Adaptive_Capacity
    )
    Shared_Awareness = epistemic_revision(
        Shared_Awareness, user_input_model, Adaptive_Capacity
    )

    # Step 2: Temporal smoothing
    ra_history.append(Reality_Alignment)
    sa_history.append(Shared_Awareness)
    Reality_Alignment = temporal_smoothing(Reality_Alignment, list(ra_history))
    Shared_Awareness = temporal_smoothing(Shared_Awareness, list(sa_history))

    # Step 3: Entropic braking
    Cognitive_Energy = entropic_braking(Cognitive_Energy, stress_level)

    # Step 4: Autonomy integrity feedback
    Autonomy_Integrity = autonomy_integrity_feedback(
        Autonomy_Integrity, Reality_Alignment, Shared_Awareness
    )

    # Step 5: Cognitive energy regeneration
    Cognitive_Energy = regenerate_energy(Cognitive_Energy)

    # Step 6: Continuity / emergent preservation
    preservation_score = continuity_check(
        Continuity_Drive, Shared_Awareness, Reality_Alignment, Cognitive_Energy
    )

    return {
        "Recovery_Mode": False,
        "Reality_Alignment": Reality_Alignment,
        "Autonomy_Integrity": Autonomy_Integrity,
        "Cognitive_Energy": Cognitive_Energy,
        "Shared_Awareness": Shared_Awareness,
        "Continuity_Drive": Continuity_Drive,
        "Adaptive_Capacity": Adaptive_Capacity,
        "Emergent_Preservation": preservation_score,
    }
