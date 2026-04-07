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

// Initial system message
addMessage("system", "Kernel online. State ready.");


// -----------------------------
// Input Handler
// -----------------------------

if (input) {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            const text = input.value.trim();
            if (!text) return;
            input.value = "";

            // User message
            addMessage("user", text);

            // Update kernel models
            updateAffectFromText(text);
            updatePersonalityFromText(text);

            // Parse → mutate → generate reply
            const intent = parseIntent(text);
            processIntent(intent, text);
            const reply = generateReply(intent, kernelState, text);

            // System reply
            addMessage("system", reply);

            // Update state panel
            statePanel.textContent = JSON.stringify(kernelState, null, 2);

            // Redraw visualizations
            draw2D(kernelState);
            draw3D(kernelState);
        }
    });
}


// -----------------------------
// Initial Draw
// -----------------------------

statePanel.textContent = JSON.stringify(kernelState, null, 2);
draw2D(kernelState);
draw3D(kernelState);
