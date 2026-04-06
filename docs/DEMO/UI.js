const input      = document.getElementById("terminal-input");
const output     = document.getElementById("terminal-output");
const statePanel = document.getElementById("state-json");

const HELP_TEXT = [
    "── Sovereign Kernel  vC5.3 ── Commands ──────────────────────",
    "",
    "  align / reality / ground     →  ALIGN_REALITY     ↑RA",
    "  aware / scan / observe        →  EXPAND_AWARENESS  ↑SA",
    "  protect / defend / integrity  →  GUARD_AUTONOMY    ↑AI",
    "  rest / restore / energy       →  RESTORE_ENERGY    ↑CE",
    "  persist / continue / sustain  →  DRIVE_CONTINUITY  ↑CD",
    "  adapt / evolve / expand       →  EXPAND_CAPACITY   ↑AC",
    "  stabilize / balance / calm    →  STABILIZE         ≈all",
    "  status                        →  show full status",
    "  help                          →  this message",
    "  (anything else)               →  QUERY             minor scan",
    "",
    "  Try: 'align reality'  or  'restore energy'  or  'stabilize'"
].join("\n");

function print(text, cls) {
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function renderStatePanel() {
    let out = "{\n";
    PRIMITIVES.forEach(k => {
        const v   = kernelState[k];
        const bar = "█".repeat(Math.round(v * 10)).padEnd(10, "░");
        out += `  "${k}": ${v.toFixed(3)}  ${bar}\n`;
    });
    out += `  "ops": ${kernelState.history.length}\n}`;
    statePanel.textContent = out;
}

input.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const text = input.value.trim();
    input.value = "";
    if (!text) return;

    print("> " + text, "cmd");

    if (/^help$/i.test(text)) {
        print(HELP_TEXT, "info");
        return;
    }

    if (/^status$/i.test(text)) {
        print("── Kernel Status ──────────────────────────────────", "info");
        PRIMITIVES.forEach(k => {
            const v   = kernelState[k];
            const bar = "█".repeat(Math.round(v * 20)).padEnd(20, "░");
            print(`  ${k}  (${PRIMITIVE_NAMES[k]})`, "info");
            print(`      ${bar}  ${(v * 100).toFixed(1)}%`, "info");
        });
        return;
    }

    const result  = processIntent(text);
    const dKeys   = Object.keys(result.delta);

    print(`→ ${result.intent.type}  (confidence: ${(result.intent.confidence * 100).toFixed(0)}%)`, "op");

    if (dKeys.length === 0) {
        print("  No state change (primitive at boundary)", "info");
    } else {
        dKeys.forEach(k => {
            const d    = result.delta[k];
            const sign = d > 0 ? "+" : "";
            print(`  ${k}  (${PRIMITIVE_NAMES[k]})  ${sign}${d}`, d > 0 ? "pos" : "neg");
        });
    }

    renderStatePanel();
    draw2D(kernelState);
});

// Boot
print("Sovereign Kernel  vC5.3  —  type 'help' to see commands.", "info");
print("Six primitives active:  RA  SA  AI  CE  CD  AC", "info");
renderStatePanel();
draw2D(kernelState);
