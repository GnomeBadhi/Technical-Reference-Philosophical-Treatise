// ============================================================
// LLM Interface — Sovereignty Engine Demo
//
// Sends user text + current kernel state to an LLM and
// receives a structured intent: { operator, magnitude, reasoning, emotions }
//
// Supported operators (must match Kernel.js):
//   STABILIZE, TIGHTEN_BOUNDARY, LOOSEN_BOUNDARY,
//   SUPPRESS_ENTROPY, RESTORE_VIABILITY, REGULATE
//
// Emotions follow Plutchik's basic 8:
//   joy, trust, fear, surprise, sadness, disgust, anger, anticipation
// ============================================================

const EMOTION_KEYS = ["joy", "trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation"];

const ZERO_EMOTIONS = Object.fromEntries(EMOTION_KEYS.map(k => [k, 0.0]));

function buildSystemPrompt(domainLabel) {
    return `
You are the intent-parsing layer of the Sovereignty Engine, a domain-agnostic
state-transition architecture. Active domain: ${domainLabel || "Default"}.

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

Also detect the primary emotions expressed in the user message from Plutchik's basic 8:
  joy, trust, fear, surprise, sadness, disgust, anger, anticipation
Rate each 0.0 (absent) to 1.0 (strongly present).

Given the user message and the current kernel state, respond with ONLY valid JSON
in exactly this shape:
{
  "operator":  "<one of the six operators above>",
  "magnitude": <float 0.1..1.0>,
  "reasoning": "<one sentence explanation>",
  "emotions":  { "joy": 0.0, "trust": 0.0, "fear": 0.0, "surprise": 0.0, "sadness": 0.0, "disgust": 0.0, "anger": 0.0, "anticipation": 0.0 }
}

Choose the operator that best matches the user's intent and the current state.
If the system is not viable, prefer RESTORE_VIABILITY.
`.trim();
}

// ------------------------------------------------------------------
// analyzeIntent — main export used by UI.js
// Returns: Promise<{ operator, magnitude, reasoning, emotions, source }>
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
    const domainLabel = (typeof currentDomainPreset !== "undefined" && currentDomainPreset.label)
        ? currentDomainPreset.label : "Default";
    const userMessage =
        `Domain: ${domainLabel}\n\nCurrent kernel state:\n${JSON.stringify(state, null, 2)}\n\nUser input: "${userText}"`;

    const body = {
        model: config.model || "gpt-4o-mini",
        messages: [
            { role: "system",  content: buildSystemPrompt(domainLabel) },
            { role: "user",    content: userMessage }
        ],
        temperature: 0.2,
        max_tokens:  300
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
        emotions:  sanitizeEmotions(parsed.emotions),
        source:    "llm"
    };
}

// ------------------------------------------------------------------
// heuristicFallback — keyword-based operator + emotion selection
// Used when no API key is configured.
// ------------------------------------------------------------------
function heuristicFallback(text, state) {
    const t = text.toLowerCase();

    // Emergency: not viable
    if (!state.viability) {
        return op("RESTORE_VIABILITY", 1.0, "Viability failure detected — emergency restoration.", emotionHeuristic(t), "heuristic");
    }

    if (/stabilize|stabilise|coherence|clarity|focus/i.test(t)) {
        return op("STABILIZE", 0.8, "User requested stabilisation.", emotionHeuristic(t), "heuristic");
    }
    if (/tighten|restrict|constrain|boundary|limit/i.test(t)) {
        return op("TIGHTEN_BOUNDARY", 0.8, "User requested tighter constraints.", emotionHeuristic(t), "heuristic");
    }
    if (/loosen|relax|open|expand|allow/i.test(t)) {
        return op("LOOSEN_BOUNDARY", 0.8, "User requested relaxed constraints.", emotionHeuristic(t), "heuristic");
    }
    if (/entropy|noise|chaos|disorder|suppress/i.test(t)) {
        return op("SUPPRESS_ENTROPY", 0.8, "User targeted entropy suppression.", emotionHeuristic(t), "heuristic");
    }
    if (/restore|recover|repair|fix|reset/i.test(t)) {
        return op("RESTORE_VIABILITY", 1.0, "User requested system restoration.", emotionHeuristic(t), "heuristic");
    }
    if (/regulate|balance|adapt|adjust/i.test(t)) {
        return op("REGULATE", 0.9, "User requested adaptive regulation.", emotionHeuristic(t), "heuristic");
    }

    // Default: run the full regulation loop
    return op("REGULATE", 0.7, "No specific intent matched — running regulation loop.", emotionHeuristic(t), "heuristic");
}

// ------------------------------------------------------------------
// emotionHeuristic — keyword-based Plutchik emotion detection
// ------------------------------------------------------------------
function emotionHeuristic(text) {
    const t = text.toLowerCase();
    function score(patterns) {
        let hits = 0;
        patterns.forEach(p => { if (new RegExp("\\b" + p + "\\b").test(t)) hits++; });
        return Math.min(hits * 0.45, 1.0);
    }
    return {
        joy:          score(["happy", "joy", "excited", "great", "love", "wonderful", "amazing", "delighted", "fantastic", "pleased"]),
        trust:        score(["confident", "sure", "reliable", "honest", "safe", "secure", "believe", "certain", "trust", "faith"]),
        fear:         score(["scared", "afraid", "worried", "anxious", "nervous", "terrified", "concerned", "fear", "dread", "panic"]),
        surprise:     score(["unexpected", "wow", "suddenly", "shocked", "astonished", "unbelievable", "whoa", "incredible"]),
        sadness:      score(["sad", "unhappy", "depressed", "down", "miserable", "unfortunate", "disappointed", "grief", "sorrow", "loss"]),
        disgust:      score(["horrible", "disgusting", "awful", "terrible", "hate", "repulsive", "revolting", "gross", "nasty"]),
        anger:        score(["angry", "furious", "frustrated", "mad", "annoyed", "irritated", "rage", "infuriated", "hostile"]),
        anticipation: score(["looking forward", "expect", "hope", "await", "anticipate", "plan", "upcoming", "soon", "excited about"])
    };
}

function sanitizeEmotions(raw) {
    if (!raw || typeof raw !== "object") return { ...ZERO_EMOTIONS };
    const result = {};
    EMOTION_KEYS.forEach(k => {
        const v = parseFloat(raw[k]);
        result[k] = isNaN(v) ? 0.0 : Math.max(0, Math.min(1, v));
    });
    return result;
}

function op(operator, magnitude, reasoning, emotions, source) {
    return { operator, magnitude, reasoning, emotions, source };
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
