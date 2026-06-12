# ERNIE 3.0 Base (Chinese)

Baidu's workhorse Chinese encoder, the base-size distillation of the ERNIE 3.0 family. BERT-base shape with a larger vocabulary, 2048-token positions, and knowledge-enhanced pretraining.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/ernie-3.0-base-zh/model.json |
| Hugging Face | https://huggingface.co/nghuyong/ernie-3.0-base-zh |
| GitHub | https://github.com/PaddlePaddle/PaddleNLP/tree/develop/model_zoo/ernie-3.0 |

## Architecture

![ERNIE 3.0 Base (Chinese) architecture](assets/diagram.svg)

| Hyperparameter | Value |
|---|---|
| Type | Bidirectional encoder (BERT family) |
| Parameters | 118M |
| Layers | 12 |
| Hidden size | 768 |
| Attention | Multi-head: 12 heads |
| FFN | Dense, 3,072, GeLU |
| Normalization | LayerNorm, post-norm |
| Positions | Absolute learned, max 2,048 |
| Vocabulary | 40,000 |

The diagram and `model.json` show the full forward path with one of the 12 identical encoder blocks expanded (the stack repeats x12). All hyperparameters are taken from the official `config.json` on Hugging Face.

## Design notes

- BERT-base shape with two ERNIE twists: a 40000-token vocabulary (almost 2x BERT's Chinese vocab) and a 2048 max position, four times BERT's 512.
- Adds a task-type embedding alongside token and position embeddings, a remnant of ERNIE 3.0's multi-task universal-representation pretraining.
- Distilled from the 10B ERNIE 3.0 Titan teacher; the base model is what ships for practical NLU.
- Official weights are Paddle-native; the linked HF checkpoint is the standard PyTorch conversion by nghuyong.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The Neurarch graph. Shape-validated; open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) | Vector diagram (papers, slides). |
| [`assets/diagram.png`](assets/diagram.png) | Raster diagram (renders everywhere). |

**License:** Apache 2.0 (PaddleNLP). The graph and diagrams here describe the architecture; the model weights remain under the upstream license.
