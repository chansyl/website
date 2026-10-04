# 多企业 React 官网工程架构方案

本工程用于持续承接外部企业的展示型官网。建议采用 **pnpm Workspace 单仓库多应用架构，以 React + Next.js 静态导出构建各家公司网站，再通过 GitHub Actions 发布到 GitHub Pages**。每家公司拥有独立源码目录和独立静态产物目录，共享工程规范与少量基础能力。

本文为架构设计，编写于 2026 年 10 月 4 日。文中的目录、配置项和流程均为后续实施约定，本轮不创建应用、不安装依赖、不编写工作流、不执行部署。

## 一 需求范围与现状

当前仓库为 `chansyl/website`，本地根目录为 `/Users/yanliang/Documents/ChansylWebsite/website`。已有简短 README、Git 忽略规则和空的 `.github` 目录，尚无前端工程或部署工作流。

本方案将“每个公司网站产物需要有独立目录”落实为两层隔离：源码放在 `sites/<company-id>/`，最终交付文件放在 `dist/<company-id>/`。不同公司可拥有完全不同的页面结构、视觉风格和内容。

首期按以下条件设计，这些是架构默认值，不代表已获得具体客户的业务需求：

- 一个开发团队统一维护多个网站，先在同一仓库内管理。
- 网站以首页、公司介绍、产品或服务、案例、新闻、联系方式等公开内容为主。
- 首期使用当前仓库的 Pages 子路径发布，不假设已配置自定义域名。
- 内容保存在 Git 中，修改内容后重新构建；暂不接入 CMS。
- 纯前端指线上只托管静态 HTML、CSS、JavaScript 和资源文件；本地及 CI 可以使用 Node.js 完成构建。

后台管理、登录、支付、数据库、服务端接口不属于本工程。联系方式默认使用电话、邮箱和公开地址；真实留言提交需要另行确定外部接口，前端不模拟提交成功。

## 二 核心架构决策

| 事项 | 推荐选择 | 原因 |
| --- | --- | --- |
| 仓库组织 | pnpm Workspace 单仓库多应用 | 统一依赖与工具，各站点仍有独立构建入口 |
| UI 技术 | React + TypeScript | 满足 React 要求，用类型约束内容与公共接口 |
| 应用框架 | Next.js App Router，仅使用静态导出能力 | 企业官网需要可直接获取正文的 HTML 和稳定页面地址 |
| 渲染策略 | 构建时静态生成，交互区域在浏览器运行 | 兼顾内容展示、搜索索引和交互 |
| 样式 | CSS Modules + 公司级 CSS 变量 | 隔离组件样式，允许各客户独立设计 |
| 内容组织 | 公司目录内的结构化数据和本地资源 | 内容归属清楚，便于审核与交付 |
| 公共代码 | 工程配置、基础组件、路径与 SEO 工具 | 复用稳定能力，客户业务留在客户目录 |
| 发布方式 | 全量构建已启用站点，汇总一个 Pages artifact | 适配单仓库只有一个 Pages 站点的限制 |
| 质量检查 | ESLint、TypeScript、静态产物检查、Playwright 冒烟测试 | 重点验证路径、资源、页面和关键交互 |

