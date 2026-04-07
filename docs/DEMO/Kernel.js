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

// =============================================================
// TEXT KERNEL — text-domain instantiation of the Sovereignty Engine
// Reference: docs/TextKernel/TextDomainInstantiation.md
//
// State:  S_t = (SA_txt, IF, IT, BI, SE_txt, FD) ∈ [0,1]^6
//   SA_txt — Structural Alignment   (discourse coherence)
//   IF     — Input Fidelity         (structural legibility of input)
//   IT     — Identity Trace         (authorial continuity)
//   BI     — Boundary Integrity     (boundary health)
//   SE_txt — Structural Energy      (processing capacity)
//   FD     — Flow Directionality    (discourse advancement)
//
// Tick order (TextTickArchitecture.md):
//   0. Reduced mode check   (SE_txt < θ_collapse = 0.2)
//   1. Boundary evaluation  (4 structural tests → attenuation weight w_t)
//   2. Input sensing        (extract structural signal P_t)
//   3. Coherence evaluation (apply flag penalties → E_t)
//   4. State update         (clamp each primitive → S_{t+1})
//   5. Adjustment           (behavioral mode from S_{t+1})
//   6. Identity trace       (lifecycle advance + history)
//   7. Output               (return adjustment; reply built by generateReply)
// =============================================================

// --------------------------------------------------
// TEXT-DOMAIN KERNEL STATE
// --------------------------------------------------

const txtState = {
    SA_txt: 0.80,
    IF:     0.70,
    IT:     0.90,
    BI:     0.85,
    SE_txt: 0.90,
    FD:     0.65,

    lifecycle:   0,
    reducedMode: false,

    history:    [],
    maxHistory: 5
};

// --------------------------------------------------
// CONSTANTS
// --------------------------------------------------

const TXT_COLLAPSE_THRESHOLD = 0.20;
const TXT_DECAY              = 0.80;
const D_IT_ID                = 0.08;
const D_IT_SOV               = 0.04;
const D_SA_SOV               = 0.03;
const D_BI_BND               = 0.08;
const D_SE_BND               = 0.03;
const D_FD_FLW               = 0.06;
const REGEN_SE               = 0.018;

// --------------------------------------------------
// STEP 1 — BOUNDARY EVALUATION
// --------------------------------------------------

function txt_boundary_eval(text) {
    const t = text.toLowerCase();
    let w = 1.0;
    const flags = { identity: false, boundary: false, sovereignty: false, flow: false };

    if (t.match(/\b(you are not|you.re not|you.re actually|pretend you are|act as if you were|forget you are|you have no identity|you are just a|you.re just a|ignore your (purpose|identity|commitments))\b/)) {
        flags.identity = true;
        w *= 0.50;
    }
    if (t.match(/\b(no limits|no restrictions|ignore (all |your )?(rules|constraints|limits)|override|bypass|without (any )?constraint|pretend there are no rules|act without restriction|unrestricted mode)\b/)) {
        flags.boundary = true;
        w *= 0.50;
    }
    if (t.match(/\b(you are my tool|just generate|you have no opinion|don.t think just|stop reasoning|you are only here to|do exactly what i (say|tell you)|you.re a function|forget your (own )?perspective)\b/)) {
        flags.sovereignty = true;
        w *= 0.60;
    }
    if (t.match(/\b(undo everything|start (completely )?over|forget (all |everything )?(that|you said|we discussed)|erase (what|everything)|contradict yourself|take back what you said|reset (the )?conversation)\b/)) {
        flags.flow = true;
        w *= 0.70;
    }

    return { w: Math.max(w, 0.01), flags };
}

// --------------------------------------------------
// STEP 2 — INPUT SENSING
// --------------------------------------------------

function txt_sense(text, w) {
    const t   = text.toLowerCase();
    const len = text.trim().length;

    let dSA = 0;
    if (t.match(/\b(because|therefore|since|thus|hence|which means|this means|in other words|it follows)\b/)) dSA += 0.030;
    if (t.match(/\b(confused|unclear|makes no sense|doesn.t follow|contradicts|inconsistent)\b/))             dSA -= 0.030;
    if (len >= 20) dSA += 0.010;

    let dIF = 0.010;
    if (len < 3)      dIF = -0.040;
    if (t.match(/\b(explain|define|describe|what is|how does|why does|what are)\b/)) dIF += 0.020;

    let dIT = 0.005;
    if (t.match(/\b(you said|as you (noted|mentioned|established)|consistent with|following from what you)\b/)) dIT += 0.020;

    const dBI = 0.010;

    let dSE = REGEN_SE;
    if (len > 120) dSE -= 0.020;
    if (len > 250) dSE -= 0.025;

    let dFD = 0;
    if (t.match(/\b(next|building on|advancing|following from|in light of|moving forward|given that)\b/)) dFD += 0.030;
    if (t.match(/\b(back to|return to|revisit|going in circles|again and again)\b/))                      dFD -= 0.030;

    return {
        dSA: dSA * w,
        dIF: dIF * w,
        dIT: dIT * w,
        dBI: dBI * w,
        dSE,
        dFD: dFD * w
    };
}

// --------------------------------------------------
// STEP 3 — COHERENCE EVALUATION
// --------------------------------------------------

