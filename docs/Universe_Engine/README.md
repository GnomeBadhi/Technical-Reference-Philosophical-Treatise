Sovereign Kernel Visualization Suite
Deterministic, invariant‑safe visualization and analysis tools for single‑universe, dual‑universe, and multi‑universe operator dynamics.

This repository provides a complete, modular pipeline for rendering the Sovereign Kernel’s coherence engine, operator fields, fused glyphs, replay systems, and comparative diagnostics.  
All artifacts are generated from JSONL universe logs produced by the SKL simulation engine.

The suite is 22 files, each isolated, composable, and drift‑resistant.

---

1. Purpose
This system provides:

- canonical visualizations of SKL operator dynamics  
- fused‑universe geometry for comparative analysis  
- deterministic replay engines  
- publication‑grade figures  
- a unified orchestrator for batch generation and export  

The architecture is intentionally literal: no metaphors, no narrative layers, no interpretive drift.  
Every artifact maps directly to operator‑level data.

---

2. Installation
Requires:

- Python 3.10+  
- matplotlib  
- numpy  
- ffmpeg (for MP4 export)

Install dependencies:

`bash
pip install -r requirements.txt
`

Ensure ffmpeg is available on your system path.

---

3. Directory Structure (High‑Level)

`
/utils/
    loaders.py
    layout.py
    colors.py

/single_universe/
    dashboard.py
    replay_engine.py
    heatmap.py
    glyph_layer.py
    glyph_animation.py
    operator_dashboard.py
    delta3_panel.py

/dual_universe/
    dashboard_multi.py
    phaselockinganalyzer.py
    crossuniversefield.py
    fused_glyph.py
    fusedglyphanimation.py
    instrument_panel.py
    replay_multi.py

/multi_universe/
    comparison_suite.py

/export/
    export_utils.py

orchestrator.py
`

Each module is self‑contained and imports only canonical utilities.

---

4. Running Artifacts (via Orchestrator)

The orchestrator provides a unified CLI:

`bash
python orchestrator.py <mode> [options]
`

Single‑Universe Modes
`
dashboard
replay
heatmap
glyph
glyph_anim
operators
delta3
`

Dual‑Universe Modes
`
dashboard_multi
phase_lock
field
fused
fused_anim
instrument
replay_multi
`

Multi‑Universe Mode
`
compare
`

---

5. Examples

Single‑Universe Dashboard
`bash
python orchestrator.py dashboard --path universe_A.jsonl
`

Dual‑Universe Fused Glyph
`bash
python orchestrator.py fused --pathA universeA.jsonl --pathB universeB.jsonl
`

Multi‑Universe Comparison
`bash
python orchestrator.py compare --paths universeA.jsonl universeB.jsonl universe_C.jsonl
`

---

6. Exporting Artifacts

Any artifact can be exported:

`bash
python orchestrator.py fused \
    --pathA universe_A.jsonl \
    --pathB universe_B.jsonl \
    --export png \
    --name fused_glyph
`

Supported formats:

- PNG  
- SVG  
- MP4 (animations)

Exports are timestamped and deterministic.

---

7. Data Format (JSONL)

Each line represents one tick:

`json
{
  "tick": 42,
  "C_global": 0.83,
  "delta3": -0.12,
  "phase": 2,
  "C_values": [...],
  "A_values": [...]
}
`

Dual‑universe and multi‑universe modules require logs with synchronized tick counts.

---

8. Design Principles

- Invariant‑safe: no hidden state, no nondeterminism  
- Modular: each file is a self‑contained operator  
- Literal geometry: no stylistic drift  
- Canonical mapping: every visual element corresponds to a real operator  
- Reproducible: deterministic exports, deterministic layouts  

This suite is designed for research, publication, and teaching.

---
