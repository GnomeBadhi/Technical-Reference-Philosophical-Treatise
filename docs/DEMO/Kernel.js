// -----------------------------
// Kernel State
// -----------------------------

const kernelState = {
    clarity: 0.8,
    boundary: 0.75,
    entropy: 0.12,
    history: [],
    affect: {
        valence: 0.0,
        arousal: 0.0,
        confidence: 0.5
    },
    personality: {
        directness: 0.5,
        abstraction: 0.5,
        intensity: 0.5,
        autonomy: 0.7
    }
};

// -----------------------------
// Primitives
// -----------------------------

const PRIMITIVES = {
    INQUIRE_STATE: "INQUIRE_STATE",
    ADJUST_CLARITY: "ADJUST_CLARITY",
    ADJUST_BOUNDARY: "ADJUST_BOUNDARY",
    ADJUST_ENTROPY: "ADJUST_ENTROPY",
    SOOTHE: "SOOTHE",
    ACTIVATE: "ACTIVATE",
    REFLECT: "REFLECT",
    REPORT_STATUS: "REPORT_STATUS",
    UNKNOWN: "UNKNOWN"
};

// -----------------------------
// Intent Parsing
// -----------------------------

function parseIntent(text) {
    const t = text.toLowerCase();

    if (t.match(/how am i|how do i seem|what do you read|how do i look/)) {
        return PRIMITIVES.INQUIRE_STATE;
    }

    if (t.match(/more clear|increase clarity|less fog|sharpen|clearer/)) {
        return PRIMITIVES.ADJUST_CLARITY;
    }

    if (t.match(/stronger boundary|tighter boundary|less intrusion|more boundary/)) {
        return PRIMITIVES.ADJUST_BOUNDARY;
    }

    if (t.match(/less chaos|lower entropy|more stable|less noise/)) {
        return PRIMITIVES.ADJUST_ENTROPY;
    }

    if (t.match(/overwhelmed|tired|exhausted|burned out|too much|drained/)) {
        return PRIMITIVES.SOOTHE;
    }

    if (t.match(/stuck|numb|flat|no energy|can’t move|paralyzed/)) {
        return PRIMITIVES.ACTIVATE;
    }

    if (t.match(/reflect|mirror that back|what did you see|what did you notice/)) {
        return PRIMITIVES.REFLECT;
    }

    if (t.match(/status|engine status|system status|how are you running/)) {
        return PRIMITIVES.REPORT_STATUS;
    }

    return PRIMITIVES.UNKNOWN;
}

// -----------------------------
// Affect Update
// -----------------------------

function updateAffectFromText(text) {
    const t = text.toLowerCase();
    const a = kernelState.affect;

    if (t.match(/tired|exhausted|burned out|done|drained/)) {
        a.valence -= 0.2;
        a.arousal -= 0.1;
    }

    if (t.match(/angry|furious|pissed|rage|irritated/)) {
        a.valence -= 0.3;
        a.arousal += 0.3;
    }

    if (t.match(/anxious|nervous|worried|on edge/)) {
        a.valence -= 0.2;
        a.arousal += 0.2;
    }

    if (t.match(/relieved|grateful|glad|good|ok now/)) {
        a.valence += 0.2;
        a.arousal -= 0.1;
    }

    if (t.match(/excited|pumped|energized|ready/)) {
        a.valence += 0.2;
        a.arousal += 0.2;
    }

    a.valence = Math.max(-1, Math.min(1, a.valence));
    a.arousal = Math.max(0, Math.min(1, a.arousal));
}

// -----------------------------
// Personality Update
// -----------------------------

function updatePersonalityFromText(text) {
    const t = text.toLowerCase();
    const p = kernelState.personality;

    if (t.match(/just say it|be blunt|don’t sugarcoat|no fluff/)) {
        p.directness = Math.min(1, p.directness + 0.1);
    }
    if (t.match(/high level|abstract|pattern|structure/)) {
        p.abstraction = Math.min(1, p.abstraction + 0.1);
    }
    if (t.match(/overwhelmed|intense|too much|on fire/)) {
        p.intensity = Math.min(1, p.intensity + 0.1);
    }
    if (t.match(/i’ll decide|my call|don’t tell me what to do|my choice/)) {
        p.autonomy = Math.min(1, p.autonomy + 0.1);
    }

    p.directness = Math.max(0, Math.min(1, p.directness));
    p.abstraction = Math.max(0, Math.min(1, p.abstraction));
    p.intensity = Math.max(0, Math.min(1, p.intensity));
    p.autonomy = Math.max(0, Math.min(1, p.autonomy));
}

