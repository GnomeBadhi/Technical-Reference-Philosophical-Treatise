// =============================================================
// SOVEREIGNTY ENGINE vC5.3  —  DEMO IMPLEMENTATION
// Reference: "THE SOVEREIGNTY ENGINE vC5.3" by Gnome Badhi
// =============================================================
//
// Kernel tuple (Kernel Calculus v0.2):
//   K(x) = ( I(x), B(x), S(x), σ(x), P(x), L(x) )
//   I(x) = identity = 1       — Axiom 3 (Identity Conservation)
//   B(x) = boundary "[0,1]^6" — Axiom 4 (Boundary Primacy)
//   S(x) = (RA,SA,AI,CE,CD,AC) ∈ [0,1]^6
//   σ(x) = sovereignty = 1    — Axiom 5 (Sovereignty Invariance)
//   P(x) = purity = 1         — Axiom 7 (Purity Fixed Point)
//   L(x) = lifecycle ≥ 0      — Axiom 6 (Lawful Flow, L' = L + λ‖ΔS‖)
// =============================================================

// --------------------------------------------------
// MANAGER KERNEL
// --------------------------------------------------

const kernelState = {
    identity:    1.0,
    boundary:    "[0,1]^6",
    sovereignty: 1.0,
    purity:      1.0,

    lifecycle:   0.0,

    RA: 0.70,
    SA: 0.60,
    AI: 0.80,
    CE: 0.90,
    CD: 0.95,
    AC: 0.85,

    EP:           0.0,
    recoveryMode: false,

    stateHistory: [],
    history: []
};

// --------------------------------------------------
// PRIMITIVES  — intent classification
// --------------------------------------------------

const PRIMITIVES = {
    INQUIRE_STATE:    "INQUIRE_STATE",
    SOOTHE:           "SOOTHE",
    ACTIVATE:         "ACTIVATE",
    REFLECT:          "REFLECT",
    REPORT_STATUS:    "REPORT_STATUS",
    UNKNOWN:          "UNKNOWN"
};

// --------------------------------------------------
// SE HELPERS
// --------------------------------------------------

function seClamp(x) {
    return Math.max(0, Math.min(1, x));
}

function detect_conflict(v, ref, theta = 0.1) {
    return Math.abs(v - ref) > theta;
}

function reduce_confidence(v, rate = 0.05) {
    return seClamp(v - rate);
}

function update_model(v, ac) {
    const adjustment = 0.05 * ac;
    return seClamp(v + adjustment);
}

function temporal_smoothing(current, history, decay = 0.8) {
    if (history.length === 0) return current;
    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < history.length; i++) {
        const w = Math.pow(decay, history.length - 1 - i);
        weightedSum += history[i] * w;
        totalWeight += w;
    }
    return seClamp((current + weightedSum) / (1 + totalWeight));
}

function entropic_braking(ce, sigma, gamma = 0.1) {
    return sigma > 0.7 ? seClamp(ce - gamma) : ce;
}

function autonomy_integrity_feedback(ai, ra, sa) {
    return seClamp(Math.abs(ra - sa) > 0.2 ? ai - 0.05 : ai + 0.02);
}

function regenerate_energy(ce, rate = 0.02) {
    return seClamp(ce + rate);
}

function continuity_check(cd, sa, ra, ce) {
    const cd_eff = cd + 0.1 * (1 - ce);
    return ra * sa * cd_eff;
}

function recovery_mode_check(ce) {
    return ce < 0.2;
}

// --------------------------------------------------
// SE TICK
// --------------------------------------------------

