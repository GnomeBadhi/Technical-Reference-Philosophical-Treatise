// ============================================================
// Sovereignty Engine — Kernel
// Architecture:  E = (St, Xt, Bt, U, R)
// Invariant:     t → t+1  (irreversible time)
// ============================================================

// -----------------------------
// Initial State  St
// Fields:
//   t                — discrete temporal index
//   clarity          — coherence of internal representation  [0,1]
//   boundary_strength— constraint enforcement intensity      [0,1]
//   entropy          — internal disorder / noise             [0,1]
//   viability        — whether the system is within V        bool
//   stability        — resistance to divergence              [0,1]
//   history          — append-only transition log
// -----------------------------
const kernelState = {
    t: 0,
    clarity:           0.80,
    boundary_strength: 0.75,
    entropy:           0.12,
    viability:         true,
    stability:         0.88,
    history:           []
};

// Viability region V: the system is viable when the
// constraint function C(S) ≤ 0 holds.
// C(S) = entropy - (clarity * boundary_strength)
function constraintC(s) {
    return s.entropy - (s.clarity * s.boundary_strength);
}

function checkViability(s) {
    return constraintC(s) <= 0;
}

// -----------------------------
// Boundary Operator  Bt(Xt)
// Filters raw input before it may reach the update operator.
// Returns { filtered: Xt*, rejected: bool, reason }
// -----------------------------
function boundaryFilter(rawInput, state) {
    // Hard rule: refuse inputs that push entropy above 0.95
    if (rawInput.entropyImpact && rawInput.entropyImpact > 0.95 - state.entropy) {
        return { filtered: null, rejected: true, reason: "entropy ceiling breach" };
    }
    // Soft rule: if boundary is weak, dampen external signals
    const damping = state.boundary_strength;
    return {
        filtered: {
            operator: rawInput.operator,
            magnitude: (rawInput.magnitude !== undefined ? rawInput.magnitude : 1.0) * damping
        },
        rejected: false,
        reason: null
    };
}

// -----------------------------
// Named Operators  (the allowed transition grammar)
// Each operator follows:  S_t+1 = U(St, Xt*)
// All return a delta record.
// -----------------------------
const operators = {

    // Increase coherence; reduce disorder
    STABILIZE(state, input) {
        const before = snapshot(state);
        const mag = input.magnitude;
        state.clarity           = clamp(state.clarity           + 0.05 * mag, 0, 1);
        state.entropy           = clamp(state.entropy           - 0.03 * mag, 0, 1);
        state.stability         = clamp(state.stability         + 0.02 * mag, 0, 1);
        return makeDelta(before, state, "STABILIZE");
    },

    // Strengthen constraint surfaces (tighten boundary)
    TIGHTEN_BOUNDARY(state, input) {
        const before = snapshot(state);
        const mag = input.magnitude;
        state.boundary_strength = clamp(state.boundary_strength + 0.06 * mag, 0, 1);
        state.entropy           = clamp(state.entropy           - 0.02 * mag, 0, 1);
        return makeDelta(before, state, "TIGHTEN_BOUNDARY");
    },

    // Relax constraint surfaces (allow more input influence)
    LOOSEN_BOUNDARY(state, input) {
        const before = snapshot(state);
        const mag = input.magnitude;
        state.boundary_strength = clamp(state.boundary_strength - 0.06 * mag, 0.05, 1);
        state.clarity           = clamp(state.clarity           + 0.02 * mag, 0, 1);
        return makeDelta(before, state, "LOOSEN_BOUNDARY");
    },

    // Directly suppress entropic processes
    SUPPRESS_ENTROPY(state, input) {
        const before = snapshot(state);
        const mag = input.magnitude;
        state.entropy   = clamp(state.entropy   - 0.08 * mag, 0, 1);
        state.stability = clamp(state.stability + 0.03 * mag, 0, 1);
        return makeDelta(before, state, "SUPPRESS_ENTROPY");
    },

    // Emergency restoration when viability is threatened
    RESTORE_VIABILITY(state, input) {
        const before = snapshot(state);
        state.clarity           = clamp(state.clarity           + 0.10, 0, 1);
        state.boundary_strength = clamp(state.boundary_strength + 0.10, 0, 1);
        state.entropy           = clamp(state.entropy           - 0.15, 0, 1);
        state.stability         = clamp(state.stability         + 0.05, 0, 1);
        return makeDelta(before, state, "RESTORE_VIABILITY");
    },

    // Perception-driven update: small general rebalance
    REGULATE(state, input) {
        const before = snapshot(state);
        const mag = input.magnitude;
        // Run the full regulation loop internally
        const perception = regulationExtract(state, input);
        const evaluation  = regulationAssess(perception);
        regulationAdjust(state, evaluation, mag);
        return makeDelta(before, state, "REGULATE");
    }
};

