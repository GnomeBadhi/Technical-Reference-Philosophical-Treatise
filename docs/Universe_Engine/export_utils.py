# export_utils.py
"""
Export Utilities (PNG, SVG, MP4)

Provides:
- PNG export
- SVG export
- MP4 export for animations
- deterministic naming
- invariant‑safe export pipeline

Dependencies:
- matplotlib
- ffmpeg (system-level)
"""

import os
import datetime
import matplotlib.pyplot as plt


# -------------------------------------------------------------
# Deterministic filename generator
# -------------------------------------------------------------
def make_name(base: str, ext: str):
    """
    Deterministic timestamped filename.
    Example: make_name("glyph", "png") → glyph_2026-04-17_12-30-05.png
    """
    ts = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    return f"{base}_{ts}.{ext}"


# -------------------------------------------------------------
# PNG Export
# -------------------------------------------------------------
def export_png(fig: plt.Figure, base: str = "figure", dpi: int = 300):
    """
    Export a Matplotlib figure as PNG.
    """
    name = make_name(base, "png")
    fig.savefig(name, dpi=dpi, bbox_inches="tight")
    print(f"[export] PNG saved → {name}")
    return name


# -------------------------------------------------------------
# SVG Export
# -------------------------------------------------------------
def export_svg(fig: plt.Figure, base: str = "figure"):
    """
    Export a Matplotlib figure as SVG.
    """
    name = make_name(base, "svg")
    fig.savefig(name, format="svg", bbox_inches="tight")
    print(f"[export] SVG saved → {name}")
    return name


# -------------------------------------------------------------
# MP4 Export (Animation)
# -------------------------------------------------------------
def export_mp4(anim, base: str = "animation", fps: int = 30, bitrate: int = 2400):
    """
    Export a Matplotlib animation as MP4 using FFMPEG.
    """
    name = make_name(base, "mp4")

    anim.save(
        name,
        writer="ffmpeg",
        fps=fps,
        bitrate=bitrate,
        dpi=200,
    )

    print(f"[export] MP4 saved → {name}")
    return name


# -------------------------------------------------------------
# Unified Export API
# -------------------------------------------------------------
def export(fig_or_anim, base: str, kind: str):
    """
    Unified export interface.
    kind ∈ {"png", "svg", "mp4"}
    """
    kind = kind.lower()

    if kind == "png":
        return export_png(fig_or_anim, base)

    if kind == "svg":
        return export_svg(fig_or_anim, base)

    if kind == "mp4":
        return export_mp4(fig_or_anim, base)

    raise ValueError(f"Unknown export kind: {kind}")
