# AETHER Mamba Pedagogical Site

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
