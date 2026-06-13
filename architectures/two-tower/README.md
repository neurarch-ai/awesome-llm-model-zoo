# Two-Tower Retrieval

The dual-encoder retrieval architecture behind virtually every industrial recommender and semantic search stack: user tower and item tower embed into the same space, scored by dot product.

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/two-tower/model.json |
| Paper (Covington et al. 2016) | https://dl.acm.org/doi/10.1145/2959100.2959190 |
| Paper (Yi et al. 2019, sampling-bias-corrected) | https://dl.acm.org/doi/10.1145/3298689.3346996 |

## Architecture

![Two-Tower Retrieval architecture](assets/diagram.png)

<details>
<summary><b>Layer-by-layer (12 nodes)</b></summary>

| # | Layer | Type | Params |
|---|---|---|---|
| 1 | User Input | `input` | shape: [1] |
| 2 | User Embed | `embedding` | vocabSize: 100000, embeddingDim: 64 |
| 3 | User FC 1 | `linear` | inFeatures: 64, outFeatures: 128 |
| 4 | User ReLU | `relu` |   |
| 5 | User Tower Out | `linear` | inFeatures: 128, outFeatures: 64 |
| 6 | Item Input | `input` | shape: [1] |
| 7 | Item Embed | `embedding` | vocabSize: 1000000, embeddingDim: 64 |
| 8 | Item FC 1 | `linear` | inFeatures: 64, outFeatures: 128 |
| 9 | Item ReLU | `relu` |   |
| 10 | Item Tower Out | `linear` | inFeatures: 128, outFeatures: 64 |
| 11 | Dot Score | `matmul` |   |
| 12 | Score | `output` |   |

</details>

This graph ships in Neurarch's in-app template library; the copy here passes shape propagation with zero errors.

## Design notes

- The towers never interact until the final dot product, which is what makes billion-item retrieval feasible (items pre-embedded into an ANN index).
- Each tower here is embeddings into an MLP; in production the towers grow but the contract (two encoders, one similarity) stays.

## Files

| File | What it is |
|---|---|
| [`model.json`](model.json) | The Neurarch graph. Shape-validated; open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [`assets/diagram.svg`](assets/diagram.svg) | Vector diagram (papers, slides). |
| [`assets/diagram.png`](assets/diagram.png) | Raster diagram (renders everywhere). |
