// =============================================================
// SOVEREIGNTY ENGINE vC5.3  —  VISUALIZER
// Reference: "THE SOVEREIGNTY ENGINE vC5.3" by Gnome Badhi
// =============================================================
//
// 2D panel: RA (x-axis) vs SA (y-axis) — the epistemic/social plane.
//   AI drives the color; EP drives the marker size.
//
// 3D panel: All 4 SE instances plotted in (RA, CE, AI) space.
//   Manager: large bright node. Nodes: smaller colored nodes.
//   Coupling lines: ρ/μ flow from manager → each node.
//   Opacity of coupling lines reflects the relative SA of each node.
// =============================================================

// --------------------------------------------------
// 2D  —  RA × SA epistemic/social plane  (§8.1, §8.2, §8.3)
// X-axis: Reality Alignment (RA)
// Y-axis: Shared Awareness (SA)
// Color:  AI — green (high) → orange (low)
// Size:   EP — larger dot = higher emergent preservation
// --------------------------------------------------

const canvas2d = document.getElementById("viz-2d");
const ctx2d    = canvas2d.getContext("2d");

function draw2D(state) {
    if (!canvas2d) return;

    canvas2d.width  = canvas2d.clientWidth  || canvas2d.offsetWidth;
    canvas2d.height = canvas2d.clientHeight || canvas2d.offsetHeight;

    const w = canvas2d.width;
    const h = canvas2d.height;

    // Skip draw if canvas has no dimensions yet (layout not complete)
    if (w === 0 || h === 0) return;

    ctx2d.clearRect(0, 0, w, h);

    // --- Phase boundary lines (§7.3) ---
    // Autonomy bifurcation: |RA - SA| = 0.2
    ctx2d.strokeStyle = "rgba(255, 200, 60, 0.15)";
    ctx2d.lineWidth = 1;
    ctx2d.setLineDash([4, 6]);
    // RA - SA = +0.2  → SA = RA - 0.2
    ctx2d.beginPath();
    ctx2d.moveTo(w * 0.2, h * 0.0);
    ctx2d.lineTo(w * 1.0, h * 0.8);
    ctx2d.stroke();
    // RA - SA = -0.2  → SA = RA + 0.2
    ctx2d.beginPath();
    ctx2d.moveTo(w * 0.0, h * 0.2);
    ctx2d.lineTo(w * 0.8, h * 1.0);
    ctx2d.stroke();
    ctx2d.setLineDash([]);

    // --- RA bar ---
    const raWidth = w * state.RA;
    ctx2d.fillStyle = `rgba(0, 220, 180, ${0.10 + state.RA * 0.25})`;
    ctx2d.fillRect(0, 0, raWidth, h * 0.42);

    // --- SA bar ---
    const saHeight = h * state.SA;
    ctx2d.fillStyle = `rgba(80, 140, 255, ${0.10 + state.SA * 0.25})`;
    ctx2d.fillRect(0, h - saHeight, w * 0.42, saHeight);

    // --- Labels ---
    ctx2d.fillStyle = "rgba(200, 255, 240, 0.85)";
    ctx2d.font = "13px JetBrains Mono";
    ctx2d.fillText(`RA: ${state.RA.toFixed(3)}`,  10, 20);
    ctx2d.fillText(`SA: ${state.SA.toFixed(3)}`,  10, h * 0.5 + 20);
    ctx2d.fillText(`AI: ${state.AI.toFixed(3)}`,  10, 40);
    ctx2d.fillText(`CE: ${state.CE.toFixed(3)}`,  10, 60);
    ctx2d.fillText(`CD: ${state.CD.toFixed(3)}`,  10, 80);
    ctx2d.fillText(`AC: ${state.AC.toFixed(3)}`,  10, 100);
    ctx2d.fillText(`EP: ${state.EP.toFixed(4)}`,  10, 120);
    if (state.recoveryMode) {
        ctx2d.fillStyle = "rgba(255, 80, 80, 0.9)";
        ctx2d.fillText("⚠ RECOVERY", 10, 140);
    }
}

