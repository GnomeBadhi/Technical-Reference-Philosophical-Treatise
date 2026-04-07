// --------------------------------------------------
// TERMINAL ELEMENTS
// --------------------------------------------------

const termOut = document.getElementById("terminal-output");
const termIn = document.getElementById("terminal-input");
const stateJson = document.getElementById("state-json");
const primitivesGrid = document.getElementById("primitives-grid");
const regimeBadge = document.getElementById("regime-badge");

// --------------------------------------------------
// PRINT TO TERMINAL
// --------------------------------------------------

function printUser(text) {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = "You: " + text;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}

function printKernel(text) {
    const div = document.createElement("div");
    div.className = "kernel";
    div.textContent = "Kernel: " + text;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}

// Show / remove a temporary "thinking" indicator
function showThinking() {
    const div = document.createElement("div");
    div.className = "kernel thinking";
    div.id = "thinking-indicator";
    div.textContent = "Kernel: …";
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}

function removeThinking() {
    const el = document.getElementById("thinking-indicator");
    if (el) el.remove();
}

// --------------------------------------------------
// PRIMITIVES DISPLAY HELPERS
// --------------------------------------------------

const PRIM_DEFS = [
    { key: "RA", label: "RA",  desc: "Reality Alignment",  color: "#00dcd8" },
    { key: "SA", label: "SA",  desc: "Shared Awareness",   color: "#5090ff" },
    { key: "AI", label: "AI",  desc: "Autonomy Integrity", color: "#a060ff" },
    { key: "CE", label: "CE",  desc: "Cognitive Energy",   color: "#40e080" },
    { key: "CD", label: "CD",  desc: "Continuity Drive",   color: "#ffb840" },
    { key: "AC", label: "AC",  desc: "Adaptive Capacity",  color: "#ff6480" }
];

// Text-domain primitive definitions — mirrors PRIM_DEFS structure
const TXT_PRIM_DEFS = [
    { key: "SA_txt", label: "SA", desc: "Structural Alignment",  color: "#c060ff" },
    { key: "IF",     label: "IF", desc: "Input Fidelity",        color: "#609fff" },
    { key: "IT",     label: "IT", desc: "Identity Trace",        color: "#40d0b0" },
    { key: "BI",     label: "BI", desc: "Boundary Integrity",    color: "#ffa040" },
    { key: "SE_txt", label: "SE", desc: "Structural Energy",     color: "#80ff60" },
    { key: "FD",     label: "FD", desc: "Flow Directionality",   color: "#ff60a0" }
];

function buildPrimitivesGrid(state) {
    primitivesGrid.innerHTML = "";
    for (const p of PRIM_DEFS) {
        const val = state[p.key];
        const pct = (val * 100).toFixed(0);

        const row = document.createElement("div");
        row.className = "prim-row";
        row.title = p.desc;

        row.innerHTML =
            `<div class="prim-label">` +
                `<span class="prim-name">${p.label}</span>` +
                `<span class="prim-value">${val.toFixed(3)}</span>` +
            `</div>` +
            `<div class="prim-bar-track">` +
                `<div class="prim-bar-fill" style="width:${pct}%;background:${p.color};"></div>` +
            `</div>`;

        primitivesGrid.appendChild(row);
    }
}

function buildTxtPrimitivesGrid(state) {
    const grid = document.getElementById("txt-primitives-grid");
    if (!grid || !state) return;
    grid.innerHTML = "";
    for (const p of TXT_PRIM_DEFS) {
        const val = state[p.key];
        const pct = (val * 100).toFixed(0);

        const row = document.createElement("div");
        row.className = "prim-row";
        row.title = p.desc;

        row.innerHTML =
            `<div class="prim-label">` +
                `<span class="prim-name">${p.label}</span>` +
                `<span class="prim-value">${val.toFixed(3)}</span>` +
            `</div>` +
            `<div class="prim-bar-track">` +
                `<div class="prim-bar-fill" style="width:${pct}%;background:${p.color};"></div>` +
            `</div>`;

        grid.appendChild(row);
    }
}

