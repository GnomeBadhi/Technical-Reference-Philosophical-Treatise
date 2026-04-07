// -----------------------------
// 2D Visualization
// -----------------------------

const canvas2d = document.getElementById("canvas2d");
const ctx2d = canvas2d.getContext("2d");

function resize2D() {
    canvas2d.width = canvas2d.clientWidth;
    canvas2d.height = canvas2d.clientHeight;
}

function draw2D(state) {
    if (!canvas2d || !ctx2d) return;
    resize2D();

    const w = canvas2d.width;
    const h = canvas2d.height;

    ctx2d.clearRect(0, 0, w, h);

    // background
    ctx2d.fillStyle = "#111";
    ctx2d.fillRect(0, 0, w, h);

    // clarity bar (green)
    const clarityWidth = w * state.clarity;
    ctx2d.fillStyle = "#00ff66";
    ctx2d.fillRect(0, h * 0.25 - 10, clarityWidth, 20);

    // entropy bar (red)
    const entropyWidth = w * state.entropy;
    ctx2d.fillStyle = "#ff3355";
    ctx2d.fillRect(0, h * 0.75 - 10, entropyWidth, 20);
}

// -----------------------------
// 3D Visualization (simple 2D proxy)
// -----------------------------

const webglCanvas = document.getElementById("webgl-canvas");
const webglCtx = webglCanvas.getContext("2d");

function resize3D() {
    webglCanvas.width = webglCanvas.clientWidth;
    webglCanvas.height = webglCanvas.clientHeight;
}

function draw3D(state) {
    if (!webglCanvas || !webglCtx) return;
    resize3D();

    const w = webglCanvas.width;
    const h = webglCanvas.height;

    webglCtx.fillStyle = "#000";
    webglCtx.fillRect(0, 0, w, h);

    // map clarity/boundary/entropy into a point
    const x = w * state.clarity;
    const y = h * (1 - state.boundary);
    const size = 6 + 20 * state.entropy;

    webglCtx.fillStyle = "#33aaff";
    webglCtx.fillRect(x - size / 2, y - size / 2, size, size);
}
