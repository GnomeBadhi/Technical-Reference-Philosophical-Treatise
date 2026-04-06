const input = document.getElementById("terminal-input");
const output = document.getElementById("terminal-output");
const statePanel = document.getElementById("state-json");

function print(text) {
    output.textContent += text + "\n";
    output.scrollTop = output.scrollHeight;
}

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const text = input.value.trim();
        input.value = "";
        print("> " + text);

        const intent = parseIntent(text);
        const result = processIntent(intent);

        print(JSON.stringify(result, null, 2));

        statePanel.textContent = JSON.stringify(kernelState, null, 2);

        draw2D(kernelState);

        // Start the 3D animation loop on first kernel initiation;
        // angle only begins advancing from this point onward
        startAnimation(kernelState);
    }
});

// Initial static draw (no animation yet)
draw2D(kernelState);
draw3D(kernelState);
statePanel.textContent = JSON.stringify(kernelState, null, 2);
