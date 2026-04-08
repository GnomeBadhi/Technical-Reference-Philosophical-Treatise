// =============================================================
// UI.js — Sovereign Cockpit Interface
// Enhanced Cockpit (C‑C): Bottom Instrument Bar
// =============================================================

// --------------------------------------------------
// DOM ELEMENTS
// --------------------------------------------------

const termOut = document.getElementById("terminal-output");
const termIn  = document.getElementById("terminal-input");
const stateJson = document.getElementById("state-json");
const primitivesGrid = document.getElementById("primitives-grid");
const regimeBadge = document.getElementById("regime-badge");

const txtGrid = document.getElementById("txt-primitives-grid");
const txtBadge = document.getElementById("txt-regime-badge");

const txtOutGrid  = document.getElementById("txt-out-primitives-grid");
const txtOutBadge = document.getElementById("txt-out-regime-badge");

// Bottom cockpit bar (created dynamically)
let bottomBar, fdBar, regimeStrip, tickLogBody;

// --------------------------------------------------
// TERMINAL PRINTING
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
// PRIMITIVES PANELS
// --------------------------------------------------

const PRIM_DEFS = [
    { key: "RA", label: "RA", desc: "Reality Alignment", color: "#00dcd8" },
    { key: "SA", label: "SA", desc: "Shared Awareness", color: "#5090ff" },
    { key: "AI", label: "AI", desc: "Autonomy Integrity", color: "#a060ff" },
    { key: "CE", label: "CE", desc: "Cognitive Energy", color: "#40e080" },
    { key: "CD", label: "CD", desc: "Continuity Drive", color: "#ffb840" },
    { key: "AC", label: "AC", desc: "Adaptive Capacity", color: "#ff6480" }
];

const TXT_PRIM_DEFS = [
    { key: "SA_txt", label: "SA", desc: "Structural Alignment", color: "#c060ff" },
    { key: "IF",     label: "IF", desc: "Input Fidelity", color: "#609fff" },
    { key: "IT",     label: "IT", desc: "Identity Trace", color: "#40d0b0" },
    { key: "BI",     label: "BI", desc: "Boundary Integrity", color: "#ffa040" },
    { key: "SE_txt", label: "SE", desc: "Structural Energy", color: "#80ff60" },
    { key: "FD",     label: "FD", desc: "Flow Directionality", color: "#ff60a0" }
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
            `<div class="prim-label">
                <span class="prim-name">${p.label}</span>
                <span class="prim-value">${val.toFixed(3)}</span>
            </div>
            <div class="prim-bar-track">
                <div class="prim-bar-fill" style="width:${pct}%;background:${p.color};"></div>
            </div>`;

        primitivesGrid.appendChild(row);
    }
}

function buildTxtPrimitivesGrid(state) {
    txtGrid.innerHTML = "";
    for (const p of TXT_PRIM_DEFS) {
        const val = state[p.key];
        const pct = (val * 100).toFixed(0);

        const row = document.createElement("div");
        row.className = "prim-row";
        row.title = p.desc;

        row.innerHTML =
            `<div class="prim-label">
                <span class="prim-name">${p.label}</span>
                <span class="prim-value">${val.toFixed(3)}</span>
            </div>
            <div class="prim-bar-track">
                <div class="prim-bar-fill" style="width:${pct}%;background:${p.color};"></div>
            </div>`;

        txtGrid.appendChild(row);
    }
}

function buildTxtOutPrimitivesGrid(state) {
    txtOutGrid.innerHTML = "";
    for (const p of TXT_PRIM_DEFS) {
        const val = state[p.key];
        const pct = (val * 100).toFixed(0);

        const row = document.createElement("div");
        row.className = "prim-row";
        row.title = p.desc;

        row.innerHTML =
            `<div class="prim-label">
                <span class="prim-name">${p.label}</span>
                <span class="prim-value">${val.toFixed(3)}</span>
            </div>
            <div class="prim-bar-track">
                <div class="prim-bar-fill" style="width:${pct}%;background:${p.color};"></div>
            </div>`;

        txtOutGrid.appendChild(row);
    }
}

// --------------------------------------------------
// REGIME BADGES
// --------------------------------------------------

const AUTONOMY_CRISIS_THRESHOLD = 0.2;
const FLOURISHING_CE_THRESHOLD = 0.7;
const FLOURISHING_AI_THRESHOLD = 0.7;

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

    // Also update bottom strip
    regimeStrip.textContent = label;
    regimeStrip.className = "regime-strip " + cls;
}

function updateTxtRegimeBadge(state) {
    if (state.reducedMode) {
        txtBadge.textContent = "REDUCED";
        txtBadge.className = "txt-regime-reduced";
    } else {
        txtBadge.textContent = "ACTIVE";
        txtBadge.className = "txt-regime-active";
    }
}

function updateTxtOutRegimeBadge(state) {
    if (state.reducedMode) {
        txtOutBadge.textContent = "REDUCED";
        txtOutBadge.className = "txt-out-regime-reduced";
    } else {
        txtOutBadge.textContent = "ACTIVE";
        txtOutBadge.className = "txt-out-regime-active";
    }
}

// --------------------------------------------------
// FD GRADIENT BAR
// --------------------------------------------------

function updateFDGradient(fd) {
    const pct = Math.max(0, Math.min(1, fd));
    const hue = pct * 120; // red → yellow → green
    fdBar.style.background = `linear-gradient(to right,
        hsl(${hue}, 80%, 55%) ${pct * 100}%,
        rgba(60,60,60,0.2) ${pct * 100}%
    )`;
}

// --------------------------------------------------
// TICK LOG
// --------------------------------------------------

