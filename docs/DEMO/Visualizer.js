// ============================================================
// Visualiser — 2D Canvas + WebGL 3D
// Reads from kernel state; never modifies it.
// ============================================================

// -----------------------------
// 2D Canvas — labelled bars for every state dimension
// -----------------------------
const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

const BARS = [
    { key: "clarity",           label: "Clarity",           color: "#00e676" },
    { key: "boundary_strength", label: "Boundary Strength", color: "#40c4ff" },
    { key: "stability",         label: "Stability",         color: "#b388ff" },
    { key: "entropy",           label: "Entropy",           color: "#ff5252" }
];

function draw2D(state) {
    const w = canvas2d.width  = canvas2d.clientWidth;
    const h = canvas2d.height = canvas2d.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const barH    = 18;
    const labelW  = 140;
    const padding = 14;
    const rowH    = barH + 14;
    const startY  = 20;

    BARS.forEach((bar, i) => {
        const y   = startY + i * rowH;
        const val = state[bar.key] !== undefined ? state[bar.key] : 0;

        // Label
        ctx.fillStyle = "#a0a0a0";
        ctx.font      = "11px monospace";
        ctx.fillText(bar.label, padding, y + barH - 3);

        // Background track
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(labelW, y, w - labelW - padding, barH);

        // Value bar
        ctx.fillStyle = bar.color;
        ctx.fillRect(labelW, y, (w - labelW - padding) * val, barH);

        // Value text
        ctx.fillStyle = "#e0e0e0";
        ctx.font      = "10px monospace";
        ctx.fillText(val.toFixed(3), labelW + 4, y + barH - 4);
    });

    // Viability indicator
    const viable = state.viability !== false;
    ctx.fillStyle = viable ? "#00e676" : "#ff5252";
    ctx.font      = "11px monospace";
    ctx.fillText(
        "Viable: " + (viable ? "YES" : "NO") + "   C(S)=" + constraintC(state).toFixed(4),
        padding,
        startY + BARS.length * rowH + 10
    );
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
