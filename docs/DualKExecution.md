# Dual‑Kernel Execution Model  
**Operational Semantics for the DC/AC Processor**

This document defines the execution model for the dual‑kernel computational architecture.  
It specifies how the **DC Core Kernel** (constant logic) and the **AC Boundary Kernel** (dynamic frequency layer) interact over time to perform computation.

The execution model formalizes:

- temporal structure,  
- transition semantics,  
- reinforcement dynamics,  
- routing behavior,  
- and the full state‑transition pipeline.

This document serves as the operational foundation for simulation and future physical implementations.

---

## 1. Temporal Structure

Although the DC Core Kernel is time‑independent, the AC Boundary Kernel introduces a **temporal rhythm** that governs computation.

Execution proceeds in discrete **cycles**, each consisting of:

1. **Input Phase**  
2. **Proposal Phase**  
3. **Validation Phase**  
4. **Transition Phase**  
5. **Stabilization Phase**

These phases define the complete lifecycle of a state update.

---

## 2. AC Input Semantics

The AC Boundary Kernel receives **oscillatory inputs**, represented abstractly as:

- frequency identifiers,  
- amplitude values,  
- phase values,  
- or symbolic triggers.

Each input corresponds to:

- a target state,  
- a transition pathway,  
- or a routing instruction.

Inputs may be:

- **persistent** (reinforcement),  
- **pulsed** (transitions),  
- **combinational** (logic conditions),  
- **sequential** (state machines).

The AC layer does not directly modify the system state; it **proposes** transitions.

---

## 3. DC Validation Semantics

The DC Core Kernel enforces:

- invariants,  
- allowed transitions,  
- boundary rules,  
- and state integrity.

When the AC layer proposes a transition, the DC layer evaluates:

1. **Is the target state valid?**  
2. **Is the transition permitted by the grammar?**  
3. **Does the transition preserve invariants?**  
4. **Does the system remain within the Meta‑Cube?**

If any condition fails, the transition is rejected.

If all conditions pass, the transition is accepted.

---

## 4. Transition Pipeline

A valid transition proceeds through the following pipeline:

### **4.1 Proposal**
The AC layer identifies a target state based on input frequencies.

### **4.2 Validation**
The DC layer checks the transition against invariants and grammar.

### **4.3 Execution**
The system moves from the current node to the target node.

### **4.4 Boundary Update**
The AC layer updates reinforcement patterns to match the new state.

### **4.5 Stabilization**
The DC layer locks the system into the new state unless further transitions are triggered.

This pipeline ensures deterministic, invariant‑preserving computation.

---

## 5. Stabilization Phase

After a transition, the system enters a stabilization phase.

### **5.1 Reinforcement**
The AC layer reinforces the active state through continued oscillatory input.

### **5.2 Boundary Integrity**
The DC layer ensures the system remains within valid boundaries.

### **5.3 Noise Rejection**
Invalid or weak AC signals are ignored during stabilization.

### **5.4 Persistence**
The system remains in the active state until a new transition is proposed and validated.

This phase provides memory‑like behavior even in the absence of explicit storage components.

---

## 6. Routing and Multi‑Node Dynamics

Routing is implemented through **frequency‑dependent coupling** between nodes.

### **6.1 Coupling Rules**
Each node has defined coupling pathways to neighboring nodes in the Meta‑Cube.

### **6.2 Frequency‑Driven Routing**
Specific frequencies activate specific pathways.

### **6.3 Conditional Routing**
Routing may depend on:

- multiple simultaneous inputs,  
- sequential patterns,  
- or state‑dependent conditions.

### **6.4 Multi‑Step Transitions**
Complex transitions may be decomposed into:

- a sequence of AC proposals,  
- validated stepwise by the DC layer.

Routing transforms the Meta‑Cube into a **computational graph**.

---

## 7. Execution Examples

### **7.1 Single‑Step Transition**
- AC proposes transition from node A to node B.  
- DC validates.  
- System transitions.  
- AC reinforces B.  
- DC stabilizes.

### **7.2 AND Gate Execution**
- AC receives frequencies \(f_A\) and \(f_B\).  
- Only the combined condition activates the O‑transition.  
- DC validates the O‑transition.  
- System moves to O.

### **7.3 Flip‑Flop Execution**
- AC reinforces \(f_L\) → system remains in L.  
- AC pulse at \(f_H\) → proposes transition to H.  
- DC validates.  
- System moves to H and stabilizes.

These examples demonstrate the generality of the execution model.

---

## 8. Pseudocode Specification

Below is an abstract pseudocode representation of the execution cycle:
