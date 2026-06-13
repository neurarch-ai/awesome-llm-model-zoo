# InternLM2-7B

Shanghai AI Laboratory's second-generation 7B base model. A pre-norm decoder with 32:8 grouped-query attention and a native 32k context window, plus strong tool-use and long-context chat variants.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/internlm2-7b/model.json |
| Hugging Face | https://huggingface.co/internlm/internlm2-7b |
| GitHub | https://github.com/InternLM/InternLM |

## Architecture

![InternLM2-7B full architecture](assets/diagram.png)

*The full graph, all 197 nodes, tiled into columns for readability (read each column top-to-bottom, then left-to-right). Exactly what `model.json` holds. Vector: [diagram.svg](assets/diagram.svg).*

<details>
<summary><b>One block, expanded (explainer view)</b></summary>

![InternLM2-7B block view](assets/block.png)

</details>

| Hyperparameter | Value |
|---|---|
| Type | Decoder-only transformer (causal LM) |
| Parameters | 7.7B |
| Layers | 32 |
| Hidden size | 4096 |
| Attention | Grouped-query: 32 query heads, 8 KV heads |
| Head dim | 128 |
| FFN | SwiGLU, intermediate size 14,336 |
| Normalization | RMSNorm, pre-norm |
| Positions | RoPE (rotary dim 128) |
| Vocabulary | 92,544 |
| Max context | 32,768 |

`model.json` is the full 32-layer graph, produced with the same import path the Neurarch app uses for "load from Hugging Face", with all hyperparameters from the official `config.json`.

## Parameter check

Neurarch's per-layer parameter estimate over this graph: **7.74B**.
Deviation from the authoritative count (7.74B): **-0.0%**.

## Design notes

- Llama-3-like shape a year early: 32 layers, GQA 32:8, and the same 14336 FFN intermediate size.
- Native 32768-token context trained with rope_theta = 1e6, extrapolating to 200k in the chat variants.
- Consolidated W_qkv weight layout: q, k, v are stored interleaved per KV group, which matters when converting checkpoints.
- 92544-token vocabulary covering Chinese, English, and code.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The full Neurarch graph (every layer, real dimensions). Open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) / [`.png`](assets/diagram.png) | Diagram of the full graph. |
| [`assets/block.svg`](assets/block.svg) / [`.png`](assets/block.png) | Compact one-block explainer view. |

**License:** Code Apache 2.0; weights free for commercial use after application. The graph and diagrams here describe the architecture; the model weights remain under the upstream license.
