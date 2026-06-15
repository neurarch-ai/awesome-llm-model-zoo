<div align="center">

# 🧠 Neurarch 模型库 (Model Zoo)

### 78 个能直接打开、编辑、校验、训练的参考架构。从 DeepSeek-V3 的潜在注意力到 ResNet 的第一条残差连接。不是图片,是计算图。

[![architectures](https://img.shields.io/badge/architectures-78-6366f1)](CATALOG.md)
[![validate](https://github.com/neurarch-ai/awesome-llm-model-zoo/actions/workflows/validate.yml/badge.svg)](https://github.com/neurarch-ai/awesome-llm-model-zoo/actions/workflows/validate.yml)
[![domains](https://img.shields.io/badge/domains-11-f59e0b)](#目录)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**English: [README.md](README.md)** · **完整清单: [CATALOG.md](CATALOG.md)** · **架构对比: [COMPARISONS.md](COMPARISONS.md)** · **在浏览器里打开: [一键打开](#一键在浏览器里打开任意架构)**

</div>

---

你见过的每一张 Qwen 或 Mixtral 架构图,都是一张死图片。这里的每一个条目都是**活的、经过结构校验的模型计算图**:

- **端到端形状校验**:张量形状、注意力头整除、GQA 约束。全部 78 个图零错误通过。
- **数字可核对**:LLM 的超参数全部取自各模型官方的 `config.json`,不是博客里抄来的。
- **一键变可编辑**:每个条目都能直接加载到 [Neurarch](https://www.neurarch.com/) 画布上,你可以 fork、换掉注意力、在跑训练之前重新校验。
- **可导出为能跑的训练代码**:TRL、torchtune、Unsloth、原生 PyTorch。

## 几张图先看看

`model.json` 永远保存**完整**的图(每一层、真实维度)。架构图会把重复的相同块折叠成一个代表块加 `× N` 角标,所以即使是 671B 的模型也能放进一屏,跟论文的画法一样。

完整展开的图(那 371 / 300 / … 个节点)在每个条目的 **Open in Neurarch** 链接里一键可达。

## 一键在浏览器里打开任意架构

每个条目都有一个 **Open in Neurarch** 链接,直接把它的图加载到画布上,不用下载:

```
https://www.neurarch.com/?import=https://raw.githubusercontent.com/neurarch-ai/awesome-llm-model-zoo/main/architectures/<id>/model.json
```

打开之后就是一个活的、已校验的图,可以 fork、编辑、重新校验,或导出成训练代码。

每个 [`architectures/`](architectures/) 下的文件夹包含:

| 文件 | 是什么 |
|------|------------|
| `README.md` | 模型是什么、它的**各处链接**(Neurarch、Hugging Face、GitHub、论文)、核对过的超参数、参数核对、设计笔记。 |
| `model.json` | 完整的 Neurarch 图:每一层都是真实维度,和在 app 里导入该 HF 模型得到的图一致。 |
| `assets/diagram.svg` / `.png` | 架构图。重复的相同块折叠成一个代表块加 `× N` 角标;`model.json` 里仍然保留全部。 |

## 目录

### 🔥 前沿 LLM(2025-2026 一代)

MoE 一代。下表每个超参数都读自模型官方的 `config.json`(含 2026 年 6 月发布的),不是发布博客。

| 架构 | 机构 | 参数 (总 / 激活) | 注意力 | 亮点 |
|--------------|-----|------------------------|-----------|---------|
| [deepseek-v3](architectures/deepseek-v3/) | DeepSeek | 671B / 37B | MLA, 128 头 | 256 专家 + 共享专家,R1 的底座 |
| [kimi-k2.6](architectures/kimi-k2.6/) | Moonshot AI | ~1T / ~32B | MLA, 64 头 | 384 专家,256K 上下文,带视觉编码器 |
| [glm-4.5-air](architectures/glm-4.5-air/) | 智谱 AI | 106B / 12B | GQA 96:8 | 宽注意力(3 倍 hidden),128 个瘦专家 |
| [llama-4-scout](architectures/llama-4-scout/) | Meta | 109B / 17B | GQA 40:8 | 16 个胖专家 top-1 路由,iRoPE,10M 上下文 |
| [gpt-oss-20b](architectures/gpt-oss-20b/) | OpenAI | 21B / 3.6B | GQA 64:8 | 滑窗(128)/全局交替,attention sink |
| [qwen3-8b](architectures/qwen3-8b/) | 阿里云 | 8.2B (dense) | GQA 32:8 + QK-Norm | 2025 年默认的开源 dense 模型 |
| [gemma-4-12b](architectures/gemma-4-12b/) | Google DeepMind | 12B (dense) | GQA 16:8, 256 维头 | 5:1 局部:全局注意力,262K 词表 |
| [gpt-oss-120b](architectures/gpt-oss-120b/) | OpenAI | 117B / 5.1B | GQA 64:8 | 128 专家 top-4,更大的 gpt-oss |
| [deepseek-v2-lite](architectures/deepseek-v2-lite/) | DeepSeek | 15.7B / 2.4B | MLA, 16 头 | 能跑得动的方式去研究 MLA + MoE |
| [deepseek-v2](architectures/deepseek-v2/) | DeepSeek | 236B / 21B | MLA, 128 头 | MLA + 细粒度 MoE 首次登场 |

小练习:把 [deepseek-v3](architectures/deepseek-v3/) 和 [llama-4-scout](architectures/llama-4-scout/) 并排打开。同一个问题,专家粒度上下的相反赌注。

### 🇨🇳 中文 LLM

选型参考了 [awesome-pretrained-chinese-nlp-models](https://github.com/lonePatient/awesome-pretrained-chinese-nlp-models)。超参数对照各官方 `config.json` 核对。

| 架构 | 机构 | 参数 | 注意力 | 亮点 |
|--------------|-----|--------|-----------|---------|
| [qwen2.5-7b](architectures/qwen2.5-7b/) | 阿里云 | 7.6B | GQA 28:4 | QKV bias,128K 上下文 |
| [deepseek-llm-7b](architectures/deepseek-llm-7b/) | DeepSeek | 7B | MHA 32 | DeepSeek 系的 dense 祖先 |
| [chatglm3-6b](architectures/chatglm3-6b/) | 智谱 AI / THUDM | 6.2B | GQA 32:2 | 接近 multi-query 注意力,部分 RoPE |
| [baichuan2-7b](architectures/baichuan2-7b/) | 百川智能 | 7B | MHA 32 | NormHead,125K 中文词表 |
| [yi-6b](architectures/yi-6b/) | 零一万物 | 6B | GQA 32:4 | 兼容 Llama,200K 上下文变体 |
| [internlm2-7b](architectures/internlm2-7b/) | 上海 AI Lab | 7.7B | GQA 32:8 | 原生 32K 上下文 |
| [minicpm-2b](architectures/minicpm-2b/) | 面壁智能 / OpenBMB | 2.4B | MHA 36 | 深而窄,muP 式缩放 |
| [skywork-13b](architectures/skywork-13b/) | 昆仑万维 | 13B | MHA 36 | 52 层深而窄,技术报告里做过消融 |

### 🌍 LLM 经典与基础构件

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [llama3-8b](architectures/llama3-8b/) | Meta | 8B | 其它一切都拿来做对照的基线 |
| [mistral-7b](architectures/mistral-7b/) | Mistral AI | 7.2B | 滑动窗口 + GQA |
| [gpt2-small](architectures/gpt2-small/) | OpenAI | 124M | 参考用的 decoder-only transformer |
| [llama3-block](architectures/llama3-block/) | Meta | 单块 | 一个 Llama-3 decoder 块,每个算子展开 |
| [mixtral-block](architectures/mixtral-block/) | Mistral AI | 单块 | 稀疏 MoE:8 专家,top-2 路由 |
| [mamba-block](architectures/mamba-block/) | Gu 和 Dao | 单块 | 选择性 SSM,无注意力,O(T) |
| [phi3-mini](architectures/phi3-mini/) | Microsoft | 单块 | 3.8B 量级的紧凑 decoder 块 |
| [transformer-block](architectures/transformer-block/) | Vaswani 等 | 单块 | 2017 年原版 post-norm encoder 块 |

### 🔬 开放与研究型 LLM(不同架构)

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [phi-2](architectures/phi-2/) | Microsoft | 2.78B | 并行残差 + 部分 RoPE;数据优先于规模 |
| [pythia-1.4b](architectures/pythia-1.4b/) | EleutherAI | 1.4B | GPT-NeoX 并行注意力;受控训练动力学套件 |
| [olmo-7b](architectures/olmo-7b/) | Ai2 | 6.9B | 完全开放(Dolma 数据 + 代码);无参 LayerNorm |

### 📝 NLP 编码器与 seq2seq

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [bert-base](architectures/bert-base/) | Google | 110M | 开启 NLP 迁移学习的编码器 |
| [modernbert-base](architectures/modernbert-base/) | Answer.AI / LightOn | 149M | 用 2024 年经验重建的 BERT:RoPE、GeGLU、8K 上下文 |
| [chinese-roberta-wwm-ext](architectures/chinese-roberta-wwm-ext/) | 哈工大讯飞联合实验室 (HFL) | 102M | 标准中文编码器基线 |
| [ernie-3.0-base-zh](architectures/ernie-3.0-base-zh/) | 百度 | 118M | 40K 词表,2048 位置,知识增强 |
| [t5-small](architectures/t5-small/) | Google | 60M | text-to-text 编码器-解码器,完整双流图 |
| [simple-rnn](architectures/simple-rnn/) | Elman 一脉 | 入门 | 库里最小的序列模型 |

### 🔎 嵌入与检索

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [all-minilm-l6](architectures/all-minilm-l6/) | Microsoft / SBERT | 22.7M | 默认的 RAG / 语义检索编码器;均值池化 384 维 |
| [bge-base-en](architectures/bge-base-en/) | 智源 (BAAI) | 109M | 长期 MTEB 检索榜首;CLS 池化 |

### 👁️ 计算机视觉

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [resnet-50](architectures/resnet-50/) | Microsoft Research | 25.6M | 完整 50 节点图,每个瓶颈块展开 |
| [vgg-16](architectures/vgg-16/) | Oxford VGG | 138M | 深度 + 统一 3x3 卷积 |
| [vit-b16](architectures/vit-b16/) | Google | 86M | Patch 嵌入 + Transformer 编码器 |
| [swin-tiny](architectures/swin-tiny/) | Microsoft | 28M | 分层 ViT,移位窗口注意力 |
| [convnext-tiny](architectures/convnext-tiny/) | Meta | 28M | 现代化到能对标 Swin 的 ConvNet |
| [efficientnet-b0](architectures/efficientnet-b0/) | Google | 5.3M | MBConv + squeeze-excite,NAS 搜出 |
| [densenet-121](architectures/densenet-121/) | Cornell 等 | 8M | 稠密连接(每层 concat) |
| [unet](architectures/unet/) | Ronneberger 等 | 31M | 带跳连的编码器-解码器 |
| [mobilenet-v2](architectures/mobilenet-v2/) | Google | 3.5M | 倒残差块;端侧 / CoreML 常客 |
| [resnet-block](architectures/resnet-block/) | He 等 | 单块 | 残差单元本身 |
| [simple-cnn](architectures/simple-cnn/) | LeNet 一脉 | 入门 | 计算机视觉的 hello-world |

### 🖼️ 多模态

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [clip-vit-b32](architectures/clip-vit-b32/) | OpenAI | 151M | 现代多模态背后的对比双编码器 |
| [siglip-base](architectures/siglip-base/) | Google | 203M | 用 sigmoid 损失的 CLIP;2024+ MLLM 的视觉编码器 |
| [llava-1.5-7b](architectures/llava-1.5-7b/) | Microsoft / UW | ~7B | 典型 MLLM:视觉编码器 → MLP 投影 → LLM |
| [blip2](architectures/blip2/) | Salesforce | Q-Former | 可学习 query 桥接冻结的 ViT 和冻结的 LLM |
| [flamingo](architectures/flamingo/) | DeepMind | 门控交叉注意力 | Perceiver resampler + 门控交叉注意力注入冻结 LLM |

### 🎨 生成式

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [dit-xl2](architectures/dit-xl2/) | Berkeley / Meta | 675M | 用 Transformer 做骨干的扩散(SD3 / Sora 级) |
| [diffusion-unet](architectures/diffusion-unet/) | CompVis / Stability | ~860M | Stable Diffusion 的 latent UNet,带文本交叉注意力 |

### 🎙️ 音频与语音

| 架构 | 机构 | 参数 | 亮点 |
|--------------|-----|--------|---------|
| [whisper-small](architectures/whisper-small/) | OpenAI | 244M | Mel 频谱,卷积前端,带交叉注意力的编码器-解码器 |
| [wav2vec2-base](architectures/wav2vec2-base/) | Meta AI | 95M | 卷积特征提取 + Transformer;自监督语音 |
| [hubert-base](architectures/hubert-base/) | Meta AI | 95M | Wav2Vec2 骨干,掩码聚类预测预训练 |
| [encodec](architectures/encodec/) | Meta AI | 编解码器 | 神经音频编解码器(卷积 + RVQ);音频 LLM 的 tokenizer |

### 🛒 推荐与排序

| 架构 | 机构 | 亮点 |
|--------------|-----|---------|
| [two-tower](architectures/two-tower/) | Google 一脉 | 几乎每个推荐系统背后的召回架构 |
| [wide-and-deep](architectures/wide-and-deep/) | Google | 记忆 + 泛化,联合训练 |
| [dlrm](architectures/dlrm/) | Meta | 稠密 MLP + 嵌入 + 两两特征交互 |
| [ncf](architectures/ncf/) | He 等 | concat 后接 MLP 的协同过滤 |
| [neumf](architectures/neumf/) | He 等 | GMF + MLP 融合,完整 NCF 模型 |
| [lightgcn](architectures/lightgcn/) | He 等 | 图卷积精简到纯传播 |
| [graph-sage-rec](architectures/graph-sage-rec/) | Stanford | 归纳式采样-聚合嵌入 |
| [bst](architectures/bst/) | 阿里巴巴 | 在用户行为序列上做 Transformer |
| [sli-rec](architectures/sli-rec/) | Microsoft Research | 时间感知 LSTM + 长期注意力融合 |
| [deepfm](architectures/deepfm/) | 华为 | FM + 深度 MLP 共享一套嵌入(CTR) |
| [dcn](architectures/dcn/) | Google | 显式特征交叉 ∥ 深度 MLP |
| [din](architectures/din/) | 阿里巴巴 | 在行为历史上做目标感知注意力(CTR) |
| [sasrec](architectures/sasrec/) | UCSD | 在物品历史上做因果自注意力(GPT 风格) |
| [bert4rec](architectures/bert4rec/) | 阿里巴巴 | 双向掩码物品 Transformer |
| [gru4rec](architectures/gru4rec/) | Gravity R&D | 在会话点击上做 GRU(RNN 基线) |

### 📈 时间序列与生物信号

| 架构 | 机构 | 亮点 |
|--------------|-----|---------|
| [patch-tst](architectures/patch-tst/) | Nie 等 | 分块 + 通道独立的预测 |
| [cnn-lstm-1d](architectures/cnn-lstm-1d/) | 标准基线 | Conv1D 前端 + LSTM,用于 ECG/PPG/IMU |
| [eegnet](architectures/eegnet/) | ARL | 通用 EEG/BCI 基线,约 2.6K 参数 |
| [eeg-conformer](architectures/eeg-conformer/) | Song 等 | 卷积前端 + Transformer 做 EEG 解码 |

## 每个条目都经过校验

这个库只有一条标准,而且不是"看起来对":

1. 每个图都通过**结构校验,零错误**:格式良好、全连通、无环。一个零依赖的独立检查器([`npm run validate`](scripts/validate.mjs))会在全部 78 个条目上重跑这套校验,并在 [CI](https://github.com/neurarch-ai/awesome-llm-model-zoo/actions/workflows/validate.yml) 里把关每一次 push,所以上面那个徽章是活的检查,不是一句口号。生成时还会额外跑 Neurarch 的完整形状传播(张量形状、注意力头整除、GQA 约束)。
2. 每个完整模型的 `model.json` 都是**完整的层堆叠**,用和 Neurarch app "从 Hugging Face 加载" 完全相同的导入路径生成,并带一个**参数核对**:Neurarch 的逐层估计 vs 真实权重数(HF safetensors 元数据或官方数字)。**全部 36 个被核对的 checkpoint 都落在 10% 以内**,最差 6.6%,大多在百分之几以内。权重共享(共享的编码器/解码器嵌入、tied LM head)和 seq2seq 交叉注意力都被显式建模,所以逐层求和能对上真实数字,而不是高估或低估。每个数字都在条目 README 和 [CATALOG.md](CATALOG.md) 里列出,按偏差从大到小排。一个都不四舍五入抹掉。
3. 每个完整 LLM 条目的超参数都取自模型**官方的 `config.json`**,各种怪癖(Qwen 的 QKV bias、Baichuan 的 NormHead、ChatGLM 的 2 个 KV 组)在条目 README 里点明,而不是糊过去。
4. 每个条目都能**从 Neurarch 画布导出成能跑的训练代码**。

这条标准在建库过程中抓到过真实的错漏:一张被广泛复制的 Llama-3 块图带着 Llama-2 的 FFN 大小(11008 而不是 14336);一个 "RoBERTa" checkpoint 其实在架构上就是 BERT。经过校验的图能让这些错误现形。

## 贡献

在 Neurarch 里设计了一个你觉得别人会用得上的架构?见 [CONTRIBUTING.md](CONTRIBUTING.md)。标准和上面一样:干净通过校验、能导出成可运行代码、把设计取舍写清楚。

## 许可

MIT(见 [LICENSE](LICENSE))。这里的图和架构图描述的是架构;模型权重仍归上游许可。
