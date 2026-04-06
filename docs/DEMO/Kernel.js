// ── Primitives ────────────────────────────────────────────────────────
const PRIMITIVES = ["RA", "SA", "AI", "CE", "CD", "AC"];

const PRIMITIVE_NAMES = {
    RA: "Reality Alignment",
    SA: "Shared Awareness",
    AI: "Autonomy Integrity",
    CE: "Cognitive Energy",
    CD: "Continuity Drive",
    AC: "Adaptive Capacity"
};

// ── Kernel State ──────────────────────────────────────────────────────
const kernelState = {
    RA: 0.75,
    SA: 0.68,
    AI: 0.82,
    CE: 0.70,
    CD: 0.65,
    AC: 0.60,
    history: []
};

// ── Helpers ───────────────────────────────────────────────────────────
function clamp(v) { return Math.min(1, Math.max(0, +v.toFixed(3))); }

function snapState(state) {
    const s = {};
    PRIMITIVES.forEach(k => s[k] = state[k]);
    return s;
}

function computeDelta(before, after, operator) {
    const d = {};
    PRIMITIVES.forEach(k => {
        const diff = +(after[k] - before[k]).toFixed(3);
        if (diff !== 0) d[k] = diff;
    });
    return { operator, delta: d, state_after: snapState(after) };
}

// ── Intent Parser ─────────────────────────────────────────────────────
function parseIntent(text) {
    const t = text.toLowerCase();
    if (/align|reality|ground|truth|verify/.test(t))          return { type: "ALIGN_REALITY",    confidence: 0.90 };
    if (/aware|scan|observe|sense|perceive/.test(t))           return { type: "EXPAND_AWARENESS", confidence: 0.88 };
    if (/protect|defend|integrit|autonomy|boundary/.test(t))   return { type: "GUARD_AUTONOMY",   confidence: 0.91 };
    if (/rest|restore|energy|recharge|recover/.test(t))        return { type: "RESTORE_ENERGY",   confidence: 0.87 };
    if (/persist|continue|maintain|drive|sustain/.test(t))     return { type: "DRIVE_CONTINUITY", confidence: 0.85 };
    if (/adapt|change|evolve|learn|grow|expand/.test(t))       return { type: "EXPAND_CAPACITY",  confidence: 0.86 };
    if (/stabilize|calm|balance|reset|normaliz/.test(t))       return { type: "STABILIZE",        confidence: 0.93 };
    return { type: "QUERY", confidence: 0.60 };
}

// ── Operators ─────────────────────────────────────────────────────────
const operators = {
    ALIGN_REALITY(state) {
        const b = snapState(state);
        state.RA = clamp(state.RA + 0.06);
        state.SA = clamp(state.SA + 0.02);
        state.CE = clamp(state.CE - 0.03);
        return computeDelta(b, state, "ALIGN_REALITY");
    },
    EXPAND_AWARENESS(state) {
        const b = snapState(state);
        state.SA = clamp(state.SA + 0.07);
        state.RA = clamp(state.RA + 0.02);
        state.CE = clamp(state.CE - 0.04);
        return computeDelta(b, state, "EXPAND_AWARENESS");
    },
    GUARD_AUTONOMY(state) {
        const b = snapState(state);
        state.AI = clamp(state.AI + 0.06);
        state.CD = clamp(state.CD + 0.02);
        state.CE = clamp(state.CE - 0.03);
        return computeDelta(b, state, "GUARD_AUTONOMY");
    },
    RESTORE_ENERGY(state) {
        const b = snapState(state);
        state.CE = clamp(state.CE + 0.10);
        state.CD = clamp(state.CD + 0.02);
        state.AC = clamp(state.AC + 0.01);
        return computeDelta(b, state, "RESTORE_ENERGY");
    },
    DRIVE_CONTINUITY(state) {
        const b = snapState(state);
        state.CD = clamp(state.CD + 0.07);
        state.AI = clamp(state.AI + 0.02);
        state.CE = clamp(state.CE - 0.03);
        return computeDelta(b, state, "DRIVE_CONTINUITY");
    },
    EXPAND_CAPACITY(state) {
        const b = snapState(state);
        state.AC = clamp(state.AC + 0.08);
        state.CE = clamp(state.CE - 0.05);
        state.RA = clamp(state.RA - 0.01);
        return computeDelta(b, state, "EXPAND_CAPACITY");
    },
    STABILIZE(state) {
        const b = snapState(state);
        const mean = PRIMITIVES.reduce((s, k) => s + state[k], 0) / PRIMITIVES.length;
        PRIMITIVES.forEach(k => { state[k] = clamp(state[k] + (mean - state[k]) * 0.3); });
        return computeDelta(b, state, "STABILIZE");
    },
    QUERY(state) {
        const b = snapState(state);
        state.SA = clamp(state.SA + 0.01);
        state.CE = clamp(state.CE - 0.01);
        return computeDelta(b, state, "QUERY");
    }
};

// ── Kernel Processor ──────────────────────────────────────────────────
function processIntent(text) {
    const intent = parseIntent(text);
    const opName = operators[intent.type] ? intent.type : "QUERY";
    const result = operators[opName](kernelState);
    kernelState.history.push(result);
    return { intent: { type: opName, confidence: intent.confidence, raw: text }, ...result };
}
