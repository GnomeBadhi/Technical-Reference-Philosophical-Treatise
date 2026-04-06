// ============================================================
// Visualiser — 2D Canvas + WebGL 3D + Emotions Canvas
// Reads from kernel state; never modifies it.
// ============================================================

// -----------------------------
// 2D Canvas — kernel state bars with sparkline history
// Shows STOE primitives (σ sovereignty, P purity) alongside kernel fields.
// -----------------------------
const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

// Kernel state bars (top section)
const KERNEL_BARS = [
    { key: "clarity",           label: "S  Clarity",          color: "#00e676" },
    { key: "boundary_strength", label: "B  Boundary",         color: "#40c4ff" },
    { key: "stability",         label: "   Stability",        color: "#b388ff" },
    { key: "entropy",           label: "   Entropy",          color: "#ff5252" }
];

// STOE derived primitives (bottom section of 2D panel)
const STOE_BARS = [
    { key: "sigma", label: "σ  Sovereignty", color: "#ffd740" },
    { key: "P",     label: "P  Purity",      color: "#e040fb" }
];

function draw2D(state) {
    const w = canvas2d.width  = canvas2d.clientWidth;
    const h = canvas2d.height = canvas2d.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const labelW   = 130;
    const padding  = 12;
    const barH     = 14;
    const rowH     = barH + 14;
    const sparkW   = Math.floor((w - labelW - padding) * 0.32);
    const barWidth = (w - labelW - padding) - sparkW - 6;

    // History for sparklines (last 40 turns)
    const hist = (state.history || []).slice(-40);

    // STOE derived primitives for current state
    const stoe = (typeof getSTOEPrimitives === "function")
        ? getSTOEPrimitives(state)
        : { sigma: 0, P: 0 };

    function drawBar(bar, i, yBase, getValue, getHistory) {
        const y   = yBase + i * rowH;
        const val = getValue(bar.key);

        // Label
        ctx.fillStyle = "#808080";
        ctx.font      = "10px monospace";
        ctx.fillText(bar.label, padding, y + barH - 2);

        // Background track
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(labelW, y, barWidth, barH);

        // Value bar
        ctx.fillStyle = bar.color;
        ctx.fillRect(labelW, y, barWidth * Math.max(0, Math.min(1, val)), barH);

        // Value text (inside bar)
        ctx.fillStyle = "#e0e0e0";
        ctx.font      = "9px monospace";
        ctx.fillText(val.toFixed(3), labelW + 3, y + barH - 3);

        // Sparkline (right of bar)
        const spX = labelW + barWidth + 6;
        drawSparkline(ctx, spX, y, sparkW, barH, getHistory(bar.key), bar.color);
    }

    // --- Kernel state bars ---
    const startY = 16;
    ctx.fillStyle = "#555";
    ctx.font      = "9px monospace";
    ctx.fillText("KERNEL STATE", padding, startY - 3);

    KERNEL_BARS.forEach((bar, i) => {
        drawBar(
            bar, i, startY,
            key => state[key] !== undefined ? state[key] : 0,
            key => hist.map(h => (h.state_after && h.state_after[key] !== undefined) ? h.state_after[key] : 0)
        );
    });

    // --- STOE derived primitives ---
    const stoeY = startY + KERNEL_BARS.length * rowH + 10;
    ctx.fillStyle = "#555";
    ctx.font      = "9px monospace";
    ctx.fillText("STOE PRIMITIVES  K(x) = (I, B, S, σ, P, L)", padding, stoeY - 3);

    STOE_BARS.forEach((bar, i) => {
        drawBar(
            bar, i, stoeY,
            key => stoe[key] !== undefined ? stoe[key] : 0,
            key => hist.map(h => {
                if (!h.state_after) return 0;
                const s = h.state_after;
                if (key === "sigma") return Math.max(0, Math.min(1, (s.clarity || 0) * (s.boundary_strength || 0) * (1 - (s.entropy || 0))));
                if (key === "P")     return Math.max(0, Math.min(1, 1 - (s.entropy || 0)));
                return 0;
            })
        );
    });

    // Identity (invariant — always 1.0)
    const identY = stoeY + STOE_BARS.length * rowH;
    ctx.fillStyle = "#555";
    ctx.font      = "10px monospace";
    ctx.fillText("I  Identity", padding, identY + barH - 2);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(labelW, identY, barWidth, barH);
    ctx.fillStyle = "#888";
    ctx.fillRect(labelW, identY, barWidth, barH);
    ctx.fillStyle = "#e0e0e0";
    ctx.font      = "9px monospace";
    ctx.fillText("1.000  (invariant)", labelW + 3, identY + barH - 3);

    // Lifecycle L
    ctx.fillStyle = "#555";
    ctx.font      = "10px monospace";
    ctx.fillText("L  Lifecycle", padding, identY + rowH + barH - 2);
    ctx.fillStyle = "#e0e0e0";
    ctx.font      = "9px monospace";
    ctx.fillText("t = " + state.t, labelW + 3, identY + rowH + barH - 3);

    // Viability + C(S)
    const viable = state.viability !== false;
    const cVal   = (typeof constraintC === "function") ? constraintC(state).toFixed(4) : "—";
    ctx.fillStyle = viable ? "#00e676" : "#ff5252";
    ctx.font      = "10px monospace";
    ctx.fillText(
        "Viable: " + (viable ? "YES" : "NO") + "   C(S)=" + cVal + "   domain: " + (state.domain || "Default"),
        padding,
        identY + rowH * 2 + 6
    );
}

