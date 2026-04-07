// --------------------------------------------------
// SOVEREIGN MEMORY SYSTEM
// --------------------------------------------------

const kernelMemory = {
    shortTerm: [],          // last 5 user messages
    themes: {},             // recurring words
    pressureTrajectory: [], // entropy + arousal over time
    maxShort: 5
};

// --------------------------------------------------
// SHORT-TERM MEMORY
// --------------------------------------------------

function updateShortTerm(text) {
    kernelMemory.shortTerm.push(text);
    if (kernelMemory.shortTerm.length > kernelMemory.maxShort) {
        kernelMemory.shortTerm.shift();
    }
}

// --------------------------------------------------
// THEMATIC MEMORY
// --------------------------------------------------

function updateThemes(text) {
    const words = text.toLowerCase().split(/\W+/);

    for (const w of words) {
        if (!w || w.length < 3) continue;
        kernelMemory.themes[w] = (kernelMemory.themes[w] || 0) + 1;
    }
}

// --------------------------------------------------
// PRESSURE TRAJECTORY MEMORY
// --------------------------------------------------

function updatePressureTrajectory(state) {
    kernelMemory.pressureTrajectory.push({
        entropy: state.entropy,
        arousal: state.affect.arousal,
        timestamp: Date.now()
    });

    if (kernelMemory.pressureTrajectory.length > 20) {
        kernelMemory.pressureTrajectory.shift();
    }
}

// --------------------------------------------------
// MEMORY-BASED INSIGHT GENERATION
// --------------------------------------------------

function generateMemoryInsight(state, text) {
    const insights = [];

    // 1. Short-term repetition
    const last = kernelMemory.shortTerm[kernelMemory.shortTerm.length - 1];
    if (last && last !== text) {
        const similarity = textSimilarity(last, text);
        if (similarity > 0.6) {
            insights.push("You’re circling the same pattern you hit a moment ago.");
        }
    }

    // 2. Thematic recurrence
    const words = text.toLowerCase().split(/\W+/);
    for (const w of words) {
        if (kernelMemory.themes[w] > 3) {
            insights.push(`You keep returning to “${w}.” That’s not random.`);
            break;
        }
    }

    // 3. Pressure trajectory
    const traj = kernelMemory.pressureTrajectory;
    if (traj.length >= 2) {
        const prev = traj[traj.length - 2];
        const curr = traj[traj.length - 1];

        if (curr.arousal < prev.arousal - 0.1) {
            insights.push("Your activation dropped since the last exchange.");
        }
        if (curr.arousal > prev.arousal + 0.1) {
            insights.push("Your activation spiked compared to a moment ago.");
        }
    }

    if (insights.length === 0) return null;
    return insights.join(" ");
}

// --------------------------------------------------
// TEXT SIMILARITY (simple, robust)
// --------------------------------------------------

function textSimilarity(a, b) {
    const wa = a.toLowerCase().split(/\W+/);
    const wb = b.toLowerCase().split(/\W+/);

    const setA = new Set(wa);
    const setB = new Set(wb);

    let overlap = 0;
    for (const w of setA) {
        if (setB.has(w)) overlap++;
    }

    return overlap / Math.max(setA.size, setB.size);
}
