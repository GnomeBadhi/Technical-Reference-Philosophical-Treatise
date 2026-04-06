// ============================================================
// UI — wires LLM boundary layer → Kernel → Visualiser
//
// Separation of concerns:
//   analyzeIntent()  lives in LLM.js  (input boundary)
//   processIntent()  lives in Kernel.js (pure engine)
//   draw2D / draw3D / drawEmotions  live in Visualizer.js
// ============================================================

const inputEl   = document.getElementById("terminal-input");
const outputEl  = document.getElementById("terminal-output");
const stateEl   = document.getElementById("state-json");

// Current emotion state — updated after each message
let currentEmotions = (typeof ZERO_EMOTIONS !== "undefined")
    ? { ...ZERO_EMOTIONS }
    : { joy: 0, trust: 0, fear: 0, surprise: 0, sadness: 0, disgust: 0, anger: 0, anticipation: 0 };

function print(text) {
    outputEl.textContent += text + "\n";
    outputEl.scrollTop = outputEl.scrollHeight;
}

// ------------------------------------------------------------------
// Domain preset selector
// ------------------------------------------------------------------
const domainSelector = document.getElementById("domain-selector");
if (domainSelector) {
    domainSelector.addEventListener("change", () => {
        const key = domainSelector.value;
        setDomain(key);
        stateEl.textContent = JSON.stringify(kernelState, null, 2);
        draw2D(kernelState);
        draw3D(kernelState);
        const label = (typeof DOMAIN_PRESETS !== "undefined" && DOMAIN_PRESETS[key])
            ? DOMAIN_PRESETS[key].label : key;
        print("[domain] switched to: " + label);
    });
}

// ------------------------------------------------------------------
// Main input handler — async because LLM call may be awaited
// ------------------------------------------------------------------
inputEl.addEventListener("keydown", async event => {
    if (event.key !== "Enter") return;

    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    inputEl.disabled = true;

    print("> " + text);
    print("  [boundary: analysing…]");

    // ── 1. Boundary layer: raw text → structured intent + emotions
    //       The kernel never sees the LLM reasoning, raw text, or emotions.
    let intent;
    try {
        intent = await analyzeIntent(text, kernelState);
    } catch (err) {
        print("  [boundary error: " + err.message + "]");
        inputEl.disabled = false;
        return;
    }

    // Show boundary reasoning in the terminal (UI-only; never passed to kernel)
    print("  [boundary → " + intent.source.toUpperCase() + "] "
        + intent.operator + " ×" + intent.magnitude.toFixed(2)
        + " — " + intent.reasoning);

    // ── 2. Pure kernel: structured intent → state transition
    //       Only operator + magnitude reach the engine.
    const result = processIntent({
        operator:  intent.operator,
        magnitude: intent.magnitude
    });

    if (result.rejected) {
        print("  [kernel] input rejected by boundary: " + result.reason);
    } else {
        print("  [kernel t=" + result.t + "] "
            + result.operator
            + " | viable=" + result.viability
            + " | C(S)=" + result.constraintC);
        print("  Δ " + JSON.stringify(result.delta));
    }

    // ── 3. Update emotions display
    if (intent.emotions) {
        currentEmotions = intent.emotions;
        drawEmotions(currentEmotions);
    }

    // ── 4. Refresh state displays
    stateEl.textContent = JSON.stringify(kernelState, null, 2);
    draw2D(kernelState);
    startAnimation(kernelState);

    inputEl.disabled = false;
    inputEl.focus();
});

// ------------------------------------------------------------------
// Collapsible LLM config panel toggle
// ------------------------------------------------------------------
const configToggle = document.getElementById("config-toggle");
const configBody   = document.getElementById("config-body");
if (configToggle && configBody) {
    configToggle.addEventListener("click", () => {
        const hidden = configBody.style.display === "none";
        configBody.style.display = hidden ? "block" : "none";
        configToggle.textContent  = hidden ? "▲ LLM Config" : "▼ LLM Config";
    });
}

// ------------------------------------------------------------------
// Initial static render (no animation until first kernel call)
// ------------------------------------------------------------------
draw2D(kernelState);
draw3D(kernelState);
drawEmotions(currentEmotions);
stateEl.textContent = JSON.stringify(kernelState, null, 2);
