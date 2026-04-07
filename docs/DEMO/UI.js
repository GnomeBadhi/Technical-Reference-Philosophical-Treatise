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
    div.textContent = text;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}

function printKernel(text) {
    const div = document.createElement("div");
    div.className = "kernel";
    div.textContent = text;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}

// --------------------------------------------------
// UPDATE STATE PANEL
// --------------------------------------------------

function updateStatePanel() {
    stateJson.textContent = JSON.stringify(kernelState, null, 2);
}

// --------------------------------------------------
// MAIN MESSAGE HANDLER
// --------------------------------------------------

function handleMessage(text) {
    if (!text.trim()) return;

    // Show user message
    printUser(text);

    // Update affect + personality
    updateAffectFromText(text);
    updatePersonalityFromText(text);

    // Parse intent
    const intent = parseIntent(text);

    // Mutate state
    processIntent(intent, text);

    // Generate reply
    const reply = generateReply(intent, kernelState, text);

    // Output reply
    printKernel(reply);

    // Update state panel
    updateStatePanel();

    // Redraw visuals
    draw2D(kernelState);
    draw3D(kernelState);
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
});
