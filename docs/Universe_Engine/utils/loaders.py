# utils/loaders.py
"""
Canonical loading utilities for the visualization suite.

Provides:
- load_jsonl(path): load JSONL logs into a list of dicts
- load_frame(history, frame): safely extract a single frame
- load_dual(pathA, pathB): synchronized loading for cross-universe modules
"""

import json
from typing import List, Dict, Tuple


# -------------------------------------------------------------
# JSONL Loader
# -------------------------------------------------------------
def load_jsonl(path: str) -> List[Dict]:
    """
    Load a JSONL file into a list of dictionaries.
    Each line is a complete universe state snapshot.
    """
    history = []
    with open(path, "r") as f:
        for line in f:
            if line.strip():
                history.append(json.loads(line))
    return history


# -------------------------------------------------------------
# Frame Extractor
# -------------------------------------------------------------
def load_frame(history: List[Dict], frame: int = -1) -> Dict:
    """
    Safely extract a single frame from a history list.
    frame = -1 → last frame
    """
    if not history:
        raise ValueError("History is empty — no frames to load.")

    if frame < 0:
        return history[-1]

    if frame >= len(history):
        raise IndexError(f"Frame {frame} out of range (len={len(history)}).")

    return history[frame]


# -------------------------------------------------------------
# Dual-Universe Loader
# -------------------------------------------------------------
def load_dual(pathA: str, pathB: str) -> Tuple[List[Dict], List[Dict], int]:
    """
    Load two universe histories and return:
    - histA
    - histB
    - L = synchronized length (min length)
    """
    histA = load_jsonl(pathA)
    histB = load_jsonl(pathB)

    if not histA:
        raise ValueError(f"Universe A log is empty: {pathA}")
    if not histB:
        raise ValueError(f"Universe B log is empty: {pathB}")

    L = min(len(histA), len(histB))
    return histA[:L], histB[:L], L


# -------------------------------------------------------------
# Convenience Extractors
# -------------------------------------------------------------
def extract_ticks(history: List[Dict]) -> List[int]:
    return [h["tick"] for h in history]


def extract_phases(history: List[Dict]) -> List[int]:
    return [h["phase"] for h in history]


def extract_array(history: List[Dict], key: str) -> List:
    """
    Extract a list of values for a given key across all frames.
    Example: extract_array(history, "C_global")
    """
    return [h[key] for h in history]
