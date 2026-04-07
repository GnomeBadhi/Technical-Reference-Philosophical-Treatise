// -----------------------------
// Kernel State
// -----------------------------
const kernelState = {
    clarity: 0.80,
    boundary: 0.75,
    entropy: 0.12,
    history: []
};

// -----------------------------
// Intent Parser
// -----------------------------
function parseIntent(text) {
    return {
        type: "QUERY",
        confidence: 0.92,
        raw: text
    };
}

// -----------------------------
// Operators
// -----------------------------
const operators = {
    STABILIZE_CLARITY(state) {
        const before = { ...state };
        state.clarity = Math.min(1, state.clarity + 0.02);
        state.entropy = Math.max(0, state.entropy - 0.01);
        return delta(before, state, "STABILIZE_CLARITY");
    }
};

// -----------------------------
// Delta Generator
// -----------------------------
function delta(before, after, operator) {
    return {
        operator,
        delta: {
            clarity: +(after.clarity - before.clarity).toFixed(3),
            entropy: +(after.entropy - before.entropy).toFixed(3)
        },
        state_after: after
    };
}

// -----------------------------
// Kernel Processor
// -----------------------------
function processIntent(intent) {
    const op = "STABILIZE_CLARITY";
    const result = operators[op](kernelState);
    kernelState.history.push(result);
    return { intent, ...result };
}
const kernelState = {
    clarity: 0.8,
    boundary: 0.75,
    entropy: 0.12,
    history: [],
    affect: {
        valence: 0.0,   // -1 (very negative) to +1 (very positive)
        arousal: 0.0,   // 0 (calm) to 1 (activated)
        confidence: 0.5 // 0–1, how “sure” we are
    }
};