// Regime threshold constants — mirror Kernel.js §15.5
const AUTONOMY_CRISIS_THRESHOLD  = 0.2;  // |RA-SA| above this → autonomy crisis
const FLOURISHING_CE_THRESHOLD   = 0.7;  // CE must be ≥ this for flourishing
const FLOURISHING_AI_THRESHOLD   = 0.7;  // AI must be ≥ this for flourishing

function updateRegimeBadge(state) {
    const ra = state.RA, sa = state.SA, ce = state.CE, ai = state.AI;
    let label, cls;
    if (state.recoveryMode) {
        label = "RECOVERY"; cls = "regime-recovery";
    } else if (Math.abs(ra - sa) > AUTONOMY_CRISIS_THRESHOLD) {
        label = "AUTONOMY CRISIS"; cls = "regime-crisis";
    } else if (ce >= FLOURISHING_CE_THRESHOLD && ai >= FLOURISHING_AI_THRESHOLD) {
        label = "FLOURISHING"; cls = "regime-flourishing";
    } else {
        label = "STRESS-ADAPTED"; cls = "regime-stress";
    }
    regimeBadge.textContent = label;
    regimeBadge.className = cls;
}

function updateTxtRegimeBadge(state) {
    const badge = document.getElementById("txt-regime-badge");
    if (!badge || !state) return;
    if (state.reducedMode) {
        badge.textContent = "REDUCED";
        badge.className = "txt-regime-reduced";
    } else {
        badge.textContent = "ACTIVE";
        badge.className = "txt-regime-active";
    }
}

// --------------------------------------------------
// UPDATE STATE PANEL
// --------------------------------------------------

function updateStatePanel() {
    buildPrimitivesGrid(kernelState);
    updateRegimeBadge(kernelState);

    if (typeof txtState !== "undefined") {
        buildTxtPrimitivesGrid(txtState);
        updateTxtRegimeBadge(txtState);
    }

    const network = {
        manager: kernelState,
        nodes: kernelNodes
    };
    stateJson.textContent = JSON.stringify(network, null, 2);
}

// --------------------------------------------------
// MAIN MESSAGE HANDLER
// --------------------------------------------------

function handleMessage(text) {
    if (!text.trim()) return;

    printUser(text);

    // ── SOVEREIGNTY ENGINE vC5.3 PIPELINE ────────────────────────────
    // Reference: SovereigntyEngine.pdf §15.4 (Tick Architecture)
    // processMessage: text → (ρ, μ, σ) → se_tick(manager) → propagateCoupling
    // Invariants (purity=1, identity=1, sovereignty=1) are validated inside
    // se_tick for every engine — stable and under coupling influence.
    const reply = processMessage(text);
    // ─────────────────────────────────────────────────────────────────

    termIn.disabled = true;
    showThinking();
    const delay = 300 + Math.random() * 300;
    setTimeout(() => {
        removeThinking();
        printKernel(reply);
        updateStatePanel();
        draw2D(kernelState);
        draw3D(kernelState);
        termIn.disabled = false;
        termIn.focus();
    }, delay);
}

// --------------------------------------------------
// INPUT HANDLER
// --------------------------------------------------

termIn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const text = termIn.value;
        termIn.value = "";
        handleMessage(text);
    }
});

// --------------------------------------------------
// HINT BAR — click to fill input
// --------------------------------------------------

document.querySelectorAll(".hint").forEach((btn) => {
    btn.addEventListener("click", () => {
        termIn.value = btn.textContent;
        termIn.focus();
    });
});

// --------------------------------------------------
// INITIALIZE
// --------------------------------------------------

window.addEventListener("load", () => {
    updateStatePanel();
    draw2D(kernelState);
    draw3D(kernelState);

    // Welcome message — reflects SE6 primitives
    printKernel("Sovereignty Engine vC5.3 online. I track RA, SA, AI, CE, CD, and AC as we talk — six primitives of cybernetic being. The 3 influenced nodes are running. What's on your mind?");
});
