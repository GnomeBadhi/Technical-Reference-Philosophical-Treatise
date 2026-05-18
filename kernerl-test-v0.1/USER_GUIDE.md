# **USER_GUIDE.md**

# **User Guide — kernel‑test‑v0.1**  
**Candidate kernel test v0.1 — one domain‑specific instantiation**

This guide explains what this tool does, how to run it, and how to adapt it to your own domain.

---

# **1. What this tool is**

`kernel-test-v0.1` is a **simple, reproducible kernel‑behavior tester**.

It allows you to:

- define a projection operator (a matrix)  
- apply it to a vector  
- see how the vector splits into “kept” and “removed” parts  
- apply a derived operator called **S**  
- check whether the kernel behaves correctly  

Think of it as a **multimeter for projection operators**.  
You plug in a kernel, run the test, and see if it behaves the way a projection should.

This project does **not** make universal, physical, cognitive, or metaphysical claims.  
It is a **narrow numerical test**.

---

# **2. What the user actually experiences**

When you run the test, you will see:

1. A vector go in  
2. The kernel projection act on it  
3. The complementary projection act on it  
4. The sovereignty operator act on it  
5. A simple pass/fail report  

A typical output looks like:

```
K0_x : [1. 2. 3. 0. 0. 0.]
I_minus_K0_x : [0. 0. 0. 4. 5. 6.]
S_x : [ 1.  2.  3. -4. -5. -6.]

K0_idempotent_error : 1.23e-16
decomposition_error : 2.11e-16
S_stability_error : 9.87e-17
```

If the errors are tiny (≈10⁻¹⁶), the kernel behaves correctly.

---

# **3. How to run the test**

### **Prerequisites**
- Python 3  
- NumPy  

### **Run the module**
From the project folder:

```
python module.py
```

### **What happens**
The script:

1. Loads a sample vector from `inputs/sample_vector.npy`  
2. Builds a projection matrix `K0`  
3. Builds two auxiliary projections `K+` and `K−`  
4. Constructs the operator `S = K0 + A_K (I − K0)`  
5. Applies all operators to the vector  
6. Prints results and error metrics  

No configuration required.

---

# **4. What `module.py` actually does**

Here is the workflow inside the script:

---

### **Step 1 — Build the kernel projection `K0`**

By default, `K0` keeps the first 3 coordinates of a vector and zeros out the rest.

You can replace this with any projection you want.

---

### **Step 2 — Build auxiliary projections `K+` and `K−`**

These are simple placeholder projections used to construct:

```
A_K = K+ − K−
```

They are ingredients for building the operator S.

---

### **Step 3 — Construct the sovereignty operator `S`**

```
S = K0 + A_K (I − K0)
```

This operator should leave the projected part unchanged.

---

### **Step 4 — Apply everything to the input vector**

The script computes:

- `K0_x` → the part of the vector that survives the kernel  
- `I_minus_K0_x` → the part that gets removed  
- `S_x` → how S transforms the vector  
- error metrics → whether the kernel behaves correctly  

---

# **5. How to plug in your own domain**

The domain is defined entirely by the choice of **K0**.

To change domains, edit this function in `module.py`:

```python
def make_K0(n=6, k=3):
    ...
```

Replace the default projection with one that fits your domain.

Below are ready‑to‑use examples.

---

# **6. Example domain options**

## **Example A — Geometry domain**  
Projection onto the xy‑plane:

```python
K0 = np.array([
    [1,0,0],
    [0,1,0],
    [0,0,0]
])
```

---

## **Example B — Signal processing domain**  
Low‑pass filter (keep first k Fourier modes):

```python
def make_K0(n=64, k=10):
    K0 = np.zeros((n,n))
    for i in range(k):
        K0[i,i] = 1
    return K0
```

---

## **Example C — Machine learning domain**  
Projection onto PCA components:

```python
U = pca_components[:, :k]
K0 = U @ U.T
```

---

## **Example D — Graph domain**  
Project onto a subset of nodes:

```python
K0 = np.diag([1,1,1,0,0,0])
```

---

## **Example E — Control theory domain**  
Projection onto controllable subspace:

```python
K0 = C @ np.linalg.pinv(C)
```

---

# **7. What counts as failure**

The test fails if:

- `K0 @ K0` deviates from `K0`  
- the decomposition `x = K0x + (I − K0)x` fails  
- `S(K0x)` deviates from `K0x`  
- numerical errors exceed tolerance  

This means the kernel is not behaving as a proper projection in this domain.

---

# **8. What this tool does *not* claim**

- No universality  
- No physical interpretation  
- No cognitive interpretation  
- No biological interpretation  
- No validation of the full Sovereignty Engine  

This is a **candidate kernel test**, not a proof.

---

# **9. Summary**

`kernel-test-v0.1` gives you:

- a simple projection operator  
- a reproducible numerical test  
- a clear pass/fail report  
- the ability to plug in any domain  
- a safe, narrow, academically acceptable artifact  

It is a sandbox for exploring projection‑based kernels.
