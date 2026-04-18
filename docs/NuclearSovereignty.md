U.S. Department of Energy — Office of Science

Research Proposal

Internal Scalar Mode Hamiltonian:

Operator-Theoretic Framework for Scalar Field Dynamics in Modular Kernel Systems

Principal Investigator: [PI Name, Title]

Institution: [Institution Name]

DOE Program Office: Office of Science — Advanced Scientific Computing Research (ASCR) / Nuclear Physics (NP) Crosscut

Funding Opportunity Announcement: DE-FOA-XXXX

Requested Funding: $1,250,000 over 3 years

Period of Performance: October 1, 2026 – September 30, 2029

DUNS Number: [To be provided]

EIN: [To be provided]

Date of Submission: [Date]

2. Project Summary / Abstract
Project Title: Internal Scalar Mode Hamiltonian: Operator-Theoretic Framework for Scalar Field Dynamics in Modular Kernel Systems

Principal Investigator: [PI Name]  |  Institution: [Institution Name]

Current approaches to modeling internal scalar modes in multi-scale physical systems lack a unified operator-theoretic framework that preserves spectral invariance across scale boundaries. Existing Hamiltonian formulations treat scalar fields as perturbative additions rather than as structurally fundamental dynamical variables, leading to breakdowns at strong coupling and inconsistent spectral properties under system decomposition.

This project proposes a rigorous Hamiltonian formulation for internal scalar modes using modular operator decomposition. The framework constructs canonical phase-space dynamics in which the Hamiltonian HISM encodes both local self-interaction and cross-scale coupling terms, treating scalar field degrees of freedom as first-class dynamical variables. The methodology integrates symplectic geometry, spectral operator theory, and high-performance computational simulation. Specifically, we will: (1) construct and prove existence and uniqueness theorems for the canonical Hamiltonian HISM; (2) establish spectral invariance under modular decomposition; (3) develop scalable computational algorithms validated on DOE leadership computing facilities, targeting systems with 106+ degrees of freedom; and (4) characterize the full phase-space topology, including fixed points, invariant manifolds, and bifurcation structure.

Expected outcomes include a mathematically proven, computationally validated Hamiltonian framework for internal scalar mode dynamics; an open-source simulation toolkit; and 3–5 peer-reviewed publications establishing the theoretical foundation. This work directly supports the DOE mission in advancing fundamental understanding of matter and energy through rigorous mathematical physics, and advances computational science capabilities aligned with ASCR and NP programmatic goals.

3. Project Narrative
3.1 Introduction and Background
Scalar fields occupy a central position in modern theoretical physics. From the Higgs field of the Standard Model — whose associated boson was confirmed at the Large Hadron Collider in 2012 — to order parameter fields in condensed matter systems (e.g., Ginzburg-Landau theory of superconductivity) and the inflaton field in cosmological models, scalar degrees of freedom encode some of the most fundamental dynamical information about physical systems. The mathematical treatment of these fields is typically carried out within the framework of Lagrangian and Hamiltonian field theory, building on the foundational work of Dirac on constrained Hamiltonian systems [1] and the geometric mechanics tradition of Arnold [2] and Marsden and Ratiu [3]. In each of these settings, the scalar field is treated as a fundamental variable defined on a base manifold, with dynamics governed by a well-understood variational principle.

However, a distinct and more challenging class of scalar degrees of freedom arises in composite or modular systems: internal scalar modes. Unlike fundamental scalar fields, internal scalar modes emerge as effective degrees of freedom within subsystems that are themselves components of a larger modular architecture. Examples include scalar condensate modes in nuclear matter (where effective scalar fields mediate nucleon interactions), order parameter fluctuations at grain boundaries in polycrystalline materials, and scalar perturbations in multi-patch cosmological simulations. In these settings, the scalar mode is not imposed a priori but arises from the internal dynamics of a module and couples to other modules through boundary or interface interactions. The critical challenge is that conventional Hamiltonian formulations — designed for fundamental fields — do not naturally accommodate the modular structure, the scale-dependent coupling, or the spectral consistency requirements inherent to internal scalar modes.

