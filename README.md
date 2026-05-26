# AETHER Mamba Project

## What is Mamba?
Mamba is a family of **State‑Space Models (SSM)** that combine the strengths of recurrent dynamics and attention‑style parallelism:
- **Infinite‑context inference** through a tiny hidden state that can be updated step‑by‑step.
- **Training speed** on GPUs by leveraging matrix‑multiplication kernels.

The three generations develop this idea progressively:
1. **Mamba‑1 (Selective Scan – S6)** – introduces *input‑dependent* parameters (`Δₜ, Bₜ, Cₜ`) that let the model selectively forget or retain information.
2. **Mamba‑2 (State‑Space Duality)** – shows that a specially‑structured attention mask (`1‑semi‑separable`) is mathematically identical to a linear SSM, enabling block‑wise parallel computation.
3. **Mamba‑3** – upgrades the integration to a **trapezoidal (Crank‑Nicolson) rule**, adds **complex‑valued RoPE rotations** for stable long‑range phase handling, and introduces **MIMO rank‑bottleneck routing** for richer cross‑channel interactions.

## Why this repository?
I built **all three generations from scratch** to:
- Provide a **research‑ready reference implementation** that is easy to read, extend, and benchmark.
- Serve as a **personal learning platform** where I could experiment with the underlying mathematics and low‑level GPU kernels.
- Offer a **pedagogical website** that explains each generation in intuitive, non‑technical language for anyone curious about the ideas.

Thus the repo contains **two complementary parts**:
- **The code** – located under `mamba-1/`, `mamba-2/`, and `mamba-3/`. Each folder holds a `model.py` implementing the core recurrence, a tiny demo (`if __name__ == "__main__"`) and, for Mamba‑2, a `README.md` describing training usage.
- **The site** – a minimal‑style editorial website in `docs/` that walks through the concepts with static SVGs and simple prose. It is deliberately lightweight; its purpose is to give a quick visual intuition, not to replace the detailed code.

## What does the code cover?
| Generation | Core Features Implemented | Files |
|------------|---------------------------|-------|
| **Mamba‑1** | Input‑dependent `Δₜ, Bₜ, Cₜ`, HiPPO‑initialized `A`, Zero‑Order Hold discretisation, GPU‑aware fused scan kernel | `mamba-1/model.py` |
| **Mamba‑2** | 1‑semi‑separable attention mask, block‑wise parallel SSD algorithm, chunked state‑passing, training‑time speed‑ups | `mamba-2/model.py` & `mamba-2/README.md` |
| **Mamba‑3** | Trapezoidal (Crank‑Nicolson) integration, complex‑valued RoPE rotation, MIMO low‑rank bottleneck routing, extended hyper‑parameters | `mamba-3/model.py` |

Future work will add **Mamba‑4** (hierarchical multi‑scale extensions) and additional benchmarks.

## How to use the code
```bash
# Clone the repository
git clone https://github.com/<your‑username>/MambaReview.git
cd MambaReview

# Install dependencies (example) – you may need torch, numpy, etc.
pip install -r requirements.txt

# Run a quick sanity‑check for each variant
python -m mamba-1.model   # prints hidden‑state shape & a tiny forward pass
python -m mamba-2.model   # same for generation‑2
python -m mamba-3.model   # same for generation‑3
```
Each demo prints shapes and a short excerpt of the output, making it trivial to verify that the recurrence works on your machine.

## The Pedagogical Site
The site lives in the `docs/` directory and is built with plain HTML/CSS and KaTeX for math rendering. It contains a single‑line purpose statement on the landing page and three long‑form articles that mirror the three generations. The site also includes a brief author bio:
> *"Created by Varun (github.com/varundaiya) to make cutting‑edge SSM research accessible to anyone with a browser."*

## Deploying the Site to GitHub Pages
The repository includes a GitHub Actions workflow (`.github/workflows/gh-pages.yml`). A recent deployment was failing because the workflow copied files to a temporary `site/` directory before publishing, which caused path issues. The workflow has been simplified to publish the `docs/` folder directly.

**Steps to enable GitHub Pages:**
1. Push any changes to the `main` branch.
2. In the repository go to **Settings → Pages** and select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. The workflow will automatically run on every push and create/update the `gh-pages` branch.
4. If you need to trigger a manual build, use the **Run workflow** button in GitHub Actions (the workflow now supports `workflow_dispatch`).

If the site still does not appear, ensure:
- The `gh-pages` branch exists (the workflow creates it on the first run).
- No branch‑protection rules block the workflow from pushing.
- Your default branch is `main` (the workflow watches `main`).

## Author & Acknowledgements
I am **Varun** (GitHub username `varundaiya`). I built this repo to deepen my own understanding of state‑space models and to share that knowledge with the community. The visual design follows an “Apple‑inspired editorial” aesthetic, with clean typography, generous white space, and subtle micro‑animations.

