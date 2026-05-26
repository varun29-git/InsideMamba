# Mamba-3

This directory holds the **Mamba-3** implementation for this repo.

The file layout matches the other model folders in the repository: the main implementation lives in `model.py`, with both **SISO** and **MIMO** variants exposed for the shared training and generation scripts.

## What is in `model.py`

- `Mamba3Config`: small config object for model construction.
- `Mamba3SISOBlock`: a pure PyTorch Mamba-3 block with token-wise `A/dt`, trapezoidal recurrence, RoPE-style complex state tracking, and optional MIMO rank expansion.
- `Mamba3SISOLayer`: RMSNorm + residual wrapper around the block.
- `Mamba3SISOModel`: embedding stack, repeated layers, final norm, and LM head.
- `Mamba3MIMOLayer`: RMSNorm + residual wrapper for the MIMO path.
- `Mamba3MIMOModel`: embedding stack, repeated MIMO layers, final norm, and LM head.

## Current status

This is now a readable, trainable implementation of the main Mamba-3 SISO and MIMO ideas in pure PyTorch. It is not the same as the official fused-kernel implementation, so it will be slower, but both variants are functional and differentiable.

Use `--model_name mamba3_siso` or `--model_name mamba3_mimo` with the shared scripts.