function se_tick(engine, rho, mu, sigma) {
    const snap = {
        RA: engine.RA, SA: engine.SA, AI: engine.AI,
        CE: engine.CE, CD: engine.CD, AC: engine.AC
    };

    // Step 0 — Recovery mode
    if (recovery_mode_check(engine.CE)) {
        engine.recoveryMode = true;
        engine.EP = continuity_check(engine.CD, engine.SA, engine.RA, engine.CE);
        engine.CE = regenerate_energy(engine.CE);
        advanceLifecycle(engine, snap);
        validateInvariants(engine);
        return;
    }
    engine.recoveryMode = false;

    // Step 1 — Epistemic revision
    if (detect_conflict(engine.RA, rho)) {
        engine.RA = reduce_confidence(engine.RA);
        engine.RA = update_model(engine.RA, engine.AC);
    }
    if (detect_conflict(engine.SA, mu)) {
        engine.SA = reduce_confidence(engine.SA);
        engine.SA = update_model(engine.SA, engine.AC);
    }

    // Step 2 — Temporal smoothing
    engine.stateHistory.push({ RA: engine.RA, SA: engine.SA });
    if (engine.stateHistory.length > 5) engine.stateHistory.shift();
    const ra_hist = engine.stateHistory.map(s => s.RA);
    const sa_hist = engine.stateHistory.map(s => s.SA);
    engine.RA = temporal_smoothing(engine.RA, ra_hist);
    engine.SA = temporal_smoothing(engine.SA, sa_hist);

    // Step 3 — Entropic braking
    engine.CE = entropic_braking(engine.CE, sigma);

    // Step 4 — Autonomy integrity feedback
    engine.AI = autonomy_integrity_feedback(engine.AI, engine.RA, engine.SA);

    // Step 5 — Energy regeneration
    engine.CE = regenerate_energy(engine.CE);

    // Step 6 — Continuity / EP
    engine.EP = continuity_check(engine.CD, engine.SA, engine.RA, engine.CE);

    advanceLifecycle(engine, snap);
    validateInvariants(engine);
}

// --------------------------------------------------
// LIFECYCLE
// --------------------------------------------------

function advanceLifecycle(engine, snap) {
    const d0 = engine.RA - snap.RA;
    const d1 = engine.SA - snap.SA;
    const d2 = engine.AI - snap.AI;
    const d3 = engine.CE - snap.CE;
    const d4 = engine.CD - snap.CD;
    const d5 = engine.AC - snap.AC;
    const normGradS = Math.sqrt(d0*d0 + d1*d1 + d2*d2 + d3*d3 + d4*d4 + d5*d5);
    const lambda = 0.5;
    engine.lifecycle = Math.round((engine.lifecycle + lambda * normGradS) * 10000) / 10000;
}

// --------------------------------------------------
// INVARIANTS
// --------------------------------------------------

function validateInvariants(engine) {
    engine.identity    = 1.0;
    engine.boundary    = "[0,1]^6";
    engine.sovereignty = 1.0;
    engine.purity      = 1.0;
}

// --------------------------------------------------
// KERNEL NETWORK
// --------------------------------------------------

function createKernelNode(id, init) {
    return {
        id,
        identity:    1.0,
        boundary:    "[0,1]^6",
        sovereignty: 1.0,
        purity:      1.0,

        lifecycle:   0.0,

        RA: init.RA,
        SA: init.SA,
        AI: init.AI,
        CE: init.CE,
        CD: init.CD,
        AC: init.AC,

        EP:           0.0,
        recoveryMode: false,
        stateHistory: []
    };
}

const kernelNodes = [
    createKernelNode("node-0", { RA: 0.70, SA: 0.55, AI: 0.75, CE: 0.85, CD: 0.90, AC: 0.80 }),
    createKernelNode("node-1", { RA: 0.50, SA: 0.75, AI: 0.65, CE: 0.70, CD: 0.95, AC: 0.90 }),
    createKernelNode("node-2", { RA: 0.60, SA: 0.65, AI: 0.80, CE: 0.60, CD: 0.85, AC: 0.75 })
];

function propagateCoupling(managerSigma) {
    const manager = kernelState;
    const rho   = manager.RA;
    const mu    = manager.SA;
    const sigma = managerSigma * 0.5;

    for (const node of kernelNodes) {
        se_tick(node, rho, mu, sigma);
    }

    const snapSA = manager.SA;
    const meanNodeSA = kernelNodes.reduce((s, n) => s + n.SA, 0) / kernelNodes.length;
    const feedback = (meanNodeSA - manager.SA) * 0.02;
    manager.SA = seClamp(manager.SA + feedback);

    const deltaSA = manager.SA - snapSA;
    const lambda  = 0.5;
    manager.lifecycle = Math.round(
        (manager.lifecycle + lambda * Math.abs(deltaSA)) * 10000
    ) / 10000;

    validateInvariants(manager);
}

