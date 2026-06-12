# InternLM2-7B

Shanghai AI Laboratory's second-generation 7B base model. A pre-norm decoder with 32:8 grouped-query attention and a native 32k context window, plus strong tool-use and long-context chat variants.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/internlm2-7b/model.json |
| Hugging Face | https://huggingface.co/internlm/internlm2-7b |
| GitHub | https://github.com/InternLM/InternLM |

## Architecture

![InternLM2-7B architecture](assets/diagram.svg)

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

The diagram and `model.json` show the full forward path with one of the 32 identical decoder blocks expanded (the stack repeats x32). All hyperparameters are taken from the official `config.json` on Hugging Face.

## Design notes

- Llama-3-like shape a year early: 32 layers, GQA 32:8, and the same 14336 FFN intermediate size.
- Native 32768-token context trained with rope_theta = 1e6, extrapolating to 200k in the chat variants.
- Consolidated W_qkv weight layout: q, k, v are stored interleaved per KV group, which matters when converting checkpoints.
- 92544-token vocabulary covering Chinese, English, and code.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The Neurarch graph. Shape-validated; open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) | Vector diagram (papers, slides). |
| [`assets/diagram.png`](assets/diagram.png) | Raster diagram (renders everywhere). |

**License:** Code Apache 2.0; weights free for commercial use after application. The graph and diagrams here describe the architecture; the model weights remain under the upstream license.
