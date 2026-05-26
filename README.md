# MambaReview

> A from-first-principles study of the Mamba family: not a wrapper around the official kernels, but a readable PyTorch reconstruction of the ideas that make selective state space models work.

MambaReview is a learning and research repository for implementing Mamba-style language models from the ground up. The `docs/` site is intentionally small: it exists to explain the concepts visually and intuitively. The main artifact is the code in `model_code/`, where the architectures are written directly enough that the math can be inspected, changed, and argued with.

The project currently implements:

| Model | Implementation focus | Status |
| :--- | :--- | :--- |
| Vanilla Mamba | Selective SSM / S6, causal convolution, token-dependent `B`, `C`, and `dt` | Trainable baseline |
| Mamba-2 | Structured State Space Duality, chunked SSD, grouped `B/C`, autoregressive cache | Trainable, benchmarked |
| Mamba-3 SISO | Token-wise `A/dt`, trapezoidal recurrence, RoPE-style complex state tracking | Trainable |
| Mamba-3 MIMO | Low-rank multi-input/multi-output routing on top of the Mamba-3 recurrence | Trainable |

This repo favors clarity over production speed. The implementations deliberately use plain PyTorch modules, loops, and `einsum`-based tensor programs where official implementations would use fused CUDA or Triton kernels. That makes the code slower, but much better for seeing the moving parts.

## Why This Exists

Transformers made sequence modeling feel like matrix multiplication. Mamba asks a different question:

> Can a model keep a compact recurrent state, update it selectively, and still train efficiently on modern hardware?

To understand that, it is not enough to import `mamba_ssm` and train a block. This repo rebuilds the path step by step:

1. Start from the continuous-time state space equation:

   ```text
   h'(t) = A h(t) + B x(t)
   y(t)  = C h(t)
   ```

2. Discretize it into a recurrence over tokens.

3. Make the recurrence selective by allowing `B`, `C`, and `dt` to depend on the input.

4. Study why selection breaks the old convolution trick used by linear time-invariant SSMs.

5. Rebuild the Mamba-2 view where recurrence and masked matrix multiplication meet through structured state space duality.

6. Extend the code toward Mamba-3 ideas: token-dependent dynamics, trapezoidal integration, complex/rotary state motion, and MIMO routing.

The goal is not only to get a loss curve down. The goal is to understand why the architecture works.

## Repository Layout

```text
.
|-- model_code/
|   |-- models/
|   |   |-- Vanilla-Mamba/      # Original selective scan style baseline
|   |   |-- Mamba-2/            # SSD / chunked semiseparable computation
|   |   `-- Mamba-3/            # SISO and MIMO Mamba-3 style variants
|   |-- scripts/
|   |   |-- train.py            # Shared TinyStories training loop
|   |   |-- generate.py         # Sampling from trained checkpoints
|   |   |-- train_tokenizer.py  # 4k BPE tokenizer training
|   |   |-- plot_curves.py      # Loss/perplexity comparison plots
|   |   |-- update_leaderboard.py
|   |   |-- eval_utils.py
|   |   `-- model_configs.py
|   `-- requirements.txt
|-- everything_else/
|   |-- tokenizer_4k.json       # TinyStories BPE tokenizer
|   |-- logs/                   # Training metrics CSVs
|   |-- checkpoints/            # Saved model weights
|   |-- results/                # Generated plots
|   `-- samples/                # Generated text samples
`-- docs/                       # Small concept explainer site
```

## Architecture Notes

### Vanilla Mamba

`model_code/models/Vanilla-Mamba/model.py` is the baseline implementation. It contains the core pieces of a Mamba-1 style language model:

- `MambaBlock`: expands the token representation, applies depthwise causal convolution, predicts selective SSM parameters, runs the recurrence, gates the output, and projects back to `d_model`.
- `RMSNorm`: lightweight normalization before each block.
- `MambaLayer`: pre-norm plus residual wrapper.
- `MambaModel`: embeddings, repeated Mamba layers, final norm, and LM head.

This version is intentionally direct. The selective scan is written as a visible recurrence over sequence positions so the state update can be read without knowing a custom kernel.

### Mamba-2

`model_code/models/Mamba-2/model.py` reconstructs the Mamba-2 shift from selective recurrence toward Structured State Space Duality.

Important components:

- `segsum`: builds stable lower-triangular segment sums inside chunks.
- `ssd_minimal_discrete`: computes the SSD decomposition in pure PyTorch:
  - diagonal block interactions inside each chunk,
  - chunk boundary state accumulation,
  - off-diagonal recurrence between chunks.
- `ssd_step`: one-token recurrent update for autoregressive generation.
- `InferenceCache`: stores convolution and SSM states for generation.
- `Mamba2Block`: combines projection, local convolution, `dt/B/C` generation, SSD, skip connection, and gating.

The implementation avoids the black box of fused kernels while preserving the conceptual shape of the algorithm: use matrix multiplications where possible, and pass compact boundary states between chunks.

### Mamba-3

`model_code/models/Mamba-3/model.py` implements readable SISO and MIMO variants based on the repo's Mamba-3 study path.

Key ideas represented in code:

- token-wise `A` and `dt`;
- trapezoidal recurrence terms using previous and current token contributions;
- RoPE-style rotations over state dimensions to model complex-valued state motion;
- optional output gated RMS normalization;
- MIMO rank expansion for low-rank cross-channel routing.

The Mamba-3 code is experimental and educational. It is meant to make the recurrence legible and trainable, not to match the throughput of official fused implementations.

## Experiments

Training uses the streamed `roneneldan/TinyStories` dataset with a custom 4,096-token BPE tokenizer. The small vocabulary is deliberate: it keeps the embedding table compact so the parameter budget is spent on the sequence model rather than on a large language-model head.

Default training configuration lives in `model_code/scripts/model_configs.py`:

| Setting | Value |
| :--- | :--- |
| Batch size | `16` |
| Sequence length | `256` |
| Vocabulary size | `4096` |
| Max steps | `5000` |
| Optimizer | `AdamW` |
| Base LR | `1e-3` |
| Warmup steps | `100` |
| Gradient clip | `1.0` |

Current logged leaderboard from `everything_else/logs/`:

| Model | Throughput (TPS) | Validation PPL |
| :--- | :--- | :--- |
| Vanilla Mamba | 2149 | 10.57 |
| Mamba-2 | 61288 | 17.67 |
| Mamba-3 SISO | N/A | N/A |
| Mamba-3 MIMO | N/A | N/A |

The Mamba-1 and Mamba-2 numbers should be read with care. Earlier runs were not perfectly matched in model size; the current configs move Mamba-2 closer to the Mamba-1 parameter budget for cleaner comparisons.

## Quickstart

Create an environment and install the Python dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r model_code/requirements.txt
```

