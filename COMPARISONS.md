# Side-by-side comparisons

The point of holding these as **graphs** instead of pictures: you can put two
architectures next to each other and see exactly what changed. Each row opens
the live, editable graph in Neurarch — fork either one and re-validate.

Every "open" link loads the full graph onto the canvas. Open two in separate
tabs to diff them node by node.

---

## Attention: MHA → GQA → MLA

The single most-iterated-on block in modern LLMs. The trend is "spend fewer
parameters and less KV-cache on keys/values without losing quality."

| Step | Model | What it does | Open |
|---|---|---|---|
| Multi-head | [deepseek-llm-7b](architectures/deepseek-llm-7b/) | 32 query heads, 32 KV heads — every head has its own K/V | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/deepseek-llm-7b/model.json) |
| Grouped-query | [qwen2.5-7b](architectures/qwen2.5-7b/) | 28 query heads share just 4 KV heads — ~7× smaller KV cache | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/qwen2.5-7b/model.json) |
| Latent | [deepseek-v2-lite](architectures/deepseek-v2-lite/) | MLA: K/V compressed to one low-rank latent, decompressed per head | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/deepseek-v2-lite/model.json) |

Same DeepSeek lineage runs the whole arc: `deepseek-llm-7b` (MHA) → `deepseek-v2` (MLA debut) → `deepseek-v3` (MLA at 671B).

## Dense → Sparse Mixture-of-Experts

How you scale total parameters without scaling the per-token compute.

| Model | Experts | Active per token | Open |
|---|---|---|---|
| [llama3-8b](architectures/llama3-8b/) | dense (1 FFN) | all 8B | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/llama3-8b/model.json) |
| [mixtral-block](architectures/mixtral-block/) | 8, top-2 routing | 2 of 8 | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/mixtral-block/model.json) |
| [deepseek-v3](architectures/deepseek-v3/) | 256 routed + 1 shared, top-8 | 37B of 671B | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/deepseek-v3/model.json) |

Then open [llama-4-scout](architectures/llama-4-scout/) (16 fat experts, top-1) next to `deepseek-v3` (256 fine experts, top-8): the same idea, opposite granularity bets.

## Post-norm → Pre-norm

Where the LayerNorm sits relative to the residual add. Pre-norm trains more
stably at depth and is now the default; the 2017 original was post-norm.

| Placement | Model | Open |
|---|---|---|
| Post-norm (norm after the add) | [transformer-block](architectures/transformer-block/) | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/transformer-block/model.json) |
| Pre-norm (norm before the sub-layer) | [llama3-block](architectures/llama3-block/) | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/llama3-block/model.json) |

## The three transformer shapes

Encoder, decoder, and encoder-decoder — same attention block, three wirings for
three jobs.

| Shape | Model | Job | Open |
|---|---|---|---|
| Encoder-only | [bert-base](architectures/bert-base/) | Read text, classify / embed | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/bert-base/model.json) |
| Decoder-only | [gpt2-small](architectures/gpt2-small/) | Generate text left-to-right | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/gpt2-small/model.json) |
| Encoder-decoder | [t5-small](architectures/t5-small/) | Map sequence to sequence (cross-attention) | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/t5-small/model.json) |

## Vision: ConvNet → Transformer → modernized ConvNet

| Model | Approach | Open |
|---|---|---|
| [resnet-50](architectures/resnet-50/) | Residual convolutions, the long-time default | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/resnet-50/model.json) |
| [vit-b16](architectures/vit-b16/) | Patch the image, run a plain Transformer | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/vit-b16/model.json) |
| [convnext-tiny](architectures/convnext-tiny/) | A ConvNet redesigned with ViT's lessons | [open](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/convnext-tiny/model.json) |

---

Want a comparison that isn't here? Open the two entries side by side in Neurarch, or [open an issue](https://github.com/neurarch-ai/awesome-llm-model-zoo/issues).