pnpm 原生支持工作区和 `workspace:` 依赖，可用于组织上述本地包。首期不引入 Nx、Turborepo、微前端运行时或远程共享资源服务，待实际构建耗时证明有必要时再增加任务缓存。[pnpm 工作区文档](https://pnpm.io/workspaces)

### 框架选择依据

| 候选方案 | 本工程判断 |
| --- | --- |
| React + Vite，纯客户端 SPA | 适合交互应用，但本工程还需要补充逐页 HTML 生成与静态路由处理 |
| React Router Framework 静态预渲染 | 可行备选，能够在不运行服务端的情况下预渲染页面 |
| React + Next.js 静态导出 | 本方案采用，围绕页面、内容与静态输出建立统一约定 |

上述取舍是本项目的工程判断。React Router 支持静态预渲染；Next.js 的 `output: 'export'` 能生成静态站点，默认输出到 `out/`，线上无需 Next.js 服务。[React Router 预渲染](https://reactrouter.com/how-to/pre-rendering)、[Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)

实施时选择相互兼容的 React、Next.js、Node.js LTS 与 pnpm 稳定版本，固定版本及锁文件，并在本地和 CI 使用同一工具链；本文不将滚动变化的版本号作为架构约束。

## 三 源码目录规划

以下仅为目录设计，`company-a`、`company-b` 均为占位名称。

```text
website/
├── sites/
│   ├── company-a/
│   │   ├── src/
│   │   │   ├── app/                 页面、布局和静态路由
│   │   │   ├── components/          公司专属组件
│   │   │   ├── content/             公司介绍、产品、案例、新闻数据
│   │   │   ├── styles/              品牌变量和站点级样式
│   │   │   └── lib/                 公司专属辅助逻辑
│   │   ├── public/                  Logo、图片、字体、下载文件
│   │   ├── tests/                   站点冒烟用例
│   │   ├── site.config.ts           站点信息与内容配置
│   │   ├── next.config.ts           消费公共配置和构建参数
│   │   ├── package.json             独立开发、构建、检查入口
│   │   └── README.md                客户站点维护与交付说明
│   └── company-b/                   与 company-a 同级且独立
├── packages/
│   ├── config/                     TypeScript、ESLint、Next.js 基础配置
│   ├── ui/                         可选的无品牌基础组件
│   └── site-core/                  配置类型、资源路径、SEO 辅助能力
├── tooling/                        后续构建、校验和产物汇总工具
├── templates/
│   └── company-site/               首个站点验证后提炼的新站点模板
├── docs/
│   └── architecture.md             本方案
├── .github/
│   └── workflows/                  后续 CI 和 Pages 发布流程
├── sites.manifest.json             站点登记和发布开关
├── package.json                    工作区级任务入口
├── pnpm-workspace.yaml             工作区范围
├── pnpm-lock.yaml                  全仓统一依赖锁文件
├── dist/                           按公司归档的静态交付产物
└── .pages/                         单次 Pages 部署的完整汇总目录
```

`sites/*/out/` 是框架导出目录，`dist/` 与 `.pages/` 是构建工具生成的目录，后续加入 Git 忽略规则。它们不作为源码提交。`templates/` 不加入应用工作区，也不参与发布。

公司标识采用稳定的小写英文与连字符，例如 `acme-industrial`，与展示名称分离。目录名和登记标识必须一致且全仓唯一，保留 `assets`、`_next` 等系统目录名称。已上线标识不能随公司展示名称随意改动，因为它是公开 URL 的一部分。

## 四 公司隔离与公共能力边界

依赖方向为“公司站点 → 公共包”。公共包不引用任何公司站点，公司之间不直接引用源码、内容或资源。

- `packages/config` 维护共同的构建和检查规则，不保存公司信息。
- `packages/ui` 仅放基础按钮、弹窗、可访问导航等稳定组件，通过参数和 CSS 变量接受外观设置；React 作为 peer dependency，避免公共组件打包另一份 React。
- `packages/site-core` 维护站点配置类型、公开资源路径处理和 SEO 辅助逻辑，不依赖浏览器中的全局公司选择器。
- 公司 Logo、客户名单、页面模块、品牌色、文案及专属动画全部保留在自己的目录中。

每家公司最终产物包含自身需要的完整运行资源，包括其使用的公共代码。允许不同公司产物包含重复的依赖片段，以换取可独立托管和交付；不创建一个必须长期共同在线的公共 JavaScript 目录。

公共组件出现第二个真实复用场景后再抽取。首期不建设统一页面搭建器，也不通过一个巨大配置文件控制所有公司的页面布局。

源码目录隔离不等于权限隔离：同一仓库的协作者通常可以读取其他客户源码；同一域名下的子路径也不是浏览器安全边界。若客户要求独立访问权限，应拆分源码仓库；若交付源码，需同时包含其依赖的公共包，不能只复制一个公司目录。

## 五 站点配置与构建输入

分开管理业务配置和部署输入，避免同一字段多处维护。

| 位置 | 保存内容 |
| --- | --- |
| 根目录站点登记表 | `id`、`enabled`；公司目录和工作区名称按 id 推导 |
| 公司站点配置 | 展示名称、语言、导航、联系方式、SEO 默认值、正式站点地址（如已确定） |
| CI 或本地构建参数 | 当前发布目标、当前域名 origin、当前 basePath、是否允许索引 |

登记表只负责确定哪些公司进入本次发布，不装载所有公司的内容。站点可单独开发与构建；公开发布则采用登记表生成完整站点清单。

构建前校验重复 id、非法路径、缺失目录、必填内容、正式地址格式以及空发布清单。`enabled: false` 表示从下一次完整发布中移除该站点，不只是跳过它的本次构建。首期不得通过“自动跳过构建失败的公司”发布不完整站点集合。

## 六 静态页面与资源规则

采用页面文件路由和静态内容。新闻、案例等动态路径在构建时根据内容清单枚举；新增内容后重新发布。核心正文、页面标题、描述和分享信息必须进入导出的 HTML。

静态导出不使用请求时渲染、Server Actions、ISR、服务端重写或依赖请求的接口；默认图片优化服务也不适用于静态托管。图片在开发或构建阶段预处理，首期使用静态图片或关闭运行时优化。浏览器 API 仅在浏览器阶段访问。[Next.js 静态导出能力与限制](https://nextjs.org/docs/app/guides/static-exports)

页面统一使用尾部斜杠，例如 `/about/`，使导出内容采用 `about/index.html` 形式。正常页面应直接对应物理文件，无需使用 hash 路由或把所有 404 请求伪装成首页。[Next.js trailingSlash](https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash)

### 发布地址与构建路径

假定当前项目 Pages 尚未设置自定义域名，地址关系设计如下。下表是规划地址，尚未验证实际 Pages 设置或上线状态。

| 场景 | company-a 网站地址 | 构建 basePath |
| --- | --- | --- |
| 单站本地开发 | `http://localhost:<port>/` | 空字符串 |
| 当前仓库统一发布 | `https://chansyl.github.io/website/company-a/` | `/website/company-a` |
| 汇总站点绑定统一域名 | `https://showcase.example.com/company-a/` | `/company-a` |
| 未来客户独立域名 | `https://www.company-a.example/` | 空字符串 |
| 未来独立部署仓库，未绑定域名 | `https://<owner>.github.io/<deploy-repo>/` | `/<deploy-repo>` |

Next.js 的 `basePath` 在构建时固定，更换发布路径后必须重建。框架链接能够处理该前缀，但图片等公开资源需要显式正确处理路径。[Next.js basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)

本工程据此约定：站内页面链接交给框架处理；图片、下载文件和 CSS 中的公开资源引用统一经过路径约定或构建处理；不在业务组件中写死 `/website/`。不使用 `assetPrefix` 代替页面路径配置，不对已经带前缀的框架链接再次追加前缀。

每站生成自身 sitemap，canonical 使用已确认的正式地址；仅用于演示的版本添加 `noindex`，不把演示地址作为正式 canonical。`noindex` 不提供访问控制。`robots.txt` 以域名根路径为作用域，项目子路径下的同名文件不能被当作独立域名根规则使用；共享域名模式下不得依赖公司子目录的 robots 文件实现隔离。

## 七 独立构建产物与汇总发布

单站输出按以下链路处理：公司源码 → 公司框架导出目录 → 公司交付目录 → Pages 汇总目录。复制时保留完整静态输出及框架导航数据，不只挑选 HTML 和图片。

```text
sites/company-a/out/        company-a 的框架静态导出
            ↓ 完整复制
dist/company-a/             company-a 的独立交付目录
            ↓ 完整复制
.pages/company-a/           Pages 中 company-a 的公开目录
```

一次统一发布的目录结构为：

```text
.pages/
├── index.html              最小入口页，默认不展示客户名单
├── 404.html                整个汇总站点的通用错误页
├── company-a/
│   ├── index.html
│   ├── about/index.html
│   ├── _next/              该公司完整运行资源
│   └── ...                 图片、下载文件、导航数据等
└── company-b/
    ├── index.html
    ├── about/index.html
    ├── _next/
    └── ...
```

artifact 的根目录直接是 `.pages/` 的内容，不再嵌套 `website/`；公开地址中的 `/website` 由项目 Pages 提供。各公司的 basePath 已在构建时包含完整公开子路径。

子目录保留各自导出的错误页面文件，但汇总发布不假设 Pages 会按公司选择嵌套的 `404.html`。首期由顶层通用错误页承接未知地址，独立部署时再使用公司的错误页。

`dist/company-a/` 可独立交付，但交付说明必须记录构建时的域名与 basePath。针对 `/website/company-a` 构建的文件不能直接移到新域名根路径并声称无需修改；应按目标路径重新构建。最终交付包不需要附带其他公司的文件或 `node_modules`。

## 八 GitHub Pages 部署架构

### 首期采用一个仓库汇总发布

GitHub Pages 每个项目仓库最多对应一个 Pages 站点。基于这一限制，本方案将公司目录视为同一个 Pages 站点下的多个独立应用，不给每家公司配置一条直接发布到当前仓库的流水线。[GitHub Pages 站点类型与数量限制](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

各应用可以独立构建，但首期公开发布与回滚以整个汇总站点为单位。部署时必须提交完整目录快照；只上传改动公司的目录会使其他公司文件从新的发布结果中消失。

### GitHub Actions 流程

1. Pull Request 运行静态检查、启用站点构建和产物冒烟检查，生成可下载的验证产物，不覆盖公开站点。
2. `main` 分支发生应用、内容、公共包、工具、依赖或工作流变更时执行发布；纯文档修改可跳过。提供手动触发入口用于重新发布。
3. 安装固定工具链，使用锁文件冻结安装依赖；缓存依赖下载，首期不缓存最终发布目录。
4. 从干净目录全量构建已启用站点，读取 Pages 元数据并结合公司 id 确定各站 basePath。
5. 对每个公司产物校验首页、页面路由、静态资源、内部链接、元数据与路径前缀；任一失败即终止。
6. 汇总 `.pages/`，生成最小入口和通用 404，校验完整性与总大小。
7. 使用官方 `actions/upload-pages-artifact` 上传一个完整 artifact，再由 `actions/deploy-pages` 发布。
8. 对已部署的各站首页、典型子页面和静态资源做访问检查，保留提交 SHA、构建目标和 artifact 信息用于追溯。

仓库 Pages 发布源设为 GitHub Actions。部署 job 依赖构建 job，使用 `github-pages` environment，并仅为部署赋予所需的 `pages: write` 与 `id-token: write` 权限；读取源码使用 `contents: read`。初始化通过 `actions/configure-pages` 获取 Pages 配置信息。[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

同一目标采用固定并发组，避免多个发布互相覆盖；发布前检查提交是否仍为预期分支版本。构建、校验或汇总失败时保留上一次线上版本。回滚通过恢复对应源码版本及构建配置后重建全量产物完成，若使用历史 artifact，需确认保留期限和目标路径一致。

首期不将“仅构建变更站点”用于正式汇总发布。后续如优化增量构建，需要先解决未变更产物补齐、公共包依赖追踪、删除站点与缓存有效性，仍上传完整快照。

### 后续客户独立部署

当客户要求独立正式域名或独立发布节奏时，保留当前开发仓库，为该客户增加一个专属部署仓库，并在其 Pages 设置中配置域名。域名配置属于 Pages 站点级设置，不能通过在各公司子目录放置不同 CNAME 文件实现按域名分流；自定义 Actions 发布时应以仓库 Pages 设置为准。[GitHub Pages 自定义域名管理](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

扩展方案是在开发仓库构建目标公司的产物，通过限定目标仓库权限的 GitHub App 或细粒度令牌同步到部署仓库的静态目录，再触发目标仓库自己的 Actions 上传并部署。普通当前仓库 `GITHUB_TOKEN` 不作为跨仓库写入凭据；不假设当前仓库的 `deploy-pages` 能直接发布其他仓库。

这一扩展不在首期实现。出现源码保密、客户自行维护或整体移交要求时，可进一步将公司源码及其必要公共依赖迁移到客户独立源码仓库。

## 九 托管适用范围

本工程面向企业官网，需把 Pages 的用途限制作为部署选型条件：GitHub 明确限制将 Pages 用于运营线上业务、电子商务或以促成商业交易、提供商业 SaaS 为主要目的的网站。本方案将首期范围限定为展示型静态官网，不据此断言所有商业企业宣传站都已获平台许可；具体客户上线前应核对用途，超出适用范围时沿用静态产物架构更换托管平台。[GitHub Pages 用途限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

当前文档所列限制还包括发布站点不超过 1 GB、月带宽软限制 100 GB、Pages 部署超过 10 分钟超时。汇总模式按整个发布站点计量；自定义 Actions 不受每小时 10 次构建软限制约束，但其他限制仍需遵守。[GitHub Pages 用量限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

据此建议图片提前压缩、视频使用客户确认的外部托管，并在构建阶段统计总产物大小。主要面向中国大陆访客时，首个真实客户应实测目标网络下的可访问性与加载表现，再确定正式托管方案。

本地未检查远程 Pages 是否启用、自定义域名、仓库可见性或套餐。GitHub Free 的 Pages 面向公共仓库，私有仓库支持取决于套餐；不能从本地 Git 配置推定已满足部署条件。[GitHub Pages 可用范围](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## 十 开发与验收约定

后续工程入口应覆盖：新建公司、单站开发、单站构建、全站构建、静态产物预览和全仓检查。新建站点流程为复制已验证模板、设定唯一 id、补齐公司内容与资源、登记发布开关、通过验收后合入。

开发服务器用于日常开发；部署验收必须使用最终静态产物，并以实际路径层级挂载。预览服务器关闭 SPA 自动回退，否则会掩盖子页面缺失问题。

| 验收项 | 通过条件 |
| --- | --- |
| 公司隔离 | company-a 页面和产物不包含 company-b 的品牌、内容或资源引用 |
| 单站构建 | 可单独构建一个公司，不需要构建其他公司 |
| 独立交付 | 单公司目录包含所有自身运行资源，按记录的 basePath 可独立服务 |
| 深层路由 | 从地址栏直接访问、刷新、前进后退均正常 |
| 静态托管 | 关闭服务器 rewrite 后，已知页面和资源仍可访问 |
| 路径切换 | 公司子路径和域名根路径分别构建后均无资源 404 |
| 内容与 SEO | 初始 HTML 包含正文和正确元数据，sitemap 与 canonical 符合发布目标 |
| 用户体验 | 移动端无横向溢出，导航与关键交互支持键盘，图片有合适替代文字 |
| 发布完整性 | 修改 company-a 后，company-b 仍存在且可用；失败构建不发布 |
| 删除与回滚 | 停用站点从新快照移除，恢复历史版本可还原完整站点集合 |
| 错误页面 | 未知地址返回真实 404，不呈现“首页成功加载”的假象 |

首期重点编写路径处理、配置校验与产物汇总的针对性测试，以及关键页面的浏览器冒烟用例。静态展示组件不机械增加大量单元测试。共享能力变更时验证所有受影响站点。

## 十一 实施顺序

1. 建立工作区、统一工具链、基础配置与站点登记规范。
2. 完成首个真实公司站点，验证静态导出、SEO、资源和交付目录。
3. 用第二个站点验证目录隔离与复用边界，再提炼公共组件和站点模板。
4. 实现全量产物汇总、静态访问检查及 GitHub Pages Actions 发布。
5. 按客户需要增加独立部署仓库、多语言静态页面或构建时 CMS 数据接入。

进入实施阶段时再补齐首家公司标识、内容与设计资料，以及实际域名和仓库 Pages 设置。当前架构以“统一维护、公司独立应用、公司独立产物、首期汇总发布”为基线，以上信息不影响本轮方案交付。