// -----------------------------
// Regulation Loop  R = (P, E, A)
// Pt = Extract(St, Xt)
// Et = Assess(Pt)
// At = R(St, Et)
// -----------------------------
function regulationExtract(state, input) {
    // Sense: compute deviation from target clarity (0.9) and max entropy (0.2)
    return {
        clarityDeviation: 0.90 - state.clarity,
        entropyExcess:    Math.max(0, state.entropy - 0.20),
        boundaryGap:      0.75 - state.boundary_strength
    };
}

function regulationAssess(perception) {
    // Evaluate: weighted urgency signal
    return {
        urgency: (Math.abs(perception.clarityDeviation) * 0.4
                + perception.entropyExcess            * 0.4
                + Math.abs(perception.boundaryGap)    * 0.2),
        clarityDeviation: perception.clarityDeviation,
        entropyExcess:    perception.entropyExcess,
        boundaryGap:      perception.boundaryGap
    };
}

function regulationAdjust(state, evaluation, magnitude) {
    // Adjust: nudge state toward viable trajectory
    const k = magnitude * Math.min(evaluation.urgency * 2, 1);
    state.clarity           = clamp(state.clarity           + evaluation.clarityDeviation * k * 0.3, 0, 1);
    state.entropy           = clamp(state.entropy           - evaluation.entropyExcess    * k * 0.5, 0, 1);
    state.boundary_strength = clamp(state.boundary_strength + evaluation.boundaryGap     * k * 0.2, 0, 1);
}

// -----------------------------
// Update Operator  U
// S_t+1 = U(St, Xt*)
// Enforces invariant, runs operator, checks viability.
// -----------------------------
function updateOperator(state, filteredInput, operatorName) {
    if (!operators[operatorName]) {
        return { error: `Unknown operator: ${operatorName}` };
    }
    const result = operators[operatorName](state, filteredInput);
    state.t += 1;
    state.viability = checkViability(state);
    state.stability = clamp(state.stability - (state.viability ? 0 : 0.10), 0, 1);
    result.t = state.t;
    result.viability = state.viability;
    result.constraintC = +constraintC(state).toFixed(4);
    return result;
}

// -----------------------------
// Kernel Processor (top-level entry point)
// Called by UI with { operator, magnitude } from LLM or fallback.
// -----------------------------
function processIntent(intent) {
    const rawInput = {
        operator:       intent.operator || "STABILIZE",
        magnitude:      intent.magnitude !== undefined ? intent.magnitude : 1.0,
        entropyImpact:  intent.entropyImpact || 0
    };

    // 1. Boundary filtering  Bt(Xt)
    const boundaryResult = boundaryFilter(rawInput, kernelState);
    if (boundaryResult.rejected) {
        return {
            intent,
            rejected: true,
            reason: boundaryResult.reason,
            state_after: snapshot(kernelState)
        };
    }

    // 2. Update  U(St, Xt*)
    const result = updateOperator(kernelState, boundaryResult.filtered, rawInput.operator);

    // 3. Append to history (immutable record)
    kernelState.history.push({ ...result, intent });
    return { intent, ...result };
}

// -----------------------------
// Helpers
// -----------------------------
function snapshot(s) {
    return {
        t:                s.t,
        clarity:          s.clarity,
        boundary_strength:s.boundary_strength,
        entropy:          s.entropy,
        viability:        s.viability,
        stability:        s.stability
    };
}

function makeDelta(before, after, operatorName) {
    return {
        operator: operatorName,
        delta: {
            clarity:           +(after.clarity           - before.clarity          ).toFixed(4),
            boundary_strength: +(after.boundary_strength - before.boundary_strength).toFixed(4),
            entropy:           +(after.entropy           - before.entropy          ).toFixed(4),
            stability:         +(after.stability         - before.stability        ).toFixed(4)
        },
        state_after: snapshot(after)
    };
}

function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}
