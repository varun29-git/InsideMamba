# Vanilla Mamba

This directory contains the foundational, pure PyTorch implementation of the original **Mamba-1** architecture. It serves as the baseline for the `MambaReview` repository, designed for pedagogical clarity and raw performance benchmarking against subsequent architectural iterations.

## Architecture Highlights
* **Selective State Spaces (S6)**: The core mechanism that enables input-dependent state transitions, allowing the model to selectively remember or forget information across the sequence.
* **1D Causal Convolution**: A lightweight local mixing layer that prepares tokens before they enter the state space math.
* **Hardware-Aware Scanning**: Implemented using stable cumulative sums and segment sums to ensure parallelizable efficiency during training without needing custom CUDA kernels.

## Usage

### Training
The model is configured to train on a streamed slice of the `roneneldan/TinyStories` dataset. 
To start a training run and generate the throughput logs:
```bash
python3 model_code/scripts/train.py --model_name mamba1
```

### Generation
The training script automatically produces a checkpoint (`everything_else/checkpoints/mamba1_best.pt`) and outputs zero-shot greedy completions during the evaluation loop. You can also evaluate it against Mamba-2 using the shared scripts under `model_code/scripts/`.

## Core Files
* `model.py`: The raw PyTorch implementation of the S6 architecture and `MambaBlock`.
* `model_code/scripts/train.py`: The shared training loop with integrated token-per-second (TPS) and VRAM tracking.
