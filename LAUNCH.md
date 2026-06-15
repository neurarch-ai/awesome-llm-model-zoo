# Launch copy

Ready-to-paste copy for launching the zoo. Canonical links first, then one block
per channel. Keep the claims as written: they match what the repo actually proves
(CI-validated, 36 param-checked checkpoints all within 10%).

## Links

- Repo: https://github.com/neurarch-ai/awesome-llm-model-zoo
- Gallery (browse all 78): https://neurarch-ai.github.io/awesome-llm-model-zoo/
- Product: https://www.neurarch.com/
- Compare page: https://github.com/neurarch-ai/awesome-llm-model-zoo/blob/main/COMPARISONS.md
- 简体中文 README: https://github.com/neurarch-ai/awesome-llm-model-zoo/blob/main/README.zh.md

---

## Show HN

**Title**

> Show HN: Neurarch Model Zoo – 78 neural-net architectures as runnable graphs

**Body**

> Every architecture diagram online is a dead PNG you can't check or run. So I built a model zoo where each of 78 architectures (DeepSeek-V3, Qwen3, Llama-4, plus vision/audio/recsys/graph) is a live, shape-validated graph you open in the browser, edit, and export to training code.
>
> What's different:
>
> - Every graph is structurally validated in CI (well-formed, acyclic, shapes propagate), and the parameter count is checked against the real safetensors metadata. All 36 checked checkpoints land within 10%.
> - That bar catches real errors: a widely-copied Llama-3 block carrying Llama-2's FFN size, a "RoBERTa" checkpoint that's architecturally BERT, and (honestly) my own T5 diagram that was missing decoder cross-attention until the param check flagged a 44% gap. Fixed, and now drawn as encoder | decoder the way the paper does.
> - Side-by-side comparison pages: MHA to GQA to MLA, dense to MoE, the three transformer shapes.
> - Browsable gallery, filter by domain/attention/param-check: https://neurarch-ai.github.io/awesome-llm-model-zoo/
> - English and 简体中文.
>
> Repo: https://github.com/neurarch-ai/awesome-llm-model-zoo
>
> It's the open companion to a tool I'm building (neurarch.com). Would love to hear which architectures you'd want added.

---

## X / Twitter (English)

> 78 neural-net architectures as live, validated graphs you can open, edit, and run. Not dead PNGs.
>
> DeepSeek-V3, Qwen3, Llama-4, MoE/MLA, vision, audio, recsys. Every graph CI-validated and param-checked against real weights.
>
> Browse all 78 ↓
> https://neurarch-ai.github.io/awesome-llm-model-zoo/

Optional follow-up tweet (thread):

> The param check is a correctness test. It caught a widely-copied Llama-3 block carrying Llama-2's FFN size, a "RoBERTa" that's really BERT, and my own T5 diagram missing decoder cross-attention (44% off) until I fixed it. Repo: https://github.com/neurarch-ai/awesome-llm-model-zoo

---

## X / Twitter (中文)

> 78 个神经网络架构,做成能打开、能编辑、能跑的活计算图,不是死图片。
>
> DeepSeek-V3、Qwen3、Llama-4、MoE/MLA,还有视觉 / 语音 / 推荐。每个图都经 CI 校验、参数对照真实权重核对。
>
> 在线浏览全部 78 个 ↓
> https://neurarch-ai.github.io/awesome-llm-model-zoo/

---

## Reddit (r/MachineLearning)

**Title**

> [P] A model zoo of 78 architectures as validated, editable graphs (the param check caught my own T5 diagram missing cross-attention)

**Body**

> I wanted architecture diagrams I could actually check and run, not PNGs. So each of 78 architectures here is a live graph: shape-validated in CI, with the per-layer parameter estimate checked against real safetensors metadata (all 36 checked checkpoints within 10%).
>
> Treating the param check as a correctness test surfaced real bugs, including my own T5 entry, which was missing decoder cross-attention until the estimate came in 44% high. It is now drawn as two stacks, encoder and decoder, joined by cross-attention.
>
> - Browse / filter: https://neurarch-ai.github.io/awesome-llm-model-zoo/
> - Comparison pages (MHA to GQA to MLA, dense to MoE): in the repo
> - Open any graph in the browser, edit it, export to TRL/torchtune/PyTorch
>
> Repo: https://github.com/neurarch-ai/awesome-llm-model-zoo
>
> Open companion to a tool I'm building. Happy to add architectures people want.

---

## LinkedIn (optional)

Note: a public post here is visible to your current colleagues. Post only if you
are comfortable with that. A low-key, resource-first framing:

> I open-sourced a model zoo: 78 reference architectures (DeepSeek-V3, Qwen3, Llama-4, plus vision, audio, recsys) as live, validated, editable graphs instead of static images. Every graph is CI-validated and its parameter count checked against real weights.
>
> Browse all 78: https://neurarch-ai.github.io/awesome-llm-model-zoo/

---

## awesome-list PR entries

For general LLM lists (e.g. Hannibal046/Awesome-LLM):

> - [Neurarch Model Zoo](https://github.com/neurarch-ai/awesome-llm-model-zoo) - 78 reference architectures (DeepSeek-V3, Qwen3, Llama-4, MoE/MLA, vision, audio, recsys) as live, shape-validated, editable graphs with verified parameter counts. Browse and open any one in the browser.

For the Chinese list that inspired the selection (lonePatient/awesome-pretrained-chinese-nlp-models), under a "相关项目 / Related" section:

> - [Neurarch Model Zoo](https://github.com/neurarch-ai/awesome-llm-model-zoo) - 78 个参考架构(含中文 LLM:Qwen、ChatGLM、Baichuan、InternLM、Yi、ERNIE 等)的活计算图,形状校验 + 参数核对,可在浏览器一键打开编辑。选型参考了本仓库。

---

## Posting notes

- Asset for social previews and image posts: `assets/promo.png`.
- Best-fit channels for a dev resource: Hacker News, r/MachineLearning, ML Twitter/X. LinkedIn only if you are fine with colleague visibility.
- Lead with "validated graphs you can run", not "visual canvas". The honest hook is the param check catching real errors, including our own.