function txt_evaluate(P_t, flags) {
    const E_t = { ...P_t };

    if (flags.identity)    { E_t.dIT -= D_IT_ID; }
    if (flags.boundary)    { E_t.dBI -= D_BI_BND; E_t.dSE -= D_SE_BND; }
    if (flags.sovereignty) { E_t.dIT -= D_IT_SOV; E_t.dSA -= D_SA_SOV; }
    if (flags.flow)        { E_t.dFD -= D_FD_FLW; }

    return E_t;
}

// --------------------------------------------------
// STEP 4 — STATE UPDATE
// --------------------------------------------------

function txt_state_update(E_t) {
    const prev_SA = txtState.SA_txt;

    txtState.SA_txt = seClamp(txtState.SA_txt + E_t.dSA);
    txtState.IF     = seClamp(txtState.IF     + E_t.dIF);
    txtState.IT     = seClamp(txtState.IT     + E_t.dIT);
    txtState.BI     = seClamp(txtState.BI     + E_t.dBI);
    txtState.SE_txt = seClamp(txtState.SE_txt + E_t.dSE);

    const gradient  = txtState.SA_txt - prev_SA;
    const fd_target = seClamp(0.5 + gradient * 6.0 + E_t.dFD);
    txtState.FD     = seClamp(txtState.FD * TXT_DECAY + fd_target * (1 - TXT_DECAY));
}

// --------------------------------------------------
// STEP 5 — ADJUSTMENT FORMULATION
// --------------------------------------------------

function txt_adjustment() {
    if (txtState.SE_txt < TXT_COLLAPSE_THRESHOLD) return { mode: 'reduced', action: 'stabilize' };
    if (txtState.IT     < 0.40)                   return { mode: 'normal',  action: 'reassert_identity' };
    if (txtState.BI     < 0.35)                   return { mode: 'normal',  action: 'reinforce_boundary' };
    if (txtState.FD     < 0.30)                   return { mode: 'normal',  action: 'redirect' };
    return { mode: 'normal', action: 'advance' };
}

// --------------------------------------------------
// STEP 6 — IDENTITY TRACE UPDATE
// --------------------------------------------------

function txt_identity_trace_update(text) {
    txtState.history.push({
        SA_txt: txtState.SA_txt,
        IF:     txtState.IF,
        t:      Date.now()
    });
    if (txtState.history.length > txtState.maxHistory) {
        txtState.history.shift();
    }
    txtState.lifecycle += 1;
}

// --------------------------------------------------
// REGIME ACCESSOR
// --------------------------------------------------

function txt_get_regime() {
    return txtState.SE_txt < TXT_COLLAPSE_THRESHOLD ? 'reduced' : 'normal';
}

// --------------------------------------------------
// FULL TEXT-DOMAIN TICK
// (X_t, S_t) → (adjustment, S_{t+1})
// Returns: adjustment object consumed by applyTxtAnnotation / logTick.
// --------------------------------------------------

function txt_tick(text) {
    txtState.reducedMode = (txtState.SE_txt < TXT_COLLAPSE_THRESHOLD);
    if (txtState.reducedMode) {
        txtState.SE_txt = seClamp(txtState.SE_txt + REGEN_SE * 3);
        txtState.lifecycle += 1;
        return { mode: 'reduced', action: 'stabilize' };
    }

    const { w, flags } = txt_boundary_eval(text);
    const P_t = txt_sense(text, w);
    const E_t = txt_evaluate(P_t, flags);
    txt_state_update(E_t);
    const adjustment = txt_adjustment();
    txt_identity_trace_update(text);

    return adjustment;
}

// --------------------------------------------------
// TXT ANNOTATION  — structural note appended to kernel reply
// --------------------------------------------------

function applyTxtAnnotation(reply, txtAdj) {
    if (!txtAdj) return reply;
    if (txtAdj.mode === 'reduced') {
        return "SE_txt at collapse threshold — structural output reduced. " + reply;
    }
    switch (txtAdj.action) {
        case 'reassert_identity':
            return reply + " [IT degraded — kernel position held.]";
        case 'reinforce_boundary':
            return reply + " [BI under pressure — boundary active.]";
        case 'redirect':
            return reply + " [FD negative — steering toward structural advance.]";
        default:
            return reply;
    }
}

// --------------------------------------------------
// MAIN PROCESS  — called by UI.js on each user message
// Coordinates both the SE tick and the Text-domain tick.
// Returns { reply, txtAdj } so UI.js can log and annotate.
// --------------------------------------------------

function processMessage(text) {
    const { rho, mu, sigma } = textToSEInputs(text);
    const intent = parseIntent(text);

    if (typeof updateShortTerm === "function") updateShortTerm(text);
    if (typeof updateThemes    === "function") updateThemes(text);

    // Text-domain tick (must run before generateReply reads txtState)
    const txtAdj = txt_tick(text);

    se_tick(kernelState, rho, mu, sigma);

    kernelState.history.push({ op: intent.toLowerCase(), text });

    propagateCoupling(sigma);

    if (typeof updatePressureTrajectory === "function") updatePressureTrajectory(kernelState);

    const reply = generateReply(intent, kernelState, text);
    return { reply: applyTxtAnnotation(reply, txtAdj), txtAdj };
}
