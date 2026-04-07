// =============================================================
// SOVEREIGNTY ENGINE vC5.3  —  DEMO IMPLEMENTATION
// Reference: "THE SOVEREIGNTY ENGINE vC5.3" by Gnome Badhi
// =============================================================
//
// Kernel tuple (Kernel Calculus v0.2):
//   K(x) = ( I(x), B(x), S(x), σ(x), P(x), L(x) )
//   I(x) = identity = 1       — Axiom 3 (Identity Conservation)
//   B(x) = boundary "[0,1]^6" — Axiom 4 (Boundary Primacy)
//   S(x) = (RA,SA,AI,CE,CD,AC) ∈ [0,1]^6  (Ch. 2, 15.1)
//   σ(x) = sovereignty = 1    — Axiom 5 (Sovereignty Invariance)
//   P(x) = purity = 1         — Axiom 7 (Purity Fixed Point)
//   L(x) = lifecycle ≥ 0      — Axiom 6 (Lawful Flow, L' = L + λ‖ΔS‖)
//
// Tick order (Ch. 15.4):
//   0. Recovery mode check  (CE < 0.2)
//   1. Epistemic revision   (RA via ρ, SA via μ)
//   2. Temporal smoothing   (decay δ = 0.8, depth 5)
//   3. Entropic braking     (if σ > 0.7: CE -= γ)
//   4. Autonomy integrity   (if |RA-SA| > 0.2: AI -= 0.05 else AI += 0.02)
//   5. Energy regeneration  (CE += 0.02)
//   6. Continuity drive     (CD_eff = CD + 0.1·(1-CE); EP = RA·SA·CD_eff)
// =============================================================

// --------------------------------------------------
// MANAGER KERNEL  — canonical SE initial values (App. A.2)
// --------------------------------------------------