The tokenizer is already checked in at `everything_else/tokenizer_4k.json`. To rebuild it:

```bash
python3 model_code/scripts/train_tokenizer.py
```

Train a model:

```bash
python3 model_code/scripts/train.py --model_name mamba1
python3 model_code/scripts/train.py --model_name mamba2
python3 model_code/scripts/train.py --model_name mamba3_siso
python3 model_code/scripts/train.py --model_name mamba3_mimo
```

Run a sweep or ablation:

```bash
python3 model_code/scripts/train.py \
  --model_name mamba2 \
  --lr_scale 0.5 \
  --warmup_multiplier 2 \
  --run_tag lr05x_warm2x
```

Generate samples:

```bash
python3 model_code/scripts/generate.py --model_name mamba2 --run_tag lr05x_warm2x
```

Plot comparison curves:

```bash
python3 model_code/scripts/plot_curves.py
```

Update the experiment leaderboard in `everything_else/README.md`:

```bash
python3 model_code/scripts/update_leaderboard.py
```

## The Explainer Site

The site in `docs/` is a companion, not the main project.

It gives visual, intuitive explanations of:

- Mamba-1 selective scan;
- Mamba-2 state space duality;
- Mamba-3 trapezoidal recurrence and MIMO routing.

Open `docs/index.html` locally, or serve the folder with any static file server:

```bash
python3 -m http.server 8000 --directory docs
```

Then visit `http://localhost:8000`.

## Design Philosophy

This repository is built around a few constraints:

- **No magical imports for the core architecture.** The interesting parts are implemented in the repo.
- **Readable tensor shapes.** The code tries to keep dimensions explicit enough that the recurrence can be followed.
- **Small-model experimentation.** TinyStories and a 4k tokenizer make iteration possible without pretending this is a production LLM.
- **Benchmark honesty.** Throughput, perplexity, elapsed time, and VRAM are logged, but comparisons are treated cautiously when configs differ.
- **Kernel awareness without kernel dependence.** The README and model docs explain why fused kernels matter, while the code stays in plain PyTorch for inspectability.

## Papers And References

Core papers guiding the project:

- [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752), Albert Gu and Tri Dao.
- [Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality](https://arxiv.org/abs/2405.21060), Tri Dao and Albert Gu.
- [Mamba-3: Improved Sequence Modeling using State Space Principles](https://arxiv.org/abs/2603.15569), Albert Gu and Tri Dao.

Related directions included in the broader study path:

- [Vision Mamba: Efficient Visual Representation Learning with Bidirectional State Space Model](https://arxiv.org/abs/2401.09417).
- [VMamba: Visual State Space Model](https://arxiv.org/abs/2401.10166).
- [Jamba: A Hybrid Transformer-Mamba Language Model](https://arxiv.org/abs/2403.19887).

## Status

MambaReview is under active development. The code is already useful as a study implementation and small-model training harness, but it should not be treated as a drop-in replacement for optimized Mamba libraries.

The next useful milestones are:

- tighter apples-to-apples benchmark runs across all variants;
- parameter-count reporting for every config;
- more complete generation using inference caches where available;
- stronger tests around tensor shapes, recurrence equivalence, and checkpoint loading;
- deeper documentation linking each equation to the exact implementation line.
