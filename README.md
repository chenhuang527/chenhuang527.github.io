# Chen Huang · Hexo 学术主页

这是 Resume 优先的个人学术网站，使用 Hexo + 自定义 scholar 主题 + EJS + 原生 CSS/JavaScript。没有 Vue、React、登录、后台、运行时数据库、博客分类或文章列表。Hexo 自身生成的 db.json 只是本地构建缓存。

## 设计分析与改造

参考 https://cmymoon.com/ 当前为 Hexo 博客，https://www.cmymoon.com/ 为 DaoHang 对应的个人主页。原项目 README 说明其基于 HeoWeb 修改，实际代码为静态 HTML + jQuery，并非现成 Hexo 主题。

本项目保留其顶部导航、左右首屏、大留白和分区浏览的设计思路，重新实现为学术内容：暖白纸张底色、墨绿点缀、衬线大标题、教育时间轴、研究卡片、论文列表。使用轻量淡入、滚动出现、hover 与当前分区导航。支持移动端、键盘导航、系统减少动画设置和打印。

Hexo 修改方式：source/index.md 指定 resume 布局；主题 layout.ejs 提供公共导航和页脚；resume.ejs 读取 site.data.profile 渲染履历，不遍历 posts。未安装文章、分类、标签或归档生成器。导航目前直接定位首页各区块，无二级菜单。

## Windows / IDEA：第一次运行

1. 从 https://nodejs.org/ 下载安装 Node.js 22 LTS 或更新的 LTS，安装时保留 npm 与 Add to PATH 选项。重启 IDEA，使 PATH 生效。
2. IDEA → File → Open → 选择本项目文件夹（包含 package.json 和 _config.yml 的目录）。使用下方 Terminal 即可，无需额外 IDEA 插件。
3. 在 Terminal 输入：

```powershell
node -v
npm -v
npm install
npm run server
```

4. 浏览器打开 http://localhost:4000/ 。这是完整学术简历首页。
5. 停止服务：终端按 Ctrl+C。

`npm run server` 与 `npx hexo server` 等效。若想直接使用 `hexo server`，先执行一次 `npm install -g hexo-cli`，之后运行 `hexo server`。无需执行 hexo init，本项目已经初始化完毕。

若 PowerShell 报 npm.ps1 禁止运行，可使用 `npm.cmd install`、`npm.cmd run server`，或将 IDEA Terminal 改为 cmd.exe。若端口被占用：`npx hexo server -p 4001`。修改 _config.yml 后重启服务；数据修改若未刷新也请重启。

## 目录与维护入口

```text
_config.yml                       网站 URL、部署根路径、主题
package.json                      依赖和运行命令
source/
  index.md                        首页入口，layout: resume
  _data/profile.yml               所有个人信息和履历
  assets/Chen_Huang_CV.pdf         原始简历 PDF
  assets/images/                  自行放置头像
  assets/favicon.svg              网站图标
themes/scholar/
  _config.yml                     单层导航
  layout/layout.ejs               HTML、导航、页脚
  layout/resume.ejs               学术简历页面
  layout/page.ejs                 未来独立页面通用模板
  source/css/main.css             颜色、排版、响应式、动画
  source/js/main.js               菜单、滚动检测、论文筛选
.github/workflows/pages.yml        GitHub Pages 自动构建部署
public/                           Hexo 生成结果，不手工编辑
legacy/                           原 DaoHang 页面与资源，仅供参考
```

## 修改头像和简历

CV 没有照片，所以当前使用姓名缩写图形占位，不是生成的人像。将照片放入 `source/assets/images/portrait.jpg`（建议竖图），修改 profile.yml：

```yaml
avatar: assets/images/portrait.jpg
```

路径不要加开头的 `/`；模板会自动处理 GitHub Pages 子目录。姓名、职位、学校、简介、研究方向、教育经历、教学与联系方式都在 profile.yml 中。`initials` 是头像占位的姓名缩写，`updated` 是手动维护的更新时间。修改 PDF 可直接替换 source/assets/Chen_Huang_CV.pdf。设 `cv: ''` 可隐藏 CV 按钮。