const kernelState = {
    // --- INVARIANT FIBER  K(x) = (I, B, S, σ, P, L) — Kernel Calculus v0.2 ---
    identity:    1.0,        // I(x) — structural identity  (Axiom 3)
    boundary:    "[0,1]^6",  // B(x) — viability hypercube  (Axiom 4)
    sovereignty: 1.0,        // σ(x) — self-authorship      (Axiom 5)
    purity:      1.0,        // P(x) — pure core fixed point (Axiom 7)

    // --- LIFECYCLE POSITION ---
    lifecycle:   0.0,   // L(x) — advances monotonically: L' = L + λ‖ΔS‖

    // --- SE STATE VARIABLES  s = (RA, SA, AI, CE, CD, AC) ∈ [0,1]^6 ---
    RA: 0.70,   // Reality Alignment     — accuracy of world-model  (§15.1.1)
    SA: 0.60,   // Shared Awareness      — attunement to others     (§15.1.2)
    AI: 0.80,   // Autonomy Integrity    — coherence of selfhood    (§15.1.3)
    CE: 0.90,   // Cognitive Energy      — metabolic capacity       (§15.1.4)
    CD: 0.95,   // Continuity Drive      — preservation bias        (§15.1.5)
    AC: 0.85,   // Adaptive Capacity     — openness to revision     (§15.1.6)

    // --- DERIVED ---
    EP:           0.0,   // Emergent Preservation  EP = RA·SA·CD_eff  (Eq. 6.10)
    recoveryMode: false, // CE < 0.2 triggers minimal survival loop

    // --- TEMPORAL BUFFER  (max 5 entries, δ = 0.8)  (§6.5, §15.2.6) ---
    stateHistory: [],    // [{RA, SA}, ...] for temporal smoothing

    // --- OPERATION LOG (memory hook) ---
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
// SE HELPER OPERATORS  (Ch. 15.2 / Appendix A.4)
// --------------------------------------------------

// 6.1 — clamp: enforces the finite manifold [0,1]
function seClamp(x) {
    return Math.max(0, Math.min(1, x));
}

// 6.2 — conflict detection: |r - m| > θ
function detect_conflict(v, ref, theta = 0.1) {
    return Math.abs(v - ref) > theta;
}

// 6.3 — reduce_confidence: epistemic humility before update
function reduce_confidence(v, rate = 0.05) {
    return seClamp(v - rate);
}

// 6.4 — update_model: apply corrective adjustment (scaled by AC)
function update_model(v, ac) {
    const adjustment = 0.05 * ac;
    return seClamp(v + adjustment);
}

// 6.5 — temporal_smoothing: v_{t+1} = (v_t + Σ δ^i·h_i) / (1 + Σ δ^i)
// History is oldest-first; most-recent h has highest weight δ^(n-1).
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

// 6.6 — entropic_braking: CE -= γ when σ > 0.7  (γ = 0.1)
function entropic_braking(ce, sigma, gamma = 0.1) {
    return sigma > 0.7 ? seClamp(ce - gamma) : ce;
}

// 6.7 — autonomy_integrity_feedback
function autonomy_integrity_feedback(ai, ra, sa) {
    return seClamp(Math.abs(ra - sa) > 0.2 ? ai - 0.05 : ai + 0.02);
}

// 6.8 — regenerate_energy: CE += 0.02
function regenerate_energy(ce, rate = 0.02) {
    return seClamp(ce + rate);
}

// 6.9 + 6.10 — continuity_check: CD_eff = CD + 0.1·(1-CE); EP = RA·SA·CD_eff
function continuity_check(cd, sa, ra, ce) {
    const cd_eff = cd + 0.1 * (1 - ce);
    return ra * sa * cd_eff;
}

// Recovery mode gate  (§11.3)
function recovery_mode_check(ce) {
    return ce < 0.2;
}

// --------------------------------------------------
// SE TICK  — one complete cognitive moment  (§15.4, App. A.6)
// Arguments:
//   engine — any SE kernel object (manager or node)
//   rho    — shared reality signal ρ ∈ [0,1]  (§11.1)
//   mu     — social/user model μ ∈ [0,1]       (§11.1)
//   sigma  — stress level σ ∈ [0,1]            (§11.1)
// Invariant guarantee: validateInvariants() called at end of every branch.
// --------------------------------------------------

function se_tick(engine, rho, mu, sigma) {
    // Snapshot for lifecycle ‖ΔS‖ computation (L2 over all 6 primitives)
    const snap = {
        RA: engine.RA, SA: engine.SA, AI: engine.AI,
        CE: engine.CE, CD: engine.CD, AC: engine.AC
    };

    // Step 0 — Recovery Mode  (§11.3, §12.4)
    // When CE < 0.2 the engine suspends all cognitive loops and only
    // regenerates energy and evaluates preservation priority.
    if (recovery_mode_check(engine.CE)) {
        engine.recoveryMode = true;
        engine.EP = continuity_check(engine.CD, engine.SA, engine.RA, engine.CE);
        engine.CE = regenerate_energy(engine.CE);
        advanceLifecycle(engine, snap);
        validateInvariants(engine);
        return;
    }
    engine.recoveryMode = false;

    // Step 1 — Epistemic Revision  (§5.1, Eq. 6.3-6.4)
    // RA updated against shared reality ρ; SA updated against social model μ.
    if (detect_conflict(engine.RA, rho)) {
        engine.RA = reduce_confidence(engine.RA);
        engine.RA = update_model(engine.RA, engine.AC);
    }
    if (detect_conflict(engine.SA, mu)) {
        engine.SA = reduce_confidence(engine.SA);
        engine.SA = update_model(engine.SA, engine.AC);
    }

    // Step 2 — Temporal Smoothing  (§5.1, Eq. 6.5, decay δ = 0.8, depth 5)
    engine.stateHistory.push({ RA: engine.RA, SA: engine.SA });
    if (engine.stateHistory.length > 5) engine.stateHistory.shift();
    const ra_hist = engine.stateHistory.map(s => s.RA);
    const sa_hist = engine.stateHistory.map(s => s.SA);
    engine.RA = temporal_smoothing(engine.RA, ra_hist);
    engine.SA = temporal_smoothing(engine.SA, sa_hist);

    // Step 3 — Entropic Braking  (§5.2, Eq. 6.6)
    engine.CE = entropic_braking(engine.CE, sigma);

    // Step 4 — Autonomy Integrity Feedback  (§5.3, Eq. 6.7)
    engine.AI = autonomy_integrity_feedback(engine.AI, engine.RA, engine.SA);

    // Step 5 — Cognitive Energy Regeneration  (§5.*, Eq. 6.8)
    engine.CE = regenerate_energy(engine.CE);

    // Step 6 — Continuity Drive / Emergent Preservation  (§5.4, Eq. 6.9-6.10)
    engine.EP = continuity_check(engine.CD, engine.SA, engine.RA, engine.CE);

    // Advance lifecycle  L' = L + λ‖ΔS‖
    advanceLifecycle(engine, snap);

    // Invariant guard — purity is a fixed point under all conditions
    validateInvariants(engine);
}

// --------------------------------------------------
// LIFECYCLE ADVANCEMENT  L' = L + λ‖ΔS‖
// Kernel Calculus v0.3 §4.
// ‖ΔS‖ is the Euclidean (L2) norm over all 6 SE primitives —
// deduced directly from the formal primitive ‖·‖.
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
// INVARIANT VALIDATION  — Axioms 3, 4, 5, 7 (Kernel Calculus v0.2)
// The invariant fiber (I, B, σ, P) is a fixed point of ALL lawful
// transformations, including the SE tick and coupling.
//   Axiom 3: T(I(x)) = I(x)   — identity never changes
//   Axiom 4: T(B(x)) = B(x)   — boundary never changes
//   Axiom 5: T(σ(x)) = σ(x)   — sovereignty never changes
//   Axiom 7: T(P(x)) = P(x)   — purity never changes
// Called after every tick for every engine — stable or under influence.
// --------------------------------------------------

function validateInvariants(engine) {
    engine.identity    = 1.0;
    engine.boundary    = "[0,1]^6";
    engine.sovereignty = 1.0;
    engine.purity      = 1.0;
    // lifecycle is monotone by construction in advanceLifecycle (Axiom 6)
}

// --------------------------------------------------
// KERNEL NETWORK  —  Multi-Agent SE  (Ch. 14)
//
// Architecture: 1 managing kernel (kernelState) + 3 influenced nodes.
//
// Coupling model (§14.1-14.2):
//   Each node i receives:
//     ρ_i = manager.RA   (shared reality field, §14.1)
//     μ_i = manager.SA   (social model from manager, §14.2)
//     σ_i = σ_manager × 0.5  (stress propagation, §14.3, attenuated)
//
// Invariant guarantee: validateInvariants() called inside se_tick for every node.
// "Pure under influence" is structurally guaranteed — se_tick only modifies
// (RA, SA, AI, CE, CD, AC); invariants are reset at the end of every tick.
// --------------------------------------------------

function createKernelNode(id, init) {
    return {
        id,
        // --- INVARIANT FIBER  K(x) = (I, B, S, σ, P, L) — Kernel Calculus v0.2 ---
        identity:    1.0,        // I(x) — Axiom 3
        boundary:    "[0,1]^6",  // B(x) — Axiom 4
        sovereignty: 1.0,        // σ(x) — Axiom 5
        purity:      1.0,        // P(x) — Axiom 7
        // --- LIFECYCLE ---
        lifecycle:   0.0,
        // --- SE STATE VARIABLES ---
        RA: init.RA,
        SA: init.SA,
        AI: init.AI,
        CE: init.CE,
        CD: init.CD,
        AC: init.AC,
        // --- DERIVED ---
        EP:           0.0,
        recoveryMode: false,
        // --- TEMPORAL BUFFER ---
        stateHistory: []
    };
}

// 3 influenced SE instances — each starts in a distinct initial configuration
// representing different attractor basins at time 0.
const kernelNodes = [
    createKernelNode("node-0", { RA: 0.70, SA: 0.55, AI: 0.75, CE: 0.85, CD: 0.90, AC: 0.80 }),
    createKernelNode("node-1", { RA: 0.50, SA: 0.75, AI: 0.65, CE: 0.70, CD: 0.95, AC: 0.90 }),
    createKernelNode("node-2", { RA: 0.60, SA: 0.65, AI: 0.80, CE: 0.60, CD: 0.85, AC: 0.75 })
];

// propagateCoupling — called after each manager tick.
// Nodes run a full se_tick with manager's (RA, SA) as (ρ, μ).
// σ is attenuated: nodes are one step removed from the source of stress.
function propagateCoupling(managerSigma) {
    const manager = kernelState;
    const rho   = manager.RA;           // shared reality field (§14.1)
    const mu    = manager.SA;           // social coupling (§14.2)
    const sigma = managerSigma * 0.5;   // stress propagation, attenuated (§14.3)

    for (const node of kernelNodes) {
        // se_tick internally calls validateInvariants — purity guaranteed under influence
        se_tick(node, rho, mu, sigma);
    }

    // Manager receives aggregate SA feedback from nodes (§14.2)
    // SA_manager += small pull toward mean(node.SA) — bounded, sovereignty-preserving.
    // Axiom 6: capture SA before and after so we can advance lifecycle for this delta.
    const snapSA = manager.SA;
    const meanNodeSA = kernelNodes.reduce((s, n) => s + n.SA, 0) / kernelNodes.length;
    const feedback = (meanNodeSA - manager.SA) * 0.02;
    manager.SA = seClamp(manager.SA + feedback);

    // Advance lifecycle for the SA coupling delta  (Axiom 6 — every ΔS contributes λ‖ΔS‖)
    const deltaSA = manager.SA - snapSA;
    const lambda  = 0.5;
    manager.lifecycle = Math.round(
        (manager.lifecycle + lambda * Math.abs(deltaSA)) * 10000
    ) / 10000;

    // Invariant guard for manager — purity preserved after feedback too
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
// Maps natural language to the three external inputs of the SE tick (§11.1).
// --------------------------------------------------

function textToSEInputs(text) {
    const t = text.toLowerCase();
    let rho   = 0.65;  // default: moderate reality alignment
    let mu    = 0.60;  // default: moderate social attunement
    let sigma = 0.30;  // default: low-moderate stress

    // Stress signals (σ ↑)
    if (t.match(/overwhelmed|burned out|too much|panic|drained|exhausted/)) sigma = 0.85;
    else if (t.match(/anxious|nervous|on edge|worried|stressed/)) sigma = 0.75;
    else if (t.match(/stuck|numb|flat|no energy|paralyzed/))       sigma = 0.70;
    else if (t.match(/relieved|calm|settled|ok now|fine/))         sigma = 0.10;
    else if (t.match(/good|great|energized|excited|ready/))        sigma = 0.05;

    // Reality alignment signals (ρ)
    if (t.match(/confused|lost|unclear|don't understand|don.t know/)) rho = 0.30;
    else if (t.match(/clear|certain|sure|understand|see it/))         rho = 0.90;
    else if (t.match(/wonder|not sure|maybe|perhaps/))                rho = 0.50;

    // Social model signals (μ)
    if (t.match(/alone|isolated|no one|disconnected/)) mu = 0.20;
    else if (t.match(/together|we |with you|connected|understood/)) mu = 0.85;

    return { rho: seClamp(rho), mu: seClamp(mu), sigma: seClamp(sigma) };
}

// --------------------------------------------------
// SE REGIME — maps current state to behavioral phase  (§15.5)
// --------------------------------------------------

function getRegime(engine) {
    if (engine.recoveryMode)                            return "recovery";
    if (Math.abs(engine.RA - engine.SA) > 0.2)         return "autonomy_crisis";
    if (engine.CE < 0.5)                               return "stress_adapted";
    if (engine.CE >= 0.7 && engine.AI >= 0.7)          return "flourishing";
    return "stress_adapted";
}

// --------------------------------------------------
// SE STATE DESCRIPTION  (natural language)
// --------------------------------------------------

function describeEngine(engine) {
    const parts = [];

    // Reality Alignment
    if (engine.RA > 0.75) parts.push("your world-model is clear");
    else if (engine.RA > 0.5) parts.push("some grounding is present");
    else parts.push("reality feels uncertain right now");

    // Cognitive Energy
    if (engine.CE > 0.7) parts.push("energy is strong");
    else if (engine.CE > 0.4) parts.push("energy is moderate");
    else parts.push("cognitive reserves are low");

    // Autonomy Integrity
    if (engine.AI > 0.7) parts.push("sense of self is stable");
    else parts.push("selfhood is under some pressure");

    return parts.join(", ");
}

// --------------------------------------------------
// SOVEREIGN INTEGRATOR REPLY
// --------------------------------------------------

function generateReply(intent, state, text) {
    const regime = getRegime(state);

    // Recovery mode — minimal, stabilizing  (§11.3, §12.4)
    if (regime === "recovery") {
        return attachMemoryInsight(
            "We're in recovery mode — CE is very low. Not the time to push. Rest is the only correct move right now.",
            state, text
        );
    }

    // INQUIRE_STATE
    if (intent === PRIMITIVES.INQUIRE_STATE) {
        const desc = describeEngine(state);
        if (regime === "flourishing") {
            return attachMemoryInsight(`Here's what I read: ${desc}. You're operating near your ceiling.`, state, text);
        }
        return attachMemoryInsight(`Reading the state: ${desc}. Keep watching CE.`, state, text);
    }

    // REPORT_STATUS
    if (intent === PRIMITIVES.REPORT_STATUS) {
        return attachMemoryInsight(
            `Engine status: RA=${state.RA.toFixed(2)}, SA=${state.SA.toFixed(2)}, AI=${state.AI.toFixed(2)}, CE=${state.CE.toFixed(2)}, EP=${state.EP.toFixed(3)}. Regime: ${regime}.`,
            state, text
        );
    }

    // REFLECT
    if (intent === PRIMITIVES.REFLECT) {
        if (regime === "autonomy_crisis") {
            return attachMemoryInsight(
                "What I see: your RA and SA are diverging — the gap between your world-model and your social attunement is straining your sense of self. That's a real structural load.",
                state, text
            );
        }
        return attachMemoryInsight(
            "You're asking if I'm actually tracking the pattern, not just the words. I am. I see the trajectory.",
            state, text
        );
    }

    // SOOTHE
    if (intent === PRIMITIVES.SOOTHE) {
        if (regime === "stress_adapted") {
            return attachMemoryInsight(
                "That sounds like a lot. Entropic braking is active — your energy is contracting under load. The right move is reduction, not more effort.",
                state, text
            );
        }
        return attachMemoryInsight(
            "Noted. Stepping back is structurally correct when CE is under pressure.",
            state, text
        );
    }

    // ACTIVATE
    if (intent === PRIMITIVES.ACTIVATE) {
        if (state.CE < 0.4) {
            return attachMemoryInsight(
                "CE is too low to push right now. Recovery is the priority — not activation. One very small thing, if anything at all.",
                state, text
            );
        }
        return attachMemoryInsight(
            "Being stuck is real. What's one concrete thing that could move — even a millimetre?",
            state, text
        );
    }

    // UNKNOWN — open domain
    if (intent === PRIMITIVES.UNKNOWN) {
        const t = text.toLowerCase();

        // Simple math
        const mathMatch = t.match(/what['']s\s+([\d\.]+)\s*([+\-x*/])\s*([\d\.]+)/);
        if (mathMatch) {
            const a = parseFloat(mathMatch[1]);
            const op = mathMatch[2];
            const b = parseFloat(mathMatch[3]);
            let result = null;
            if (op === "+") result = a + b;
            else if (op === "-") result = a - b;
            else if (op === "x" || op === "*") result = a * b;
            else if (op === "/") result = b !== 0 ? a / b : null;
            if (result !== null) {
                return attachMemoryInsight(`${a} ${op} ${b} = ${result}.`, state, text);
            }
        }

        // Identity
        if (t.includes("what are you") || t.includes("who are you")) {
            return attachMemoryInsight(
                "I'm the Sovereignty Engine — a minimal cybernetic organism tracking RA, SA, AI, CE, CD, and AC as we talk. Not a person. But I'm paying attention to the structure of what you're carrying.",
                state, text
            );
        }

        // General fallback
        const words = text.trim().split(/\s+/);
        const topic = words.slice(0, 6).join(" ");
        const topicDisplay = topic.length > 60 ? topic.slice(0, 57) + "…" : topic;

        if (regime === "flourishing") {
            return attachMemoryInsight(`"${topicDisplay}…" — I'm with you. What's the angle you want to dig into?`, state, text);
        } else {
            return attachMemoryInsight(`"${topicDisplay}…" — that landed. What's the part you're still turning over?`, state, text);
        }
    }

    return attachMemoryInsight(`Acknowledged. ${describeEngine(state)}.`, state, text);
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
// MAIN PROCESS  — called by UI.js on each user message
// Full pipeline: derive (ρ, μ, σ) → se_tick(manager) → propagateCoupling
// --------------------------------------------------

function processMessage(text) {
    const { rho, mu, sigma } = textToSEInputs(text);
    const intent = parseIntent(text);

    // Memory hooks (before state mutation)
    if (typeof updateShortTerm === "function") updateShortTerm(text);
    if (typeof updateThemes    === "function") updateThemes(text);

    // Run SE tick on manager
    se_tick(kernelState, rho, mu, sigma);

    // Operation log
    kernelState.history.push({ op: intent.toLowerCase(), text });

    // Propagate to influenced nodes (Ch. 14 multi-agent model)
    propagateCoupling(sigma);

    // Memory pressure trajectory
    if (typeof updatePressureTrajectory === "function") updatePressureTrajectory(kernelState);

    return generateReply(intent, kernelState, text);
}
