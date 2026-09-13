# Chen Huang · ORBIT 学术主页

基于现有 Hexo 7 + scholar 自定义主题改造的多页面个人主页。保持 EJS、原生 CSS/JavaScript 和标准 Hexo 结构，无新增依赖。

## 本次设计

- Home 是独立 Landing Page，只显示姓名、职位、学校、研究方向、一句简介、个人视觉与 View Research / View CV。
- About、Research、Publications、Projects、Teaching、Contact 分别生成独立 HTML。不是首页锚点，也不是前端模拟路由。
- 深蓝星空、蓝紫星云、轨道与姓名缩写构成个人视觉。可换成真实头像。
- 透明玻璃导航固定在顶部，滚动后加深背景。当前页标记、hover 下划线、移动端菜单。
- Canvas 星星对鼠标及滚动产生轻微视差，附近星点与指针连接；轨道缓慢旋转、元素浮动、页面进入及滚动渐入。
- 内页使用深色阅读面板与学术列表，已发表和审稿中稿件明确区分，保留论文筛选与 DOI。

设计理念参考 https://cmymoon.com/ 的氛围、导航与视觉层次，以及 https://isakzhang.github.io/index.html 的独立栏目组织。新视觉与代码独立编写，未复制参考站资产。

## 项目结构

```text
_config.yml                    Hexo 地址、root、主题；保留 .html 链接
source/
  index.md                     首页入口，layout: landing
  about.md                     permalink: about.html
  research.md                  permalink: research.html
  publications.md              permalink: publications.html
  projects.md                  permalink: projects.html
  teaching.md                  permalink: teaching.html
  contact.md                   permalink: contact.html
  _data/profile.yml            唯一个人履历数据入口
  assets/
    Chen_Huang_CV.pdf           CV
    favicon.svg                新轨道图标
    images/                    可自行建立，放置头像
themes/scholar/
  _config.yml                  独立页面导航、effects 动画开关
  layout/
    layout.ejs                 星空、导航、公共页脚
    landing.ejs                首页个人展示
    academic.ejs               内页标题与内容组织
    page.ejs                   未来 Markdown 独立页
    index.ejs                  首页回退模板
    resume.ejs                 兼容旧入口，现指向 landing
    _partial/
      about.ejs                个人介绍
      education.ejs            教育时间轴（About 内）
      research.ejs             研究方向
      publications.ejs         论文列表
      projects.ejs             科研项目
      teaching.ejs             教学
      contact.ejs              联系方式
  source/css/main.css          完整新版样式、响应式与动画
  source/js/main.js            菜单、筛选、Canvas 与动画控制
.github/workflows/pages.yml     已有 GitHub Pages 工作流，继续使用
package.json                   原有依赖，无新增框架
legacy/                        原 DaoHang 文件，不参与构建
public/                        Hexo 输出，不要手工修改
```

## IDEA / Windows 本地运行

IDEA → File → Open → 选择包含 package.json 的项目目录。在 Terminal 中运行：

```powershell
hexo server
```

若没有全局 hexo 命令，使用项目现有脚本（无需全局安装）：

```powershell
npm run server
```

两者都启动 Hexo。本地访问 http://localhost:4000/，用导航访问例如 http://localhost:4000/publications.html。Ctrl+C 停止。仅重新打开浏览器或重启电脑不会自动启动服务。

如果你之前删除了 node_modules，先安装 Node.js 22 LTS 或更新 LTS（https://nodejs.org/，包含 npm），重启 IDEA，然后只需执行一次 `npm install` 恢复依赖。依赖仍在时不需要重新安装。PowerShell 禁止 npm.ps1 时可使用 `npm.cmd run server`。

本次修改涉及主题配置，旧 Hexo 服务若仍在运行，请 Ctrl+C 后重新运行。若仍看到旧页面，请浏览器 Ctrl+F5；仅在确有旧输出缓存时执行一次 `npm run clean` 后重新启动。

## 修改资料和头像

