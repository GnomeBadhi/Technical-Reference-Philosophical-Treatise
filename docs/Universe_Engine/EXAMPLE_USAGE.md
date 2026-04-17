Example Usage Commands (Hybrid: Kernel‑Core + Public Clarity)

Generate example usage commands for a 22‑module visualization suite.  
Use a hybrid voice: kernel‑core precision + public‑facing clarity.  
No fluff, no metaphor, no narrative drift.  
Structure the output exactly as follows:

---

Example Usage Commands

Provide minimal, literal examples for each orchestrator mode.  
Assume the orchestrator is invoked as:

`
python orchestrator.py <mode> [options]
`

Group commands by domain:

---

Single‑Universe

Dashboard
`
python orchestrator.py dashboard --path universe_A.jsonl
`

Replay
`
python orchestrator.py replay --path universe_A.jsonl --interval 120
`

Heatmap
`
python orchestrator.py heatmap --path universe_A.jsonl --frame 50
`

Glyph
`
python orchestrator.py glyph --path universe_A.jsonl --frame 100
`

Glyph Animation
`
python orchestrator.py glyphanim --path universeA.jsonl --interval 120
`

Operator Dashboard
`
python orchestrator.py operators --path universe_A.jsonl
`

Δ₃ Panel
`
python orchestrator.py delta3 --path universe_A.jsonl
`

---

Dual‑Universe

Multi‑Dashboard
`
python orchestrator.py dashboardmulti --pathA universeA.jsonl --pathB universe_B.jsonl
`

Phase Locking Analyzer
`
python orchestrator.py phaselock --pathA universeA.jsonl --pathB universe_B.jsonl
`

Cross‑Universe Field
`
python orchestrator.py field --pathA universeA.jsonl --pathB universeB.jsonl --frame 75
`

Fused Glyph
`
python orchestrator.py fused --pathA universeA.jsonl --pathB universeB.jsonl --frame 120
`

Fused Glyph Animation
`
python orchestrator.py fusedanim --pathA universeA.jsonl --pathB universe_B.jsonl --interval 120
`

Instrument Panel
`
python orchestrator.py instrument --pathA universeA.jsonl --pathB universeB.jsonl --frame 200
`

Dual‑Universe Replay
`
python orchestrator.py replaymulti --pathA universeA.jsonl --pathB universe_B.jsonl --interval 120
`

---

Multi‑Universe

Comparison Suite
`
python orchestrator.py compare --paths universeA.jsonl universeB.jsonl universe_C.jsonl
`

---

Export Examples

PNG
`
python orchestrator.py fused \
    --pathA universe_A.jsonl \
    --pathB universe_B.jsonl \
    --export png \
    --name fused_glyph
`

SVG
`
python orchestrator.py dashboard --path universeA.jsonl --export svg --name dashboardA
`

MP4
`
python orchestrator.py replay --path universeA.jsonl --interval 120 --export mp4 --name replayA
`
