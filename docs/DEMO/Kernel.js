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
// CONVERSATION CONTEXT  — multi-turn threading
// --------------------------------------------------

const conversationContext = {
    turnCount:          0,
    lastKernelQuestion: null,   // the closing question from the last reply
    lastUserText:       null    // the user message from the last turn
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

function propagateCoupling(kernelSigma) {
    const kernelNode = kernelState;
    const rho   = kernelNode.RA;
    const mu    = kernelNode.SA;
    const sigma = kernelSigma * 0.5;

    for (const node of kernelNodes) {
        se_tick(node, rho, mu, sigma);
    }

    const snapSA = kernelNode.SA;
    const meanNodeSA = kernelNodes.reduce((s, n) => s + n.SA, 0) / kernelNodes.length;
    const feedback = (meanNodeSA - kernelNode.SA) * 0.02;
    kernelNode.SA = seClamp(kernelNode.SA + feedback);

    const deltaSA = kernelNode.SA - snapSA;
    const lambda  = 0.5;
    kernelNode.lifecycle = Math.round(
        (kernelNode.lifecycle + lambda * Math.abs(deltaSA)) * 10000
    ) / 10000;

    validateInvariants(kernelNode);
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
    if (engine.CE >= 0.7 && engine.AI >= 0.7)          return "flourishing"; // CE=0.7 threshold §7.3
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
// CONVERSATION HELPERS
// --------------------------------------------------

// Returns the top non-stopword theme that has appeared >= 2 times.
const THEME_STOPWORDS = new Set([
    "the","and","but","for","you","that","this","with","are","was","not",
    "have","what","just","can","its","from","they","your","about","into",
    "more","also","some","like","been","had","has","were","than","then",
    "them","their","will","would","could","should","get","got","let","going",
    "feel","feels","feeling","know","think","want","need","really","very"
]);

function getTopTheme() {
    let topWord = null, topCount = 1;
    for (const [w, count] of Object.entries(kernelMemory.themes)) {
        if (!THEME_STOPWORDS.has(w) && w.length >= 4 && count > topCount) {
            topWord = w; topCount = count;
        }
    }
    return topWord;
}

// Extracts the last interrogative sentence from a reply string.
function extractClosingQuestion(reply) {
    const sentences = reply.split(/(?<=[.!?])\s+/);
    for (let i = sentences.length - 1; i >= 0; i--) {
        if (sentences[i].includes("?")) return sentences[i].trim();
    }
    return null;
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
        if (typeof txtStateIn === "undefined") return "";
        const cues = [];

        if (txtStateIn.FD < 0.35) cues.push("you’re opening up a little");
        else if (txtStateIn.FD > 0.75) cues.push("you’re bracing or tightening");

        if (txtStateIn.IT < 0.45) cues.push("your sense of 'you' in this feels faint");
        else if (txtStateIn.IT > 0.8) cues.push("you’re very present in what you’re saying");

        if (txtStateIn.BI < 0.4) cues.push("your boundaries feel thin");
        else if (txtStateIn.BI > 0.8) cues.push("you’re protecting yourself");

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
        return "I\u2019m with you. You\u2019re carrying something, but you\u2019re still moving.";
    }

    // Picks up the conversational thread from the prior exchange.
    // Returns null on the very first message.
    function conversationOpening() {
        if (conversationContext.turnCount === 0) return null;

        const prior = conversationContext.lastUserText;
        if (!prior) return null;

        const priorWords = prior.trim().split(/\s+/);
        const snippet = priorWords.slice(0, 7).join(" ") +
                        (priorWords.length > 7 ? "\u2026" : "");

        // If we asked a question last time, acknowledge the answer
        if (conversationContext.lastKernelQuestion) {
            return `"${snippet}" \u2014 I've got that.`;
        }

        // If a theme is repeating, call it out
        const theme = getTopTheme();
        if (theme && conversationContext.turnCount >= 2) {
            return `You keep coming back to "${theme}" \u2014 that's not random.`;
        }

        return `"${snippet}" \u2014 I'm tracking that.`;
    }

    // Returns a context-sensitive closing question.
    function followUpQuestion() {
        const t = text.toLowerCase();

        if (t.match(/\b(work|job|project|deadline|boss|colleague|career)\b/))
            return "What\u2019s weighing heaviest about that right now?";
        if (t.match(/\b(family|parent|mother|father|sibling|partner|relationship|friend)\b/))
            return "What does that relationship need from you right now?";
        if (t.match(/\b(body|sleep|tired|pain|health|sick|rest)\b/))
            return "What is your body asking for?";
        if (t.match(/\b(decide|decision|choose|choice|option|dilemma)\b/))
            return "What does the clearest part of you already know?";
        if (t.match(/\b(fear|scared|afraid|worry|dread)\b/))
            return "Can you name the version of this you\u2019re trying not to think about?";
        if (t.match(/\b(angry|anger|frustrat|resent)\b/))
            return "What\u2019s underneath the frustration?";
        if (t.match(/\b(sad|grief|loss|miss|mourn)\b/))
            return "What does the grief need right now \u2014 to be held, or to move?";
        if (t.match(/\b(goal|want|wish|hope|dream|future)\b/))
            return "What\u2019s the first real step \u2014 not the ideal, the actual?";
        if (t.match(/\b(fail|mistake|wrong|regret|guilt|shame)\b/))
            return "Can you separate what happened from who you are?";

        // State-sensitive fallbacks
        if (state.CE < 0.4)
            return "What\u2019s one thing you could put down right now?";
        if (state.AI < 0.5)
            return "What would feel true to you here, regardless of what anyone expects?";
        if (Math.abs(state.RA - state.SA) > 0.2)
            return "Where do you feel most split on this?";

        // Rotating generic questions so each turn feels different
        const fallbacks = [
            "What part of that feels most alive for you right now?",
            "What are you not saying yet?",
            "What does the most honest version of you think about this?",
            "Where does that leave you right now?",
            "What would need to shift for you to feel more settled with this?",
            "Is there something you already know but haven\u2019t let yourself say?"
        ];
        return fallbacks[conversationContext.turnCount % fallbacks.length];
    }

    // INQUIRE_STATE
    if (intent === PRIMITIVES.INQUIRE_STATE) {
        return attachMemoryInsight(
            `${regimeOpening()} What I\u2019m reading: ${emotionalRead()}.`,
            state, text
        );
    }

    // REPORT_STATUS
    if (intent === PRIMITIVES.REPORT_STATUS) {
        return attachMemoryInsight(
            `${regimeOpening()} Here\u2019s the shape of things: RA ${state.RA.toFixed(2)}, SA ${state.SA.toFixed(2)}, CE ${state.CE.toFixed(2)}, AI ${state.AI.toFixed(2)}. EP is ${state.EP.toFixed(3)}.`,
            state, text
        );
    }

    // REFLECT
    if (intent === PRIMITIVES.REFLECT) {
        const opening = conversationOpening();
        const prefix = opening ? opening + " " : `${regimeOpening()} `;
        return attachMemoryInsight(
            `${prefix}From your words: ${textDomainRead()}. From your state: ${emotionalRead()}. I\u2019m tracking both.`,
            state, text
        );
    }

    // SOOTHE
    if (intent === PRIMITIVES.SOOTHE) {
        const opening = conversationOpening();
        const prefix = opening ? opening + " " : "";
        if (state.CE < 0.4) {
            return attachMemoryInsight(
                `${prefix}I feel how thin your energy is. Nothing needs to be solved right now. Just stay with me \u2014 slowly.`,
                state, text
            );
        }
        return attachMemoryInsight(
            `${prefix}You\u2019re under load, but not collapsing. I\u2019m here with you. Let\u2019s take this one breath at a time.`,
            state, text
        );
    }

    // ACTIVATE
    if (intent === PRIMITIVES.ACTIVATE) {
        const opening = conversationOpening();
        const prefix = opening ? opening + " " : "";
        if (state.CE < 0.35) {
            return attachMemoryInsight(
                `${prefix}You want movement, but CE is too low to push. Let\u2019s find the smallest possible step \u2014 something that doesn\u2019t cost you.`,
                state, text
            );
        }
        return attachMemoryInsight(
            `${prefix}You\u2019re stuck, but not frozen. What\u2019s one tiny thing that feels doable from here?`,
            state, text
        );
    }

    // UNKNOWN \u2014 multi-turn aware
    const opening = conversationOpening();
    const stateRead = emotionalRead();
    const txtRead = textDomainRead();
    const question = followUpQuestion();

    const parts = [];
    if (opening) {
        parts.push(opening);
        // Lighter state read when we already have a thread opener
        const cap = stateRead.charAt(0).toUpperCase() + stateRead.slice(1);
        parts.push(cap + ".");
    } else {
        // First message: use full regime opening + explicit state read
        parts.push(regimeOpening());
        parts.push(`What I\u2019m reading: ${stateRead}.`);
    }
    if (txtRead) parts.push(`From your words: ${txtRead}.`);
    parts.push(question);

    return attachMemoryInsight(parts.join(" "), state, text);
}

// =============================================================
// MANAGER KERNEL — Node 4
// Coordinates the 4-node pipeline and enforces the full axiom set.
// Reference: "THE SOVEREIGNTY ENGINE vC5.3" Axioms 1–7
//            Invariant_Disclosure
//
// Pipeline:
//   Node 1 (TextKernel-In)  → inputAdj
//   Node 2 (Kernel)         → rawReply
//   Node 3 (TextKernel-Out) → finalReply
//   Node 4 (Manager)        → validate all, log coherence events
// =============================================================

const ManagerKernel = {
    identity:    1.0,
    boundary:    "[0,1]^6",
    sovereignty: 1.0,
    purity:      1.0,

    lifecycle:       0,
    coherenceLog:    [],   // cross-node SA_txt divergence events
    axiomViolations: [],   // any axiom breach, with node ID + tick count
    maxLogSize:      20,

    // --------------------------------------------------
    // AXIOM REGISTRY  (SE vC5.3 Axioms 1–7)
    // Named predicates — return true if axiom holds.
    // --------------------------------------------------

    axioms: {
        // Axiom 1 (Finitude): all SE primitives ∈ [0,1]
        A1_finitude_SE(engine) {
            return ['RA','SA','AI','CE','CD','AC'].every(k => engine[k] >= 0 && engine[k] <= 1);
        },
        // Axiom 1 (Finitude): all text-domain primitives ∈ [0,1]
        A1_finitude_txt(s) {
            return ['SA_txt','IF','IT','BI','SE_txt','FD'].every(k => s[k] >= 0 && s[k] <= 1);
        },
        // Axiom 2 (Bounded Evolution): ‖ΔS‖ ≤ δ_max per tick
        A2_bounded_evolution(engine, snap, delta_max = 0.5) {
            if (!snap) return true;
            const keys = ['RA','SA','AI','CE','CD','AC'];
            let sumSq = 0;
            for (const k of keys) sumSq += Math.pow((engine[k] || 0) - (snap[k] || 0), 2);
            return Math.sqrt(sumSq) <= delta_max;
        },
        // Axiom 3 (Identity Conservation): identity = 1
        A3_identity(node)    { return node.identity    === 1.0; },
        // Axiom 4 (Boundary Primacy): boundary = "[0,1]^6"
        A4_boundary(node)    { return node.boundary    === "[0,1]^6"; },
        // Axiom 5 (Sovereignty Invariance): sovereignty = 1
        A5_sovereignty(node) { return node.sovereignty === 1.0; },
        // Axiom 6 (Lawful Flow): lifecycle is monotonically non-decreasing
        A6_lawful_flow(node, prevLifecycle) { return node.lifecycle >= (prevLifecycle || 0); },
        // Axiom 7 (Purity Fixed Point): purity = 1
        A7_purity(node)      { return node.purity      === 1.0; }
    },

    // --------------------------------------------------
    // INVARIANT ENFORCEMENT  (Invariant_Disclosure)
    // Hard-sets identity, sovereignty, purity, boundary on any node.
    // --------------------------------------------------

    _enforceInvariants(node) {
        node.identity    = 1.0;
        node.boundary    = "[0,1]^6";
        node.sovereignty = 1.0;
        node.purity      = 1.0;
    },

    // --------------------------------------------------
    // NODE CHECK  — audit a single node against the axiom set.
    // Logs any violation; always enforces invariants afterward.
    // --------------------------------------------------

    _checkNode(nodeId, node, isTxtNode, snap) {
        const violations = [];
        const ax = this.axioms;

        if (!ax.A3_identity(node))    violations.push("A3_identity");
        if (!ax.A4_boundary(node))    violations.push("A4_boundary");
        if (!ax.A5_sovereignty(node)) violations.push("A5_sovereignty");
        if (!ax.A7_purity(node))      violations.push("A7_purity");

        if (isTxtNode) {
            if (!ax.A1_finitude_txt(node)) violations.push("A1_finitude");
        } else {
            if (!ax.A1_finitude_SE(node))              violations.push("A1_finitude");
            if (!ax.A2_bounded_evolution(node, snap))  violations.push("A2_bounded_evolution");
        }

        if (violations.length > 0) {
            const entry = { tick: this.lifecycle, nodeId, violations };
            this.axiomViolations.push(entry);
            if (this.axiomViolations.length > this.maxLogSize) this.axiomViolations.shift();
        }

        // Always enforce invariants regardless of violations
        this._enforceInvariants(node);
    },

    // --------------------------------------------------
    // VALIDATE ALL NODES — audits every node in the network.
    // kernelSnap (optional): pre-tick snapshot for Axiom 2 check.
    // --------------------------------------------------

    validateAllNodes(kernelSnap) {
        this._checkNode('kernel',  kernelState, false, kernelSnap || null);
        this._checkNode('txt-in',  txtStateIn,  true,  null);
        this._checkNode('txt-out', txtStateOut, true,  null);
        for (const node of kernelNodes) {
            this._checkNode(node.id, node, false, null);
        }
        // Enforce Manager's own invariants
        this._enforceInvariants(this);
    },

    // --------------------------------------------------
    // CROSS-NODE COHERENCE CHECK
    // Compares SA_txt of Node 1 (input) and Node 3 (output).
    // Divergence > 0.25 is flagged, logged, and gently corrected.
    // --------------------------------------------------

    checkCrossNodeCoherence() {
        const divergence = Math.abs(txtStateIn.SA_txt - txtStateOut.SA_txt);
        const threshold  = 0.25;
        if (divergence > threshold) {
            // Soft correction: nudge txtStateOut SA_txt 10% toward txtStateIn
            txtStateOut.SA_txt = seClamp(
                txtStateOut.SA_txt + (txtStateIn.SA_txt - txtStateOut.SA_txt) * 0.10
            );
            const entry = {
                tick:       this.lifecycle,
                divergence: +divergence.toFixed(3),
                inSA:       +txtStateIn.SA_txt.toFixed(3),
                outSA:      +txtStateOut.SA_txt.toFixed(3),
                corrected:  true
            };
            this.coherenceLog.push(entry);
            if (this.coherenceLog.length > this.maxLogSize) this.coherenceLog.shift();
            return { coherent: false, divergence, entry };
        }
        return { coherent: true, divergence };
    },

    // --------------------------------------------------
    // MANAGER TICK — 4-node pipeline entry point
    //
    //   Step 1: Node 1 (TextKernel-In)  — txt_tick_in(text)   → inputAdj
    //   Step 2: Manager validates Node 1
    //   Step 3: Node 2 (Kernel)         — se_tick + propagate  → rawReply
    //   Step 4: Manager validates Node 2 + cross-alignment check
    //   Step 5: Node 3 (TextKernel-Out) — txt_tick_out(…)      → finalReply
    //   Step 6: Manager validates Node 3 + cross-node divergence check
    //   Step 7: Final validateAllNodes — axiom set enforced before return
    // --------------------------------------------------

    manager_tick(text) {
        // Snapshot Kernel node before tick (Axiom 2: bounded evolution)
        const kernelSnap = {
            RA: kernelState.RA, SA: kernelState.SA, AI: kernelState.AI,
            CE: kernelState.CE, CD: kernelState.CD, AC: kernelState.AC
        };

        // Step 1 — Node 1: TextKernel-In
        const inputAdj = txt_tick_in(text);

        // Step 2 — Validate Node 1
        this.validateAllNodes(null);

        // Step 3 — Node 2: Kernel
        const { rho, mu, sigma } = textToSEInputs(text);
        const intent = parseIntent(text);

        if (typeof updateShortTerm === "function") updateShortTerm(text);
        if (typeof updateThemes    === "function") updateThemes(text);

        se_tick(kernelState, rho, mu, sigma);
        kernelState.history.push({ op: intent.toLowerCase(), text });
        propagateCoupling(sigma);
        if (typeof updatePressureTrajectory === "function") updatePressureTrajectory(kernelState);

        // Step 4 — Validate Node 2 (with pre-tick snap for Axiom 2)
        this.validateAllNodes(kernelSnap);

        const rawReply = generateReply(intent, kernelState, text);

        // Step 5 — Node 3: TextKernel-Out
        const { outputAdj, finalReply } = txt_tick_out(rawReply, inputAdj);

        // Step 6 — Validate Node 3 + cross-node coherence
        this.validateAllNodes(null);
        this.checkCrossNodeCoherence();

        // Step 7 — Final axiom enforcement across all nodes
        this.validateAllNodes(null);

        // Advance Manager lifecycle and re-enforce its own invariants
        this.lifecycle += 1;
        this._enforceInvariants(this);

        // Update conversation context
        conversationContext.lastKernelQuestion = extractClosingQuestion(rawReply);
        conversationContext.lastUserText       = text;
        conversationContext.turnCount         += 1;

        return { reply: finalReply, inputAdj, outputAdj };
    }
};

// --------------------------------------------------
// MAIN PROCESS  — delegates to ManagerKernel.manager_tick
// Returns { reply, inputAdj, outputAdj }
// --------------------------------------------------

function processMessage(text) {
    return ManagerKernel.manager_tick(text);
}