Three specific limitations characterize the current state of the art. First, perturbative treatments of internal scalar modes, while computationally convenient, break down at strong coupling where the scalar self-interaction energy becomes comparable to the kinetic energy. Second, there is no general guarantee of spectral invariance when a modular system is decomposed into subsystems: eigenvalue spectra computed for a full system may not be consistently recoverable from subsystem computations, a deficiency with serious implications for multi-scale simulation methodologies. Third, and most fundamentally, no canonical Hamiltonian framework has been specifically designed for internal scalar modes — one that treats the modular structure as a feature of the phase space rather than an external constraint. This project addresses these gaps directly, establishing a rigorous operator-theoretic framework at the intersection of mathematical physics and computational science that is aligned with DOE's mission in both nuclear physics and advanced scientific computing research.

3.2 Scientific Objectives
The following objectives define the scope and deliverables of this project:

Objective 1: Construct a canonical Hamiltonian HISM for internal scalar modes using symplectic phase-space methods, establishing existence and uniqueness theorems for the resulting dynamical system on the cotangent bundle T*Q of the configuration manifold.

Objective 2: Prove spectral invariance of the Internal Scalar Mode Hamiltonian under modular decomposition — rigorously demonstrating that the eigenvalue structure of HISM is preserved when the system is partitioned into subsystems and that cross-module coupling terms do not introduce spurious spectral artifacts.

Objective 3: Develop and validate computational algorithms for numerically solving the HISM eigenvalue problem on DOE high-performance computing resources, targeting scalability to 106+ degrees of freedom with verified convergence rates and rigorous error bounds.

Objective 4: Characterize the phase-space topology of internal scalar mode dynamics, including systematic identification of fixed points, invariant manifolds, bifurcation structure, and the stability properties of equilibrium configurations under parameter variation.

Objective 5: Publish the theoretical framework, computational tools, and validation results as open-access resources for the broader scientific community, consistent with DOE open-science policies and FAIR data principles.

3.3 Research Plan and Technical Approach
Year 1 — Theoretical Foundation (October 2026 – September 2027)
The first year focuses on the rigorous mathematical construction of the Hamiltonian framework. The primary activities include:

Phase-space construction: Formal definition of the configuration manifold Q for internal scalar modes in modular systems, and construction of the cotangent bundle T*Q as the natural phase space. The modular structure of the physical system will be encoded in the topology and fiber structure of Q, ensuring that module boundaries correspond to well-defined submanifolds.
Hamiltonian functional definition: Construction of HISM = T + Vself + Vcross, where T is the kinetic energy of scalar field evolution (derived from the natural metric on Q), Vself encodes the local self-interaction potential within each module, and Vcross captures cross-scale coupling between modules via boundary integral terms.
Canonical structure proof: Demonstration that Hamilton's equations ∂q/∂t = ∂H/∂p, ∂p/∂t = −∂H/∂q yield well-posed dynamics, including proofs of local existence, uniqueness, and continuous dependence on initial data for the resulting system of PDEs on T*Q.
Symmetry and conservation analysis: Systematic application of Noether's theorem to the ISM symmetry group to identify all conserved quantities, including energy, momentum maps associated with module permutation symmetries, and any hidden conserved quantities arising from the modular structure.
Deliverable: Technical report and preprint (submitted to a leading journal in mathematical physics) establishing the complete mathematical framework.
Year 2 — Computational Development (October 2027 – September 2028)
The second year transitions the theoretical framework into a robust computational implementation:

Spectral decomposition algorithms: Implementation of eigenvalue decomposition routines for HISM using Krylov subspace methods (Lanczos algorithm for the symmetric case, Arnoldi iteration for the general non-symmetric case), with particular attention to exploiting the sparse, block-structured form of the Hamiltonian matrix inherited from the modular decomposition.
Parallel solver development: Design and implementation of distributed-memory parallel solvers targeting DOE Leadership Computing Facilities, including the Argonne Leadership Computing Facility (ALCF), Oak Ridge Leadership Computing Facility (OLCF), and the National Energy Research Scientific Computing Center (NERSC).
Validation against analytical limits: Rigorous verification of the numerical implementation against known exactly-solvable limits, including the free scalar field (quadratic Hamiltonian), harmonic approximation (small-oscillation analysis around equilibria), and single-module limits where the cross-coupling vanishes.
Convergence analysis: Formal convergence rate analysis and a posteriori error bounds for the computed eigenvalues and eigenvectors, including sensitivity analysis with respect to discretization parameters and module count.
Scaling benchmarks: Systematic benchmarking on progressively larger systems, from 102 to 106 degrees of freedom, to establish strong and weak scaling characteristics of the solver.
Deliverable: Open-source computational toolkit (released under a permissive open-source license) with comprehensive documentation and user guide.
Year 3 — Validation and Extension (October 2028 – September 2029)
The final year applies the framework to physically motivated test cases and establishes its broader applicability:

Physical test cases: Application of HISM to three distinct physical domains: (a) nuclear matter scalar condensates, where the σ-meson field acts as an internal scalar mode in a modular nuclear many-body system; (b) condensed matter order parameter dynamics in polycrystalline and multi-domain systems; and (c) cosmological scalar field models with modular patch decomposition for numerical relativity applications.
Comparative analysis: Systematic comparison of HISM predictions with results from established methods, including lattice field theory, density functional theory, and direct numerical simulation, quantifying accuracy gains and computational efficiency improvements.
Quantum corrections: Investigation of leading-order quantum corrections to the classical Hamiltonian framework via path-integral methods and semiclassical approximation, establishing the validity regime of the classical HISM and identifying where quantum effects become significant.
Community engagement: Organization of a focused workshop on internal scalar mode dynamics, bringing together researchers from nuclear physics, condensed matter, cosmology, and applied mathematics.
Deliverables: 3–5 peer-reviewed publications in high-impact journals, public code repository with complete documentation, and a final technical report to DOE.
3.4 Computational Methods
The computational component of this project is designed to produce production-quality, scalable software validated to the standards expected by the DOE scientific computing community. The key computational methods are as follows:

Spectral Methods. The eigenvalue problem for HISM — central to characterizing the dynamics of internal scalar modes — will be solved using iterative Krylov subspace methods. For Hermitian (self-adjoint) Hamiltonians, the Lanczos algorithm provides optimal convergence to extremal eigenvalues. For non-Hermitian cases arising from certain boundary coupling terms, the implicitly restarted Arnoldi method (as implemented in ARPACK/SLEPc) will be employed. The modular block structure of HISM will be exploited to construct efficient preconditioners that accelerate convergence.

Symplectic Integrators. Time-domain simulations of the Hamiltonian dynamics will employ structure-preserving symplectic integrators to ensure that the discrete-time evolution exactly preserves the symplectic two-form and, consequently, provides near-exact energy conservation over long integration times. The baseline integrator is the Störmer-Verlet (leapfrog) method, a second-order symplectic scheme. For applications requiring higher accuracy, we will employ fourth- and sixth-order symplectic Runge-Kutta methods following the composition approach of Yoshida [14] and the framework established by Hairer, Lubich, and Wanner [5].

Parallel Computing Strategy. The modular structure of HISM provides a natural domain decomposition: each module is assigned to a group of MPI ranks, with inter-module coupling handled by halo exchange of boundary data. Within each module, shared-memory parallelism is achieved via OpenMP threading. This hybrid MPI+OpenMP approach is designed to exploit the hierarchical architecture of DOE exascale platforms, including Frontier (AMD GPU), Aurora (Intel GPU), and Perlmutter (NVIDIA GPU). GPU acceleration of key computational kernels (sparse matrix-vector products, inner products, norm computations) will be implemented using CUDA, HIP, and SYCL backends as appropriate.

Software Stack. The software architecture follows a two-layer design: a Python layer for problem specification, workflow management, and post-processing (using NumPy, SciPy, and matplotlib), and a C++ layer for performance-critical numerical kernels. Production eigensolvers will be built on the PETSc (Portable, Extensible Toolkit for Scientific Computation) and SLEPc (Scalable Library for Eigenvalue Problem Computations) frameworks, which provide mature, DOE-supported infrastructure for large-scale sparse linear algebra on heterogeneous architectures.