function logTick(kernelState, txtIn, txtOut, inputAdj, outputAdj) {
    const mgr = (typeof ManagerKernel !== "undefined") ? ManagerKernel : null;
    const entry = [
        `Tick ${mgr ? mgr.lifecycle : kernelState.lifecycle}`,
        `  Manager:  L=${mgr ? mgr.lifecycle : "?"} violations=${mgr ? mgr.axiomViolations.length : 0} coherenceEvents=${mgr ? mgr.coherenceLog.length : 0}`,
        `  TxtIn:   SA=${txtIn.SA_txt.toFixed(2)} IF=${txtIn.IF.toFixed(2)} IT=${txtIn.IT.toFixed(2)} BI=${txtIn.BI.toFixed(2)} SE=${txtIn.SE_txt.toFixed(2)} FD=${txtIn.FD.toFixed(2)} → ${inputAdj.mode}/${inputAdj.action}`,
        `  Kernel:  RA=${kernelState.RA.toFixed(2)} SA=${kernelState.SA.toFixed(2)} AI=${kernelState.AI.toFixed(2)} CE=${kernelState.CE.toFixed(2)}`,
        `  TxtOut:  SA=${txtOut.SA_txt.toFixed(2)} IF=${txtOut.IF.toFixed(2)} IT=${txtOut.IT.toFixed(2)} BI=${txtOut.BI.toFixed(2)} SE=${txtOut.SE_txt.toFixed(2)} FD=${txtOut.FD.toFixed(2)} → ${outputAdj.mode}/${outputAdj.action}`,
        ""
    ].join("\n");

    tickLogBody.textContent += entry;
    tickLogBody.scrollTop = tickLogBody.scrollHeight;
}

// --------------------------------------------------
// STATE PANEL UPDATE
// --------------------------------------------------

function updateStatePanel() {
    buildPrimitivesGrid(kernelState);
    updateRegimeBadge(kernelState);

    buildTxtPrimitivesGrid(txtStateIn);
    updateTxtRegimeBadge(txtStateIn);

    buildTxtOutPrimitivesGrid(txtStateOut);
    updateTxtOutRegimeBadge(txtStateOut);

    updateFDGradient(txtStateIn.FD);

    const mgr = (typeof ManagerKernel !== "undefined") ? ManagerKernel : null;
    const network = {
        manager: mgr ? {
            lifecycle:       mgr.lifecycle,
            coherenceLog:    mgr.coherenceLog,
            axiomViolations: mgr.axiomViolations
        } : null,
        kernelNode:    kernelState,
        txtIn:         txtStateIn,
        txtOut:        txtStateOut,
        couplingNodes: kernelNodes
    };
    stateJson.textContent = JSON.stringify(network, null, 2);
}

// --------------------------------------------------
// MAIN MESSAGE HANDLER
// --------------------------------------------------

function handleMessage(text) {
    if (!text.trim()) return;

    printUser(text);

    // Disable input and show thinking indicator before processing begins
    termIn.disabled = true;
    showThinking();

    const delay = 300 + Math.random() * 300;
    setTimeout(() => {
        try {
            removeThinking();

            // processMessage returns { reply, inputAdj, outputAdj } (ManagerKernel coordinates all nodes)
            // Runs inside the delay so the thinking indicator is visible before state advances
            const { reply: finalReply, inputAdj, outputAdj } = processMessage(text);

            printKernel(finalReply);

            if (typeof speakReply === "function") speakReply(finalReply);

            updateStatePanel();
            draw2D(kernelState);
            draw3D(kernelState);

            logTick(kernelState, txtStateIn, txtStateOut, inputAdj, outputAdj);
        } finally {
            termIn.disabled = false;
            termIn.focus();
        }
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
// CREATE BOTTOM COCKPIT BAR
// --------------------------------------------------

function createBottomBar() {
    bottomBar = document.createElement("div");
    bottomBar.id = "cockpit-bottom-bar";

    fdBar = document.createElement("div");
    fdBar.id = "fd-gradient";

    regimeStrip = document.createElement("div");
    regimeStrip.id = "regime-strip";

    const tickDetails = document.createElement("details");
    tickDetails.id = "tick-log";

    const summary = document.createElement("summary");
    summary.textContent = "Tick Log";

    tickLogBody = document.createElement("pre");
    tickLogBody.id = "tick-log-body";

    tickDetails.appendChild(summary);
    tickDetails.appendChild(tickLogBody);

    bottomBar.appendChild(fdBar);
    bottomBar.appendChild(regimeStrip);
    bottomBar.appendChild(tickDetails);

    document.body.appendChild(bottomBar);
}

// --------------------------------------------------
// LIVE CLOCK
// --------------------------------------------------

const clockEl = document.getElementById("live-clock");

function updateClock() {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const lifecycle = (typeof ManagerKernel !== "undefined") ? ManagerKernel.lifecycle : kernelState.lifecycle;
    clockEl.textContent =
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` +
        `  L:${lifecycle}`;
}

// --------------------------------------------------
// INITIALIZE
// --------------------------------------------------

window.addEventListener("load", () => {
    createBottomBar();

    updateStatePanel();
    draw2D(kernelState);
    draw3D(kernelState);

    // Live clock — updates every second
    updateClock();
    setInterval(updateClock, 1000);

    // Real-time visualization — redraws canvases every second
    setInterval(() => {
        draw2D(kernelState);
        draw3D(kernelState);
    }, 1000);

    printKernel(
        "Sovereignty Engine vC5.3 online. " +
        "Four-node architecture active: Manager \u2192 TextKernel-In \u2192 Kernel \u2192 TextKernel-Out. " +
        "Axiom set enforced across all nodes. What\u2019s on your mind?"
    );
});
