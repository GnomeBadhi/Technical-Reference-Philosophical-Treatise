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

let angle = 0;

function draw3D(state) {
    const w = glCanvas.width = glCanvas.clientWidth;
    const h = glCanvas.height = glCanvas.clientHeight;

    gl.viewport(0, 0, w, h);
    gl.clearColor(0.05, 0.05, 0.05, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Simple animated dot representing kernel state
    const x = state.clarity * 2 - 1;
    const y = state.entropy * -2 + 1;

    const vertices = new Float32Array([x, y, 0]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

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

    const program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, 1);
}
