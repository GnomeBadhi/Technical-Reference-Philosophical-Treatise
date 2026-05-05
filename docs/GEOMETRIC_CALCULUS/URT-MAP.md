---
title: "URT-MAP v1.0 — Cross-Domain Mapping Chart"
version: "1.0.0"
status: "draft"
authors:
  - name: "Chris"
date-created: "2026-05-05"
date-modified: "2026-05-05"
tags:
  - URT-MAP
  - cross-domain
  - mapping-chart
  - invariants
parent: "README.md"
see-also:
  - "Invariant-Geometry.md"
  - "Applications.md"
  - "../sovereignty-engine/README.md"
  - "../lk-urt/README.md"
chart-format: "Markdown table + Mermaid"
commit-scope: "chart"
---

# URT-MAP v1.0 — Cross-Domain Mapping Chart

> **Navigation:** [← README](./README.md) | [Invariant Geometry →](./Invariant-Geometry.md) | [Applications →](./Applications.md)

---

## 1. Purpose of the Cross-Domain Chart

The URT-MAP chart encodes, for each recognized **domain pair**:

1. **Source domain** and its native representational primitives
2. **Target domain** and its native representational primitives
3. **Invariant class** preserved under the map (derived from [LK-URT](../lk-urt/README.md))
4. **Map type** (isomorphism, homomorphism, embedding, projection)
5. **Geometric structure** referenced in [Invariant-Geometry.md](./Invariant-Geometry.md)
6. **Sovereignty Engine hook** — the constraint module that validates the map at runtime

---

## 2. Domain Taxonomy
