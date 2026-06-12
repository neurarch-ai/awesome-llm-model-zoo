# GPT-2 Small

The 124M-parameter GPT-2 configuration from OpenAI, the classic decoder-only transformer and the reference point most later LLM architectures are described against.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/gpt2-small/model.json |
| Hugging Face | https://huggingface.co/openai-community/gpt2 |
| GitHub | https://github.com/openai/gpt-2 |

## Architecture

![GPT-2 Small architecture](assets/diagram.svg)

| Hyperparameter | Value |
|---|---|
| Type | Decoder-only transformer (causal LM) |
| Parameters | ~124M |
| Layers | 12 |
| Hidden size | 768 |
| Attention | Multi-head: 12 heads (causal) |
| Head dim | 64 |
| FFN | Dense MLP, 3072, GeLU |
| Normalization | LayerNorm, pre-norm |
| Positions | Learned absolute, max 1024 |
| Vocabulary | 50,257 |
| Max context | 1,024 |

The diagram and `model.json` show the full forward path with one of the 12 identical decoder blocks expanded (the stack repeats x12).

## Design notes

- Pre-norm placement (LayerNorm before attention and MLP) plus a final `ln_f`, the detail that separates GPT-2 from the original post-norm Transformer.
- Learned absolute position embeddings added to token embeddings, no RoPE; context is hard-capped at 1024 tokens.
- Dense GeLU MLP at 4x hidden (3072), the ratio later Llama-style models replaced with ~2.7x SwiGLU.
- LM head shares weights with the token embedding (weight tying).

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The Neurarch graph. Shape-validated; open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) | Vector diagram (papers, slides). |
| [`assets/diagram.png`](assets/diagram.png) | Raster diagram (renders everywhere). |

**License:** MIT (model weights and code from OpenAI).
