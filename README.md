# 多企业官网工程

基于 React / Next.js 的纯前端多站点工程。各公司拥有独立应用、素材和静态产物，共享工程配置；通过 GitHub Actions 汇总部署到 GitHub Pages。

首个网站为 **行人易安科技**：采用已确认的“星际航线”视觉方向，独立设计电脑与手机布局，包含首页、四项服务详情、联系与需求整理页。

## 本地运行

环境：Node.js 22 或更新版本、pnpm 11.19.0。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

开发地址：`http://127.0.0.1:3000/`。

按实际 GitHub Pages 路径构建、检查和预览：

```bash
PAGES_URL=https://chansyl.github.io/website pnpm build
pnpm check:output
pnpm preview
```

产物预览地址：`http://127.0.0.1:4173/website/xingren-yian/`。修改生产代码后，需要重新构建才能更新此预览。

## 目录

```text
sites.manifest.json           站点启用清单
sites/xingren-yian/           行人易安科技独立应用
  src/app/                   页面、SEO 与全局样式
  src/components/            导航、双端演示、需求表单等
  src/content/services.ts    服务文案
  src/lib/site.ts            名称、联系信息、微信二维码路径
  public/images/             优化后的 WebP 图片
packages/config/             Next.js 静态导出及 TypeScript 配置
tooling/                     全站构建、产物校验、静态预览
tests/                       部署规则测试与浏览器验收
.github/workflows/pages.yml  CI 与 GitHub Pages 部署
dist/xingren-yian/            独立公司产物（自动生成）
.pages/xingren-yian/          汇总部署产物（自动生成）
```

## 检查

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm check:output
pnpm test:browser
pnpm test:mobile
```

浏览器验收需先运行产物预览，默认使用本机 Chrome 的独立无头实例。覆盖 320、375、390、430、768、1024、1440 像素，以及菜单、服务导航、双端演示、流程展开、表单必填校验、服务预选、摘要和复制。另有 390 × 844、DPR 3 的触控与减少动态效果、暂停动画、键盘入口和剪贴板拒绝权限回退检查。`pnpm test:production` 会在 4174 端口自动启动并结束验收专用预览，执行三组浏览器检查（含埋点成功、服务端错误和网络失败场景）。截图与结果写入 `artifacts/qa/`，不提交 Git。可通过 `TEST_URL` 和 `BROWSER_CHANNEL` 调整地址与浏览器。

## GitHub Pages 部署

1. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. 推送到 `main` 后，工作流先执行类型、Lint 和单元检查，再构建全部启用站点、验证本地链接、运行独立浏览器验收后，上传一个 Pages 产物。所有公司站点由同一部署任务发布，防止互相覆盖。
3. 默认从仓库推导 Pages 地址；本仓库对应 `https://chansyl.github.io/website/xingren-yian/`。这是预期发布地址，不表示已经上线。
4. 如果为整个仓库绑定自定义域名，先在 Pages 设置中配置，再设置 Actions 仓库变量 `PAGES_URL` 为站点汇总根地址，如 `https://example.com`。不要包含公司目录，构建脚本会追加。
5. 确认域名、内容和联系资料后，可设置仓库变量 `ALLOW_INDEXING=true` 允许搜索收录。默认预览模式不索引；每站点仍生成对应 sitemap，正式上线后可分别提交给搜索引擎。子目录 robots.txt 不是域名根策略，页面自身的 robots meta 同时控制索引。

工作流遵循 [GitHub Pages 自定义工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。当前仅准备本地代码与工作流，未推送或修改远端 Pages 设置。

## 联系方式与微信替换

真实邮箱、电话与微信二维码路径已配置在 `sites/xingren-yian/src/lib/site.ts`。当前二维码使用 `sites/xingren-yian/public/images/xingren_wechat.png`，联系页可扫码或点击查看原图。

后续替换同名图片并重新构建即可；若使用新文件名，同步修改 `wechatQr` 配置。

点击“整理我的需求”并通过必填校验后，会在浏览器生成摘要，同时向 `https://xingrenyian.com/api/omega/report` 发送 JSON POST：`{ name: "xingrenyian_website_submit_ck", attr: { content: "本次生成的完整需求摘要" } }`。摘要包含用户填写的企业、需求和联系方式，页面已同步说明。上报为非阻塞请求，不携带 Cookie，不自动重试；失败不影响摘要、复制和邮件入口。关闭/刷新页面不会在本机保留所填内容。浏览器验收拦截此接口并验证参数，不向真实接口发送测试数据。

## 新增公司

在 `sites/<company-id>/` 建立独立 Next.js 应用，引用 `@website/config/next`，提供 `build`、`lint`、`typecheck` 脚本；在 `sites.manifest.json` 注册并设置 `enabled: true`。所有站点资源需带自身 `NEXT_PUBLIC_BASE_PATH`，页面用 Next.js Link。构建时从清单逐个生成 `dist/<company-id>`，再汇总部署。不同公司不通过运行时条件混在同一应用中。

## 已确认设计与维护

- [工程架构](docs/architecture.md)
- [官网设计方案](docs/design/xingren-yian/proposal.md)
- [手机设计方案](docs/design/xingren-yian/mobile-design.md)
- [官网文案](docs/design/xingren-yian/website-copy.md)
- [视觉验收](design-qa.md)

网站未引用外部组件站的源码或商业素材。星际背景与星球为本次生成并优化的图片，Phosphor 图标采用其开源库。原始图片保存在 `docs/design/xingren-yian/asset-sources/`，不进入网站部署产物。
