// --------------------------------------------------
// 2D AFFECT FIELD
// --------------------------------------------------

const canvas2d = document.getElementById("viz-2d");
const ctx2d = canvas2d.getContext("2d");

function draw2D(state) {
    if (!canvas2d) return;

    // Resize to container
    canvas2d.width = canvas2d.clientWidth;
    canvas2d.height = canvas2d.clientHeight;

    const w = canvas2d.width;
    const h = canvas2d.height;

    ctx2d.clearRect(0, 0, w, h);

    // ------------------------------
    // Affect values
    // ------------------------------

    const valence = (state.affect.valence + 1) / 2; // map -1..1 → 0..1
    const arousal = state.affect.arousal;           // already 0..1

    // ------------------------------
    // Valence bar (green → red)
    // ------------------------------

    const valenceColor = state.affect.valence >= 0
        ? `rgba(0, 255, 180, ${0.15 + valence * 0.25})`
        : `rgba(255, 80, 80, ${0.15 + (1 - valence) * 0.25})`;

    ctx2d.fillStyle = valenceColor;
    ctx2d.fillRect(0, 0, w * valence, h * 0.42);

    // ------------------------------
    // Arousal bar (blue intensity)
    // ------------------------------

    ctx2d.fillStyle = `rgba(80, 160, 255, ${0.12 + arousal * 0.3})`;
    ctx2d.fillRect(0, h * 0.48, w * arousal, h * 0.42);

    // ------------------------------
    // Labels
    // ------------------------------

    ctx2d.fillStyle = "rgba(200, 255, 240, 0.8)";
    ctx2d.font = "14px JetBrains Mono";

    ctx2d.fillText(`Valence: ${state.affect.valence.toFixed(2)}`, 10, 20);
    ctx2d.fillText(`Arousal: ${state.affect.arousal.toFixed(2)}`, 10, h * 0.48 + 20);
}

// --------------------------------------------------
// 3D KERNEL SPACE (2D PROJECTION)
// --------------------------------------------------

const canvas3d = document.getElementById("viz-3d");
const ctx3d = canvas3d.getContext("2d");

function draw3D(state) {
    if (!canvas3d) return;

    // Resize to container
    canvas3d.width = canvas3d.clientWidth;
    canvas3d.height = canvas3d.clientHeight;

    const w = canvas3d.width;
    const h = canvas3d.height;

    ctx3d.clearRect(0, 0, w, h);

    // ------------------------------
    // Personality → 3D coordinates
    // ------------------------------

    const px = state.personality.directness;   // 0..1
    const py = state.personality.abstraction;  // 0..1
    const pz = state.personality.intensity;    // 0..1

    // Project 3D → 2D
    const x = w * (0.2 + px * 0.6);
    const y = h * (0.2 + py * 0.6);

    // Depth shading
    const depthShade = 0.25 + pz * 0.35;

    // ------------------------------
    // Draw personality point
    // ------------------------------

    ctx3d.fillStyle = `rgba(0, 255, 200, ${depthShade})`;
    ctx3d.beginPath();
    ctx3d.arc(x, y, 10 + pz * 8, 0, Math.PI * 2);
    ctx3d.fill();

    // Soft glow
    ctx3d.shadowColor = "rgba(0, 255, 200, 0.15)";
    ctx3d.shadowBlur = 12;

    // ------------------------------
    // Labels
    // ------------------------------

    ctx3d.shadowBlur = 0;
    ctx3d.fillStyle = "rgba(200, 255, 240, 0.8)";
    ctx3d.font = "14px JetBrains Mono";

    ctx3d.fillText(`Directness: ${px.toFixed(2)}`, 10, 20);
    ctx3d.fillText(`Abstraction: ${py.toFixed(2)}`, 10, 40);
    ctx3d.fillText(`Intensity: ${pz.toFixed(2)}`, 10, 60);
}

// --------------------------------------------------
// INITIAL DRAW ON LOAD
// --------------------------------------------------

window.addEventListener("load", () => {
    draw2D(kernelState);
    draw3D(kernelState);
});
