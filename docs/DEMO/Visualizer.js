// ── 2D Radar Chart ────────────────────────────────────────────────────
const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

function draw2D(state) {
    const w = canvas2d.width  = canvas2d.clientWidth  || 400;
    const h = canvas2d.height = canvas2d.clientHeight || 300;
    const cx = w / 2, cy = h / 2;
    const r  = Math.min(w, h) * 0.36;
    const n  = PRIMITIVES.length;

    ctx.clearRect(0, 0, w, h);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
        ctx.strokeStyle = ring === 4 ? "#3a3a3a" : "#1e1e1e";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const a  = (i / n) * Math.PI * 2 - Math.PI / 2;
            const rx = cx + Math.cos(a) * r * ring / 4;
            const ry = cy + Math.sin(a) * r * ring / 4;
            i === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // Axes
    PRIMITIVES.forEach((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        ctx.strokeStyle = "#2a2a2a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
    });

    // Data polygon
    ctx.beginPath();
    PRIMITIVES.forEach((key, i) => {
        const a  = (i / n) * Math.PI * 2 - Math.PI / 2;
        const px = cx + Math.cos(a) * r * state[key];
        const py = cy + Math.sin(a) * r * state[key];
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle   = "rgba(0, 180, 255, 0.12)";
    ctx.fill();
    ctx.strokeStyle = "#00b4ff";
    ctx.lineWidth   = 2;
    ctx.stroke();

    // Points + labels
    PRIMITIVES.forEach((key, i) => {
        const a  = (i / n) * Math.PI * 2 - Math.PI / 2;
        const px = cx + Math.cos(a) * r * state[key];
        const py = cy + Math.sin(a) * r * state[key];

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#00b4ff";
        ctx.fill();

        const lx = cx + Math.cos(a) * (r + 20);
        const ly = cy + Math.sin(a) * (r + 20);

        ctx.fillStyle    = "#8ab4ff";
        ctx.font         = "bold 11px monospace";
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(key, lx, ly);

        ctx.fillStyle = "#555";
        ctx.font      = "9px monospace";
        ctx.fillText((state[key] * 100).toFixed(0) + "%", lx, ly + 13);
    });
}

// ── 3D WebGL Rotating Ring ────────────────────────────────────────────
const glCanvas  = document.getElementById("webgl-canvas");
const gl        = glCanvas.getContext("webgl") || glCanvas.getContext("experimental-webgl");

const COLORS_3D = [
    [0.2, 0.8, 1.0],  // RA  cyan
    [0.0, 1.0, 0.5],  // SA  green
    [1.0, 0.9, 0.1],  // AI  yellow
    [1.0, 0.5, 0.1],  // CE  orange
    [0.7, 0.2, 1.0],  // CD  purple
    [1.0, 0.2, 0.6],  // AC  pink
];

let glProgram = null;
let pointBuf  = null;
let rotAngle  = 0;

function initGL() {
    if (!gl) return;

    const vsrc = `
        attribute vec2 a_pos;
        uniform   float u_size;
        void main() {
            gl_PointSize = u_size;
            gl_Position  = vec4(a_pos, 0.0, 1.0);
        }
    `;
    const fsrc = `
        precision mediump float;
        uniform vec3 u_color;
        void main() {
            vec2 c = gl_PointCoord - vec2(0.5);
            if (dot(c, c) > 0.25) discard;
            gl_FragColor = vec4(u_color, 1.0);
        }
    `;

    function makeShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    glProgram = gl.createProgram();
    gl.attachShader(glProgram, makeShader(gl.VERTEX_SHADER,   vsrc));
    gl.attachShader(glProgram, makeShader(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(glProgram);

    pointBuf = gl.createBuffer();
}

function draw3D(state) {
    if (!gl || !glProgram) return;

    const w = glCanvas.width  = glCanvas.clientWidth  || 400;
    const h = glCanvas.height = glCanvas.clientHeight || 300;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0.04, 0.04, 0.06, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(glProgram);

    const posLoc   = gl.getAttribLocation(glProgram,  "a_pos");
    const colorLoc = gl.getUniformLocation(glProgram, "u_color");
    const sizeLoc  = gl.getUniformLocation(glProgram, "u_size");
    const aspect   = w / h;

    // Build 3D positions for each primitive on a tilted ring
    const items = PRIMITIVES.map((key, i) => {
        const base = (i / PRIMITIVES.length) * Math.PI * 2;
        const a    = base + rotAngle;
        const ringR = 0.55, tilt = 0.5;
        return {
            key, ci: i,
            x3: ringR * Math.cos(a),
            y3: ringR * Math.sin(a) * Math.cos(tilt),
            z3: ringR * Math.sin(a) * Math.sin(tilt)
        };
    });

    // Painter's algorithm: draw back nodes first
    items.sort((a, b) => a.z3 - b.z3);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    items.forEach(({ key, ci, x3, y3, z3 }) => {
        const fov = 2.5, d = fov + z3;
        const px  = (x3 / d) / aspect;
        const py  = y3 / d;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([px, py]), gl.DYNAMIC_DRAW);

        const val    = state[key];
        const size   = 8 + val * 24;
        const col    = COLORS_3D[ci];
        const bright = 0.25 + val * 0.75;

        gl.uniform3f(colorLoc, col[0] * bright, col[1] * bright, col[2] * bright);
        gl.uniform1f(sizeLoc, size);
        gl.drawArrays(gl.POINTS, 0, 1);
    });

    rotAngle += 0.006;
}

initGL();

// Start continuous 3D animation
(function startAnimation() {
    function frame() { draw3D(kernelState); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
})();
