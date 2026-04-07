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
// Maps formal kernel state (S, L) to visual space.
// Axes: clarity (x), boundary (y), entropy (z/depth)
// Lifecycle L advances monotonically and is displayed as a label.
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
    // Kernel state → 3D coordinates
    // Clarity (x-axis), Boundary (y-axis), Entropy (depth/size)
    // ------------------------------

    const px = state.clarity;           // 0..1 → x position
    const py = 1 - state.boundary;      // 0..1 → y position (inverted: high boundary = top)
    const pz = 1 - state.entropy;       // 0..1 → depth shading (low entropy = bright/stable)

    // Project 3D → 2D with isometric-style offset
    const x = w * (0.15 + px * 0.65);
    const y = h * (0.15 + py * 0.65);

    // Radius grows with structural coherence (low entropy, high clarity)
    const radius = 8 + pz * 10;

    // Depth shading: high purity/low entropy → brighter
    const depthShade = 0.2 + pz * 0.5;

    // ------------------------------
    // Draw kernel state point
    // ------------------------------

    ctx3d.fillStyle = `rgba(0, 255, 200, ${depthShade})`;
    ctx3d.beginPath();
    ctx3d.arc(x, y, radius, 0, Math.PI * 2);
    ctx3d.fill();

    // Soft glow
    ctx3d.shadowColor = "rgba(0, 255, 200, 0.2)";
    ctx3d.shadowBlur = 14;

    // Lifecycle trail — a faint ring showing how far L has advanced
    const lifecycleRadius = radius + 4 + Math.min(state.lifecycle * 12, 30);
    ctx3d.strokeStyle = `rgba(0, 255, 200, ${0.08 + Math.min(state.lifecycle * 0.04, 0.18)})`;
    ctx3d.lineWidth = 1;
    ctx3d.beginPath();
    ctx3d.arc(x, y, lifecycleRadius, 0, Math.PI * 2);
    ctx3d.stroke();

    // ------------------------------
    // Labels
    // ------------------------------

    ctx3d.shadowBlur = 0;
    ctx3d.fillStyle = "rgba(200, 255, 240, 0.8)";
    ctx3d.font = "14px JetBrains Mono";

    ctx3d.fillText(`Clarity:   ${state.clarity.toFixed(2)}`,  10, 20);
    ctx3d.fillText(`Boundary:  ${state.boundary.toFixed(2)}`, 10, 40);
    ctx3d.fillText(`Entropy:   ${state.entropy.toFixed(2)}`,  10, 60);
    ctx3d.fillText(`Lifecycle: ${state.lifecycle.toFixed(4)}`, 10, h - 10);
}

// --------------------------------------------------
// INITIAL DRAW ON LOAD
// --------------------------------------------------

window.addEventListener("load", () => {
    draw2D(kernelState);
    draw3D(kernelState);
});