// --------------------------------------------------
// 3D  —  All 4 SE instances in (RA, CE, AI) space
// X-axis: RA  (Reality Alignment)
// Y-axis: 1-CE (inverted: low CE = bottom = depleted)
// Depth / node size: AI
//
// Manager: large teal node.
// Nodes: smaller colored nodes.
// Coupling lines: ρ/μ flow from manager → each node (§14.1-14.2).
// --------------------------------------------------

const canvas3d = document.getElementById("viz-3d");
const ctx3d    = canvas3d.getContext("2d");

// Project an SE state to 2D canvas coordinates
function seToXY(engine, w, h) {
    const px = engine.RA;        // x-axis: RA
    const py = 1 - engine.CE;    // y-axis: inverted CE (high CE = top)
    return {
        x: w * (0.12 + px * 0.70),
        y: h * (0.10 + py * 0.72)
    };
}

function draw3D(state) {
    if (!canvas3d) return;

    canvas3d.width  = canvas3d.clientWidth  || canvas3d.offsetWidth;
    canvas3d.height = canvas3d.clientHeight || canvas3d.offsetHeight;

    const w = canvas3d.width;
    const h = canvas3d.height;

    // Skip draw if canvas has no dimensions yet (layout not complete)
    if (w === 0 || h === 0) return;

    ctx3d.clearRect(0, 0, w, h);

    // Phase boundary: CE = 0.2 (collapse threshold, §7.3)
    const collapseY = h * (0.10 + (1 - 0.2) * 0.72);
    ctx3d.strokeStyle = "rgba(255, 80, 80, 0.15)";
    ctx3d.lineWidth = 1;
    ctx3d.setLineDash([4, 6]);
    ctx3d.beginPath();
    ctx3d.moveTo(w * 0.12, collapseY);
    ctx3d.lineTo(w * 0.82, collapseY);
    ctx3d.stroke();
    // Phase boundary: CE = 0.7 (stress threshold, §7.3)
    const stressY = h * (0.10 + (1 - 0.7) * 0.72);
    ctx3d.strokeStyle = "rgba(255, 180, 60, 0.12)";
    ctx3d.beginPath();
    ctx3d.moveTo(w * 0.12, stressY);
    ctx3d.lineTo(w * 0.82, stressY);
    ctx3d.stroke();
    ctx3d.setLineDash([]);

    const managerPos = seToXY(state, w, h);

    // --- Coupling lines: manager → each node (ρ/μ flow) ---
    const nodeColors = [
        { r: 80,  g: 200, b: 255 },
        { r: 160, g: 100, b: 255 },
        { r: 255, g: 180, b: 60  }
    ];

    for (let i = 0; i < kernelNodes.length; i++) {
        const node    = kernelNodes[i];
        const nodePos = seToXY(node, w, h);
        const c       = nodeColors[i];
        const opacity = 0.06 + node.SA * 0.22; // opacity reflects SA coupling strength

        ctx3d.strokeStyle = `rgba(${c.r},${c.g},${c.b},${opacity})`;
        ctx3d.lineWidth = 1;
        ctx3d.setLineDash([3, 6]);
        ctx3d.beginPath();
        ctx3d.moveTo(managerPos.x, managerPos.y);
        ctx3d.lineTo(nodePos.x, nodePos.y);
        ctx3d.stroke();
        ctx3d.setLineDash([]);
    }

    // --- Influenced nodes ---
    for (let i = 0; i < kernelNodes.length; i++) {
        const node    = kernelNodes[i];
        const pos     = seToXY(node, w, h);
        const c       = nodeColors[i];
        const aiShade = 0.20 + node.AI * 0.45;
        const radius  = 4 + node.AI * 7;

        ctx3d.fillStyle = `rgba(${c.r},${c.g},${c.b},${aiShade})`;
        ctx3d.beginPath();
        ctx3d.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx3d.fill();

        // Lifecycle ring
        const lRing = radius + 3 + Math.min(node.lifecycle * 6, 18);
        ctx3d.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.05 + Math.min(node.lifecycle * 0.02, 0.12)})`;
        ctx3d.lineWidth = 1;
        ctx3d.beginPath();
        ctx3d.arc(pos.x, pos.y, lRing, 0, Math.PI * 2);
        ctx3d.stroke();

        // Recovery indicator
        if (node.recoveryMode) {
            ctx3d.fillStyle = "rgba(255, 80, 80, 0.6)";
            ctx3d.font = "10px JetBrains Mono";
            ctx3d.fillText("↯", pos.x + radius + 2, pos.y + 4);
        }

        // Node label
        ctx3d.fillStyle = `rgba(${c.r},${c.g},${c.b},0.75)`;
        ctx3d.font = "10px JetBrains Mono";
        ctx3d.fillText(node.id, pos.x + radius + 2, pos.y - 4);
    }

    // --- Manager node ---
    const aiShade  = 0.20 + state.AI * 0.50;
    const radius   = 10 + state.AI * 10;

    ctx3d.shadowColor = "rgba(0, 255, 200, 0.3)";
    ctx3d.shadowBlur  = 18;
    ctx3d.fillStyle   = `rgba(0, 255, 200, ${aiShade})`;
    ctx3d.beginPath();
    ctx3d.arc(managerPos.x, managerPos.y, radius, 0, Math.PI * 2);
    ctx3d.fill();
    ctx3d.shadowBlur = 0;

    // Lifecycle ring (manager)
    const lRing = radius + 4 + Math.min(state.lifecycle * 10, 28);
    ctx3d.strokeStyle = `rgba(0, 255, 200, ${0.07 + Math.min(state.lifecycle * 0.03, 0.16)})`;
    ctx3d.lineWidth = 1;
    ctx3d.beginPath();
    ctx3d.arc(managerPos.x, managerPos.y, lRing, 0, Math.PI * 2);
    ctx3d.stroke();

    // Recovery indicator
    if (state.recoveryMode) {
        ctx3d.fillStyle = "rgba(255, 80, 80, 0.9)";
        ctx3d.font = "12px JetBrains Mono";
        ctx3d.fillText("⚠ RECOVERY", managerPos.x + radius + 4, managerPos.y + 4);
    }

    // Manager label
    ctx3d.fillStyle = "rgba(0, 255, 200, 0.75)";
    ctx3d.font = "10px JetBrains Mono";
    ctx3d.fillText("manager", managerPos.x + radius + 3, managerPos.y - 4);

    // --- Axis labels ---
    ctx3d.fillStyle = "rgba(200, 255, 240, 0.50)";
    ctx3d.font = "11px JetBrains Mono";
    ctx3d.fillText("RA →", w * 0.82, h * 0.10 + 12);
    ctx3d.fillText("CE ↑", w * 0.12 - 2, h * 0.08);
    ctx3d.fillText("0.2", w * 0.83, collapseY - 2);
    ctx3d.fillText("0.7", w * 0.83, stressY - 2);

    // --- Manager state summary ---
    ctx3d.fillStyle = "rgba(200, 255, 240, 0.85)";
    ctx3d.font = "13px JetBrains Mono";
    ctx3d.fillText(`RA:${state.RA.toFixed(2)} SA:${state.SA.toFixed(2)}`, 10, 20);
    ctx3d.fillText(`AI:${state.AI.toFixed(2)} CE:${state.CE.toFixed(2)}`, 10, 38);
    ctx3d.fillText(`L: ${state.lifecycle.toFixed(4)}`,                     10, h - 10);
}

// Initial draw is handled by UI.js window.addEventListener("load", ...)
