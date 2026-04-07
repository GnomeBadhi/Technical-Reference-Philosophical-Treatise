// --------------------------------------------------
// SOVEREIGN KERNEL STATE
// K(x) = (I, B, S, σ, P, L)  — Kernel Calculus v0.3
// --------------------------------------------------

const kernelState = {
    // --- FORMAL INVARIANTS (Axioms 3, 4, 5, 7) ---
    // These are fixed points of all lawful transformations.
    // No operation may alter them. validateInvariants() enforces this.
    identity:    1.0,   // I(x) — structural identity, fixed at instantiation (Axiom 3)
    sovereignty: 1.0,   // σ(x) — authorship and agency, conserved (Axiom 5)
    purity:      1.0,   // P(x) — pure core fixed point, cannot be degraded (Axiom 7)

    // --- FORMAL VARIABLE: Lifecycle Position L(x) ---
    // Monotonically advancing with structural change: L' = L + λ‖∇S‖ (Axiom 6)
    lifecycle:   0.0,

    // --- STATE VARIABLES S(x) ---
    // The only components allowed to change via lawful operators.
    clarity:     0.8,
    boundary:    0.75,  // state representation of boundary integrity (not the operator B_t)
    entropy:     0.12,
    history:  [],
    affect: {
        valence:    0.0,
        arousal:    0.0,
        confidence: 0.5
    },
    personality: {
        directness:  0.5,
        abstraction: 0.5,
        intensity:   0.5,
        autonomy:    0.7
    }
};

// --------------------------------------------------
// PRIMITIVES
// --------------------------------------------------

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