页面资料从用户提供的 CV 整理。4 篇已发表论文与 1 篇审稿中论文明确分开；教学未虚构课程名称。DOI 沿用简历内容，未另行核验。修改姓名后同时更新网站 _config.yml 的 title 和 author。

## 添加论文、项目与课程

在 profile.yml 的 publications 列表后添加（保持同级缩进，勿用 Tab）：

```yaml
  - title: Your paper title
    authors: 'Huang, C., Other, A., & Other, B.'
    year: 2027
    venue: Journal name, volume, pages
    status: published
    doi: 10.xxxx/your-doi
```

审稿中的稿件使用 `status: review`，无 DOI 使用 `doi: ''`。按数据文件顺序展示；新论文推荐放在列表最前面。DOI 只填编号，不填 https://doi.org/ 前缀。首页统计自动计算。

项目按 projects 中已有条目复制，url 为空时不展示按钮。teaching.courses 可改为：

```yaml
  courses:
    - name: 实际课程名称
      term: 2026 Fall
```

## 扩展独立页面

现在导航完整定位首页，点 Home 返回首屏。以后可以创建 source/about/index.md：

```markdown
---
title: About
layout: page
---
这里填写 Markdown 内容。
```

然后把 themes/scholar/_config.yml 对应导航的 href 改为 `/about/`。公共模板自动保留导航和页脚，不需要引入博客系统。

## GitHub Pages 部署

1. 安装 Git：https://git-scm.com/download/win ，创建 GitHub 账号。
2. 建立公开仓库 `你的用户名.github.io`（用户名替换为真实 GitHub 用户名）。
3. 将 _config.yml 修改为：

```yaml
url: https://你的用户名.github.io
root: /
```

4. 项目终端执行以下命令，把 YOUR_USERNAME 换为真实用户名。若已有 Git 仓库则跳过 git init；若已有 origin，使用 git remote set-url origin 替换地址。

```powershell
git init
git add .
git commit -m "Build academic homepage"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

5. GitHub 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
6. Actions 页面选择 Deploy academic homepage → Run workflow；后续推送 main 会自动部署。
7. 工作流成功后访问 https://你的用户名.github.io/ 。无需手工上传 public 文件夹。

如果仓库名是 academic 而非 用户名.github.io，则改为：

```yaml
url: https://你的用户名.github.io/academic
root: /academic/
```

图片、CSS、JavaScript 和导航通过 Hexo url_for 自动适配 root。发布前可运行 `npm run build` 检查是否成功。部署只需静态文件，不需要服务器或数据库。当前任务仅准备部署文件，没有上传或发布到外网。

## 绑定个人域名

推荐先使用子域名如 www.example.com：

1. 域名提供商 DNS 中添加 CNAME：主机记录 www，目标 你的用户名.github.io（没有 https://，没有仓库名）。
2. GitHub 仓库 Settings → Pages → Custom domain 填写 www.example.com，保存。
3. 新建 source/CNAME，内容只有一行：www.example.com。
4. 修改 _config.yml：url 为 https://www.example.com，root 为 /，提交并推送。
5. 等待 DNS 与证书生效后启用 Enforce HTTPS。

根域名 example.com 的 A/AAAA 或 ALIAS 记录请按 GitHub 官方文档配置，不要照抄过时的 IP。建议在 GitHub 账号设置中验证域名。取消绑定时同时处理 DNS、Pages 设置和 source/CNAME。

官方资料：
- Hexo 数据文件：https://hexo.io/docs/data-files
- Hexo 模板：https://hexo.io/docs/templates
- Hexo GitHub Pages：https://hexo.io/docs/github-pages
- 域名配置：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 原项目保留

原 DaoHang 的 index.html、README 和静态资源归档在 legacy/，不参与 Hexo 构建。来源 https://github.com/Monthpity/DaoHang ，原说明称基于 https://github.com/zhheo/HeoWeb 修改。新 scholar 主题独立编写，没有加载旧 jQuery、旧导航卡片或第三方追踪脚本。
