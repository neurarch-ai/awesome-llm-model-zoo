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
| `model.json` | The Neurarch graph. Open it at [neurarch.com](https://www.neurarch.com/) to edit, validate, or export. |
| `assets/diagram.svg` | Vector diagram (scales cleanly, good for papers and slides). |
| `assets/diagram.png` | Raster diagram (renders everywhere: GitHub, social previews, docs). |
| `README.md` | A short explanation of the architecture and its design choices. |

### Open any architecture in one click

Every entry has an **Open in Neurarch** link that loads its graph straight onto the canvas, no download step:

```
https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/<id>/model.json
```

From there you have a live, validated graph you can fork, edit, re-validate, or export to training code.

## Catalog

| Architecture | Family | Status |
|--------------|--------|--------|
| [gpt2-small](architectures/gpt2-small/) | Decoder-only transformer | scaffold |

(More landing soon.)

## Contributing

Designed an architecture in Neurarch you think others would find useful? See [CONTRIBUTING.md](CONTRIBUTING.md). The bar is simple: it has to validate cleanly in Neurarch and export to runnable code.

## License

MIT. See [LICENSE](LICENSE). Use the architectures freely, attribution appreciated.
