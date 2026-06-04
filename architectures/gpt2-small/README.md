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

Once `model.json` is added, download it and open it at [neurarch.com](https://www.neurarch.com/) to edit, validate, or export to training code.
