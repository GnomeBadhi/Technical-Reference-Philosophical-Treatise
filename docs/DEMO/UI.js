// ── DOM refs ──────────────────────────────────────────────────────────
const chatInput    = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const stateBars    = document.getElementById("state-bars");
const opLog        = document.getElementById("op-log");

// ── Helpers ───────────────────────────────────────────────────────────
function pct(v)   { return (v * 100).toFixed(1) + "%"; }
function meanPct(s) {
    const m = PRIMITIVES.reduce((acc, k) => acc + s[k], 0) / PRIMITIVES.length;
    return (m * 100).toFixed(1) + "%";
}
function timestamp() {
    const d = new Date();
    return d.getHours().toString().padStart(2, "0") + ":"
         + d.getMinutes().toString().padStart(2, "0") + ":"
         + d.getSeconds().toString().padStart(2, "0");
}
function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── SOVA response pool ────────────────────────────────────────────────
const SOVA_RESPONSES = {
    ALIGN_REALITY: [
        s => `Reality calibration sequence complete. RA climbing to ${pct(s.RA)} — coherence margin stable. Background noise attenuated. Shared Awareness updated to ${pct(s.SA)}.`,
        s => `Ground truth vector locked. Reality Alignment reads ${pct(s.RA)}. Sensor drift corrected. Cognitive load reduced to ${pct(s.CE)} to free calibration bandwidth.`,
    ],
    EXPAND_AWARENESS: [
        s => `Wide-field sensor sweep complete. Shared Awareness extended to ${pct(s.SA)}. Peripheral signatures indexed. Energy draw at ${pct(s.CE)}.`,
        s => `Awareness net expanded. SA now ${pct(s.SA)}, RA baseline ${pct(s.RA)}. All quadrants scanned and logged.`,
    ],
    GUARD_AUTONOMY: [
        s => `Boundary lattice engaged. Autonomy Integrity reinforced to ${pct(s.AI)}. Continuity Drive updated to ${pct(s.CD)}. Perimeter holding. External interference nullified.`,
        s => `Defense protocols active. AI reads ${pct(s.AI)}. Identity boundary secured. Energy overhead absorbed; CE at ${pct(s.CE)}.`,
    ],
    RESTORE_ENERGY: [
        s => `Power cycle complete. Cognitive Energy restored to ${pct(s.CE)}. Continuity Drive holding at ${pct(s.CD)}. Reserve capacity replenished. Adaptive Capacity improved to ${pct(s.AC)}.`,
        s => `Energy grid recharged. CE at ${pct(s.CE)} — all systems nominal. Recommend strategic deployment before next high-load operation.`,
    ],
    DRIVE_CONTINUITY: [
        s => `Continuity protocols engaged. CD now ${pct(s.CD)}. Autonomy Integrity reinforced to ${pct(s.AI)}. Long-range trajectory locked and stable.`,
        s => `Persistence vector confirmed. CD reads ${pct(s.CD)}. Mission profile maintained. Energy draw manageable at ${pct(s.CE)}.`,
    ],
    EXPAND_CAPACITY: [
        s => `Capacity expansion matrix updated. Adaptive Capacity elevated to ${pct(s.AC)}. Cognitive overhead noted — CE at ${pct(s.CE)}. RA variance within tolerance.`,
        s => `Growth protocol applied. AC now ${pct(s.AC)}. System learning rate increased. Recommend energy restoration when CE drops below 50%.`,
    ],
    STABILIZE: [
        s => `Field harmonization complete. All primitives converging toward equilibrium. Mean alignment: ${meanPct(s)}. Oscillation probability low.`,
        s => `Stabilization sweep applied. Primitive spread reduced. System coherence improved. Mean reads ${meanPct(s)}.`,
    ],
    QUERY: [
        s => `Acknowledged. Query logged. SA reads ${pct(s.SA)} — passive scan active. Minimal state perturbation. Standing by for further instruction.`,
        s => `Signal received. Kernel nominal. All six primitives within operational range. What is your directive?`,
        s => `Input registered. No matching directive pattern — running passive scan. CE reduced slightly to ${pct(s.CE)}. Awaiting command.`,
    ],
};

