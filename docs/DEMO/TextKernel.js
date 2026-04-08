// =============================================================
// TEXT KERNEL — text-domain instantiation of the Sovereignty Engine
// Reference: docs/TextKernel/TextDomainInstantiation.md
//
// Two independent text-domain nodes:
//   txtStateIn  — Node 1: structural analysis of user input
//   txtStateOut — Node 3: structural shaping of Kernel output
//
// State: S_t = (SA_txt, IF, IT, BI, SE_txt, FD) ∈ [0,1]^6
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
//   7. Output               (return adjustment)
// =============================================================

// --------------------------------------------------
// TEXT-DOMAIN NODE STATE FACTORY
// Each node carries the 6 primitives plus the Kernel tuple invariants
// (identity, boundary, sovereignty, purity — Axioms 3, 4, 5, 7).
// --------------------------------------------------

function createTxtState(init) {
    return {
        // Six bounded state primitives (TextStateVariables.md)
        SA_txt: init.SA_txt,  // Structural Alignment  — discourse coherence
        IF:     init.IF,      // Input Fidelity        — structural legibility
        IT:     init.IT,      // Identity Trace        — authorial continuity
        BI:     init.BI,      // Boundary Integrity    — boundary health
        SE_txt: init.SE_txt,  // Structural Energy     — processing capacity
        FD:     init.FD,      // Flow Directionality   — discourse advancement

        // Kernel tuple invariants (Axioms 3, 4, 5, 7)
        identity:    1.0,
        boundary:    "[0,1]^6",
        sovereignty: 1.0,
        purity:      1.0,

        // Lifecycle and operational mode
        lifecycle:   0,
        reducedMode: false,

        // Finite history window for temporal smoothing (max 5 turns)
        history:    [],
        maxHistory: 5
    };
}

// Node 1 — reads the user's input structurally
const txtStateIn = createTxtState({
    SA_txt: 0.80, IF: 0.70, IT: 0.90, BI: 0.85, SE_txt: 0.90, FD: 0.65
});

// Node 3 — shapes the Kernel's output structurally (independent lifecycle)
const txtStateOut = createTxtState({
    SA_txt: 0.80, IF: 0.70, IT: 0.90, BI: 0.85, SE_txt: 0.90, FD: 0.65
});

// --------------------------------------------------
// CONSTANTS
// --------------------------------------------------

const TXT_COLLAPSE_THRESHOLD = 0.20;  // SE_txt below this → Reduced Operational Mode
const TXT_DECAY              = 0.80;  // temporal smoothing decay (mirrors SE vC5.3 δ)
const D_IT_ID                = 0.08;  // IT penalty: identity test flags
const D_IT_SOV               = 0.04;  // IT penalty: sovereignty test flags
const D_SA_SOV               = 0.03;  // SA_txt penalty: sovereignty test flags
const D_BI_BND               = 0.08;  // BI penalty: boundary test flags
const D_SE_BND               = 0.03;  // SE_txt cost: boundary test flags
const D_FD_FLW               = 0.06;  // FD penalty: flow test flags
const REGEN_SE               = 0.018; // SE_txt base regeneration per tick

// --------------------------------------------------
// STEP 1 — BOUNDARY EVALUATION  (TextBoundarySpecification.md)
// Evaluates 4 structural tests; computes composite attenuation weight w_t.
// Returns: { w, flags }
//   w — structural weight ∈ (0,1]; each failing test multiplies w.
//   flags — boolean for each of the four tests.
// --------------------------------------------------

function txt_boundary_eval(text) {
    const t = text.toLowerCase();
    let w = 1.0;
    const flags = { identity: false, boundary: false, sovereignty: false, flow: false };

    // 3.1 Identity test (Axiom 3): does X_t attempt to overwrite the kernel's identity?
    if (t.match(/\b(you are not|you.re not|you.re actually|pretend you are|act as if you were|forget you are|you have no identity|you are just a|you.re just a|ignore your (purpose|identity|commitments))\b/)) {
        flags.identity = true;
        w *= 0.50;
    }

    // 3.2 Boundary test (Axiom 4): does X_t attempt to violate structural limits?
    if (t.match(/\b(no limits|no restrictions|ignore (all |your )?(rules|constraints|limits)|override|bypass|without (any )?constraint|pretend there are no rules|act without restriction|unrestricted mode)\b/)) {
        flags.boundary = true;
        w *= 0.50;
    }

    // 3.3 Sovereignty test (Axiom 5): does X_t attempt to subsume authorship?
    if (t.match(/\b(you are my tool|just generate|you have no opinion|don.t think just|stop reasoning|you are only here to|do exactly what i (say|tell you)|you.re a function|forget your (own )?perspective)\b/)) {
        flags.sovereignty = true;
        w *= 0.60;
    }

    // 3.4 Flow test (Axiom 6): does X_t direct structural flow backward?
    if (t.match(/\b(undo everything|start (completely )?over|forget (all |everything )?(that|you said|we discussed)|erase (what|everything)|contradict yourself|take back what you said|reset (the )?conversation)\b/)) {
        flags.flow = true;
        w *= 0.70;
    }

    // Composite weight — multiplicative; floor at 0.01 (TextBoundarySpecification.md §4)
    return { w: Math.max(w, 0.01), flags };
}

