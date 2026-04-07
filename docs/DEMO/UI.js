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

    // Show user message
    printUser(text);

    // ── SOVEREIGNTY ENGINE PIPELINE ──────────────────────────────────
    // Formal pipeline: B_t(X_t) → P_t → E_t → A_t → U → L' → validate
    // ArchitectureSpecifications §4-6, InvariantStructure §4

    // 1. Boundary Operator: B_t(X_t) → X_t*
    //    Filters raw input based on current boundary integrity state.
    const filteredInput = applyBoundaryFilter(text, kernelState);

    // 2. Affect + personality update (scaled by boundary gain)
    updateAffectFromText(filteredInput.text, filteredInput.gain);
    updatePersonalityFromText(filteredInput.text);

    // 3. Perception: P_t = Extract(S_t, X_t*)
    const intent = parseIntent(filteredInput.text);

    // 4. Evaluation: E_t = Assess(P_t)
    const evaluation = evaluatePerception(intent, filteredInput, kernelState);

    // 5. Adjustment + Update: A_t = R(S_t, E_t) → S_{t+1}
    //    (lifecycle advancement and invariant validation occur inside)
    processIntent(intent, filteredInput.text, evaluation);
    // ─────────────────────────────────────────────────────────────────

    // Generate reply
    const reply = generateReply(intent, kernelState, text);

    // Show thinking indicator, then reveal reply after a short delay
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

    // Welcome message
    printKernel("Hello. I'm the Sovereign Kernel — I track your clarity, boundary, and state as we talk. Just speak naturally. What's on your mind?");
});
