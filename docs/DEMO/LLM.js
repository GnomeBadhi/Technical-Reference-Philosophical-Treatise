// ============================================================
// LLM Interface — Sovereignty Engine Demo
//
// Sends user text + current kernel state to an LLM and
// receives a structured intent: { operator, magnitude, reasoning }
//
// Supported operators (must match Kernel.js):
//   STABILIZE, TIGHTEN_BOUNDARY, LOOSEN_BOUNDARY,
//   SUPPRESS_ENTROPY, RESTORE_VIABILITY, REGULATE
// ============================================================

const LLM_SYSTEM_PROMPT = `
You are the intent-parsing layer of the Sovereignty Engine, a domain-agnostic
state-transition architecture.

The kernel state has these fields:
  t                 — discrete time index (integer)
  clarity           — internal coherence             [0..1]
  boundary_strength — constraint enforcement         [0..1]
  entropy           — internal disorder              [0..1]
  viability         — boolean (true = system is viable)
  stability         — resistance to divergence       [0..1]

Allowed operators and their effects:
  STABILIZE          — raise clarity, lower entropy, raise stability
  TIGHTEN_BOUNDARY   — raise boundary_strength, lower entropy
  LOOSEN_BOUNDARY    — lower boundary_strength, raise clarity
  SUPPRESS_ENTROPY   — sharply lower entropy, raise stability
  RESTORE_VIABILITY  — emergency correction: raise clarity + boundary, lower entropy
  REGULATE           — full regulation loop (Sense → Assess → Adjust)

Given the user message and the current kernel state, respond with ONLY valid JSON
in exactly this shape:
{
  "operator":  "<one of the six operators above>",
  "magnitude": <float 0.1..1.0>,
  "reasoning": "<one sentence explanation>"
}

Choose the operator that best matches the user's intent and the current state.
If the system is not viable, prefer RESTORE_VIABILITY.
`.trim();

// ------------------------------------------------------------------
// analyzeIntent — main export used by UI.js
// Returns: Promise<{ operator, magnitude, reasoning, source }>
//   source = "llm" | "heuristic"
// ------------------------------------------------------------------
async function analyzeIntent(userText, state) {
    const config = getLLMConfig();

    if (config.apiKey && config.endpoint) {
        try {
            return await callLLM(userText, state, config);
        } catch (err) {
            console.warn("LLM call failed, falling back to heuristic:", err.message);
        }
    }

    return heuristicFallback(userText, state);
}

// ------------------------------------------------------------------
// callLLM — sends request to an OpenAI-compatible chat endpoint
// ------------------------------------------------------------------
async function callLLM(userText, state, config) {
    const userMessage =
        `Current kernel state:\n${JSON.stringify(state, null, 2)}\n\nUser input: "${userText}"`;

    const body = {
        model: config.model || "gpt-4o-mini",
        messages: [
            { role: "system",  content: LLM_SYSTEM_PROMPT },
            { role: "user",    content: userMessage }
        ],
        temperature: 0.2,
        max_tokens:  256
    };

    const response = await fetch(config.endpoint, {
        method:  "POST",
        headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data   = await response.json();
    const raw    = data.choices?.[0]?.message?.content?.trim() || "";

    // Strip markdown code fences if the model wrapped the JSON
    const jsonStr = raw.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "").trim();
    const parsed  = JSON.parse(jsonStr);

    return {
        operator:  parsed.operator  || "REGULATE",
        magnitude: parsed.magnitude !== undefined ? parsed.magnitude : 1.0,
        reasoning: parsed.reasoning || "",
        source:    "llm"
    };
}

// ------------------------------------------------------------------
// heuristicFallback — keyword-based operator selection
// Used when no API key is configured.
// ------------------------------------------------------------------
function heuristicFallback(text, state) {
    const t = text.toLowerCase();

    // Emergency: not viable
    if (!state.viability) {
        return op("RESTORE_VIABILITY", 1.0, "Viability failure detected — emergency restoration.", "heuristic");
    }

    if (/stabilize|stabilise|coherence|clarity|focus/i.test(t)) {
        return op("STABILIZE", 0.8, "User requested stabilisation.", "heuristic");
    }
    if (/tighten|restrict|constrain|boundary|limit/i.test(t)) {
        return op("TIGHTEN_BOUNDARY", 0.8, "User requested tighter constraints.", "heuristic");
    }
    if (/loosen|relax|open|expand|allow/i.test(t)) {
        return op("LOOSEN_BOUNDARY", 0.8, "User requested relaxed constraints.", "heuristic");
    }
    if (/entropy|noise|chaos|disorder|suppress/i.test(t)) {
        return op("SUPPRESS_ENTROPY", 0.8, "User targeted entropy suppression.", "heuristic");
    }
    if (/restore|recover|repair|fix|reset/i.test(t)) {
        return op("RESTORE_VIABILITY", 1.0, "User requested system restoration.", "heuristic");
    }
    if (/regulate|balance|adapt|adjust/i.test(t)) {
        return op("REGULATE", 0.9, "User requested adaptive regulation.", "heuristic");
    }

    // Default: run the full regulation loop
    return op("REGULATE", 0.7, "No specific intent matched — running regulation loop.", "heuristic");
}

function op(operator, magnitude, reasoning, source) {
    return { operator, magnitude, reasoning, source };
}

// ------------------------------------------------------------------
// Config helpers — read/write the LLM config panel values
// ------------------------------------------------------------------
function getLLMConfig() {
    return {
        apiKey:   (document.getElementById("llm-key")      || {}).value?.trim()   || "",
        endpoint: (document.getElementById("llm-endpoint") || {}).value?.trim()   || "https://api.openai.com/v1/chat/completions",
        model:    (document.getElementById("llm-model")    || {}).value?.trim()   || "gpt-4o-mini"
    };
}
