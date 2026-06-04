# GPT-2 Small

A decoder-only transformer, the 124M-parameter GPT-2 configuration. Used here as the first reference entry.

- **Family:** decoder-only transformer
- **Parameters:** ~124M
- **Status:** scaffold (graph and diagrams to be added)

## Design notes

(To fill: embed dim, number of layers, attention heads, head dim, and any divisibility constraints worth calling out. Confirm `embedDim % numHeads == 0`.)

## Files

| File | Status |
|------|--------|
| `model.json` | TODO: export from Neurarch via Save JSON |
| `assets/diagram.svg` | TODO: export via Export Image (SVG) |
| `assets/diagram.png` | TODO: export PNG (pending PNG export feature) |

## Open in Neurarch

[**▶ Open this architecture in Neurarch**](https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/gpt2-small/model.json)

The link loads the graph directly onto the canvas (once `model.json` is added). From there you can edit, validate, or export to training code.
