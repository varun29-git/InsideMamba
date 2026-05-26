# AETHER Mamba Project

This repository hosts a **complete implementation** of the Mamba family of State‑Space Models (SSM) **from scratch**, together with a minimalist, editorial‑grade website that explains the concepts from first principles.

## Repository Layout
```
.
├─ docs/                     # Static site (HTML/CSS/SVG) – pedagogical supplement
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
