# Contributing

Thanks for wanting to add an architecture.

## The bar

An architecture belongs here if:

1. It **validates cleanly** in [Neurarch](https://www.neurarch.com/) (no shape errors, no divisibility violations, no cycles).
2. It **exports to runnable training code** in at least one supported framework.
3. It is **documented**: a short README explaining what it is and any notable design choices.

A pretty diagram alone is not enough. The value of this zoo is that every entry is correct.

## How to add one

1. Design or open the architecture in Neurarch.
2. Export the graph: **Save JSON** (this is the `model.json`).
3. Export the visual: **Export Image (SVG)**, and a **PNG** for reliable rendering.
4. Create a folder `architectures/<your-architecture-id>/` with:
   - `model.json`
   - `assets/diagram.svg`
   - `assets/diagram.png`
   - `README.md`
5. Add a row to the catalog table in the top-level `README.md`.
6. Add an **Open in Neurarch** link to your entry's README:
   `https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures/<your-id>/model.json`
7. Open a pull request.

## Naming

Use a lowercase, hyphenated id that matches the common name where one exists, for example `gpt2-small`, `llama3-8b`, `vit-base-patch16`.
