# VORTKART Visual CMS 新手上线手册

这份手册是给第一次接手这个项目的人看的。你不需要懂代码细节，只要按顺序操作，就能把方案 D 的内容准备好、部署上线、再开始维护内容。

---

## 你先记住一句话

这个项目的内容维护分成两层：

1. **后台结构化表单**：改产品、项目、设置、询盘、首页区块
2. **视觉页面编辑器**：改首页和其他视觉页面的版式、模块和内容

你不会看到原始 JSON 编辑框。后台已经改成表单和视觉编辑器了。

---

## 第 1 步：先准备 Supabase

你需要先有一个 Supabase 项目。

### 你要做什么

1. 打开 Supabase 控制台
2. 进入你的项目
3. 找到左侧的 **SQL Editor**
4. 先执行基础脚本 `supabase/setup.sql`
5. 再执行升级脚本 `supabase/upgrade-visual-cms.sql`

### 怎么点

1. 左侧点 **SQL Editor**
2. 右上角点 **New query**
3. 打开项目里的 `supabase/setup.sql`
4. 复制全部内容，粘贴到 SQL Editor
5. 点 **Run**
6. 再打开 `supabase/upgrade-visual-cms.sql`
7. 复制全部内容，再点一次 **Run**

### 你应该看到什么

- 表创建成功，没有报错
- 数据库里有 `site_settings`、`products`、`projects`、`inquiries`、`navigation`、`pages`、`page_sections`
- 如果重复执行，通常不会破坏已有数据

### 小提醒

- 如果你已经有旧数据，先别急着删
- 这个升级脚本是为了“补齐结构”，不是清空重建

---

## 第 2 步：准备环境变量

这个项目运行需要 Supabase 和站点地址。

### 你要准备的变量

在部署平台里准备这些环境变量：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 每个变量怎么理解

- `NEXT_PUBLIC_SITE_URL`：你线上网站的地址，比如 `https://your-site.com`
- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目的 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase 匿名 key
- `SUPABASE_SERVICE_ROLE_KEY`：Supabase 服务端 key，只给服务器用

### 怎么填

如果你用 Vercel：

1. 打开 Vercel 项目
2. 进入 **Settings**
3. 选择 **Environment Variables**
4. 一项一项添加上面这些变量
5. 保存

### 注意

- `SUPABASE_SERVICE_ROLE_KEY` 不要暴露给浏览器
- 前缀是 `NEXT_PUBLIC_` 的变量才会在前台可用

---

## 第 3 步：先确认项目能跑起来

如果你是在本地检查，先做一次最基础的启动。

### 本地启动步骤

1. 打开命令行
2. 进入项目目录
3. 运行 `npm install`
4. 运行 `npm run dev`
5. 打开浏览器访问 `http://localhost:3000`

### 你应该先看哪个页面

先看首页 `/`，再看后台 `/admin`。

---

## 第 4 步：确认后台登录

### 怎么进后台

1. 打开 `http://localhost:3000/admin`
2. 如果还没登录，先输入 Supabase 里能登录后台的邮箱和密码
3. 点 **Sign in**

### 登录后你会看到什么

左侧是内容导航，右侧是当前模块编辑区。

导航里你会看到：

- Products
- Projects
- Site settings
- Inquiries
- Homepage sections
- Visual Pages

---

## 第 5 步：先改站点全局设置

建议你第一件事先改 `Site settings`，因为它会影响全站样式和文案。

### 怎么点

1. 在后台左侧点 **Site settings**
2. 右侧会出现表单
3. 逐项填写
4. 点 **Save**

### 先填哪些内容

建议按这个顺序：

1. `site_name`
2. `tagline`
3. `logo_url`
4. `favicon_url`
5. `seo_title`
6. `seo_description`
7. `header_cta_label`
8. `header_cta_url`
9. `footer_note`

### 主题颜色怎么改

在 `theme` 里填：

- `primary`
- `secondary`
- `background`

如果你不确定配色，先别乱改，先用默认值。

### 你改完后会发生什么

- 前台顶部标题会变
- CTA 按钮会变
- favicon 会变
- 页面整体主题会跟着更新

---

## 第 6 步：维护产品

### 怎么点

1. 左侧点 **Products**
2. 右侧会列出已有产品
3. 点 **New product** 新建
4. 或者点某一条产品右侧的 **Edit**

### 产品页面里怎么填

按这个顺序最容易：

1. `name`
2. `slug`
3. `category`
4. `description`
5. `price`
6. `seo_title`
7. `seo_description`
8. `images`
9. `brochure_url`
10. `specs`
11. `published`

### 图片和 PDF 怎么上传

1. 在字段右侧找到上传控件
2. 选择文件
3. 上传后会生成公开 URL
4. 你可以看到预览或 URL
5. 保存

### `specs` 怎么填

它适合做参数表，比如：

- `Frame: 30 mm`
- `Engine: 200 cc`
- `Application: Rental tracks`

### 保存前检查什么

- `slug` 是否唯一
- `images` 里是否至少有一张图
- `published` 是否打开

---

## 第 7 步：维护项目案例

### 怎么点

1. 左侧点 **Projects**
2. 点 **New project**
3. 或者编辑已有项目

### 建议填写顺序

