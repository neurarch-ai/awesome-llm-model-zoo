#!/usr/bin/env node
// Emit index.json: one machine-readable record per architecture, so the zoo can
// be consumed as data (filter by domain / attention / params, build a site, etc.)
// without scraping 78 READMEs. Derived from each entry README + model.json and
// the domain sections in the top-level README.
//
// Usage: node scripts/build-index.mjs   (writes index.json)
import { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARCH = join(ROOT, 'architectures');
const RAW = 'https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures';
const grab = (re, s) => { const m = s.match(re); return m ? m[1].trim() : ''; };
const parseHuman = (s) => {
  const m = String(s).match(/([\d.]+)\s*([KMBT]?)/i);
  if (!m) return null;
  return parseFloat(m[1]) * { '': 1, K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[m[2].toUpperCase()];
};

// Map each entry id -> its domain, read from the "### " sub-headings inside the
// "## Catalog" section of the top-level README (ignore the hero / few-graphs area).
const topReadme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const domainOf = {};
let inCatalog = false, section = 'Other';
for (const line of topReadme.split('\n')) {
  if (/^##\s+Catalog/i.test(line)) { inCatalog = true; continue; }
  if (inCatalog && /^##\s+/.test(line)) { inCatalog = false; continue; } // left the catalog
  if (!inCatalog) continue;
  const h = line.match(/^###\s+(.+)$/);
  if (h) { section = h[1].replace(/[^\x00-\x7F]/g, '').trim(); continue; } // strip emoji
  const ref = line.match(/architectures\/([a-z0-9.\-]+)\//i);
  if (ref && !domainOf[ref[1]]) domainOf[ref[1]] = section;
}

const records = readdirSync(ARCH)
  .filter((d) => statSync(join(ARCH, d)).isDirectory())
  .sort()
  .map((id) => {
    const r = readFileSync(join(ARCH, id, 'README.md'), 'utf8');
    const model = JSON.parse(readFileSync(join(ARCH, id, 'model.json'), 'utf8'));
    const est = grab(/per-layer parameter estimate over this graph:\s*\*\*([^*]+)\*\*/i, r);
    // real weight count: prefer the "reports ** ** for the real weights" line,
    // else the parenthetical in the deviation line "(684.53B): **-1.8%**".
    const real = grab(/reports\s*\*\*([^*]+)\*\*\s*for the real weights/i, r)
      || grab(/Deviation from the authoritative count \(([^)]+)\):/i, r);
    const devStr = grab(/Deviation from the authoritative count \([^)]*\):\s*\*\*([^*]+)\*\*/i, r);
    const urls = {};
    for (const row of r.matchAll(/\|\s*(?:\*\*)?([^|*]+?)(?:\*\*)?\s*(?:\([^)]*\))?\s*\|\s*(https?:\/\/[^\s|]+)\s*\|/g)) {
      const label = row[1].toLowerCase();
      if (label.includes('neurarch')) urls.neurarch = row[2];
      else if (label.includes('hugging')) urls.huggingface = row[2];
      else if (label.includes('github')) urls.github = row[2];
      else if (label.includes('paper') || label.includes('arxiv')) urls.paper = row[2];
    }
    const attnTypes = [...new Set(model.components.map((c) => c.type).filter((t) => /atten/i.test(t)))];
    return {
      id,
      title: grab(/^#\s+(.+)$/m, r) || id,
      domain: domainOf[id] || 'Other',
      params: grab(/\|\s*Parameters\s*\|\s*([^|]+?)\s*\|/i, r) || null,
      layers: grab(/\|\s*Layers\s*\|\s*([^|]+?)\s*\|/i, r) || null,
      type: grab(/\|\s*Type\s*\|\s*([^|]+?)\s*\|/i, r) || null,
      nodes: model.components.length,
      attention: attnTypes,
      paramCheck: devStr ? {
        estimate: est ? parseHuman(est) : null,
        real: real ? parseHuman(real) : null,
        deviationPct: parseFloat(devStr.replace('%', '')),
      } : null,
      urls: { neurarch: urls.neurarch || `https://www.neurarch.com/?import=${RAW}/${id}/model.json`, ...urls },
      diagram: `architectures/${id}/assets/diagram.png`,
    };
  });

const out = {
  name: 'Neurarch Model Zoo',
  generated_by: 'scripts/build-index.mjs',
  count: records.length,
  models: records,
};
writeFileSync(join(ROOT, 'index.json'), JSON.stringify(out, null, 2) + '\n');
const withCheck = records.filter((r) => r.paramCheck).length;
const domains = [...new Set(records.map((r) => r.domain))].length;
console.log(`Wrote index.json — ${records.length} models, ${domains} domains, ${withCheck} with a parameter check`);