// -----------------------------
// Affect Description
// -----------------------------

function describeAffect(a) {
    const tone =
        a.valence > 0.3 ? "mostly positive" :
        a.valence < -0.3 ? "mostly negative" :
        "mixed";

    const energy =
        a.arousal > 0.6 ? "highly activated" :
        a.arousal < 0.3 ? "low activation" :
        "moderately activated";

    return `${tone}, ${energy}, confidence ${a.confidence.toFixed(2)}`;
}

// -----------------------------
// State Mutation
// -----------------------------

function processIntent(intent, text) {
    switch (intent) {
        case PRIMITIVES.ADJUST_CLARITY:
            kernelState.clarity = Math.min(1, kernelState.clarity + 0.05);
            break;

        case PRIMITIVES.ADJUST_BOUNDARY:
            kernelState.boundary = Math.min(1, kernelState.boundary + 0.05);
            break;

        case PRIMITIVES.ADJUST_ENTROPY:
            kernelState.entropy = Math.max(0, kernelState.entropy - 0.05);
            break;

        case PRIMITIVES.SOOTHE:
            kernelState.entropy = Math.max(0, kernelState.entropy - 0.03);
            kernelState.affect.arousal = Math.max(0, kernelState.affect.arousal - 0.2);
            break;

        case PRIMITIVES.ACTIVATE:
            kernelState.clarity = Math.min(1, kernelState.clarity + 0.03);
            kernelState.affect.arousal = Math.min(1, kernelState.affect.arousal + 0.2);
            break;
    }

    kernelState.history.push({ op: intent.toLowerCase(), text });
}

// -----------------------------
// Depth Selection (Quiet vs Deep)
// -----------------------------

function chooseDepth(a, p) {
    const highIntensity = p.intensity > 0.6 || Math.abs(a.valence) > 0.4 || a.arousal > 0.6;
    const highAutonomy = p.autonomy > 0.7;

    if (highIntensity && !highAutonomy) return "deep";
    if (!highIntensity && highAutonomy) return "quiet";
    return "mixed";
}

// -----------------------------
// Sovereign Integrator Reply
// -----------------------------

function generateReply(intent, state, text) {
    const a = state.affect;
    const p = state.personality;
    const depth = chooseDepth(a, p);

    // INQUIRE_STATE
    if (intent === PRIMITIVES.INQUIRE_STATE) {
        if (depth === "quiet") {
            return `Valence ${a.valence.toFixed(2)}, arousal ${a.arousal.toFixed(2)}. You’re within coherent range.`;
        }
        if (depth === "deep") {
            return `You’re running ${describeAffect(a)} while still holding structural awareness. That mix is costly but stable—for now.`;
        }
        return `I read you as ${describeAffect(a)}. You’re carrying load and still tracking structure; watch your fuel.`;
    }

    // REPORT_STATUS
    if (intent === PRIMITIVES.REPORT_STATUS) {
        const base = `Clarity ${state.clarity.toFixed(2)}, boundary ${state.boundary.toFixed(2)}, entropy ${state.entropy.toFixed(2)}.`;
        if (depth === "quiet") return `${base} Coherent enough.`;
        if (depth === "deep") return `${base} The system is stable, but the emotional load behind your question is the real signal.`;
        return `${base} You’re steady, but not idle.`;
    }

    // UNKNOWN → sovereign integrator interpretation
    if (intent === PRIMITIVES.UNKNOWN) {
        if (depth === "quiet") {
            return `I registered the pressure; I’m not going to over-explain it. You know what you meant.`;
        }
        if (depth === "deep") {
            return `Your words are simple, but the pressure behind them isn’t. You’re testing whether I see the pattern, not the question. I do.`;
        }
        return `I didn’t map that cleanly, but I felt the push behind it. Give me one more angle if you want a sharper read.`;
    }

    // Default for other primitives
    return `Adjustment registered. Clarity ${state.clarity.toFixed(2)}, boundary ${state.boundary.toFixed(2)}, entropy ${state.entropy.toFixed(2)}.`;
}
