# Neurarch Model Zoo

A growing library of **validated reference architectures** for machine learning models.

Every architecture here is not just a picture. It is a structurally validated model graph:

- **Shape-checked** end to end (tensor shapes, attention head divisibility, GQA constraints).
- **Exportable** to runnable training code (TRL, torchtune, Unsloth, PyTorch).
- **Editable** as a graph, so you can fork it, modify it, and re-validate before you ever launch a run.

The diagrams are a side effect. The point is that each one is correct and runnable.

Built with [Neurarch](https://www.neurarch.com/), a graph-native design environment for ML model architectures.

## How to use this

Each folder under [`architectures/`](architectures/) contains:

| File | What it is |
|------|------------|
| `README.md` | What the model is, its **model URLs** (Neurarch, Hugging Face, GitHub), the verified hyperparameters, and design notes. |
| `model.json` | The Neurarch graph. Open it at [neurarch.com](https://www.neurarch.com/) to edit, validate, or export. |
| `assets/diagram.svg` | Vector diagram (scales cleanly, good for papers and slides). |
| `assets/diagram.png` | Raster diagram (renders everywhere: GitHub, social previews, docs). |

### Open any architecture in one click

Every entry has an **Open in Neurarch** link that loads its graph straight onto the canvas, no download step:

```
https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/<id>/model.json
```

From there you have a live, validated graph you can fork, edit, re-validate, or export to training code.

## Catalog

All hyperparameters are verified against each model's official `config.json` on Hugging Face, and every graph passes Neurarch's shape propagation with zero issues.

### Chinese LLMs (decoder-only)

Selection informed by [awesome-pretrained-chinese-nlp-models](https://github.com/lonePatient/awesome-pretrained-chinese-nlp-models).

| Architecture | Org | Params | Attention | Notable |
|--------------|-----|--------|-----------|---------|
| [qwen2.5-7b](architectures/qwen2.5-7b/) | Alibaba Cloud | 7.6B | GQA 28:4 | QKV bias, 128K context |
| [deepseek-llm-7b](architectures/deepseek-llm-7b/) | DeepSeek | 7B | MHA 32 | Dense ancestor of the DeepSeek line |
| [chatglm3-6b](architectures/chatglm3-6b/) | Zhipu AI / THUDM | 6.2B | GQA 32:2 | Near-multi-query attention, partial RoPE |
| [baichuan2-7b](architectures/baichuan2-7b/) | Baichuan Inc. | 7B | MHA 32 | NormHead, 125K Chinese vocab |
| [yi-6b](architectures/yi-6b/) | 01.AI | 6B | GQA 32:4 | Llama-compatible, 200K-context variant |
| [internlm2-7b](architectures/internlm2-7b/) | Shanghai AI Lab | 7.7B | GQA 32:8 | Native 32K context |
| [minicpm-2b](architectures/minicpm-2b/) | OpenBMB / ModelBest | 2.4B | MHA 36 | Deep-and-thin, muP-style scaling |
| [skywork-13b](architectures/skywork-13b/) | Kunlun Tech | 13B | MHA 36 | 52-layer deep-and-thin, ablated in tech report |

### Chinese NLU encoders (BERT family)

| Architecture | Org | Params | Notable |
|--------------|-----|--------|---------|
| [chinese-roberta-wwm-ext](architectures/chinese-roberta-wwm-ext/) | HFL | 102M | Whole-word masking, the standard Chinese encoder baseline |
| [ernie-3.0-base-zh](architectures/ernie-3.0-base-zh/) | Baidu | 118M | 40K vocab, 2048 positions, knowledge-enhanced pretraining |

### Classics

| Architecture | Org | Params | Notable |
|--------------|-----|--------|---------|
| [gpt2-small](architectures/gpt2-small/) | OpenAI | 124M | The reference decoder-only transformer |

(More landing soon.)

## Contributing

Designed an architecture in Neurarch you think others would find useful? See [CONTRIBUTING.md](CONTRIBUTING.md). The bar is simple: it has to validate cleanly in Neurarch and export to runnable code.

## License

MIT. See [LICENSE](LICENSE). Use the architectures freely, attribution appreciated. Model weights referenced by each entry remain under their upstream licenses (noted per entry).
