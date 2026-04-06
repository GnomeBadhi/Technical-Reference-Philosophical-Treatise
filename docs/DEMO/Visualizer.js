// -----------------------------
// 2D Canvas Visualization
// -----------------------------
const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

function draw2D(state) {
    const w = canvas2d.width = canvas2d.clientWidth;
    const h = canvas2d.height = canvas2d.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Draw clarity bar
    ctx.fillStyle = "#0f0";
    ctx.fillRect(20, 20, state.clarity * (w - 40), 20);

    // Draw entropy bar
    ctx.fillStyle = "#f00";
    ctx.fillRect(20, 60, state.entropy * (w - 40), 20);
}

// -----------------------------
// WebGL 3D Visualization
// -----------------------------
const glCanvas = document.getElementById("webgl-canvas");
const gl = glCanvas.getContext("webgl");

// angle drives the orbital rotation; only active after kernel initiation
let angle = 0;

let glProgram = null;
let glPosLoc = null;
let glBuffer = null;

// Compile shaders and link program once
function initWebGL() {
    if (!gl) return;

    const vs = `
        attribute vec3 pos;
        void main() {
            gl_PointSize = 12.0;
            gl_Position = vec4(pos, 1.0);
        }
    `;

    const fs = `
        void main() {
            gl_FragColor = vec4(0.2, 0.8, 1.0, 1.0);
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
    glBuffer = gl.createBuffer();
}

function draw3D(state) {
    if (!gl || !glProgram) return;

    const w = glCanvas.width = glCanvas.clientWidth;
    const h = glCanvas.height = glCanvas.clientHeight;

    gl.viewport(0, 0, w, h);
    gl.clearColor(0.05, 0.05, 0.05, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Orbit the kernel point using angle; radius and vertical offset driven by state
    const r = state.clarity * 0.8;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r - state.entropy;

    const vertices = new Float32Array([x, y, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(glProgram);
    gl.enableVertexAttribArray(glPosLoc);
    gl.vertexAttribPointer(glPosLoc, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, 1);
}

// Start the continuous rotation loop; angle only advances after initiation
let animationStarted = false;
let liveState = null;

function startAnimation(state) {
    liveState = state;
    if (animationStarted) return;
    animationStarted = true;

    function loop() {
        angle += 0.01;
        draw3D(liveState);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

// One-time WebGL setup on load
initWebGL();
