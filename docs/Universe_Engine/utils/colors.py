# utils/colors.py
"""
Canonical color grammar for the visualization suite.

Defines:
- PHASE_COLORS: mapping from Phase enum → hex color
- blended_color(c1, c2, t): linear interpolation for dual-phase fusion
"""

from typing import Tuple
from universe_engine import Phase


# -------------------------------------------------------------
# Phase Color Grammar (Canonical)
# -------------------------------------------------------------
PHASE_COLORS = {
    Phase.NEBULA:     "#666666",  # diffuse, low-coherence
    Phase.STAR:       "#ffcc00",  # ignition, growth
    Phase.BLACK_HOLE: "#000000",  # collapse, compression
    Phase.QUASAR:     "#ff00ff",  # emission, expansion
    Phase.SOURCE:     "#00ffcc",  # perfect coherence
}


# -------------------------------------------------------------
# Color Utilities
# -------------------------------------------------------------
def _hex_to_rgb(hex_color: str) -> Tuple[float, float, float]:
    """Convert #RRGGBB → (r, g, b) in [0, 1]."""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def _rgb_to_hex(rgb: Tuple[float, float, float]) -> str:
    """Convert (r, g, b) in [0, 1] → #RRGGBB."""
    return "#{:02x}{:02x}{:02x}".format(
        int(rgb[0] * 255),
        int(rgb[1] * 255),
        int(rgb[2] * 255),
    )


def blended_color(hex1: str, hex2: str, t: float) -> str:
    """
    Linear interpolation between two hex colors.
    t = 0 → hex1
    t = 1 → hex2

    Used for:
    - dual-phase halos
    - fused glyph transitions
    """
    r1, g1, b1 = _hex_to_rgb(hex1)
    r2, g2, b2 = _hex_to_rgb(hex2)

    r = r1 + (r2 - r1) * t
    g = g1 + (g2 - g1) * t
    b = b1 + (b2 - b1) * t

    return _rgb_to_hex((r, g, b))
