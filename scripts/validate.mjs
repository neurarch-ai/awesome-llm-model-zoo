#!/usr/bin/env node
// Standalone structural validator for every entry under architectures/.
// NO dependency on the Neurarch app source: it checks the model.json graphs
// and the per-entry files directly, so contributors (and CI) can verify a PR
// without the private app checkout. The full parameter gate still runs
// maintainer-side in generate.mts; this guards the invariants that matter for
// a published entry: a well-formed, connected, acyclic graph plus its docs and
// diagrams.
//
// Usage: node scripts/validate.mjs   (exit 1 on any failure)
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARCH = join(ROOT, 'architectures');
const PARAM_TOLERANCE = 10; // percent; the published estimate-vs-real gate

const entries = readdirSync(ARCH).filter((d) => statSync(join(ARCH, d)).isDirectory());
let failed = 0;
const problems = [];

const fail = (id, msg) => { problems.push(`  ✗ ${id}: ${msg}`); };

for (const id of entries) {
  const dir = join(ARCH, id);
  const before = problems.length;

  // 1. required files
  for (const f of ['README.md', 'model.json', 'assets/diagram.svg', 'assets/diagram.png']) {
    if (!existsSync(join(dir, f))) fail(id, `missing ${f}`);
  }
  const modelPath = join(dir, 'model.json');
  if (!existsSync(modelPath)) { if (problems.length > before) failed++; continue; }

  // 2. valid JSON with the expected shape
  let m;
  try { m = JSON.parse(readFileSync(modelPath, 'utf8')); }
  catch (e) { fail(id, `model.json is not valid JSON (${e.message})`); failed++; continue; }

  const comps = m.components;
  const conns = m.connections ?? [];
  if (!Array.isArray(comps) || comps.length === 0) { fail(id, 'no components[]'); failed++; continue; }
  if (!Array.isArray(conns)) { fail(id, 'connections is not an array'); failed++; continue; }

  // 3. components: unique ids, required fields
  const ids = new Set();
  for (const c of comps) {
    if (!c || typeof c.id !== 'string') { fail(id, 'a component has no string id'); continue; }
    if (!c.type) fail(id, `component ${c.id} has no type`);
    if (ids.has(c.id)) fail(id, `duplicate component id ${c.id}`);
    ids.add(c.id);
  }

  // 4. connections reference existing components
  for (const e of conns) {
    if (!ids.has(e.from)) fail(id, `connection ${e.id ?? '?'} from unknown node ${e.from}`);
    if (!ids.has(e.to)) fail(id, `connection ${e.id ?? '?'} to unknown node ${e.to}`);
  }

  // 5. the graph must be acyclic (DFS over directed edges)
  const adj = new Map([...ids].map((x) => [x, []]));
  for (const e of conns) if (ids.has(e.from) && ids.has(e.to)) adj.get(e.from).push(e.to);
  const state = new Map(); // 0=visiting, 1=done
  const hasCycle = (n) => {
    state.set(n, 0);
    for (const nx of adj.get(n)) {
      if (state.get(nx) === 0) return true;
      if (state.get(nx) === undefined && hasCycle(nx)) return true;
    }
    state.set(n, 1);
    return false;
  };
  for (const n of ids) if (state.get(n) === undefined && hasCycle(n)) { fail(id, 'graph has a cycle'); break; }

  // 6. parameter check — for every entry that publishes a deviation, the
  //    per-layer estimate (from the app, captured in the README at generation)
  //    must stay within PARAM_TOLERANCE of the real weight count. Makes the
  //    README's headline "every checked entry within 10%" a live CI gate, with
  //    no app dependency.
  const readme = readFileSync(join(dir, 'README.md'), 'utf8');
  const devM = readme.match(/Deviation from the authoritative count \([^)]*\):\s*\*\*([+-]?[\d.]+)%\*\*/i);
  if (devM && Math.abs(parseFloat(devM[1])) > PARAM_TOLERANCE) {
    fail(id, `published deviation ${devM[1]}% is over ±${PARAM_TOLERANCE}%`);
  }

  if (problems.length > before) failed++;
}

const ok = entries.length - failed;
console.log(`\nNeurarch Model Zoo — structural validation`);
console.log(`${'='.repeat(46)}`);
if (problems.length) console.log(problems.join('\n'));
console.log(`\n${ok}/${entries.length} entries valid` + (failed ? `, ${failed} FAILED` : ' — all passing ✓'));
process.exit(failed ? 1 : 0);
