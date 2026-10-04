# 精工制造 · 独立网站示例

这是虚构企业的静态网站，用于行人易安科技的行业示例库。使用 React / Next.js，电脑与手机独立编排。

- 开发：`pnpm --filter @website/demo-precision-manufacturing dev`，端口 3002。
- 发布产物：仓库根目录运行 `pnpm build` 后生成 `dist/demo-precision-manufacturing/`。
- 页面、组件与内容分别位于 `src/app`、`src/components`、`src/content`。
- 图片存放于 `public/images`，全部为本项目生成式概念素材，不代表真实产品或工厂。
- 页面始终 `noindex,nofollow`，不受正式官网搜索收录开关影响。
- 表单只在本机整理与复制，不接后端、付款或文件上传。加工表单与补充说明仅保留于当前页面内存，刷新即清空。
- 跨站入口从构建 basePath 推导。单站 dev 模式默认行人易安运行于 3000，示例库的 A/C 开发入口分别为 3001/3002。
- 原图、生成提示词与效果稿位于 `docs/design/industrial-showcase/`，不进入网站产物。
- 真实客户使用前需要替换企业身份、真实产品与参数、素材和联系渠道，并确认托管路径。
