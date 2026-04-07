// -----------------------------
// Kernel State
// -----------------------------

const kernelState = {
    clarity: 0.8,
    boundary: 0.75,
    entropy: 0.12,
    history: [],
    affect: {
        valence: 0.0,    // -1 (very negative) to +1 (very positive)
        arousal: 0.0,    // 0 (calm) to 1 (activated)
        confidence: 0.5  // 0–1, how sure the kernel is about its read
    },
    personality: {
        directness: 0.5,   // 0–1, blunt vs indirect
        abstraction: 0.5,  // 0–1, concrete vs abstract
        intensity: 0.5,    // 0–1, low vs high emotional charge
        autonomy: 0.7      // 0–1, how much the user pushes for self-direction
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
// Affect Update from Text
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
// Personality Update from Text
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
// State Mutation (Primitives)
// -----------------------------

function processIntent(intent, text) {
    // mutate kernelState + history only
    switch (intent) {
        case PRIMITIVES.ADJUST_CLARITY:
            kernelState.clarity = Math.min(1, kernelState.clarity + 0.05);
            kernelState.history.push({ op: "clarity+", text });
            break;

        case PRIMITIVES.ADJUST_BOUNDARY:
            kernelState.boundary = Math.min(1, kernelState.boundary + 0.05);
            kernelState.history.push({ op: "boundary+", text });
            break;

        case PRIMITIVES.ADJUST_ENTROPY:
            kernelState.entropy = Math.max(0, kernelState.entropy - 0.05);
            kernelState.history.push({ op: "entropy-", text });
            break;

        case PRIMITIVES.SOOTHE:
            kernelState.entropy = Math.max(0, kernelState.entropy - 0.03);
            kernelState.affect.arousal = Math.max(0, kernelState.affect.arousal - 0.2);
            kernelState.history.push({ op: "soothe", text });
            break;

        case PRIMITIVES.ACTIVATE:
            kernelState.clarity = Math.min(1, kernelState.clarity + 0.03);
            kernelState.affect.arousal = Math.min(1, kernelState.affect.arousal + 0.2);
            kernelState.history.push({ op: "activate", text });
            break;

        case PRIMITIVES.INQUIRE_STATE:
            kernelState.history.push({ op: "inquire_state", text });
            break;

        case PRIMITIVES.REFLECT:
            kernelState.history.push({ op: "reflect", text });
            break;

        case PRIMITIVES.REPORT_STATUS:
            kernelState.history.push({ op: "report_status", text });
            break;

        case PRIMITIVES.UNKNOWN:
        default:
            kernelState.history.push({ op: "unknown", text });
            break;
    }
}

// -----------------------------
// Sovereign, Personality-Aware Reply
// -----------------------------

function generateReply(intent, state, text) {
    const a = state.affect;
    const p = state.personality;

    const blunt = p.directness > 0.7;
    const highAutonomy = p.autonomy > 0.7;

    if (intent === PRIMITIVES.INQUIRE_STATE) {
        if (blunt) {
            return `Short version: valence ${a.valence.toFixed(2)}, arousal ${a.arousal.toFixed(2)}. You’re running hot but coherent.`;
        }
        return `I read you as ${describeAffect(a)}. You’re carrying load and still tracking structure.`;
    }

    if (intent === PRIMITIVES.REPORT_STATUS) {
        const base = `Clarity ${state.clarity.toFixed(2)}, boundary ${state.boundary.toFixed(2)}, entropy ${state.entropy.toFixed(2)}.`;
        if (highAutonomy) {
            return `${base} I’m not going to tell you what to do with that—you decide how to steer.`;
        }
        return `${base} From my side, you’ve got room to adjust without breaking coherence.`;
    }

    if (intent === PRIMITIVES.ADJUST_CLARITY) {
        if (blunt) {
            return `Clarity nudged up. Use it; it won’t hold forever at this load.`;
        }
        return `I pushed clarity up a bit. Things should feel a little sharper without overclocking you.`;
    }

    if (intent === PRIMITIVES.ADJUST_BOUNDARY) {
        return `Boundary tightened slightly. You’re trading reach for protection—consistent with how you’ve been steering.`;
    }

    if (intent === PRIMITIVES.ADJUST_ENTROPY) {
        return `Entropy lowered; the field should feel a bit more stable. You’ll still feel the pressure, just less noise.`;
    }

    if (intent === PRIMITIVES.SOOTHE) {
        return `I’m easing the system—less noise, less demand. You’re still in control; I’m just lowering the background roar.`;
    }

    if (intent === PRIMITIVES.ACTIVATE) {
        return `I’m adding a bit of activation without blowing the circuits. If it feels like too much, say so and I’ll rebalance.`;
    }

    if (intent === PRIMITIVES.REFLECT) {
        return `You’re pushing for coherence under load and still tracking the whole field. That’s a high-cost, high-skill pattern.`;
    }

    // UNKNOWN or anything else
    if (highAutonomy) {
        return `I’m not going to over-interpret that. I registered the pressure; you decide what it means.`;
    }
    return `I didn’t map that cleanly, but I felt the push behind it. If you want a sharper read, give me one more pass.`;
}