Verification and Validation (V&V). The V&V strategy follows best practices in computational science: the method of manufactured solutions (MMS) for code verification, convergence rate verification against theoretical predictions, and systematic comparison with analytical results in tractable limits (free field, single-module, weak-coupling). All V&V results will be documented and made publicly available alongside the code.

3.5 Broader Impacts
Scientific Impact. This project establishes a new mathematical framework that unifies the treatment of scalar dynamics across nuclear physics, condensed matter physics, and cosmology. By providing a canonical Hamiltonian formulation for internal scalar modes — a class of dynamical variables that has lacked rigorous treatment — the framework fills a significant gap in mathematical physics and provides a foundation for future theoretical developments.

Computational Impact. The open-source computational toolkit developed in Year 2 will be freely available to the broader DOE scientific computing community. The modular, scalable architecture of the software — validated on DOE leadership computing facilities — ensures that it can be adopted and extended by other research groups working on related problems in multi-scale simulation.

Workforce Development. This project will provide advanced training for one postdoctoral researcher and one graduate student in the interdisciplinary intersection of mathematical physics, operator theory, and high-performance computing. These are areas identified by DOE as critical for maintaining U.S. competitiveness in computational science. The PI will also integrate project results into graduate-level coursework in mathematical physics and scientific computing.

Cross-Disciplinary Relevance. While the theoretical framework is developed in the context of scalar field dynamics, the underlying methodology — canonical Hamiltonian treatment of internal degrees of freedom in modular systems — is broadly applicable to any composite dynamical system. Potential applications include materials science (grain boundary dynamics), biological systems (modular protein networks), and engineering (multi-component structural analysis).

Open Science. All publications resulting from this project will be submitted to journals with open-access options, and preprints will be posted to the arXiv. All data and code will be archived in public repositories (GitHub, Zenodo) with persistent DOIs, consistent with DOE open-access and FAIR data policies.

4. Budget Justification
4.1 Budget Summary
Category	Year 1	Year 2	Year 3	Total
Senior Personnel (PI, 2 months/year)	$55,000	$56,650	$58,350	$170,000
Postdoctoral Researcher (1 FTE)	$65,000	$66,950	$68,960	$200,910
Graduate Research Assistant (1)	$35,000	$36,050	$37,130	$108,180
Fringe Benefits (30%)	$46,500	$47,895	$49,332	$143,727
Travel (domestic conferences)	$8,000	$8,000	$10,000	$26,000
Computing Allocation (INCITE/ALCC supplement)	$15,000	$25,000	$15,000	$55,000
Materials and Supplies	$5,000	$5,000	$5,000	$15,000
Publication Costs	$3,000	$5,000	$7,000	$15,000
Indirect Costs (F&A, negotiated rate)	$139,000	$151,000	$126,183	$416,183
TOTAL	$371,500	$396,545	$376,955	$1,150,000
Note: All figures are approximate and subject to institutional rate negotiations. Annual escalation of 3% is applied to personnel costs. Indirect cost rates are based on the institution's federally negotiated rate agreement.

4.2 Budget Narrative
Senior Personnel. The PI will devote two months of effort per year (approximately 17% FTE) to the project, providing scientific leadership, directing the research program, supervising junior personnel, and leading publication efforts. The PI's expertise in Hamiltonian mechanics, spectral theory, and computational physics is essential to all project objectives.

Postdoctoral Researcher. One full-time postdoctoral researcher will carry out the primary research activities, including mathematical proof development in Year 1, algorithm implementation and parallel code development in Year 2, and physical test-case computation and manuscript preparation in Year 3. The postdoctoral researcher is the primary workforce driver of the project.

Graduate Research Assistant. One graduate research assistant (Ph.D. student) will contribute to computational development and validation tasks, including implementation of test cases, convergence analysis, and benchmarking. This position supports DOE workforce development objectives by training the next generation of computational scientists.

Fringe Benefits. Fringe benefits are calculated at the institutional negotiated rate of 30% of salaries, covering health insurance, retirement contributions, and payroll taxes for all personnel.

