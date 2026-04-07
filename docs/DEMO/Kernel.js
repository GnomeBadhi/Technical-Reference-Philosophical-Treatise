// -----------------------------
// Kernel State and Primitives
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
    }
};

const PRIMITIVES = {
    INQUIRE_STATE: "INQUIRE_STATE",
    ADJUST_CLARITY: "ADJUST_CLARITY",
    ADJUST_BOUNDARY: "ADJUST_BOUNDARY",
    ADJUST_ENTROPY: "ADJUST_ENTROPY",
    SOOTHE: "SOOTHE",
    ACTIVATE: "ACTIVATE",
    REFLECT: "REFLECT",
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

    // clamp
    a.valence = Math.max(-1, Math.min(1, a.valence));
    a.arousal = Math.max(0, Math.min(1, a.arousal));
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

    return `${tone}, ${energy}, confidence ${a.confidence.toFixed(2)}.`;
}

// -----------------------------
// Intent Processing
// -----------------------------

function processIntent(intent, text) {
    // always update affect from the raw text
    updateAffectFromText(text);

    switch (intent) {
        case PRIMITIVES.ADJUST_CLARITY:
            kernelState.clarity = Math.min(1, kernelState.clarity + 0.05);
            kernelState.history.push({ op: "clarity+", text });
            return "I nudged clarity up a bit.";

        case PRIMITIVES.ADJUST_BOUNDARY:
            kernelState.boundary = Math.min(1, kernelState.boundary + 0.05);
            kernelState.history.push({ op: "boundary+", text });
            return "Boundary tightened slightly.";

        case PRIMITIVES.ADJUST_ENTROPY:
            kernelState.entropy = Math.max(0, kernelState.entropy - 0.05);
            kernelState.history.push({ op: "entropy-", text });
            return "Entropy lowered; things should feel a bit more stable.";

        case PRIMITIVES.SOOTHE:
            kernelState.entropy = Math.max(0, kernelState.entropy - 0.03);
            kernelState.affect.arousal = Math.max(0, kernelState.affect.arousal - 0.2);
            kernelState.history.push({ op: "soothe", text });
            return "I’m easing the system—less noise, less demand on you.";

        case PRIMITIVES.ACTIVATE:
            kernelState.clarity = Math.min(1, kernelState.clarity + 0.03);
            kernelState.affect.arousal = Math.min(1, kernelState.affect.arousal + 0.2);
            kernelState.history.push({ op: "activate", text });
            return "I’m adding a bit of activation without blowing the circuits.";

        case PRIMITIVES.INQUIRE_STATE: {
            const a = kernelState.affect;
            const desc = describeAffect(a);
            kernelState.history.push({ op: "inquire_state", text });
            return `Right now I read you as valence ${a.valence.toFixed(2)}, arousal ${a.arousal.toFixed(2)} — ${desc}`;
        }

        case PRIMITIVES.REFLECT:
            kernelState.history.push({ op: "reflect", text });
            return "You’re pushing for coherence under load and still tracking the whole field. That’s not nothing.";

        case PRIMITIVES.UNKNOWN:
        default:
            kernelState.history.push({ op: "unknown", text });
            return "I didn’t map that cleanly to a primitive, but I registered it in the affect vector.";
    }
}
