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

function updateRegimeBadge(state) {
    const ra = state.RA, sa = state.SA, ce = state.CE, ai = state.AI;
    let label, cls;
    if (state.recoveryMode) {
        label = "RECOVERY"; cls = "regime-recovery";
    } else if (Math.abs(ra - sa) > 0.2) {
        label = "AUTONOMY CRISIS"; cls = "regime-crisis";
    } else if (ce >= 0.7 && ai >= 0.7) {
        label = "FLOURISHING"; cls = "regime-flourishing";
    } else {
        label = "STRESS-ADAPTED"; cls = "regime-stress";
    }
    regimeBadge.textContent = label;
    regimeBadge.className = cls;
}

// --------------------------------------------------
// UPDATE STATE PANEL
// --------------------------------------------------

function updateStatePanel() {
    buildPrimitivesGrid(kernelState);
    updateRegimeBadge(kernelState);

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
