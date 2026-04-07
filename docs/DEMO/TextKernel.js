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
//   7. Output               (return adjustment; reply built by Kernel.js)
// =============================================================

// --------------------------------------------------
// TEXT-DOMAIN KERNEL STATE
// --------------------------------------------------

const txtState = {
    // Six bounded state primitives (TextStateVariables.md)
    SA_txt: 0.80,  // Structural Alignment  — discourse coherence         (§1)
    IF:     0.70,  // Input Fidelity        — structural legibility        (§2)
    IT:     0.90,  // Identity Trace        — authorial continuity         (§3)
    BI:     0.85,  // Boundary Integrity    — boundary health              (§4)
    SE_txt: 0.90,  // Structural Energy     — processing capacity          (§5)
    FD:     0.65,  // Flow Directionality   — discourse advancement        (§6)

    // Lifecycle and operational mode
    lifecycle:   0,
    reducedMode: false,

    // Finite history window for temporal smoothing (max 5 turns)
    history:    [],
    maxHistory: 5
};

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
// STEP 4 — STATE UPDATE  (TextTickArchitecture.md Step 4)
// Integrates E_t into S_t → S_{t+1}. Clamp enforces Axiom 1 (finitude).
// FD is computed from the SA_txt gradient (TextStateVariables.md §6.2).
// --------------------------------------------------

function txt_state_update(E_t) {
    const prev_SA = txtState.SA_txt;  // snapshot for FD gradient

    txtState.SA_txt = seClamp(txtState.SA_txt + E_t.dSA);
    txtState.IF     = seClamp(txtState.IF     + E_t.dIF);
    txtState.IT     = seClamp(txtState.IT     + E_t.dIT);
    txtState.BI     = seClamp(txtState.BI     + E_t.dBI);
    txtState.SE_txt = seClamp(txtState.SE_txt + E_t.dSE);

    // FD: clamp( (SA_txt,t+1 - SA_txt,t) * k_FD + 0.5 ) — k_FD = 6
    // Exponentially smoothed to capture trend (TextStateVariables.md §6.2)
    const gradient  = txtState.SA_txt - prev_SA;
    const fd_target = seClamp(0.5 + gradient * 6.0 + E_t.dFD);
    txtState.FD     = seClamp(txtState.FD * TXT_DECAY + fd_target * (1 - TXT_DECAY));
}

// --------------------------------------------------
// STEP 5 — ADJUSTMENT FORMULATION  (TextTickArchitecture.md Step 5)
// Determines the behavioral mode constraint on the text response.
// Priority order mirrors SE vC5.3 recovery precedence.
// --------------------------------------------------

function txt_adjustment() {
    if (txtState.SE_txt < TXT_COLLAPSE_THRESHOLD) return { mode: 'reduced', action: 'stabilize' };
    if (txtState.IT     < 0.40)                   return { mode: 'normal',  action: 'reassert_identity' };
    if (txtState.BI     < 0.35)                   return { mode: 'normal',  action: 'reinforce_boundary' };
    if (txtState.FD     < 0.30)                   return { mode: 'normal',  action: 'redirect' };
    return { mode: 'normal', action: 'advance' };
}

// --------------------------------------------------
// STEP 6 — IDENTITY TRACE UPDATE  (TextTickArchitecture.md Step 6)
// Records completed turn; advances lifecycle (L_t → L_{t+1}).
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
// FULL TEXT-DOMAIN TICK  (TextTickArchitecture.md)
// (X_t, S_t) → (adjustment, S_{t+1})
// Returns: adjustment object for Kernel.js to apply to reply.
// --------------------------------------------------

function txt_tick(text) {
    // Step 0 — Reduced Operational Mode check (SE_txt < θ_collapse)
    txtState.reducedMode = (txtState.SE_txt < TXT_COLLAPSE_THRESHOLD);
    if (txtState.reducedMode) {
        // Minimal operation: regenerate SE_txt only; skip full pipeline
        txtState.SE_txt = seClamp(txtState.SE_txt + REGEN_SE * 3);
        txtState.lifecycle += 1;
        return { mode: 'reduced', action: 'stabilize' };
    }

    // Step 1 — Boundary evaluation
    const { w, flags } = txt_boundary_eval(text);

    // Step 2 — Input sensing
    const P_t = txt_sense(text, w);

    // Step 3 — Coherence evaluation
    const E_t = txt_evaluate(P_t, flags);

    // Step 4 — State update
    txt_state_update(E_t);

    // Step 5 — Adjustment formulation
    const adjustment = txt_adjustment();

    // Step 6 — Identity trace update
    txt_identity_trace_update(text);

    // Step 7 — return adjustment (text output built by Kernel.js / generateReply)
    return adjustment;
}

// --------------------------------------------------
// TXT ANNOTATION  — structural note appended to kernel reply
// Called in Kernel.js when boundary or identity conditions trigger.
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