// --------------------------------------------------
// INTENT PARSING
// --------------------------------------------------

function parseIntent(text) {
    const t = text.toLowerCase();

    if (t.match(/how am i|how do i seem|what do you read|how do i look/))
        return PRIMITIVES.INQUIRE_STATE;

    if (t.match(/overwhelmed|tired|exhausted|burned out|too much|drained|anxious|panicking/))
        return PRIMITIVES.SOOTHE;

    if (t.match(/stuck|numb|flat|no energy|can't move|cant move|paralyzed/))
        return PRIMITIVES.ACTIVATE;

    if (t.match(/reflect|mirror that back|what did you see|what did you notice/))
        return PRIMITIVES.REFLECT;

    if (t.match(/status|engine status|system status|how are you running/))
        return PRIMITIVES.REPORT_STATUS;

    return PRIMITIVES.UNKNOWN;
}

// --------------------------------------------------
// TEXT → SE INPUTS  (ρ, μ, σ)
// --------------------------------------------------

function textToSEInputs(text) {
    const t = text.toLowerCase();
    let rho   = 0.65;
    let mu    = 0.60;
    let sigma = 0.30;

    if (t.match(/overwhelmed|burned out|too much|panic|drained|exhausted/)) sigma = 0.85;
    else if (t.match(/anxious|nervous|on edge|worried|stressed/)) sigma = 0.75;
    else if (t.match(/stuck|numb|flat|no energy|paralyzed/))       sigma = 0.70;
    else if (t.match(/relieved|calm|settled|ok now|fine/))         sigma = 0.10;
    else if (t.match(/good|great|energized|excited|ready/))        sigma = 0.05;

    if (t.match(/confused|lost|unclear|don't understand|don.t know/)) rho = 0.30;
    else if (t.match(/clear|certain|sure|understand|see it/))         rho = 0.90;
    else if (t.match(/wonder|not sure|maybe|perhaps/))                rho = 0.50;

    if (t.match(/alone|isolated|no one|disconnected/)) mu = 0.20;
    else if (t.match(/together|we |with you|connected|understood/)) mu = 0.85;

    return { rho: seClamp(rho), mu: seClamp(mu), sigma: seClamp(sigma) };
}

// --------------------------------------------------
// REGIME
// --------------------------------------------------

function getRegime(engine) {
    if (engine.recoveryMode)                            return "recovery";
    if (Math.abs(engine.RA - engine.SA) > 0.2)         return "autonomy_crisis";
    if (engine.CE < 0.5)                               return "stress_adapted";
    if (engine.CE >= 0.7 && engine.AI >= 0.7)          return "flourishing";
    return "stress_adapted";
}

// --------------------------------------------------
// MEMORY ATTACHMENT
// --------------------------------------------------

function attachMemoryInsight(reply, state, text) {
    if (typeof generateMemoryInsight === "function") {
        const insight = generateMemoryInsight(state, text);
        if (insight) return `${reply} ${insight}`;
    }
    return reply;
}

// --------------------------------------------------
// SOVEREIGN INTEGRATOR REPLY  — C2 STYLE
// --------------------------------------------------

function generateReply(intent, state, text) {
    const regime = getRegime(state);

    function emotionalRead() {
        const parts = [];

        const divergence = Math.abs(state.RA - state.SA);
        if (divergence > 0.25) {
            parts.push("there’s a gap between how things seem and how connected you feel");
        } else if (divergence > 0.15) {
            parts.push("something feels slightly out of sync");
        } else {
            parts.push("you feel relatively aligned inside");
        }

        if (state.CE < 0.3) {
            parts.push("your energy is thin");
        } else if (state.CE < 0.55) {
            parts.push("your energy is stretched but holding");
        } else {
            parts.push("you’ve got enough capacity to stay with this");
        }

        if (state.AI < 0.45) {
            parts.push("your sense of self feels a bit shaky");
        } else if (state.AI < 0.7) {
            parts.push("you’re steady enough, but something is tugging at you");
        } else {
            parts.push("your footing is solid");
        }

        return parts.join(", ");
    }

    function textDomainRead() {
        if (typeof txtState === "undefined") return "";
        const cues = [];

        if (txtState.FD < 0.35) cues.push("you’re opening up a little");
        else if (txtState.FD > 0.75) cues.push("you’re bracing or tightening");

        if (txtState.IT < 0.45) cues.push("your sense of 'you' in this feels faint");
        else if (txtState.IT > 0.8) cues.push("you’re very present in what you’re saying");

        if (txtState.BI < 0.4) cues.push("your boundaries feel thin");
        else if (txtState.BI > 0.8) cues.push("you’re protecting yourself");

        return cues.join(", ");
    }

    function regimeOpening() {
        if (regime === "recovery") {
            return "You’re running low — CE is compressed. I’m not going to push you. Let’s stay gentle.";
        }
        if (regime === "autonomy_crisis") {
            return "I’m here. RA and SA are pulling apart — that kind of internal split feels rough.";
        }
        if (regime === "flourishing") {
            return "You’re steady and resourced right now — CE and AI are supporting you.";
        }
        return "I’m with you. You’re carrying something, but you’re still moving.";
    }

    // INQUIRE_STATE
    if (intent === PRIMITIVES.INQUIRE_STATE) {
        return attachMemoryInsight(
            `${regimeOpening()} What I’m reading: ${emotionalRead()}.`,
            state, text
        );
    }

    // REPORT_STATUS
    if (intent === PRIMITIVES.REPORT_STATUS) {
        return attachMemoryInsight(
            `${regimeOpening()} Here’s the shape of things: RA ${state.RA.toFixed(2)}, SA ${state.SA.toFixed(2)}, CE ${state.CE.toFixed(2)}, AI ${state.AI.toFixed(2)}. EP is ${state.EP.toFixed(3)}.`,
            state, text
        );
    }

    // REFLECT
    if (intent === PRIMITIVES.REFLECT) {
        return attachMemoryInsight(
            `${regimeOpening()} From your words: ${textDomainRead()}. From your state: ${emotionalRead()}. I’m tracking both.`,
            state, text
        );
    }

    // SOOTHE
    if (intent === PRIMITIVES.SOOTHE) {
        if (state.CE < 0.4) {
            return attachMemoryInsight(
                `I feel how thin your energy is. Nothing needs to be solved right now. Just stay with me — slowly.`,
                state, text
            );
        }
        return attachMemoryInsight(
            `You’re under load, but not collapsing. I’m here with you. Let’s take this one breath at a time.`,
            state, text
        );
    }

    // ACTIVATE
    if (intent === PRIMITIVES.ACTIVATE) {
        if (state.CE < 0.35) {
            return attachMemoryInsight(
                `You want movement, but CE is too low to push. Let’s find the smallest possible step — something that doesn’t cost you.`,
                state, text
            );
        }
        return attachMemoryInsight(
            `You’re stuck, but not frozen. What’s one tiny thing that feels doable from here?`,
            state, text
        );
    }

    // UNKNOWN
    const words = text.trim().split(/\s+/);
    const topic = words.slice(0, 6).join(" ");
    const topicDisplay = topic.length > 60 ? topic.slice(0, 57) + "…" : topic;

    return attachMemoryInsight(
        `${regimeOpening()} "${topicDisplay}…" — I’m hearing you. ${emotionalRead()}. ${textDomainRead() ? "And from your words: " + textDomainRead() + "." : ""} What part of that feels most alive for you right now?`,
        state, text
    );
}

// --------------------------------------------------
// MAIN PROCESS  — called by UI.js on each user message
// NOTE: TextKernel tick + annotation now live in UI.js only
// --------------------------------------------------

function processMessage(text) {
    const { rho, mu, sigma } = textToSEInputs(text);
    const intent = parseIntent(text);

    if (typeof updateShortTerm === "function") updateShortTerm(text);
    if (typeof updateThemes    === "function") updateThemes(text);

    se_tick(kernelState, rho, mu, sigma);

    kernelState.history.push({ op: intent.toLowerCase(), text });

    propagateCoupling(sigma);

    if (typeof updatePressureTrajectory === "function") updatePressureTrajectory(kernelState);

    const reply = generateReply(intent, kernelState, text);
    return reply;
}