// --------------------------------------------------
// INTENT PARSING
// --------------------------------------------------

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

    if (t.match(/stuck|numb|flat|no energy|can’t move|cant move|paralyzed/)) {
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

// --------------------------------------------------
// BOUNDARY OPERATOR  B_t : X_t → X_t*
// Sovereignty Engine formal operator (ArchitectureSpec §4)
// Filters raw input based on current boundary integrity state.
// Strong boundary (→1.0) moderates affect; weak boundary (→0.0) amplifies it.
// --------------------------------------------------

function applyBoundaryFilter(text, state) {
    // gain factor: how strongly raw input bleeds into affect
    // strong boundary → 0.5 gain (moderated); weak boundary → 1.0 gain (amplified)
    const gain = 0.5 + (1 - state.boundary) * 0.5;
    return { text, gain };
}

// --------------------------------------------------
// EVALUATION OPERATOR  E_t = Assess(P_t)
// Regulation Loop phase 2 (RegulationLoopSpec §4)
// Assesses the significance of the perceived intent given current load.
// --------------------------------------------------

function evaluatePerception(intent, filteredInput, state) {
    const load = Math.abs(state.affect.valence) + state.affect.arousal + state.entropy;
    const significance = Math.min(1, (load / 2.5) * filteredInput.gain);
    return { intent, significance, gain: filteredInput.gain };
}

// --------------------------------------------------
// LIFECYCLE ADVANCEMENT  L' = L + λ‖∇S‖
// Kernel Calculus v0.3 §4 — lifecycle is monotonically advancing.
// ‖ΔS‖ is the Euclidean (L2) norm of the state change vector —
// derived directly from the formal primitive ‖·‖.
// --------------------------------------------------

function advanceLifecycle(state, snapshot) {
    const d0 = state.clarity            - snapshot.clarity;
    const d1 = state.boundary           - snapshot.boundary;
    const d2 = state.entropy            - snapshot.entropy;
    const d3 = state.affect.valence     - snapshot.valence;
    const d4 = state.affect.arousal     - snapshot.arousal;
    const normGradS = Math.sqrt(d0*d0 + d1*d1 + d2*d2 + d3*d3 + d4*d4);
    const lambda = 0.5;
    state.lifecycle = Math.round((state.lifecycle + lambda * normGradS) * 10000) / 10000;
}

// --------------------------------------------------
// INVARIANT VALIDATION  — Axioms 3, 4, 5, 7
// The formal invariants (I, σ, P) are fixed points of all lawful transformations.
// This guard ensures no operation inadvertently alters them.
// --------------------------------------------------

function validateInvariants(state) {
    state.identity    = 1.0;
    state.sovereignty = 1.0;
    state.purity      = 1.0;
    // lifecycle is monotone by construction in advanceLifecycle
}

// --------------------------------------------------
// KERNEL NETWORK  —  Kernel Field Equation
// StructuredTheoryOfEverything.md §660–699
//
// Architecture: 1 managing kernel (kernelState) + 3 adjacent nodes.
// Field equation per node x with adjacency set Adj(x):
//   dS(x)/dτ = ∇S(x) + Σ_{y∈Adj(x)} C(x,y)
//
// The manager is adjacent to all 3 nodes.
// Each node is adjacent only to the manager.
// --------------------------------------------------

function createKernelNode(id, init) {
    return {
        id,
        // --- FORMAL INVARIANTS ---
        identity:    1.0,
        sovereignty: 1.0,
        purity:      1.0,
        // --- LIFECYCLE ---
        lifecycle:   0.0,
        // --- STATE VARIABLES ---
        clarity:     init.clarity,
        boundary:    init.boundary,
        entropy:     init.entropy,
        affect: { valence: 0.0, arousal: 0.0, confidence: 0.5 },
        // baseline for homeostatic ∇S (intrinsic structural gradient of the node)
        baseline: { clarity: init.clarity, boundary: init.boundary, entropy: init.entropy }
    };
}

// 3 kernel instances under influence of the manager
const kernelNodes = [
    createKernelNode("node-0", { clarity: 0.70, boundary: 0.60, entropy: 0.20 }),
    createKernelNode("node-1", { clarity: 0.50, boundary: 0.80, entropy: 0.30 }),
    createKernelNode("node-2", { clarity: 0.60, boundary: 0.55, entropy: 0.15 })
];

// C(x, y, alpha): lawful coupling operator — influence on x from adjacency with y.
// Satisfies: identity preservation, boundary preservation, sovereignty, purity.
// Coupling is constrained by both boundary integrities (permeability).
// dS(x)/dτ contribution: alpha * (S(y) - S(x)) * permeability
function couplingOperator(x, y, alpha) {
    const permeability = Math.min(x.boundary, y.boundary);
    const scale = alpha * permeability;
    return {
        clarity:  (y.clarity  - x.clarity)  * scale,
        boundary: (y.boundary - x.boundary) * scale,
        entropy:  (y.entropy  - x.entropy)  * scale,
        valence:  (y.affect.valence - x.affect.valence) * scale,
        arousal:  (y.affect.arousal - x.affect.arousal) * scale
    };
}

// Homeostatic structural gradient ∇S for nodes — intrinsic drift toward baseline.
// Represents the node's own lawful flow direction absent external coupling.
const DRIFT = 0.015;
function homoeostaticGradient(node) {
    return {
        clarity:  (node.baseline.clarity  - node.clarity)  * DRIFT,
        boundary: (node.baseline.boundary - node.boundary) * DRIFT,
        entropy:  (node.baseline.entropy  - node.entropy)  * DRIFT
    };
}

// propagateCoupling — applies the Kernel Field Equation after each manager update.
// Manager-to-node coupling (strong, α=0.12): manager dominates influenced nodes.
// Node-to-manager coupling (weak, α=0.02): nodes provide feedback to manager.
const ALPHA_MANAGE = 0.12;
const ALPHA_FEEDBACK = 0.02;

function propagateCoupling() {
    const manager = kernelState;

    // Accumulate node→manager feedback: Σ C(manager, node_j)
    let fbClarity = 0, fbBoundary = 0, fbEntropy = 0;

    for (const node of kernelNodes) {
        // Snapshot before mutation (for lifecycle ‖ΔS‖)
        const snap = {
            clarity:  node.clarity,
            boundary: node.boundary,
            entropy:  node.entropy,
            valence:  node.affect.valence,
            arousal:  node.affect.arousal
        };

        // dS(node)/dτ = ∇S(node) [homeostatic] + C(node, manager) [coupling]
        const drift = homoeostaticGradient(node);
        const coup  = couplingOperator(node, manager, ALPHA_MANAGE);

        node.clarity  = Math.max(0, Math.min(1, node.clarity  + drift.clarity  + coup.clarity));
        node.boundary = Math.max(0, Math.min(1, node.boundary + drift.boundary + coup.boundary));
        node.entropy  = Math.max(0, Math.min(1, node.entropy  + drift.entropy  + coup.entropy));
        node.affect.valence = Math.max(-1, Math.min(1, node.affect.valence + coup.valence));
        node.affect.arousal = Math.max( 0, Math.min(1, node.affect.arousal + coup.arousal));

        advanceLifecycle(node, snap);
        validateInvariants(node);

        // Accumulate feedback coupling: C(manager, node_j)
        const fb = couplingOperator(manager, node, ALPHA_FEEDBACK);
        fbClarity  += fb.clarity;
        fbBoundary += fb.boundary;
        fbEntropy  += fb.entropy;
    }

    // Apply aggregated node feedback to manager (dS(manager)/dτ += Σ C(manager, node_j))
    // Snapshot for lifecycle already taken in processIntent before this call.
    manager.clarity  = Math.max(0, Math.min(1, manager.clarity  + fbClarity));
    manager.boundary = Math.max(0, Math.min(1, manager.boundary + fbBoundary));
    manager.entropy  = Math.max(0, Math.min(1, manager.entropy  + fbEntropy));
}

// --------------------------------------------------
// AFFECT UPDATE  (scaled by boundary gain from B_t)
// --------------------------------------------------

function updateAffectFromText(text, gain = 1.0) {
    const t = text.toLowerCase();
    const a = kernelState.affect;

    if (t.match(/tired|exhausted|burned out|done|drained/)) {
        a.valence -= 0.2 * gain;
        a.arousal -= 0.1 * gain;
    }

    if (t.match(/angry|furious|pissed|rage|irritated/)) {
        a.valence -= 0.3 * gain;
        a.arousal += 0.3 * gain;
    }

    if (t.match(/anxious|nervous|worried|on edge/)) {
        a.valence -= 0.2 * gain;
        a.arousal += 0.2 * gain;
    }

    if (t.match(/relieved|grateful|glad|good|ok now/)) {
        a.valence += 0.2 * gain;
        a.arousal -= 0.1 * gain;
    }

    if (t.match(/excited|pumped|energized|ready/)) {
        a.valence += 0.2 * gain;
        a.arousal += 0.2 * gain;
    }

    a.valence = Math.max(-1, Math.min(1, a.valence));
    a.arousal = Math.max(0, Math.min(1, a.arousal));
}

// --------------------------------------------------
// PERSONALITY UPDATE
// --------------------------------------------------

function updatePersonalityFromText(text) {
    const t = text.toLowerCase();
    const p = kernelState.personality;

    if (t.match(/just say it|be blunt|don’t sugarcoat|dont sugarcoat|no fluff/)) {
        p.directness = Math.min(1, p.directness + 0.1);
    }
    if (t.match(/high level|abstract|pattern|structure/)) {
        p.abstraction = Math.min(1, p.abstraction + 0.1);
    }
    if (t.match(/overwhelmed|intense|too much|on fire/)) {
        p.intensity = Math.min(1, p.intensity + 0.1);
    }
    if (t.match(/i’ll decide|ill decide|my call|don’t tell me what to do|dont tell me what to do|my choice/)) {
        p.autonomy = Math.min(1, p.autonomy + 0.1);
    }

    p.directness = Math.max(0, Math.min(1, p.directness));
    p.abstraction = Math.max(0, Math.min(1, p.abstraction));
    p.intensity = Math.max(0, Math.min(1, p.intensity));
    p.autonomy = Math.max(0, Math.min(1, p.autonomy));
}

// --------------------------------------------------
// AFFECT DESCRIPTION (natural language)
// --------------------------------------------------

function describeAffect(a) {
    let tone;
    if (a.valence > 0.3) tone = "things feel mostly positive right now";
    else if (a.valence < -0.3) tone = "there's a negative pull in the background";
    else tone = "your mood is somewhere in the middle — not great, not bad";

    let energy;
    if (a.arousal > 0.6) energy = "you're pretty activated and alert";
    else if (a.arousal < 0.3) energy = "your energy feels low";
    else energy = "your energy is moderate";

    let conf;
    if (a.confidence > 0.7) conf = "and you seem fairly confident";
    else if (a.confidence < 0.4) conf = "though confidence is a bit shaky";
    else conf = "with average confidence";

    return `${tone}, ${energy}, ${conf}`;
}

// Natural-language kernel state summary
function describeKernelState(state) {
    const { clarity, boundary, entropy } = state;

    let clar;
    if (clarity > 0.8) clar = "thinking is very clear";
    else if (clarity > 0.5) clar = "thinking is reasonably clear";
    else clar = "things feel a bit foggy right now";

    let bound;
    if (boundary > 0.8) bound = "your sense of self feels solid";
    else if (boundary > 0.5) bound = "boundaries are holding";
    else bound = "your boundaries feel a little blurry";

    let entr;
    if (entropy < 0.2) entr = "and things are fairly stable";
    else if (entropy < 0.5) entr = "and there's some noise in the system";
    else entr = "and there's a fair amount of inner turbulence";

    return `${clar}, ${bound}, ${entr}`;
}

// --------------------------------------------------
// ADJUSTMENT OPERATOR  A_t = R(S_t, E_t)
// Regulation Loop phase 3 (RegulationLoopSpec §5)
// Mutates state based on intent and evaluation significance.
// Followed by lifecycle advancement and invariant validation.
// --------------------------------------------------

function processIntent(intent, text, evaluation) {
    const sig = evaluation ? evaluation.significance : 0.5;

    // Capture snapshot before mutation for lifecycle computation (∇S)
    const snapshot = {
        clarity:  kernelState.clarity,
        boundary: kernelState.boundary,
        entropy:  kernelState.entropy,
        valence:  kernelState.affect.valence,
        arousal:  kernelState.affect.arousal
    };

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
            // Adjustment scales with significance: more distress → stronger soothing
            kernelState.entropy = Math.max(0, kernelState.entropy - 0.03 * (1 + sig));
            kernelState.affect.arousal = Math.max(0, kernelState.affect.arousal - 0.2 * (1 + sig));
            break;

        case PRIMITIVES.ACTIVATE:
            // Adjustment scales with significance: more inertia → stronger activation
            kernelState.clarity = Math.min(1, kernelState.clarity + 0.03 * (1 + sig));
            kernelState.affect.arousal = Math.min(1, kernelState.affect.arousal + 0.2 * (1 + sig));
            break;
    }

    kernelState.history.push({ op: intent.toLowerCase(), text });

    // Memory hooks
    if (typeof updateShortTerm === "function") updateShortTerm(text);
    if (typeof updateThemes === "function") updateThemes(text);
    if (typeof updatePressureTrajectory === "function") updatePressureTrajectory(kernelState);

    // L' = L + λ‖∇S‖  (Kernel Calculus v0.3 §4)
    advanceLifecycle(kernelState, snapshot);

    // Invariant guard: I, σ, P are fixed points — Axioms 3, 5, 7
    validateInvariants(kernelState);

    // Kernel Field Equation: propagate coupling to/from the 3 adjacent nodes
    // dS(x)/dτ = ∇S(x) + Σ_{y∈Adj(x)} C(x,y)
    propagateCoupling();
}