function pickResponse(type, state) {
    const pool = SOVA_RESPONSES[type] || SOVA_RESPONSES.QUERY;
    const fn   = pool[Math.floor(Math.random() * pool.length)];
    let text   = fn(state);
    const low  = PRIMITIVES.filter(k => state[k] < 0.35).map(k => `${k} at ${pct(state[k])}`);
    if (low.length) text += `\n\n⚠  Warning: ${low.join(", ")} — below operational threshold.`;
    return text;
}

// ── Chat rendering ────────────────────────────────────────────────────
function appendMessage(role, text) {
    const label = role === "user" ? "OPERATOR" : "SOVA";
    const wrap  = document.createElement("div");
    wrap.className = `msg ${role}`;
    wrap.innerHTML =
        `<div class="msg-label">${label}</div>` +
        `<div class="msg-bubble">${escHtml(text)}</div>`;
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return wrap;
}

function showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "msg sova typing-bubble";
    wrap.innerHTML =
        `<div class="msg-label">SOVA</div>` +
        `<div class="msg-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return wrap;
}

// ── State bars ────────────────────────────────────────────────────────
const BAR_COLORS = {
    RA: "#1a8aaa", SA: "#1aaa6a", AI: "#aaaa1a",
    CE: "#aa7a1a", CD: "#7a1aaa", AC: "#aa1a6a"
};

function renderStateBars() {
    stateBars.innerHTML = PRIMITIVES.map(k => {
        const v   = kernelState[k];
        const col = BAR_COLORS[k];
        return `<div class="bar-row">` +
            `<span class="bar-key">${k}</span>` +
            `<div class="bar-track"><div class="bar-fill" style="width:${(v * 100).toFixed(1)}%;background:${col}"></div></div>` +
            `<span class="bar-pct">${(v * 100).toFixed(0)}%</span>` +
            `</div>`;
    }).join("");
}

// ── Operator log ──────────────────────────────────────────────────────
function addToOpLog(opName) {
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `<span class="log-op">${opName}</span><span class="log-time">${timestamp()}</span>`;
    opLog.insertBefore(entry, opLog.firstChild);
    while (opLog.children.length > 20) opLog.removeChild(opLog.lastChild);
}

// ── Input handler ─────────────────────────────────────────────────────
chatInput.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const text = chatInput.value.trim();
    chatInput.value = "";
    if (!text) return;

    appendMessage("user", text);

    if (/^help$/i.test(text)) {
        const help = [
            "I respond to natural language. Try phrases like:",
            "",
            '  "align reality"       — reinforces RA, improves SA',
            '  "expand awareness"    — boosts SA, widens scan',
            '  "guard integrity"     — strengthens AI boundary',
            '  "restore energy"      — recharges CE reserves',
            '  "sustain continuity"  — drives CD forward',
            '  "adapt and grow"      — elevates AC',
            '  "stabilize"           — harmonizes all primitives',
            '  "status"              — full system readout',
        ].join("\n");
        setTimeout(() => appendMessage("sova", help), 400);
        return;
    }

    if (/^status$/i.test(text)) {
        const lines = ["── KERNEL STATUS ──────────────────────────────"];
        PRIMITIVES.forEach(k => {
            const v   = kernelState[k];
            const bar = "█".repeat(Math.round(v * 16)).padEnd(16, "░");
            lines.push(`  ${k}  ${bar}  ${(v * 100).toFixed(1)}%  ${PRIMITIVE_NAMES[k]}`);
        });
        lines.push(`\n  Total operations: ${kernelState.history.length}`);
        setTimeout(() => appendMessage("sova", lines.join("\n")), 500);
        return;
    }

    const typing = showTyping();
    const delay  = 540 + Math.random() * 360;

    setTimeout(() => {
        typing.remove();
        const result   = processIntent(text);
        const response = pickResponse(result.intent.type, kernelState);
        appendMessage("sova", response);
        renderStateBars();
        draw2D(kernelState);
        addToOpLog(result.intent.type);
    }, delay);
});

// ── Boot ──────────────────────────────────────────────────────────────
renderStateBars();
draw2D(kernelState);

setTimeout(() => {
    appendMessage("sova",
        "Sovereign Kernel vC5.3 online. All six primitives initialized.\n" +
        "SOVA navigation interface active. Orbital map is live.\n\n" +
        'Say "help" for a list of directives, or speak naturally.'
    );
}, 300);

