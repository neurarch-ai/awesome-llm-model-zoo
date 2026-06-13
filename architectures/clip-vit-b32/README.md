# CLIP ViT-B/32

The contrastive image-text model that underpins modern multimodality: a full 12-block ViT image tower and a full 12-block Transformer text tower projected into one 512-dim space, trained so matching pairs score high by dot product. Stable Diffusion's text encoder is the text half of this design.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/clip-vit-b32/model.json |
| Paper (Radford et al. 2021) | https://arxiv.org/abs/2103.00020 |
| GitHub | https://github.com/openai/CLIP |
| Hugging Face | https://huggingface.co/openai/clip-vit-base-patch32 |

## Architecture

![CLIP ViT-B/32 full architecture](assets/diagram.png)

*The full graph, all 38 nodes. Exactly what `model.json` holds. Vector: [diagram.svg](assets/diagram.svg).*

| Hyperparameter | Value |
|---|---|
| Type | Contrastive image-text dual encoder |
| Parameters | 151M (88M vision + 63M text) |
| Vision tower | ViT-B/32: 12 blocks, 768 hidden, 12 heads |
| Text tower | 12 blocks, 512 hidden, 8 heads, causal |
| Projection | Both towers project to a shared 512-dim space |
| Similarity | Scaled dot product, learned temperature |
| Vocabulary | 49,408 BPE (text), 77-token max |
| Input | 224x224 image, 32x32 patches |

`model.json` is the full graph, hand-built against the official config.json.

## Parameter check

Neurarch's per-layer parameter estimate over this graph: **151.2M**.
Deviation from the authoritative count (151.3M): **-0.1%**.

## Design notes

- Two towers, one space: each tower ends in a linear projection to 512 dims; the similarity logit is a scaled dot product.
- The graph pools each tower with an average-pool node as a stand-in for CLIP's token selection (class token for the image tower, EOT token for text).
- Tower dims verified from the official config.json; the text tower is causal, a quirk inherited from GPT-style pretraining.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The full Neurarch graph (every layer, real dimensions). Open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) / [`.png`](assets/diagram.png) | Diagram of the full graph. |

**License:** MIT. The graph and diagrams here describe the architecture; any referenced weights remain under the upstream license.
