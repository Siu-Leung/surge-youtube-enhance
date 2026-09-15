# surge-youtube-enhance

Fork of [gholts/surge](https://github.com/gholts/surge) — YouTube 去广告、画中画/后台播放与最高画质模块（兼容 Surge / Egern / Loon / Shadowrocket）。

- 脚本：[scripts/youtube/request.js](scripts/youtube/request.js)、[scripts/youtube/response.js](scripts/youtube/response.js)
- 测试套件：[test/youtube/](test/youtube/)（143 项单测全通过）

上游代码派生自 [Maasea/sgmodule](https://github.com/Maasea/sgmodule)（Apache-2.0），主要改动是把原版依赖外部 Cloudflare Worker 解密 UMP 流的做法，改为在代理脚本内本地完成 AES-CTR + HMAC-SHA256 解密与重签名，不依赖第三方云端服务。

---

## 模块文件与下载链接

| 平台 / 格式 | 模块文件路径 | 远程安装 Raw 链接 |
|---|---|---|
| **Surge (.sgmodule)** | [`modules/youtube-enhance.sgmodule`](modules/youtube-enhance.sgmodule) | `https://raw.githubusercontent.com/Siu-Leung/surge-youtube-enhance/main/modules/youtube-enhance.sgmodule` |
| **Egern 推荐 (.module)** | [`modules/youtube-enhance.module`](modules/youtube-enhance.module) | `https://raw.githubusercontent.com/Siu-Leung/surge-youtube-enhance/main/modules/youtube-enhance.module` |
| **Egern 原生 YAML (.yaml)** | [`modules/youtube-enhance.egern.yaml`](modules/youtube-enhance.egern.yaml) | `https://raw.githubusercontent.com/Siu-Leung/surge-youtube-enhance/main/modules/youtube-enhance.egern.yaml` |

---

## 使用与配置说明

### 1. 为什么一定要阻断 QUIC？
YouTube iOS 客户端默认优先使用 **QUIC (HTTP/3)** 协议发起音视频流和配置请求。iOS 代理 App 目前普遍无法解密基于 UDP 443 的 QUIC 流量。如果放行 QUIC，请求会直接绕过 MITM 脚本，导致去广告完全失效。

因此，本模块在 `[Rule]`（或 `rules:`）中默认内置了：
```
AND,((DOMAIN-SUFFIX,googlevideo.com),(PROTOCOL,QUIC)),REJECT
AND,((DOMAIN-SUFFIX,youtubei.googleapis.com),(PROTOCOL,QUIC)),REJECT
```
阻断 QUIC 后，YouTube App 会自动降级为标准 TCP/TLS，脚本即可稳定拦截并改写 Protobuf 报文。

### 2. Surge 导入
进入 Surge iOS：
1. 模块 (Modules) ➔ 安装新模块 ➔ 填入上面的 `youtube-enhance.sgmodule` 链接。
2. 确保在 Surge 的 MITM 证书已信任并开启。

### 3. Egern 导入
Egern 支持两种方式：
- **方式 A（最简推荐）**：在 Egern 的「工具 ➔ 模块 ➔ 添加模块」中，填入 `youtube-enhance.module`（或 `youtube-enhance.sgmodule`），Egern 会原生解析并启用。
- **方式 B（YAML 模式）**：在配置文件或自定义模块中引用 `youtube-enhance.egern.yaml`。

---

## 核心实现与审计结论 (2026-09)

通过纯 Node 内置模块环境运行的仿真测试套件（`npm test` 或 `node test/youtube/index.js`），共 143 项断言已全部通过：

1. **`/player`**：清理 `adPlacements`、`adSlots`、`paidPromotion` 及 `pagead` 统计追踪；强启 PiP（画中画）与后台播放能力标志。
2. **信息流 (`browse` / `next` / `search`)**：识别并清除 `inline_injection_entrypoint_layout.eml` 等 6 种已知广告布局，以及带有 `sponsoredVideo` / `sponsoredDisplay` / `/pagead/` 特征的卡片；保持正常视频原有顺序与结构。
3. **`navigation/resolve_url` 与 `get_watch`**：清理嵌套播放器及下期推荐中的广告。
4. **UMP / Onesie (`initplayback`)**：
   - 本地捕获 `youtubei/v1/config` 下发的密钥。
   - 对 `googlevideo.com/initplayback` 加密二进制流进行 AES-128-CTR + HMAC-SHA256 解密与验证。
   - 移除内置播放器广告并重签 HMAC，兼容 gzip (0/6/9) 及未压缩模式；若密钥协商异常则优雅回退空包，促使客户端走可解密的普通请求。

---

## 常见排查

1. **若仍看到广告**：
   - 检查 MITM 主机名列表中是否包含了 `*.googlevideo.com`、`youtubei.googleapis.com`、`*.youtube.com`，且根证书状态为“已信任”。
   - 确认 QUIC 拦截规则已生效（可尝试清理 YouTube App 缓存或重开飞行模式触发降级）。
2. **单测运行**：
   ```bash
   cd test && npm test
   ```
