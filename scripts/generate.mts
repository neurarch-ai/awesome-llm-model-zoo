/**
 * Model-zoo generator (maintainers only).
 *
 * Builds each architecture entry (model.json + assets/diagram.svg + README.md)
 * from a verified spec, using the Neurarch source checkout expected at a
 * sibling directory (../Neurarch). Run from the zoo repo root:
 *
 *   npx tsx scripts/generate.mts
 *
 * Every graph is validated with Neurarch's own shape propagator before it is
 * written; the script fails loudly on any shape issue. Hyperparameters were
 * verified against each model's official config.json on Hugging Face.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NEURARCH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Neurarch');
const ZOO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { exportPaperSvg } = await import(path.join(NEURARCH, 'src/utils/figureExporter.ts'));
const { propagateShapes } = await import(path.join(NEURARCH, 'src/utils/shapeInference.ts'));

// ---------------------------------------------------------------------------
// Specs (all numbers verified against the official config.json on HF)
// ---------------------------------------------------------------------------

interface DecoderSpec {
  kind: 'decoder';
  id: string;
  displayName: string;
  org: string;
  paramsLabel: string;
  github: string;
  hf: string;
  license: string;
  hidden: number;
  layers: number;
  heads: number;
  kvHeads: number; // == heads means plain MHA
  ffn: number;
  vocab: number;
  ctx: number;
  ropeDim: number; // rotary dim per head
  notes: string[];
  blurb: string;
}

interface EncoderSpec {
  kind: 'encoder';
  id: string;
  displayName: string;
  org: string;
  paramsLabel: string;
  github: string;
  hf: string;
  license: string;
  hidden: number;
  layers: number;
  heads: number;
  ffn: number;
  vocab: number;
  maxPos: number;
  notes: string[];
  blurb: string;
}

type Spec = DecoderSpec | EncoderSpec;

const SPECS: Spec[] = [
  {
    kind: 'decoder', id: 'qwen2.5-7b', displayName: 'Qwen2.5-7B', org: 'Alibaba Cloud (Qwen team)',
    paramsLabel: '7.6B', github: 'https://github.com/QwenLM/Qwen2.5', hf: 'https://huggingface.co/Qwen/Qwen2.5-7B',
    license: 'Apache 2.0',
    hidden: 3584, layers: 28, heads: 28, kvHeads: 4, ffn: 18944, vocab: 152064, ctx: 131072, ropeDim: 128,
    notes: [
      'Grouped-query attention with 28 query heads sharing 4 KV heads (7:1 ratio), which keeps the KV cache small at long context.',
      'Unusually for the Llama lineage, Qwen adds a bias term to the Q, K, V projections (attention bias on, everywhere else off).',
      'Wide FFN: the SwiGLU intermediate size (18944) is about 5.3x the hidden size, wider than the Llama-2 ratio.',
      'Native 131072-token context window with rope_theta = 1e6.',
    ],
    blurb: 'A 7.6B-parameter decoder-only transformer from the Qwen2.5 family, one of the most widely deployed open-weight Chinese and multilingual LLM series. Llama-style pre-norm decoder with grouped-query attention, RoPE, RMSNorm, and SwiGLU.',
  },
  {
    kind: 'decoder', id: 'deepseek-llm-7b', displayName: 'DeepSeek-LLM-7B', org: 'DeepSeek',
    paramsLabel: '7B', github: 'https://github.com/deepseek-ai/DeepSeek-LLM', hf: 'https://huggingface.co/deepseek-ai/deepseek-llm-7b-base',
    license: 'Code MIT; weights under the DeepSeek Model License (commercial use permitted)',
    hidden: 4096, layers: 30, heads: 32, kvHeads: 32, ffn: 11008, vocab: 102400, ctx: 4096, ropeDim: 128,
    notes: [
      'The dense ancestor of the DeepSeek series, before the MoE turn (V2/V3). Architecture is deliberately Llama-compatible: model_type in config.json is literally "llama".',
      'Plain multi-head attention at 7B (32 Q = 32 KV heads); only the 67B sibling adopted grouped-query attention.',
      '30 layers instead of the usual 32, slightly shallower and wider than Llama-2-7B.',
      'Large 102400-token byte-level BPE vocabulary tuned for bilingual Chinese and English text.',
    ],
    blurb: 'The original dense 7B model from DeepSeek, trained on 2T bilingual tokens. A clean Llama-style decoder (RoPE, RMSNorm, SwiGLU) with a large bilingual vocabulary, and the architectural starting point of the DeepSeek lineage.',
  },
  {
    kind: 'decoder', id: 'chatglm3-6b', displayName: 'ChatGLM3-6B', org: 'Zhipu AI / Tsinghua KEG (THUDM)',
    paramsLabel: '6.2B', github: 'https://github.com/THUDM/ChatGLM3', hf: 'https://huggingface.co/THUDM/chatglm3-6b',
    license: 'Code Apache 2.0; weights under the ChatGLM3-6B license (free commercial use after registration)',
    hidden: 4096, layers: 28, heads: 32, kvHeads: 2, ffn: 13696, vocab: 65024, ctx: 8192, ropeDim: 64,
    notes: [
      'Aggressive multi-query-style attention: 32 query heads share only 2 KV groups (multi_query_group_num = 2), a 16:1 ratio that shrinks the KV cache far more than typical GQA.',
      'GLM-style partial RoPE: rotary embedding is applied to half of each 128-dim head (rotary dim 64); the other half stays position-free.',
      'The FFN intermediate size (13696) follows the GLM recipe rather than the Llama 8/3 ratio.',
      '8192-token base context; -32k and -128k long-context variants exist.',
    ],
    blurb: 'The third generation of the ChatGLM series from Zhipu AI and Tsinghua, historically the most-starred Chinese open LLM. A pre-norm decoder with extreme grouped (near-multi-query) attention and GLM-style partial rotary embeddings.',
  },
  {
    kind: 'decoder', id: 'baichuan2-7b', displayName: 'Baichuan2-7B', org: 'Baichuan Inc.',
    paramsLabel: '7B', github: 'https://github.com/baichuan-inc/Baichuan2', hf: 'https://huggingface.co/baichuan-inc/Baichuan2-7B-Base',
    license: 'Code Apache 2.0; weights under the Baichuan2 Community License (free commercial use after application)',
    hidden: 4096, layers: 32, heads: 32, kvHeads: 32, ffn: 11008, vocab: 125696, ctx: 4096, ropeDim: 128,
    notes: [
      'Llama-2-7B shape (32 layers, 4096 hidden, 11008 FFN) with a much larger 125696-token vocabulary optimized for Chinese.',
      'NormHead: the output embedding (LM head) rows are L2-normalized before the logit matmul, which the tech report credits with stabilizing training.',
      'The 7B model uses RoPE; do not confuse it with the 13B sibling, which uses ALiBi instead.',
      'Trained on 2.6T tokens; one of the first Chinese LLMs to ship intermediate training checkpoints for research.',
    ],
    blurb: 'Baichuan Inc.\'s second-generation 7B base model, a Llama-shaped pre-norm decoder distinguished by a large Chinese-optimized vocabulary and a normalized output head (NormHead).',
  },
  {
    kind: 'decoder', id: 'yi-6b', displayName: 'Yi-6B', org: '01.AI',
    paramsLabel: '6B', github: 'https://github.com/01-ai/Yi', hf: 'https://huggingface.co/01-ai/Yi-6B',
    license: 'Apache 2.0 (relicensed from the Yi License in 2024)',
    hidden: 4096, layers: 32, heads: 32, kvHeads: 4, ffn: 11008, vocab: 64000, ctx: 4096, ropeDim: 128,
    notes: [
      'Fully Llama-compatible architecture (model_type "llama"), so the whole Llama tooling ecosystem works out of the box.',
      'Grouped-query attention even at 6B scale: 32 query heads over 4 KV heads, unusual for a model this small at the time.',
      'High rope_theta (5e6) chosen with long-context extension in mind; the Yi-6B-200K variant stretches the same architecture to 200k tokens.',
      'Compact 64000-token bilingual vocabulary.',
    ],
    blurb: 'The 6B base model from 01.AI (founded by Kai-Fu Lee), trained on 3.1T bilingual tokens. A Llama-style decoder notable for using grouped-query attention at small scale and for its 200K long-context variant.',
  },
  {
    kind: 'decoder', id: 'internlm2-7b', displayName: 'InternLM2-7B', org: 'Shanghai AI Laboratory',
    paramsLabel: '7.7B', github: 'https://github.com/InternLM/InternLM', hf: 'https://huggingface.co/internlm/internlm2-7b',
    license: 'Code Apache 2.0; weights free for commercial use after application',
    hidden: 4096, layers: 32, heads: 32, kvHeads: 8, ffn: 14336, vocab: 92544, ctx: 32768, ropeDim: 128,
    notes: [
      'Llama-3-like shape a year early: 32 layers, GQA 32:8, and the same 14336 FFN intermediate size.',
      'Native 32768-token context trained with rope_theta = 1e6, extrapolating to 200k in the chat variants.',
      'Consolidated W_qkv weight layout: q, k, v are stored interleaved per KV group, which matters when converting checkpoints.',
      '92544-token vocabulary covering Chinese, English, and code.',
    ],
    blurb: 'Shanghai AI Laboratory\'s second-generation 7B base model. A pre-norm decoder with 32:8 grouped-query attention and a native 32k context window, plus strong tool-use and long-context chat variants.',
  },
  {
    kind: 'decoder', id: 'minicpm-2b', displayName: 'MiniCPM-2B', org: 'ModelBest / OpenBMB (Tsinghua NLP)',
    paramsLabel: '2.4B (non-embedding)', github: 'https://github.com/OpenBMB/MiniCPM', hf: 'https://huggingface.co/openbmb/MiniCPM-2B-sft-bf16',
    license: 'Apache 2.0 (code); weights free for commercial use after registration',
    hidden: 2304, layers: 40, heads: 36, kvHeads: 36, ffn: 5760, vocab: 122753, ctx: 4096, ropeDim: 64,
    notes: [
      'Deep-and-thin: 40 layers at only 2304 hidden, the opposite trade-off from most 2B-class models.',
      'muP-style stability tricks baked into the architecture: embedding output scaled by scale_emb = 12, residual branches scaled by scale_depth / sqrt(num_layers), and tied input/output embeddings.',
      'Plain multi-head attention (36 heads, 64-dim each); the KV-cache saving tricks were left out at this scale.',
      'A 122753-token vocabulary, very large for a 2B model, reflecting its Chinese-first design.',
    ],
    blurb: 'OpenBMB\'s flagship small LLM, a 2.4B deep-and-thin decoder that punches above its weight via muP-style scaling (scale_emb, scaled residuals, tied embeddings) found by extensive scaling-law sweeps.',
  },
  {
    kind: 'decoder', id: 'skywork-13b', displayName: 'Skywork-13B', org: 'Kunlun Tech (SkyworkAI)',
    paramsLabel: '13B', github: 'https://github.com/SkyworkAI/Skywork', hf: 'https://huggingface.co/Skywork/Skywork-13B-base',
    license: 'Code Apache-style; weights under the Skywork Community License (free commercial use after agreement)',
    hidden: 4608, layers: 52, heads: 36, kvHeads: 36, ffn: 12288, vocab: 65519, ctx: 4096, ropeDim: 128,
    notes: [
      'Deliberately deep-and-thin at 13B scale: 52 layers at 4608 hidden, versus Llama-2-13B\'s 40 layers at 5120. The tech report (arXiv 2310.19341) ablates this choice directly.',
      'Plain multi-head attention (36 heads), RoPE, RMSNorm, SwiGLU; the FFN ratio is a modest 2.67x.',
      '65519-token vocabulary balanced for Chinese and English; trained on 3.2T tokens.',
      'Ships with a clean tech report and intermediate checkpoints, making it a good reference for training-dynamics work.',
    ],
    blurb: 'Kunlun Tech\'s 13B bilingual base model, notable for an explicitly ablated deep-and-thin layout (52 layers) and a thorough public tech report on its 3.2T-token training run.',
  },
  {
    kind: 'encoder', id: 'chinese-roberta-wwm-ext', displayName: 'Chinese-RoBERTa-wwm-ext', org: 'HFL (HIT and iFLYTEK joint lab)',
    paramsLabel: '102M', github: 'https://github.com/ymcui/Chinese-BERT-wwm', hf: 'https://huggingface.co/hfl/chinese-roberta-wwm-ext',
    license: 'Apache 2.0',
    hidden: 768, layers: 12, heads: 12, ffn: 3072, vocab: 21128, maxPos: 512,
    notes: [
      'Despite the RoBERTa name, this is architecturally BERT-base: it loads as BertModel with absolute learned positions and post-layer-norm. "RoBERTa" refers to the training recipe (no NSP, dynamic masking), not the architecture.',
      'Whole-word masking (wwm) masks all WordPiece pieces of a Chinese word together, which matters because Chinese has no whitespace word boundaries.',
      '21128-token Chinese WordPiece vocabulary, the de facto standard for Chinese BERT-family checkpoints.',
      'For a decade of Chinese NLU benchmarks (CLUE, etc.), this checkpoint was the baseline everyone compared against.',
    ],
    blurb: 'The standard Chinese encoder from HFL: BERT-base architecture trained RoBERTa-style with whole-word masking on extended data. Still the default starting point for Chinese classification, NER, and retrieval fine-tuning.',
  },
  {
    kind: 'encoder', id: 'ernie-3.0-base-zh', displayName: 'ERNIE 3.0 Base (Chinese)', org: 'Baidu',
    paramsLabel: '118M', github: 'https://github.com/PaddlePaddle/PaddleNLP/tree/develop/model_zoo/ernie-3.0', hf: 'https://huggingface.co/nghuyong/ernie-3.0-base-zh',
    license: 'Apache 2.0 (PaddleNLP)',
    hidden: 768, layers: 12, heads: 12, ffn: 3072, vocab: 40000, maxPos: 2048,
    notes: [
      'BERT-base shape with two ERNIE twists: a 40000-token vocabulary (almost 2x BERT\'s Chinese vocab) and a 2048 max position, four times BERT\'s 512.',
      'Adds a task-type embedding alongside token and position embeddings, a remnant of ERNIE 3.0\'s multi-task universal-representation pretraining.',
      'Distilled from the 10B ERNIE 3.0 Titan teacher; the base model is what ships for practical NLU.',
      'Official weights are Paddle-native; the linked HF checkpoint is the standard PyTorch conversion by nghuyong.',
    ],
    blurb: 'Baidu\'s workhorse Chinese encoder, the base-size distillation of the ERNIE 3.0 family. BERT-base shape with a larger vocabulary, 2048-token positions, and knowledge-enhanced pretraining.',
  },
];

// ---------------------------------------------------------------------------
// Graph builders (template-style model.json, matching public/templates/*)
// ---------------------------------------------------------------------------

interface Comp {
  id: string; type: string; name: string; scope?: string;
  position: { x: number; y: number };
  params: Record<string, unknown>;
  notes?: string;
  inputs: string[]; outputs: string[];
}
interface Conn { id: string; from: string; to: string }

function buildDecoder(s: DecoderSpec) {
  const comps: Comp[] = [];
  const conns: Conn[] = [];
  let y = 50; const X = 300; const STEP = 150; let ci = 0;
  const add = (type: string, name: string, params: Record<string, unknown>, opts: { scope?: string; notes?: string; x?: number; sameRow?: boolean } = {}) => {
    if (!opts.sameRow) y += STEP;
    const c: Comp = { id: `${type}-${comps.length + 1}`, type, name, position: { x: opts.x ?? X, y }, params, inputs: [], outputs: [] };
    if (opts.scope) c.scope = opts.scope;
    if (opts.notes) c.notes = opts.notes;
    comps.push(c);
    return c;
  };
  const wire = (from: Comp, to: Comp) => { conns.push({ id: `c${++ci}`, from: from.id, to: to.id }); };

  const seqLen = Math.min(s.ctx, 4096);
  const attnLabel = s.kvHeads < s.heads ? `GQA ${s.heads}Q:${s.kvHeads}KV` : `MHA ${s.heads} heads`;

  y -= STEP;
  const inp = add('input', 'tokens', { shape: [1, seqLen] }, { notes: `Token ids. Max context ${s.ctx.toLocaleString()} tokens; shown at ${seqLen.toLocaleString()} for shape preview.` });
  const emb = add('embedding', 'token_embed', { numEmbeddings: s.vocab, embeddingDim: s.hidden }, { scope: 'embeddings', notes: `${s.vocab.toLocaleString()}-token vocabulary, ${s.hidden}-dim embeddings.` });
  wire(inp, emb);
  const normA = add('rmsNorm', 'attn_norm', { normalizedShape: s.hidden }, { scope: 'layer.0.attention', notes: `Pre-norm RMSNorm. One of ${s.layers} identical decoder blocks is expanded below; the stack repeats x${s.layers}.` });
  wire(emb, normA);
  const attn = s.kvHeads < s.heads
    ? add('groupedQueryAttention', 'self_attn', { embedDim: s.hidden, numHeads: s.heads, numKVHeads: s.kvHeads }, { scope: 'layer.0.attention', notes: `${attnLabel}, head dim ${s.hidden / s.heads}.` })
    : add('causalAttention', 'self_attn', { embedDim: s.hidden, numHeads: s.heads }, { scope: 'layer.0.attention', notes: `${attnLabel}, head dim ${s.hidden / s.heads}, causal mask.` });
  wire(normA, attn);
  const rope = add('rope', 'rope', { dim: s.ropeDim }, { scope: 'layer.0.attention', x: X + 280, sameRow: true, notes: `Rotary position embedding, rotary dim ${s.ropeDim} per head.` });
  wire(rope, attn);
  const res1 = add('add', 'residual_1', {}, { scope: 'layer.0.attention' });
  wire(attn, res1); wire(emb, res1);
  const normF = add('rmsNorm', 'ffn_norm', { normalizedShape: s.hidden }, { scope: 'layer.0.ffn' });
  wire(res1, normF);
  const ffn = add('swiglu', 'swiglu_ffn', { embedDim: s.hidden, intermediateSize: s.ffn }, { scope: 'layer.0.ffn', notes: `SwiGLU gated FFN, intermediate size ${s.ffn.toLocaleString()} (${(s.ffn / s.hidden).toFixed(2)}x hidden).` });
  wire(normF, ffn);
  const res2 = add('add', 'residual_2', {}, { scope: 'layer.0.ffn' });
  wire(ffn, res2); wire(res1, res2);
  const normOut = add('rmsNorm', 'final_norm', { normalizedShape: s.hidden }, { scope: 'norm' });
  wire(res2, normOut);
  const head = add('linear', 'lm_head', { inFeatures: s.hidden, outFeatures: s.vocab }, { scope: 'head' });
  wire(normOut, head);
  const out = add('output', 'logits', {});
  wire(head, out);

  return {
    id: s.id,
    name: s.displayName,
    description: `${s.displayName} (${s.org}): decoder-only transformer, ${s.layers} layers x ${s.hidden} hidden, ${attnLabel}, RoPE + RMSNorm + SwiGLU. One decoder block expanded; repeats x${s.layers}. Verified against the official config.json.`,
    components: comps,
    connections: conns,
  };
}

function buildEncoder(s: EncoderSpec) {
  const comps: Comp[] = [];
  const conns: Conn[] = [];
  let y = 50; const X = 300; const STEP = 150; let ci = 0;
  const add = (type: string, name: string, params: Record<string, unknown>, opts: { scope?: string; notes?: string } = {}) => {
    const c: Comp = { id: `${type}-${comps.length + 1}`, type, name, position: { x: X, y }, params, inputs: [], outputs: [] };
    if (opts.scope) c.scope = opts.scope;
    if (opts.notes) c.notes = opts.notes;
    comps.push(c);
    y += STEP;
    return c;
  };
  const wire = (from: Comp, to: Comp) => { conns.push({ id: `c${++ci}`, from: from.id, to: to.id }); };

  const inp = add('input', 'input_ids', { shape: [1, s.maxPos] });
  const emb = add('embedding', 'word_embed', { numEmbeddings: s.vocab, embeddingDim: s.hidden }, { scope: 'embeddings', notes: `${s.vocab.toLocaleString()}-token vocabulary.` });
  wire(inp, emb);
  const pos = add('positionalEncoding', 'pos_embed', { maxLen: s.maxPos, embedDim: s.hidden }, { scope: 'embeddings', notes: `Absolute learned position embeddings, max ${s.maxPos} positions.` });
  wire(emb, pos);
  const eNorm = add('layerNorm', 'embed_norm', { normalizedShape: s.hidden }, { scope: 'embeddings' });
  wire(pos, eNorm);
  const drop = add('dropout', 'embed_drop', { p: 0.1 }, { scope: 'embeddings' });
  wire(eNorm, drop);
  const attn = add('multiHeadAttention', 'self_attn', { embedDim: s.hidden, numHeads: s.heads }, { scope: 'layer.0.attention', notes: `Bidirectional self-attention, ${s.heads} heads. One of ${s.layers} identical encoder blocks is expanded; the stack repeats x${s.layers}.` });
  wire(drop, attn);
  const res1 = add('add', 'residual_1', {}, { scope: 'layer.0.attention' });
  wire(attn, res1); wire(drop, res1);
  const n1 = add('layerNorm', 'attn_norm', { normalizedShape: s.hidden }, { scope: 'layer.0.attention', notes: 'Post-norm: LayerNorm applied after the residual add (original BERT placement).' });
  wire(res1, n1);
  const ffn = add('feedForward', 'ffn', { embedDim: s.hidden, ffDim: s.ffn }, { scope: 'layer.0.ffn', notes: `Dense FFN ${s.hidden} -> ${s.ffn} -> ${s.hidden}, GeLU activation.` });
  wire(n1, ffn);
  const res2 = add('add', 'residual_2', {}, { scope: 'layer.0.ffn' });
  wire(ffn, res2); wire(n1, res2);
  const n2 = add('layerNorm', 'ffn_norm', { normalizedShape: s.hidden }, { scope: 'layer.0.ffn' });
  wire(res2, n2);
  const out = add('output', 'hidden_states', {}, { notes: 'Sequence of contextual embeddings; [CLS] position is used for classification heads.' });
  wire(n2, out);

  return {
    id: s.id,
    name: s.displayName,
    description: `${s.displayName} (${s.org}): BERT-style bidirectional encoder, ${s.layers} layers x ${s.hidden} hidden, ${s.heads} heads, post-LayerNorm, GeLU FFN. One encoder block expanded; repeats x${s.layers}. Verified against the official config.json.`,
    components: comps,
    connections: conns,
  };
}

// ---------------------------------------------------------------------------
// README rendering
// ---------------------------------------------------------------------------

const RAW_BASE = 'https://raw.githubusercontent.com/neurarch-ai/neurarch-model-zoo/main/architectures';
const openUrl = (id: string) => `https://www.neurarch.com/?import=${RAW_BASE}/${id}/model.json`;

function archTable(s: Spec): string {
  const rows: Array<[string, string]> = s.kind === 'decoder'
    ? [
        ['Type', 'Decoder-only transformer (causal LM)'],
        ['Parameters', s.paramsLabel],
        ['Layers', String(s.layers)],
        ['Hidden size', String(s.hidden)],
        ['Attention', s.kvHeads < s.heads ? `Grouped-query: ${s.heads} query heads, ${s.kvHeads} KV heads` : `Multi-head: ${s.heads} heads`],
        ['Head dim', String(s.hidden / s.heads)],
        ['FFN', `SwiGLU, intermediate size ${s.ffn.toLocaleString()}`],
        ['Normalization', 'RMSNorm, pre-norm'],
        ['Positions', `RoPE (rotary dim ${s.ropeDim})`],
        ['Vocabulary', s.vocab.toLocaleString()],
        ['Max context', s.ctx.toLocaleString()],
      ]
    : [
        ['Type', 'Bidirectional encoder (BERT family)'],
        ['Parameters', s.paramsLabel],
        ['Layers', String(s.layers)],
        ['Hidden size', String(s.hidden)],
        ['Attention', `Multi-head: ${s.heads} heads`],
        ['FFN', `Dense, ${s.ffn.toLocaleString()}, GeLU`],
        ['Normalization', 'LayerNorm, post-norm'],
        ['Positions', `Absolute learned, max ${s.maxPos.toLocaleString()}`],
        ['Vocabulary', s.vocab.toLocaleString()],
      ];
  return ['| Hyperparameter | Value |', '|---|---|', ...rows.map(([k, v]) => `| ${k} | ${v} |`)].join('\n');
}

function renderReadme(s: Spec): string {
  const blocks = s.kind === 'decoder' ? `${s.layers} identical decoder blocks` : `${s.layers} identical encoder blocks`;
  return `# ${s.displayName}

${s.blurb}

## Model URLs

| Where | URL |
|---|---|
| **Open in Neurarch** (live, editable graph) | ${openUrl(s.id)} |
| Hugging Face | ${s.hf} |
| GitHub | ${s.github} |

## Architecture

![${s.displayName} architecture](assets/diagram.svg)

${archTable(s)}

The diagram and \`model.json\` show the full forward path with one of the ${blocks} expanded (the stack repeats x${s.layers}). All hyperparameters are taken from the official \`config.json\` on Hugging Face.

## Design notes

${s.notes.map((n) => `- ${n}`).join('\n')}

## Files

| File | What it is |
|---|---|
| [\`model.json\`](model.json) | The Neurarch graph. Shape-validated; open it at [neurarch.com](https://www.neurarch.com/) to edit or export training code. |
| [\`assets/diagram.svg\`](assets/diagram.svg) | Vector diagram (papers, slides). |
| [\`assets/diagram.png\`](assets/diagram.png) | Raster diagram (renders everywhere). |

**License:** ${s.license}. The graph and diagrams here describe the architecture; the model weights remain under the upstream license.
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let failed = false;
for (const s of SPECS) {
  const model = s.kind === 'decoder' ? buildDecoder(s) : buildEncoder(s);

  // Wire inputs/outputs arrays from connections (what the app loader does)
  const byId = new Map(model.components.map((c) => [c.id, c]));
  for (const conn of model.connections) {
    byId.get(conn.from)!.outputs.push(conn.to);
    byId.get(conn.to)!.inputs.push(conn.from);
  }

  const result = propagateShapes(model as never);
  const errors = (result.issues ?? []).filter((i: { severity: string }) => i.severity === 'error');
  if (errors.length) {
    failed = true;
    console.error(`✗ ${s.id}: shape errors`, errors);
    continue;
  }

  const dir = path.join(ZOO, 'architectures', s.id);
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'model.json'), JSON.stringify(model, null, 2) + '\n');
  fs.writeFileSync(path.join(dir, 'assets', 'diagram.svg'), exportPaperSvg(model as never, { attribution: true }));
  fs.writeFileSync(path.join(dir, 'README.md'), renderReadme(s));
  console.log(`✓ ${s.id} (${model.components.length} components, ${(result.issues ?? []).length} warnings)`);
}
if (failed) process.exit(1);
console.log('\nDone. Convert SVGs to PNG separately (resvg), then update the top-level catalog.');
