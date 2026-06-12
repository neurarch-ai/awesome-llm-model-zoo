# BERT-Base

The bidirectional encoder that started the transfer-learning era in NLP. Twelve post-norm encoder blocks, 768 hidden, 12 heads: the shape every "base-size" encoder since has copied.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/bert-base/model.json |
| Hugging Face | https://huggingface.co/google-bert/bert-base-uncased |
| GitHub | https://github.com/google-research/bert |

## Architecture

![BERT-Base architecture](assets/diagram.svg)

| Hyperparameter | Value |
|---|---|
| Type | Bidirectional encoder (BERT family) |
| Parameters | 110M |
| Layers | 12 |
| Hidden size | 768 |
| Attention | Multi-head: 12 heads |
| FFN | Dense, 3,072, GeLU |
| Normalization | LayerNorm, post-norm |
| Positions | Absolute learned, max 512 |
| Vocabulary | 30,522 |

The diagram and `model.json` show the full forward path with one of the 12 identical encoder blocks expanded (the stack repeats x12). All hyperparameters are taken from the official `config.json` on Hugging Face.

## Design notes

- The model that made pretrain-then-finetune the default workflow in NLP (Devlin et al. 2018, arXiv 1810.04805).
- Post-norm placement: LayerNorm comes after each residual add, the original Transformer ordering that pre-norm models later abandoned for training stability.
- Learned absolute position embeddings hard-cap the context at 512 tokens.
- 30522-token WordPiece vocabulary; masked-language-modeling plus next-sentence-prediction pretraining.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The Neurarch graph. Shape-validated; open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) | Vector diagram (papers, slides). |
| [`assets/diagram.png`](assets/diagram.png) | Raster diagram (renders everywhere). |

**License:** Apache 2.0. The graph and diagrams here describe the architecture; the model weights remain under the upstream license.
