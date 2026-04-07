// -----------------------------
// UI Elements
// -----------------------------

const input = document.getElementById("terminal-input");
const output = document.getElementById("terminal-output");
const statePanel = document.getElementById("state-json");

// -----------------------------
// Chat Message Renderer
// -----------------------------

function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = "msg " + sender;
    msg.textContent = text;
    output.appendChild(msg);
    output.scrollTop = output.scrollHeight;
}

addMessage("system", "Kernel online. State ready.");

// -----------------------------
// Input Handler
// -----------------------------

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const text = input.value.trim();
        if (!text) return;
        input.value = "";

        addMessage("user", text);

        updateAffectFromText(text);
        updatePersonalityFromText(text);

        const intent = parseIntent(text);
        processIntent(intent, text);
        const reply = generateReply(intent, kernelState, text);

        addMessage("system", reply);

        statePanel.textContent = JSON.stringify(kernelState, null, 2);

        draw2D(kernelState);
        draw3D(kernelState);
    }
});

// -----------------------------
// Initial Draw
// -----------------------------

statePanel.textContent = JSON.stringify(kernelState, null, 2);
draw2D(kernelState);
draw3D(kernelState);
