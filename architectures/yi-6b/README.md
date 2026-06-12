# Yi-6B

The 6B base model from 01.AI (founded by Kai-Fu Lee), trained on 3.1T bilingual tokens. A Llama-style decoder notable for using grouped-query attention at small scale and for its 200K long-context variant.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/yi-6b/model.json |
| Hugging Face | https://huggingface.co/01-ai/Yi-6B |
| GitHub | https://github.com/01-ai/Yi |

## Architecture

![Yi-6B architecture](assets/diagram.svg)

| Hyperparameter | Value |
|---|---|
| Type | Decoder-only transformer (causal LM) |
| Parameters | 6B |
| Layers | 32 |
| Hidden size | 4096 |
| Attention | Grouped-query: 32 query heads, 4 KV heads |
| Head dim | 128 |
| FFN | SwiGLU, intermediate size 11,008 |
| Normalization | RMSNorm, pre-norm |
| Positions | RoPE (rotary dim 128) |
| Vocabulary | 64,000 |
| Max context | 4,096 |

The diagram and `model.json` show the full forward path with one of the 32 identical decoder blocks expanded (the stack repeats x32). All hyperparameters are taken from the official `config.json` on Hugging Face.

## Design notes

- Fully Llama-compatible architecture (model_type "llama"), so the whole Llama tooling ecosystem works out of the box.
- Grouped-query attention even at 6B scale: 32 query heads over 4 KV heads, unusual for a model this small at the time.
- High rope_theta (5e6) chosen with long-context extension in mind; the Yi-6B-200K variant stretches the same architecture to 200k tokens.
- Compact 64000-token bilingual vocabulary.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The Neurarch graph. Shape-validated; open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) | Vector diagram (papers, slides). |
| [`assets/diagram.png`](assets/diagram.png) | Raster diagram (renders everywhere). |

**License:** Apache 2.0 (relicensed from the Yi License in 2024). The graph and diagrams here describe the architecture; the model weights remain under the upstream license.
