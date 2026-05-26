README
AETHER Mamba Project

Mamba
A complete from-scratch implementation of the Mamba State-Space Model family.

Mamba provides a way to blend the infinite-context inference of recurrent dynamics with the matrix-multiplication speed of attention. Instead of treating state-space models as abstract concepts, this repository implements them from first principles so you can see exactly how the internal states, hardware-aware chunking, and integrations work.

Generation	Core Concept	Job	Code Location
Mamba-1	Selective Scan (S6)	Breaks LTI with input-dependent gates	mamba-1/model.py
Mamba-2	State-Space Duality	1-semiseparable block-wise parallel computation	mamba-2/model.py
Mamba-3	Trapezoidal Integration	Complex RoPE, MIMO bottleneck routing	mamba-3/model.py

Start Here
1. Clone the repository.
2. Install dependencies (e.g., torch).
3. Run the generation you want to inspect (e.g., python -m mamba-1.model).
4. Read the printed tensor shapes from the forward pass.

Why This Exists
Most state-space model implementations are deeply abstracted inside large libraries.

Usual SSM Flow	AETHER Mamba Flow
Import black-box module	Read the explicit PyTorch operations
Trust the integration logic	See the exact Trapezoidal / ZOH discretization
Obscured hardware operations	Exposed chunking and state-passing bounds

AETHER is for moments when a researcher wants to look under the hood of Mamba without fighting through thousands of lines of generalized framework code.

What AETHER Maintains
Path	Purpose
mamba-1/	S6 selective scan implementation
mamba-2/	State-Space Duality and parallel chunking
mamba-3/	Trapezoidal integration and complex RoPE
docs/	Lightweight pedagogical static site

Folder Layout
/
|-- docs/
|-- mamba-1/
|-- mamba-2/
|-- mamba-3/
`-- README.md

Pedagogical Site
A visual, first-principles explanation of these models can be viewed at: https://varundaiya.github.io/MambaReview/

Status
AETHER Mamba is a reference implementation for educational and research purposes.

It is not a substitute for highly optimized production libraries like the official mamba-ssm package.