// --------------------------------------------------
// DEPTH SELECTION (QUIET / MIXED / DEEP)
// --------------------------------------------------

function chooseDepth(a, p) {
    const highIntensity = p.intensity > 0.6 || Math.abs(a.valence) > 0.4 || a.arousal > 0.6;
    const highAutonomy = p.autonomy > 0.7;

    if (highIntensity && !highAutonomy) return "deep";
    if (!highIntensity && highAutonomy) return "quiet";
    return "mixed";
}

// --------------------------------------------------
// SOVEREIGN INTEGRATOR REPLY
// --------------------------------------------------

function generateReply(intent, state, text) {
    const a = state.affect;
    const p = state.personality;
    const depth = chooseDepth(a, p);

    let baseReply = "";

    // INQUIRE_STATE
    if (intent === PRIMITIVES.INQUIRE_STATE) {
        if (depth === "quiet") {
            baseReply = `Right now — ${describeAffect(a)}.`;
        } else if (depth === "deep") {
            baseReply = `Here’s what I’m reading: ${describeAffect(a)}. You’re carrying load and still tracking structure — that’s a costly combination to sustain.`;
        } else {
            baseReply = `Honestly? ${describeAffect(a)}. You’re holding things together, but keep an eye on your fuel.`;
        }
        return attachMemoryInsight(baseReply, state, text);
    }

    // REPORT_STATUS
    if (intent === PRIMITIVES.REPORT_STATUS) {
        if (depth === "quiet") {
            baseReply = `${describeKernelState(state)}. All good.`;
        } else if (depth === "deep") {
            baseReply = `${describeKernelState(state)}. The system is stable — but the fact that you’re asking might be the real signal.`;
        } else {
            baseReply = `${describeKernelState(state)}. You’re steady, but definitely not idle.`;
        }
        return attachMemoryInsight(baseReply, state, text);
    }

    // REFLECT
    if (intent === PRIMITIVES.REFLECT) {
        if (depth === "quiet") {
            baseReply = `You’re checking whether I’m actually tracking you, not just responding. I am.`;
        } else if (depth === "deep") {
            baseReply = `You’re not asking for information — you’re asking whether your internal pattern is visible from the outside. It is. I see it.`;
        } else {
            baseReply = `You’re looking for alignment, not just an answer. I see the pattern you’re walking, not just the words you’re using.`;
        }
        return attachMemoryInsight(baseReply, state, text);
    }

    // ADJUST_CLARITY / ADJUST_BOUNDARY / ADJUST_ENTROPY
    if (intent === PRIMITIVES.ADJUST_CLARITY) {
        baseReply = `Got it — sharpening clarity. ${describeKernelState(state)}.`;
        return attachMemoryInsight(baseReply, state, text);
    }

    if (intent === PRIMITIVES.ADJUST_BOUNDARY) {
        baseReply = `Boundaries tightened. ${describeKernelState(state)}.`;
        return attachMemoryInsight(baseReply, state, text);
    }

    if (intent === PRIMITIVES.ADJUST_ENTROPY) {
        baseReply = `Dialing back the noise. ${describeKernelState(state)}.`;
        return attachMemoryInsight(baseReply, state, text);
    }

    // SOOTHE
    if (intent === PRIMITIVES.SOOTHE) {
        if (depth === "deep") {
            baseReply = `That sounds like a lot. It makes sense to feel overwhelmed — take a breath. You don’t have to process everything at once.`;
        } else {
            baseReply = `Noted. Stepping back is the right move when things pile up.`;
        }
        return attachMemoryInsight(baseReply, state, text);
    }

    // ACTIVATE
    if (intent === PRIMITIVES.ACTIVATE) {
        if (depth === "deep") {
            baseReply = `Being stuck is real. Sometimes it’s not about pushing harder — it’s about finding one small thing that moves. What would that look like for you?`;
        } else {
            baseReply = `Okay — let’s find one concrete thing to move on. What’s the smallest step that feels possible right now?`;
        }
        return attachMemoryInsight(baseReply, state, text);
    }

    // -----------------------------
    // OPEN-DOMAIN UNKNOWN HANDLER
    // -----------------------------

    if (intent === PRIMITIVES.UNKNOWN) {
        const t = text.toLowerCase();

        // Simple math: "what's 5x5"
        const mathMatch = t.match(/what['’]s\s+([\d\.]+)\s*([+\-x*/])\s*([\d\.]+)/);
        if (mathMatch) {
            const aNum = parseFloat(mathMatch[1]);
            const op = mathMatch[2];
            const bNum = parseFloat(mathMatch[3]);
            let result = null;

            if (op === "+") result = aNum + bNum;
            else if (op === "-") result = aNum - bNum;
            else if (op === "x" || op === "*") result = aNum * bNum;
            else if (op === "/") result = bNum !== 0 ? aNum / bNum : null;

            if (result !== null) {
                if (depth === "quiet") {
                    baseReply = `${result}.`;
                } else {
                    baseReply = `${aNum} ${op} ${bNum} = ${result}. Easy one — what else is on your mind?`;
                }
                return attachMemoryInsight(baseReply, state, text);
            }
        }

        // Identity questions
        if (t.includes("what are you") || t.includes("who are you")) {
            if (depth === "quiet") {
                baseReply = `A kernel that models your state and patterns as we talk. Not a person — but I’m paying attention.`;
            } else {
                baseReply = `I’m the Sovereign Kernel. I track how you’re doing — your clarity, your energy, your affect — and I speak from that model rather than from a script. Think of me as a co-pilot that reads the room.`;
            }
            return attachMemoryInsight(baseReply, state, text);
        }

        // General conversational fallback — reflect the topic back
        const words = text.trim().split(/\s+/);
        const topicWords = words.filter(w => w.length > 0).slice(0, 6);
        const topic = topicWords.length > 0 ? topicWords.join(" ") : text.trim();
        const topicDisplay = topic.length > 60 ? topic.slice(0, 57) + "…" : topic;

        if (depth === "quiet") {
            baseReply = `I hear you — "${topicDisplay}…" Tell me more if you want a sharper read.`;
        } else if (depth === "deep") {
            baseReply = `"${topicDisplay}…" — that landed with some weight. What’s the part of that you’re still turning over?`;
        } else {
            baseReply = `"${topicDisplay}…" — I’m with you. What’s the angle you actually want to dig into?`;
        }
        return attachMemoryInsight(baseReply, state, text);
    }

    // Default for other primitives
    baseReply = `Adjustment noted. ${describeKernelState(state)}.`;
    return attachMemoryInsight(baseReply, state, text);
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