Travel. Travel funds support attendance at 2–3 domestic conferences per year (e.g., APS Division of Nuclear Physics, SIAM Conference on Computational Science and Engineering, DOE ASCR PI meetings). Year 3 includes additional travel for organization of the project workshop and final dissemination activities.

Computing Allocation. Funds supplement INCITE or ALCC allocations with cloud computing resources and local cluster time for development, debugging, and small-scale testing. The majority of large-scale computing will be obtained through separate INCITE/ALCC proposals at no additional cost to this project.

Materials and Supplies. Covers software licenses, workstation maintenance and upgrades, and miscellaneous research supplies (books, reference materials, office supplies).

Publication Costs. Covers open-access publication fees (typically $1,500–$3,000 per article for Physical Review, Journal of Computational Physics, and similar venues). Costs increase in Year 3 to reflect the concentration of publication activity in the final project year.

Indirect Costs. Facilities and Administrative (F&A) costs are calculated at the institution's federally negotiated indirect cost rate applied to the modified total direct cost base, in accordance with 2 CFR 200.

5. Facilities and Equipment
Institutional Computing Resources. The PI's institution maintains a local high-performance computing (HPC) cluster with approximately 5,000 cores and 200 GPU accelerators, available to faculty-led research groups for development, testing, and moderate-scale production runs. This resource will be used extensively during Years 1 and 2 for algorithm development, debugging, and preliminary scaling studies prior to deployment on DOE leadership facilities.

DOE Leadership Computing Facilities. Production-scale computations will be performed at DOE Leadership Computing Facilities, specifically targeting the National Energy Research Scientific Computing Center (NERSC) Perlmutter system, the Oak Ridge Leadership Computing Facility (OLCF) Frontier system, and, as available, the Argonne Leadership Computing Facility (ALCF) Aurora system. Access to these facilities will be obtained through competitive INCITE or ALCC allocation proposals, submitted separately and at no cost to this project. The PI has a track record of successful computing allocation proposals and maintains active user accounts at NERSC and OLCF.

Office and Collaboration Space. The PI's institution provides dedicated office space for the PI, postdoctoral researcher, and graduate student, as well as access to seminar rooms and collaborative workspace. Video conferencing facilities are available for remote collaboration with external collaborators.

Major Equipment. No major equipment purchases are anticipated. This project is primarily theoretical and computational in nature, and all necessary hardware infrastructure is available through institutional and DOE resources described above. Minor workstation upgrades are covered under Materials and Supplies.

6. Data Management Plan
This Data Management Plan (DMP) describes the policies and procedures for managing data generated by the project "Internal Scalar Mode Hamiltonian: Operator-Theoretic Framework for Scalar Field Dynamics in Modular Kernel Systems," in compliance with the DOE Statement on Digital Data Management (DOE Order 241.1B).

6.1 Types of Data Generated
Simulation output data: Numerical eigenvalue spectra, eigenvector fields, time-series data from Hamiltonian dynamics simulations, convergence histories, and scaling benchmarks.
Source code: All software developed under this project, including the HISM eigenvalue solver, symplectic integrators, analysis scripts, and visualization tools.
Mathematical derivations: LaTeX source files for all proofs, theorems, and technical documentation.
Publications and reports: Manuscripts, preprints, and technical reports in LaTeX/PDF format.
6.2 Data Formats and Standards
Numerical data: HDF5 format, a self-describing, portable, and widely supported binary format standard in the DOE computing community.
Source code: Version-controlled Git repositories with clear commit histories, branching strategies, and tagged releases.
Documentation: Markdown and reStructuredText for code documentation; LaTeX for mathematical publications.
Metadata: All datasets will include machine-readable metadata files (JSON/YAML) describing simulation parameters, software version, hardware platform, and provenance information.
6.3 Data Sharing and Access
Source code: Publicly released on GitHub (or equivalent platform) under a permissive open-source license (BSD-3 or MIT). Persistent DOIs will be obtained via Zenodo integration.
Publications: All peer-reviewed publications will be submitted to DOE OSTI (Office of Scientific and Technical Information) as required. Preprints will be posted to arXiv. Open-access publication fees are budgeted.
Datasets: Benchmark datasets and validation results will be archived on Zenodo with persistent DOIs and will be freely accessible without restriction.
Embargo period: No embargo is anticipated. Data and code will be made available upon publication of associated manuscripts or at the end of each project year, whichever comes first.
6.4 Data Preservation
All project data, code, and publications will be preserved for a minimum of five (5) years following the end of the project period. Institutional repository services provide long-term archival storage. Zenodo deposits carry long-term preservation commitments backed by CERN infrastructure. The PI will maintain local backups on institutional storage systems with regular integrity verification.