1. `title`
2. `slug`
3. `client`
4. `location`
5. `year`
6. `story`
7. `testimonial`
8. `gallery`
9. `published`

### 你要特别注意

- `gallery` 最好至少有一张首图
- `story` 适合写项目背景、过程、结果
- `published` 关掉就是草稿

---

## 第 8 步：处理询盘

### 怎么点

1. 左侧点 **Inquiries**
2. 点击某条询盘

### 你能改什么

询盘页面里，客户的原始信息是只读的。你只需要处理：

- `status`
- `notes`

### 推荐操作方式

1. 先看客户姓名、邮箱、电话、需求
2. 把当前处理状态改成 `New`、`Contacted` 或 `Closed`
3. 在 `notes` 里写跟进内容
4. 点 **Save**

### 为什么这样设计

因为客户提交的内容不该被随手改掉，你只要留下跟进痕迹就行。

---

## 第 9 步：维护首页区块

### 怎么点

1. 左侧点 **Homepage sections**
2. 选择某个区块
3. 修改内容
4. 点 **Save**

### 你会看到哪些字段

- `section_type`
- `title`
- `sort_order`
- `published`
- `content`

### 常见操作

- `sort_order` 越小，越靠前
- `published` 关闭，区块就不显示
- `content` 里一般放标题、描述、按钮文字、链接、图片

### 建议你先怎么改

如果你是第一次操作，先只改：

1. 首页 hero
2. 产品推荐区
3. 联系区

不要一口气改太多，先看前台效果再继续。

---

## 第 10 步：维护视觉页面

这是方案 D 最重要的地方。

### 你先做什么

1. 左侧点 **Visual Pages**
2. 点 **New page**
3. 输入页面标题和 slug
4. 进入视觉编辑器

### 你会看到什么

你不会看到 JSON。  
你会看到的是一个可视化编辑器，里面可以拖拽和编辑这些区块：

- Hero
- RichText
- MediaGallery
- ProductShowcase
- CaseStudyShowcase
- CTA
- FaqSpecs

### 每个区块怎么理解

- **Hero**：首屏大标题、描述、按钮、背景图
- **RichText**：一段说明文字
- **MediaGallery**：多图展示
- **ProductShowcase**：选几个产品做展示
- **CaseStudyShowcase**：选几个案例做展示
- **CTA**：引导用户点击按钮
- **FaqSpecs**：FAQ 和参数组合

### 怎么编辑一个视觉页

1. 先建页
2. 再添加区块
3. 再填区块内容
4. 先点 **Save draft**
5. 检查没问题后点 **Publish page**

### 怎么判断页面有没有发布成功

- 列表里会显示已保存
- 前台访问 `/pages/你的slug`
- 如果已经发布，你应该能看到页面内容

---

## 第 11 步：前台怎么查看

### 你先看哪些地址

1. 首页：`/`
2. 产品列表：`/products`
3. 项目列表：`/projects`
4. 视觉页：`/pages/home`
5. 后台：`/admin`
6. 视觉页后台：`/admin/pages`

### 正常情况下你会看到什么

- 首页会根据数据库内容展示
- 没有视觉页时会自动回退到本地首页
- 导航、footer、CTA、favicon、SEO 都会跟着设置变

---

## 第 12 步：上线到 Vercel

如果你要正式上线，建议用 Vercel。

### 操作顺序

1. 把代码推到 GitHub
2. 在 Vercel 里导入这个仓库
3. 配好环境变量
4. 部署
5. 部署完成后打开线上地址检查

### 上线前检查

- Supabase SQL 已经执行
- 环境变量已填完
- `npm run build` 本地能通过
- `/admin` 能登录
- `/admin/pages` 能打开
- 首页 `/` 能打开

---

## 第 13 步：你每次改内容的推荐流程

这是最稳的日常操作顺序：

1. 先改 `Site settings`
2. 再改 `Products`
3. 再改 `Projects`
4. 再处理 `Inquiries`
5. 再调 `Homepage sections`
6. 最后去 `Visual Pages` 做视觉排版
7. 每改完一块就到前台看一次

---

## 第 14 步：常见问题

### 问：后台没有内容怎么办？

先确认 Supabase 变量是否配置正确，再确认数据库脚本是否执行过。

### 问：图片上传后看不到？

检查是否已经拿到公开 URL，保存后再刷新前台。

### 问：视觉页没显示？

确认页面已经 `Publish page`，并且 `slug` 没写错。

### 问：前台还是旧内容？

刷新页面，检查是不是数据库里还有旧数据，或者视觉页还没发布。

### 问：我怕点错？

先点草稿保存，不要一上来就发布。  
每次只改一个模块，看懂结果后再继续。

---

## 最后给你的最短上手路线

如果你现在就要开始用，照这个顺序做：

1. 执行 `setup.sql`
2. 执行 `upgrade-visual-cms.sql`
3. 配环境变量
4. 打开 `/admin`
5. 先改 `Site settings`
6. 再改 `Products` 和 `Projects`
7. 再处理 `Inquiries`
8. 再调 `Homepage sections`
9. 最后进 `/admin/pages` 做视觉页
10. 到前台检查 `/`、`/products`、`/projects`、`/pages/home`

你按这个顺序走，基本就能把方案 D 跑起来并开始上线使用了。
