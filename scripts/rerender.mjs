// Re-render diagram.svg + diagram.png from each entry's EXISTING model.json,
// using the app's exportPaperSvg (no Hugging Face re-import, so model.json is
// never touched). Only entries whose SVG actually changes are rewritten, so
// unaffected diagrams produce no spurious diff. Mirrors generate.mts::svgToPng.
//
// Usage (from the repo root):
//   npx tsx --tsconfig ../Neurarch/tsconfig.json scripts/rerender.mjs [id ...]
import { Resvg } from '@resvg/resvg-js';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';

const NEURARCH = path.resolve('..', 'Neurarch');
const { exportPaperSvg } = await import(path.join(NEURARCH, 'src/utils/figureExporter.ts'));

const TALL_THRESHOLD = 3600, MAX_RASTER_H = 42000, MAX_COLS = 14;
function svgToPng(svg) {
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const H = m ? Number(m[2]) : 0;
  const zoom = H <= TALL_THRESHOLD ? 2 : Math.min(1.6, MAX_RASTER_H / H);
  const full = new Resvg(svg, { fitTo: { mode: 'zoom', value: zoom }, background: 'white' }).render();
  const FW = full.width, FH = full.height;
  if (H <= TALL_THRESHOLD) return full.asPng();
  const src = full.pixels;
  const cols = Math.max(3, Math.min(MAX_COLS, Math.round(Math.sqrt(FH / FW / 1.4))));
  const sliceH = Math.ceil(FH / cols);
  const GAP = 44, HEADER = 40;
  const outW = cols * FW + (cols + 1) * GAP;
  const out = new PNG({ width: outW, height: sliceH + GAP + HEADER });
  out.data.fill(255);
  for (let c = 0; c < cols; c++) {
    const sy0 = c * sliceH, colX = GAP + c * (FW + GAP);
    for (let row = 0; row < sliceH; row++) {
      const sy = sy0 + row;
      if (sy >= FH) break;
      src.copy(out.data, ((HEADER + row) * outW + colX) * 4, sy * FW * 4, sy * FW * 4 + FW * 4);
    }
  }
  return PNG.sync.write(out);
}

const ARCH = path.resolve('architectures');
const ids = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(ARCH).filter((d) => fs.statSync(path.join(ARCH, d)).isDirectory());

let changed = 0;
for (const id of ids) {
  const dir = path.join(ARCH, id);
  const model = JSON.parse(fs.readFileSync(path.join(dir, 'model.json'), 'utf8'));
  const svg = exportPaperSvg(model, { attribution: true, fold: true });
  const svgPath = path.join(dir, 'assets', 'diagram.svg');
  const old = fs.existsSync(svgPath) ? fs.readFileSync(svgPath, 'utf8') : '';
  if (svg === old) continue; // unchanged layout, leave the files alone
  fs.writeFileSync(svgPath, svg);
  fs.writeFileSync(path.join(dir, 'assets', 'diagram.png'), svgToPng(svg));
  changed++;
  console.log('re-rendered', id);
}
console.log(`\n${changed} diagram(s) changed`);
