# orchestrator.py
"""
Top‑Level Orchestrator

Provides:
- unified CLI
- one‑call artifact generation
- batch export
- deterministic pipeline execution

This module wraps all visualization and analysis tools into a
single, clean interface.

Dependencies:
- all visualization modules
- export_utils
"""

import argparse

from dashboard import dashboard
from replay_engine import replay
from heatmap import heatmap
from glyph_layer import glyph_layer
from glyph_animation import glyph_animation
from operator_dashboard import operator_dashboard
from delta3_panel import delta3_panel
from dashboard_multi import dashboard_multi
from phase_locking_analyzer import phase_locking_analyzer
from cross_universe_field import cross_universe_field
from fused_glyph import fused_glyph
from fused_glyph_animation import fused_glyph_animation
from instrument_panel import instrument_panel
from replay_multi import replay_multi
from comparison_suite import comparison_suite

from export_utils import export


# -------------------------------------------------------------
# Orchestrator Commands
# -------------------------------------------------------------
def run():
    parser = argparse.ArgumentParser(
        description="Sovereign Kernel Visualization Orchestrator"
    )

    parser.add_argument("mode", type=str,
                        help="artifact to generate")

    parser.add_argument("--path", type=str, default=None,
                        help="single‑universe log")

    parser.add_argument("--pathA", type=str, default=None,
                        help="universe A log")

    parser.add_argument("--pathB", type=str, default=None,
                        help="universe B log")

    parser.add_argument("--paths", nargs="+", default=None,
                        help="multi‑universe logs")

    parser.add_argument("--frame", type=int, default=-1,
                        help="frame index")

    parser.add_argument("--interval", type=int, default=120,
                        help="animation interval (ms)")

    parser.add_argument("--export", type=str, default=None,
                        help="export kind: png | svg | mp4")

    parser.add_argument("--name", type=str, default="artifact",
                        help="base name for export")

    args = parser.parse_args()

    fig_or_anim = None

    # ---------------------------------------------------------
    # Single‑universe artifacts
    # ---------------------------------------------------------
    if args.mode == "dashboard":
        fig_or_anim = dashboard(args.path)

    elif args.mode == "replay":
        fig_or_anim = replay(args.path, args.interval)

    elif args.mode == "heatmap":
        fig_or_anim = heatmap(args.path, args.frame)

    elif args.mode == "glyph":
        fig_or_anim = glyph_layer(args.path, args.frame)

    elif args.mode == "glyph_anim":
        fig_or_anim = glyph_animation(args.path, args.interval)

    elif args.mode == "operators":
        fig_or_anim = operator_dashboard(args.path)

    elif args.mode == "delta3":
        fig_or_anim = delta3_panel(args.path)

    # ---------------------------------------------------------
    # Dual‑universe artifacts
    # ---------------------------------------------------------
    elif args.mode == "dashboard_multi":
        fig_or_anim = dashboard_multi(args.pathA, args.pathB)

    elif args.mode == "phase_lock":
        fig_or_anim = phase_locking_analyzer(args.pathA, args.pathB)

    elif args.mode == "field":
        fig_or_anim = cross_universe_field(args.pathA, args.pathB, args.frame)

    elif args.mode == "fused":
        fig_or_anim = fused_glyph(args.pathA, args.pathB, args.frame)

    elif args.mode == "fused_anim":
        fig_or_anim = fused_glyph_animation(args.pathA, args.pathB, args.interval)

    elif args.mode == "instrument":
        fig_or_anim = instrument_panel(args.pathA, args.pathB, args.frame)

    elif args.mode == "replay_multi":
        fig_or_anim = replay_multi(args.pathA, args.pathB, args.interval)

    # ---------------------------------------------------------
    # Multi‑universe artifacts
    # ---------------------------------------------------------
    elif args.mode == "compare":
        fig_or_anim = comparison_suite(args.paths)

    else:
        raise ValueError(f"Unknown mode: {args.mode}")

    # ---------------------------------------------------------
    # Export (optional)
    # ---------------------------------------------------------
    if args.export:
        export(fig_or_anim, args.name, args.export)


if __name__ == "__main__":
    run()
