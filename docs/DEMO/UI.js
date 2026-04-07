// -----------------------------
// UI Wiring
// -----------------------------

const input = document.getElementById("terminal-input");
const output = document.getElementById("terminal-output");
const statePanel = document.getElementById("state-json");

// Chat-style message renderer
function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = "msg " + sender;
    msg.textContent = text;
    output.appendChild(msg);
    output.scrollTop = output.scrollHeight;
}

// Initial system message
addMessage("system", "Kernel online. State ready.");

// Input handler
if (input) {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            const text = input.value.trim();
            if (!text) return;

            input.value = "";

            // User message
            addMessage("user", text);

            // Kernel processing
            const intent = parseIntent(text);
            const reply = processIntent(intent, text);

            // System response
            addMessage("system", reply);

            // Update state panel
            statePanel.textContent = JSON.stringify(kernelState, null, 2);

            // Redraw visualizations
            draw2D(kernelState);
            draw3D(kernelState);
        }
    });
}

// Initial draw
statePanel.textContent = JSON.stringify(kernelState, null, 2);
draw2D(kernelState);
draw3D(kernelState);
