# Baichuan2-7B

Baichuan Inc.'s second-generation 7B base model, a Llama-shaped pre-norm decoder distinguished by a large Chinese-optimized vocabulary and a normalized output head (NormHead).

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/baichuan2-7b/model.json |
| Hugging Face | https://huggingface.co/baichuan-inc/Baichuan2-7B-Base |
| GitHub | https://github.com/baichuan-inc/Baichuan2 |

## Architecture

![Baichuan2-7B architecture](assets/diagram.png)

*Identical repeated blocks are folded into one representative block with a `× N` badge, so the whole architecture fits on screen. `model.json` keeps all 197 nodes (open it in Neurarch to see and edit every layer). Vector: [diagram.svg](assets/diagram.svg).*

| Hyperparameter | Value |
|---|---|
| Type | Decoder-only transformer (causal LM) |
| Parameters | 7.5B |
| Layers | 32 |
| Hidden size | 4096 |
| Attention | Multi-head: 32 heads |
| Head dim | 128 |
| FFN | SwiGLU, intermediate size 11,008 |
| Normalization | RMSNorm, pre-norm |
| Positions | RoPE (rotary dim 128) |
| Vocabulary | 125,696 |
| Max context | 4,096 |

`model.json` is the full 32-layer graph, produced with the same import path the Neurarch app uses for "load from Hugging Face", with all hyperparameters from the official `config.json`.

## Parameter check

Neurarch's per-layer parameter estimate over this graph: **7.51B**.
Deviation from the authoritative count (7.51B): **+0.0%**.

## Design notes

- Llama-2-7B shape (32 layers, 4096 hidden, 11008 FFN) with a much larger 125696-token vocabulary optimized for Chinese.
- NormHead: the output embedding (LM head) rows are L2-normalized before the logit matmul, which the tech report credits with stabilizing training.
- The 7B model uses RoPE; do not confuse it with the 13B sibling, which uses ALiBi instead.
- Trained on 2.6T tokens; one of the first Chinese LLMs to ship intermediate training checkpoints for research.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The full Neurarch graph (every layer, real dimensions). Open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) / [`.png`](assets/diagram.png) | Architecture diagram (repeated blocks folded with a `× N` badge). |

**License:** Code Apache 2.0; weights under the Baichuan2 Community License (free commercial use after application). The graph and diagrams here describe the architecture; the model weights remain under the upstream license.