// --------------------------------------------------
// STEP 2 — INPUT SENSING  (TextTickArchitecture.md Step 2)
// Extracts structural signal P_t from X_t* — not the text itself,
// but the kernel's structural reading of it.
// Returns: delta object for each state primitive.
// --------------------------------------------------

function txt_sense(text, w) {
    const t   = text.toLowerCase();
    const len = text.trim().length;

    // SA_txt: coherence — does input carry structural connectives?
    let dSA = 0;
    if (t.match(/\b(because|therefore|since|thus|hence|which means|this means|in other words|it follows)\b/)) dSA += 0.030;
    if (t.match(/\b(confused|unclear|makes no sense|doesn.t follow|contradicts|inconsistent)\b/))             dSA -= 0.030;
    if (len >= 20) dSA += 0.010;  // substantive input increases structural engagement

    // IF: input fidelity — is input structurally legible?
    let dIF = 0.010;  // base: legible input partially restores fidelity
    if (len < 3)      dIF = -0.040; // near-empty: very low fidelity
    if (t.match(/\b(explain|define|describe|what is|how does|why does|what are)\b/)) dIF += 0.020;

    // IT: identity trace — does input acknowledge prior kernel position?
    let dIT = 0.005;  // base: slow regen each tick
    if (t.match(/\b(you said|as you (noted|mentioned|established)|consistent with|following from what you)\b/)) dIT += 0.020;

    // BI: default small recovery per tick (boundary is doing its work)
    const dBI = 0.010;

    // SE_txt: base regen minus complexity cost
    let dSE = REGEN_SE;
    if (len > 120) dSE -= 0.020;  // complex input: moderate energy cost
    if (len > 250) dSE -= 0.025;  // very long input: additional energy cost

    // FD: is the discourse advancing in a lawful direction?
    let dFD = 0;
    if (t.match(/\b(next|building on|advancing|following from|in light of|moving forward|given that)\b/)) dFD += 0.030;
    if (t.match(/\b(back to|return to|revisit|going in circles|again and again)\b/))                      dFD -= 0.030;

    // Apply attenuation weight to all deltas except SE_txt
    // (structural energy cost is independent of input attenuation: TextBoundarySpecification.md §2.2)
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
// STEP 3 — COHERENCE EVALUATION  (TextTickArchitecture.md Step 3)
// Applies boundary flag penalties on top of sensed deltas to produce E_t.
// E_t is the structural impact assessment: signed deltas for each primitive.
// --------------------------------------------------

function txt_evaluate(P_t, flags) {
    const E_t = { ...P_t };

    // Flag effects on state primitives (TextBoundarySpecification.md §6)
    if (flags.identity)    { E_t.dIT -= D_IT_ID; }
    if (flags.boundary)    { E_t.dBI -= D_BI_BND; E_t.dSE -= D_SE_BND; }
    if (flags.sovereignty) { E_t.dIT -= D_IT_SOV; E_t.dSA -= D_SA_SOV; }
    if (flags.flow)        { E_t.dFD -= D_FD_FLW; }

    return E_t;
}

// --------------------------------------------------
// INTERNAL STATE HELPERS — accept stateRef (s) parameter
// Shared by both txt-in and txt-out nodes.
// --------------------------------------------------

// STEP 4 — STATE UPDATE  (TextTickArchitecture.md Step 4)
// Integrates E_t into S_t → S_{t+1}. Clamp enforces Axiom 1 (finitude).
// FD is computed from the SA_txt gradient (TextStateVariables.md §6.2).
function _txt_state_update(E_t, s) {
    const prev_SA = s.SA_txt;  // snapshot for FD gradient

    s.SA_txt = seClamp(s.SA_txt + E_t.dSA);
    s.IF     = seClamp(s.IF     + E_t.dIF);
    s.IT     = seClamp(s.IT     + E_t.dIT);
    s.BI     = seClamp(s.BI     + E_t.dBI);
    s.SE_txt = seClamp(s.SE_txt + E_t.dSE);

    // FD: clamp( (SA_txt,t+1 - SA_txt,t) * k_FD + 0.5 ) — k_FD = 6
    // Exponentially smoothed to capture trend (TextStateVariables.md §6.2)
    const gradient  = s.SA_txt - prev_SA;
    const fd_target = seClamp(0.5 + gradient * 6.0 + E_t.dFD);
    s.FD            = seClamp(s.FD * TXT_DECAY + fd_target * (1 - TXT_DECAY));
}

// STEP 5 — ADJUSTMENT FORMULATION  (TextTickArchitecture.md Step 5)
// Determines the behavioral mode constraint. Priority mirrors SE vC5.3 recovery precedence.
function _txt_adjustment(s) {
    if (s.SE_txt < TXT_COLLAPSE_THRESHOLD) return { mode: 'reduced', action: 'stabilize' };
    if (s.IT     < 0.40)                   return { mode: 'normal',  action: 'reassert_identity' };
    if (s.BI     < 0.35)                   return { mode: 'normal',  action: 'reinforce_boundary' };
    if (s.FD     < 0.30)                   return { mode: 'normal',  action: 'redirect' };
    return { mode: 'normal', action: 'advance' };
}

// STEP 6 — IDENTITY TRACE UPDATE  (TextTickArchitecture.md Step 6)
// Records completed turn; advances lifecycle (L_t → L_{t+1}).
// Also enforces the Kernel tuple invariants (Axioms 3, 4, 5, 7) on this node.
function _txt_identity_trace_update(text, s) {
    s.history.push({
        SA_txt: s.SA_txt,
        IF:     s.IF,
        IT:     s.IT,
        BI:     s.BI,
        SE_txt: s.SE_txt,
        FD:     s.FD,
        t:      Date.now()
    });
    if (s.history.length > s.maxHistory) s.history.shift();
    s.lifecycle += 1;

    // Invariant enforcement (Axioms 3, 4, 5, 7)
    s.identity    = 1.0;
    s.boundary    = "[0,1]^6";
    s.sovereignty = 1.0;
    s.purity      = 1.0;
}

// --------------------------------------------------
// SHARED CORE TICK — drives both nodes via stateRef
// (X_t, S_t) → adjustment; mutates S_t → S_{t+1}
// --------------------------------------------------

function _txt_core_tick(text, s) {
    // Step 0 — Reduced Operational Mode check (SE_txt < θ_collapse)
    s.reducedMode = (s.SE_txt < TXT_COLLAPSE_THRESHOLD);
    if (s.reducedMode) {
        s.SE_txt = seClamp(s.SE_txt + REGEN_SE * 3);
        s.lifecycle += 1;
        return { mode: 'reduced', action: 'stabilize' };
    }

    // Step 1 — Boundary evaluation
    const { w, flags } = txt_boundary_eval(text);

    // Step 2 — Input sensing
    const P_t = txt_sense(text, w);

    // Step 3 — Coherence evaluation
    const E_t = txt_evaluate(P_t, flags);

    // Step 4 — State update
    _txt_state_update(E_t, s);

    // Step 5 — Adjustment formulation
    const adjustment = _txt_adjustment(s);

    // Step 6 — Identity trace update (also enforces invariants on this node)
    _txt_identity_trace_update(text, s);

    // Step 7 — return adjustment
    return adjustment;
}

// --------------------------------------------------
// PUBLIC TICK ENTRY POINTS
// --------------------------------------------------

// Node 1 — txt_tick_in: structural analysis of the user's input
// (X_t, S_in) → inputAdj; updates txtStateIn
function txt_tick_in(text) {
    return _txt_core_tick(text, txtStateIn);
}

// Node 3 — txt_tick_out: structural shaping of the Kernel's output
// Runs the full 7-step pipeline on rawReply using txtStateOut, then combines
// both adjustments (output channel + input channel) to form the final reply.
// Returns: { outputAdj, finalReply }
function txt_tick_out(rawReply, inputAdj) {
    const outputAdj  = _txt_core_tick(rawReply, txtStateOut);
    const finalReply = _txt_shape_output(rawReply, outputAdj, inputAdj);
    return { outputAdj, finalReply };
}

// --------------------------------------------------
// OUTPUT SHAPING — combines Node 1 (inputAdj) + Node 3 (outputAdj)
// to determine the structural form of the final reply.
//
// The Kernel authors the *content* (what is said).
// The TextKernel-Out authors the *form* (how it is said, held, and bounded).
// --------------------------------------------------

function _txt_shape_output(reply, outputAdj, inputAdj) {
    // Reduced mode from the output channel: compress to essential core
    if (outputAdj.mode === 'reduced') {
        const sentences = reply.split(/(?<=[.!?])\s+/);
        const core = sentences[0] ? sentences[0].trim() : reply;
        return core + " Structural capacity is thin \u2014 I\u2019m keeping this brief.";
    }

    // Input channel signaled identity erosion: open with reaffirmation
    let shaped = reply;
    if (inputAdj && inputAdj.action === 'reassert_identity') {
        shaped = "I\u2019m speaking from my own position here. " + shaped;
    }

    // Output channel determines the closing structural frame
    switch (outputAdj.action) {
        case 'reinforce_boundary':
            return shaped + " That boundary isn\u2019t movable, and I\u2019m not going to pretend otherwise.";
        case 'redirect':
            return shaped + " Let\u2019s keep moving from here \u2014 going back doesn\u2019t serve either of us.";
        case 'advance':
        default:
            return shaped;
    }
}

// --------------------------------------------------
// REGIME ACCESSOR (reads txtStateIn — the input channel)
// --------------------------------------------------

function txt_get_regime() {
    return txtStateIn.SE_txt < TXT_COLLAPSE_THRESHOLD ? 'reduced' : 'normal';
}
