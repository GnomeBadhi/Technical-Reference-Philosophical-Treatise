// --------------------------------------------------
// TERMINAL ELEMENTS
// --------------------------------------------------

const termOut = document.getElementById("terminal-output");
const termIn = document.getElementById("terminal-input");
const stateJson = document.getElementById("state-json");

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
// UPDATE STATE PANEL
// --------------------------------------------------

function updateStatePanel() {
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
// INITIALIZE
// --------------------------------------------------

window.addEventListener("load", () => {
    updateStatePanel();
    draw2D(kernelState);
    draw3D(kernelState);

    // Welcome message — reflects SE6 primitives
    printKernel("Sovereignty Engine vC5.3 online. I track RA, SA, AI, CE, CD, and AC as we talk — six primitives of cybernetic being. The 3 influenced nodes are running. What's on your mind?");
});