// Small sparkline chart
function drawSparkline(ctx, x, y, w, h, values, color) {
    if (!values || values.length < 2) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    values.forEach((v, i) => {
        const px = x + (i / (values.length - 1)) * w;
        const py = y + h - Math.max(0, Math.min(1, v)) * h;
        if (i === 0) ctx.moveTo(px, py);
        else         ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
}

// -----------------------------
// Emotions Canvas — Plutchik's 8 basic emotions
// Two columns of 4, always visible.
// -----------------------------
const canvasEmotions = document.getElementById("canvas-emotions");
const ctxE = canvasEmotions.getContext("2d");

const EMOTIONS = [
    { key: "joy",          label: "Joy",           color: "#FFD700" },
    { key: "trust",        label: "Trust",         color: "#00e676" },
    { key: "fear",         label: "Fear",          color: "#ce93d8" },
    { key: "surprise",     label: "Surprise",      color: "#00bcd4" },
    { key: "sadness",      label: "Sadness",       color: "#42a5f5" },
    { key: "disgust",      label: "Disgust",       color: "#8bc34a" },
    { key: "anger",        label: "Anger",         color: "#ff5252" },
    { key: "anticipation", label: "Anticipation",  color: "#ff9800" }
];

function drawEmotions(emotions) {
    if (!canvasEmotions || !ctxE) return;
    const w = canvasEmotions.width  = canvasEmotions.clientWidth;
    const h = canvasEmotions.height = canvasEmotions.clientHeight;
    ctxE.clearRect(0, 0, w, h);

    const cols     = 2;
    const rows     = 4;
    const colW     = w / cols;
    const rowH     = (h - 6) / rows;
    const labelW   = 96;
    const padding  = 10;
    const barH     = Math.max(10, rowH - 10);

    EMOTIONS.forEach((em, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x   = col * colW + padding;
        const y   = row * rowH + (rowH - barH) / 2 + 4;
        const val = (emotions && emotions[em.key] !== undefined) ? emotions[em.key] : 0;
        const availW = colW - padding * 2;

        // Label
        ctxE.fillStyle = "#808080";
        ctxE.font      = "10px monospace";
        ctxE.fillText(em.label, x, y + barH - 2);

        // Background track
        ctxE.fillStyle = "#1a1a1a";
        ctxE.fillRect(x + labelW, y, availW - labelW, barH);

        // Value bar
        ctxE.fillStyle = em.color;
        ctxE.fillRect(x + labelW, y, (availW - labelW) * Math.max(0, Math.min(1, val)), barH);

        // Value text
        ctxE.fillStyle = "#e0e0e0";
        ctxE.font      = "9px monospace";
        ctxE.fillText(val.toFixed(2), x + labelW + 3, y + barH - 3);
    });
}

// -----------------------------
// WebGL 3D — kernel state space
// Axes: X = clarity, Y = stability, Z = boundary_strength
// Entropy drives the point colour via red channel.
// -----------------------------
const glCanvas = document.getElementById("webgl-canvas");
const gl       = glCanvas.getContext("webgl");

let angle      = 0;
let glProgram  = null;
let glPosLoc   = null;
let glColLoc   = null;
let glBuffer   = null;

function initWebGL() {
    if (!gl) return;

    const vs = `
        attribute vec3 pos;
        attribute vec3 col;
        varying   vec3 vCol;
        void main() {
            gl_PointSize = 14.0;
            gl_Position  = vec4(pos, 1.0);
            vCol = col;
        }
    `;

    const fs = `
        precision mediump float;
        varying vec3 vCol;
        void main() {
            gl_FragColor = vec4(vCol, 1.0);
        }
    `;

    const vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vs);
    gl.compileShader(vshader);

    const fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fs);
    gl.compileShader(fshader);

    glProgram = gl.createProgram();
    gl.attachShader(glProgram, vshader);
    gl.attachShader(glProgram, fshader);
    gl.linkProgram(glProgram);
    gl.useProgram(glProgram);

    glPosLoc = gl.getAttribLocation(glProgram, "pos");
    glColLoc = gl.getAttribLocation(glProgram, "col");
    glBuffer = gl.createBuffer();
}

function draw3D(state) {
    if (!gl || !glProgram) return;

    const w = glCanvas.width  = glCanvas.clientWidth;
    const h = glCanvas.height = glCanvas.clientHeight;

    gl.viewport(0, 0, w, h);
    gl.clearColor(0.05, 0.05, 0.05, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Map kernel dimensions onto orbital position:
    //   orbital radius  ← clarity
    //   vertical offset ← stability - 0.5
    //   orbit speed     ← driven by angle (advances only after first input)
    //   entropy         → red channel (high entropy = more red)
    const r  = (state.clarity          || 0) * 0.75;
    const bz = (state.boundary_strength|| 0) * 0.4 - 0.2;
    const x  = Math.cos(angle) * r;
    const y  = Math.sin(angle) * r * 0.6 + ((state.stability || 0) - 0.5) * 0.5;

    const rr = state.entropy           || 0;
    const gg = state.clarity           || 0;
    const bb = state.boundary_strength || 0;

    // Interleaved: pos(x,y,z), col(r,g,b)
    const data = new Float32Array([x, y, bz,  rr, gg, bb]);

    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const stride = 6 * 4;
    gl.useProgram(glProgram);

    gl.enableVertexAttribArray(glPosLoc);
    gl.vertexAttribPointer(glPosLoc, 3, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(glColLoc);
    gl.vertexAttribPointer(glColLoc, 3, gl.FLOAT, false, stride, 3 * 4);

    gl.drawArrays(gl.POINTS, 0, 1);
}

// Continuous rotation — angle advances only after first kernel input
let animationStarted = false;
let liveState        = null;

function startAnimation(state) {
    liveState = state;
    if (animationStarted) return;
    animationStarted = true;

    function loop() {
        angle += 0.008;
        draw3D(liveState);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

// One-time WebGL setup
initWebGL();
