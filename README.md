# surge-youtube-enhance

Fork of [gholts/surge](https://github.com/gholts/surge) — 只关注其中的 YouTube 去广告模块。

- 模块：[modules/youtube-enhance.sgmodule](modules/youtube-enhance.sgmodule)
- 脚本：[scripts/youtube/request.js](scripts/youtube/request.js)、[scripts/youtube/response.js](scripts/youtube/response.js)

上游代码派生自 [Maasea/sgmodule](https://github.com/Maasea/sgmodule)（Apache-2.0），
主要改动是把 Maasea 依赖外部 Cloudflare Worker 解密 UMP 流的做法，
改成在 Surge 脚本里本地完成 AES-CTR + HMAC-SHA256 解密/重签名。

## 审计结论（2026-09）

我用 Node 搭了个 Surge 环境模拟器，把两个脚本跑在合成的 protobuf / UMP 报文上，
共 143 项断言全部通过（[test/youtube](test/youtube)）：

```
node test/youtube/index.js
```

**逻辑本身没有坏。** 已验证有效的部分：

- `/player`：`adPlacements`、`adSlots`、`paidPromotion`、`pagead` 回传追踪全部清除；
  PiP 与后台播放被强制打开
- 信息流（`browse` / `next` / `search`）：6 种已知广告布局 + `sponsoredVideo` /
  `sponsoredDisplay` / `/pagead/` 字节特征都能命中，且顺序保持、正常视频不被误删
- `navigation/resolve_url`（嵌入式播放器）与 `get_watch` 也覆盖
- UMP/onesie：`initplayback` 加密流能正确解密、改广告、重新签名，
  gzip 0/6/9 与不压缩四种变体都通过，无关分片原样保留

## 已知风险点

1. **广告布局名是硬编码白名单**（`AD_LAYOUTS`，6 条）。YouTube 新增布局即失效，
   这是最可能需要跟着更新的地方。Maasea 用「跨请求持久化的广告缓存」来学习新布局
   （`YouTubeAdvertiseInfo`），本 fork 明确注释了不这么做：
   *"Ad classification is local to a rendered item, never learned across requests."*
   取舍是：漏掉新布局 vs. 误判污染缓存。
2. **MITM 未覆盖 `youtubei-att.googleapis.com`**。该域名用于客户端 attestation / PoToken，
   见 [Maasea/sgmodule#96](https://github.com/Maasea/sgmodule/issues/96)。
3. **UMP 失败即放弃**：HMAC 校验失败 / 无缓存 key 时，脚本返回空 body，
   让 App 回退到 `/youtubei/v1/player`（后者可被正常改写）。这是有意设计，
   但意味着一旦 key 协商出问题，起播会变慢。
4. 服务端广告插入（SSAI）若在某路流量铺开，改元数据对该路无效——
   目前未找到 2026 年移动端已大规模启用的可靠证据。

## 相关

- 上游：<https://github.com/gholts/surge>
- 原始实现：<https://github.com/Maasea/sgmodule>
- issue 参考：[#96](https://github.com/Maasea/sgmodule/issues/96)（attestation 域名）、
  [#104](https://github.com/Maasea/sgmodule/issues/104)、
  [#106](https://github.com/Maasea/sgmodule/issues/106)、
  [#108](https://github.com/Maasea/sgmodule/issues/108)