所有履历仍在 source/_data/profile.yml，本次保留原有资料：

- name / initials：姓名与个人视觉缩写。
- role / institution / focus / intro：首页职位、学校、方向与简介。
- about / education：About 页面。
- research / publications / projects / teaching / contact：对应独立页面。
- updated：手动更新页脚日期。

没有真实头像时使用 CH 轨道视觉。把头像放到 source/assets/images/portrait.jpg，然后设置：

```yaml
avatar: assets/images/portrait.jpg
```

路径不加开头斜杠。模板通过 url_for 自动添加部署子目录。替换 source/assets/Chen_Huang_CV.pdf 即可更新 CV，或修改 cv 字段；留空隐藏按钮。

添加论文：在 publications 列表按既有缩进添加一项，推荐新论文放前面：

```yaml
  - title: Your paper title
    authors: 'Huang, C., Other, A., & Other, B.'
    year: 2027
    venue: Journal, volume, pages
    status: published
    doi: 10.xxxx/your-doi
```

审稿中使用 `status: review`，没有 DOI 使用 `doi: ''`。不填写完整 DOI URL。YAML 用空格，勿用 Tab。

教学页沿用 CV 中实际提供的教学情况，没有编造课程。你可填写：

```yaml
  courses:
    - name: 真实课程名称
      term: 2026 Fall
```

## 动画和配色

themes/scholar/source/css/main.css 顶部变量控制颜色。主题配置中的 `effects: false` 可关闭全站动画；修改配置后重启 Hexo。

页面底部 Pause effects 可以临时暂停，刷新后恢复默认。遵循 prefers-reduced-motion；无 JavaScript 时资料和导航链接依然存在。Canvas 上限为桌面 95 / 手机 40 颗星，绘制约 30fps；隐藏标签页时暂停动画循环。未加入统计、鼠标行为上传、外部字体、WebGL 或动画依赖。

## GitHub Pages

沿用 .github/workflows/pages.yml，不需要安装部署插件。

1. 当前 _config.yml 地址保留为 `https://chenhuang527.github.io`，root 为 `/`，适用于仓库 `chenhuang527.github.io`。
2. 将代码提交并推送到 GitHub 仓库的 main 分支。
3. GitHub 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
4. 推送 main 会运行工作流；也可在 Actions → Deploy academic homepage → Run workflow 手动触发。
5. 云端自动安装依赖、生成 public，再发布。成功后访问站点及 `/about.html` 等独立地址。

如果使用普通仓库（例如 academic），请设置：

```yaml
url: https://chenhuang527.github.io/academic
root: /academic/
```

务必保留 `pretty_urls.trailing_html: true`，让独立页链接保持 `.html`。模板已统一使用 url_for 适配 root。不要上传 node_modules、public 或本地缓存。此次只修改本地源代码，没有替你提交或触发线上部署。

绑定个人域名：在 GitHub Settings → Pages 设置 Custom domain；域名 DNS 的 www CNAME 指向 chenhuang527.github.io；在 source/CNAME 写域名（不加协议），将 _config.yml 的 url 改为 https://你的域名、root 改为 /，提交推送，待证书就绪后开启 Enforce HTTPS。根域名 DNS 记录按官方文档配置。

官方文档：
- https://hexo.io/docs/github-pages
- https://hexo.io/docs/data-files
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 本次修改范围与验证说明

修改：_config.yml（保留 .html 后缀）、source/index.md、source/assets/favicon.svg、themes/scholar/_config.yml、layout/layout.ejs、index.ejs、resume.ejs、page.ejs、source/css/main.css、source/js/main.js、README.md。

新增：source 下 6 个内页 Markdown、layout/landing.ejs、academic.ejs、_partial 下 7 个内容模板。

个人数据、CV 和已有部署工作流保留。按本次要求未执行 npm/pnpm 安装、构建或自动化测试，也没有启动新的本地服务。本次改动文件均位于项目内；运行后的最终渲染效果尚未验证。