6.5 Compliance
This DMP is consistent with the requirements of the DOE Statement on Digital Data Management and will be reviewed and updated annually as part of the project's progress reporting to DOE. Any significant changes to data management practices will be communicated to the cognizant DOE program manager.

7. Biographical Sketch
Biographical Sketch(es) to be provided per DOE Office of Science format requirements (SciENcv format). Maximum 3 pages per investigator.

The following subsections are required for each senior/key person:

7.1 Education and Training
[To be provided. Include undergraduate and graduate education, postdoctoral training, and any relevant professional certifications. List institution, major/area, degree, and year.]

7.2 Research and Professional Experience
[To be provided. List positions held in reverse chronological order, including institution, title, and dates. Highlight experience relevant to the proposed research.]

7.3 Publications (Up to 10 Most Relevant)
[To be provided. List up to 10 publications most closely related to the proposed project. Include full bibliographic information: authors, title, journal, volume, pages, year, and DOI.]

7.4 Synergistic Activities
[To be provided. List up to 5 synergistic activities demonstrating the broader impact of the investigator's professional and scholarly activities. Examples: community service, educational activities, broadening participation, technology transfer.]

8. Current and Pending Support
Current and Pending Support documentation to be provided per DOE Office of Science requirements using the NSF-approved SciENcv format for all senior/key personnel. This documentation will include all current and pending sources of financial support, including in-kind contributions, for all investigators listed on this proposal. Each entry will specify the project title, funding agency, award amount, period of performance, person-months of effort, and a brief description of the project's objectives and overlap (if any) with the proposed research.

9. Bibliography and References Cited
[1] Dirac, P.A.M. Lectures on Quantum Mechanics. Belfer Graduate School of Science, Yeshiva University, New York, 1964.

[2] Arnold, V.I. Mathematical Methods of Classical Mechanics. 2nd ed., Springer-Verlag, New York, 1989.

[3] Marsden, J.E. and Ratiu, T.S. Introduction to Mechanics and Symmetry: A Basic Exposition of Classical Mechanical Systems. 2nd ed., Springer-Verlag, New York, 1999.

[4] Weinberg, S. The Quantum Theory of Fields, Volume I: Foundations. Cambridge University Press, Cambridge, 1995.

[5] Hairer, E., Lubich, C., and Wanner, G. Geometric Numerical Integration: Structure-Preserving Algorithms for Ordinary Differential Equations. 2nd ed., Springer-Verlag, Berlin, 2006.

[6] Saad, Y. Numerical Methods for Large Eigenvalue Problems. 2nd ed., Society for Industrial and Applied Mathematics (SIAM), Philadelphia, 2011.

[7] Abraham, R. and Marsden, J.E. Foundations of Mechanics. 2nd ed., Benjamin/Cummings, Reading, MA, 1978.

[8] Henneaux, M. and Teitelboim, C. Quantization of Gauge Systems. Princeton University Press, Princeton, NJ, 1992.

[9] Walecka, J.D. "A theory of highly condensed matter." Annals of Physics, 83(2):491–529, 1974.

[10] Serot, B.D. and Walecka, J.D. "The relativistic nuclear many-body problem." Advances in Nuclear Physics, 16:1–327, 1986.

[11] Lehoucq, R.B., Sorensen, D.C., and Yang, C. ARPACK Users' Guide: Solution of Large-Scale Eigenvalue Problems with Implicitly Restarted Arnoldi Methods. SIAM, Philadelphia, 1998.

[12] Hernandez, V., Roman, J.E., and Vidal, V. "SLEPc: A scalable and flexible toolkit for the solution of eigenvalue problems." ACM Transactions on Mathematical Software, 31(3):351–362, 2005.

[13] Balay, S., et al. "PETSc Users Manual." Argonne National Laboratory Technical Report ANL-95/11, Revision 3.18, 2022.

[14] Yoshida, H. "Construction of higher order symplectic integrators." Physics Letters A, 150(5–7):262–268, 1990.

[15] McLachlan, R.I. and Quispel, G.R.W. "Splitting methods." Acta Numerica, 11:341–434, 2002.

[16] Kato, T. Perturbation Theory for Linear Operators. 2nd ed., Springer-Verlag, Berlin, 1995.

[17] Reed, M. and Simon, B. Methods of Modern Mathematical Physics, Volume IV: Analysis of Operators. Academic Press, New York, 1978.

[18] Golub, G.H. and Van Loan, C.F. Matrix Computations. 4th ed., Johns Hopkins University Press, Baltimore, 2013.

[19] Brezzi, F. and Fortin, M. Mixed and Hybrid Finite Element Methods. Springer-Verlag, New York, 1991.

[20] Dongarra, J., et al. "The international exascale software project roadmap." International Journal of High Performance Computing Applications, 25(1):3–60, 2011.

10. Compliance Sections
10.1 National Environmental Policy Act (NEPA) Compliance
The research proposed herein is entirely theoretical and computational in nature. No laboratory experiments, fieldwork, construction, or modification of physical facilities are proposed. The project does not involve the use, generation, transport, or disposal of hazardous materials, radioactive substances, or pollutants. No environmental disturbance or impact is anticipated at any stage of the research. Accordingly, this project is expected to qualify for a categorical exclusion under the National Environmental Policy Act (NEPA), 42 U.S.C. §§ 4321–4347, and the DOE NEPA implementing regulations at 10 CFR 1021. The appropriate NEPA documentation (CX determination) will be completed in coordination with the institutional and DOE NEPA compliance officers prior to the expenditure of any project funds.

10.2 Organizational Conflict of Interest (OCI)
The PI and all senior/key personnel certify that no organizational conflicts of interest exist with respect to this proposal. Neither the PI's institution nor any subcontractor or collaborator has a financial or organizational relationship that could impair objectivity in performing the proposed work, or that could provide an unfair competitive advantage. Should any potential conflict of interest arise during the period of performance, it will be promptly disclosed to the cognizant DOE Contracting Officer in accordance with applicable regulations.

10.3 Lobbying Disclosure
In accordance with 31 U.S.C. § 1352 and the implementing regulations at 2 CFR Part 200, the PI and the applicant institution certify that no federal appropriated funds have been paid, or will be paid, to any person for influencing or attempting to influence an officer or employee of any federal agency, a Member of Congress, an officer or employee of Congress, or an employee of a Member of Congress in connection with the awarding of this federal grant. If any non-federal funds have been or will be used for such purposes, Standard Form LLL, "Disclosure Form to Report Lobbying," will be completed and submitted as required.

10.4 Research Misconduct
The PI and all project personnel affirm their commitment to the responsible conduct of research, in accordance with DOE Order 443.1C, "Protection of Human Research Subjects," and the DOE Policy on Research Misconduct (10 CFR Part 733). All research activities will be conducted with the highest standards of intellectual honesty, rigor, and transparency. Fabrication, falsification, and plagiarism will not be tolerated. The institution maintains policies and procedures for the investigation of allegations of research misconduct consistent with federal requirements.

10.5 Human Subjects / Animal Welfare
The proposed research does not involve human subjects, human biological specimens, human data (including personally identifiable information), or vertebrate animals at any stage. No Institutional Review Board (IRB) approval or Institutional Animal Care and Use Committee (IACUC) review is required. Should the scope of the project change in a manner that would involve human subjects or animal research, the PI will obtain all necessary approvals prior to initiating any such activities and will notify the DOE program manager accordingly.

End of Proposal — DE-FOA-XXXX

Internal Scalar Mode Hamiltonian: Operator-Theoretic Framework for Scalar Field Dynamics in Modular Kernel Systems