Special thanks to the original Mamba authors for their groundbreaking papers and to the open‑source community for the tooling that made this implementation possible.

---

*Happy hacking and happy learning!*

│  ├─ index.html            # Hub / landing page
│  ├─ style.css             # Global minimalist stylesheet
│  ├─ mamba-1/index.html    # Generation I article
│  ├─ mamba-2/index.html    # Generation II article
│  └─ mamba-3/index.html    # Generation III article
├─ mamba-1/                  # First‑generation implementation (S6 selective scan)
│  └─ model.py              # Core Mamba‑1 model code
├─ mamba-2/                  # Second‑generation implementation (State‑Space Duality)
│  ├─ model.py              # Core Mamba‑2 code (SSD, chunked parallel scan)
│  └─ README.md             # Details on training / usage
├─ mamba-3/                  # Third‑generation implementation (Trapezoidal, RoPE, MIMO)
│  └─ model.py              # Core Mamba‑3 code
├─ .github/
│  └─ workflows/
│     └─ gh-pages.yml      # GitHub Actions deployment for the site
└─ README.md                # You are reading it now
```

All **code** lives outside the `docs/` folder, making the repository a full research‑ready package: you can import the models directly from `mamba-1/model.py`, `mamba-2/model.py`, and `mamba-3/model.py`.

## How to Use the Code
```bash
# Clone the repo
git clone https://github.com/<username>/MambaReview.git
cd MambaReview

# Install requirements (example using pip)
pip install -r requirements.txt   # (or install needed libraries manually)

# Run a quick sanity check for each generation
python -m mamba-1.model   # runs a tiny demo of Mamba‑1
python -m mamba-2.model   # runs a tiny demo of Mamba‑2
python -m mamba-3.model   # runs a tiny demo of Mamba‑3
```

Each `model.py` contains a minimal `if __name__ == "__main__":` block that generates a short forward pass and prints the shapes of the hidden state and output, useful for quick verification.

## How to Deploy the Pedagogical Site to GitHub Pages
1. **Push to `main`** – The site will be automatically built on every push to the `main` branch.
2. **GitHub Settings** – In the repository *Settings → Pages*, set:
   - **Source** → `Deploy from a branch`
   - **Branch** → `gh-pages`
   - **Folder** → `/ (root)`
3. The provided GitHub Actions workflow (`.github/workflows/gh-pages.yml`) copies the `docs/` folder to the `gh-pages` branch, making the site live at `https://<username>.github.io/<repo>/`.

## Custom Domain (optional)
If you own a custom domain, add a `CNAME` file at the repository root containing the domain name (e.g. `example.com`). GitHub Pages will pick it up automatically.

---

### Acknowledgements
The visual style follows the “Apple‑inspired editorial” aesthetic defined in the original design brief. Mathematical formulas are rendered with **KaTeX**, and all SVGs are hand‑crafted to illustrate the core concepts without heavy JavaScript.

---

*Happy learning and happy hacking!*

This repository contains a minimal‑style, editorial‑grade website that explains the **Mamba** family of State‑Space Models (SSM) from first principles. Each generation (Mamba‑1, Mamba‑2, Mamba‑3) is presented as a long‑form article with clear math, intuitive analogies and static SVG illustrations.

## Repository Layout
```
.
├─ docs/
│  ├─ index.html            # Hub / landing page
│  ├─ style.css             # Global minimalist stylesheet
│  ├─ mamba-1/index.html    # Generation I article
│  ├─ mamba-2/index.html    # Generation II article
│  └─ mamba-3/index.html    # Generation III article
├─ .github/
│  └─ workflows/
│     └─ gh-pages.yml      # GitHub Actions deployment
└─ README.md                # You are reading it now
```

All content lives under the **`docs/`** folder because GitHub Pages can serve static files directly from this directory.

## How to Deploy to GitHub Pages
1. **Push to `main`** – The site will be automatically built on every push to the `main` branch.
2. **GitHub Settings** – In the repository *Settings → Pages*, set:
   - **Source** → `Deploy from a branch`
   - **Branch** → `gh-pages`
   - **Folder** → `/ (root)`
3. The provided GitHub Actions workflow (`.github/workflows/gh-pages.yml`) copies the `docs/` folder to the `gh-pages` branch, making the site live at `https://<username>.github.io/<repo>/`.

## Custom Domain (optional)
If you own a custom domain, add a `CNAME` file at the repository root containing the domain name (e.g. `example.com`). GitHub Pages will pick it up automatically.

---

### Acknowledgements
The visual style follows the “Apple‑inspired editorial” aesthetic defined in the original design brief. Mathematical formulas are rendered with **KaTeX**, and all SVGs are hand‑crafted to illustrate the core concepts without heavy JavaScript.

---

*Happy learning!*
