# VORTKART Brand Website

A deploy-ready English B2B brand website for VORTKART: public product catalog, racing stories, inquiry capture, SEO, Supabase CMS, and a secure `/admin` route.

## 1. Run locally

Requirements: Node.js 20+.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The public site works immediately with bundled demo content, even before Supabase is configured.

If the local page suddenly appears without styling, close the existing development terminal and run `npm run dev` again. Development and production builds use separate cache directories, so `npm run build` will not overwrite the active local site's assets.

## 2. Set up Supabase

> **重要：不要把本 README 文件复制到 SQL Editor。**
>
> SQL Editor 只能运行 `.sql` 文件。若报错 `syntax error at or near "#"`，说明复制的是 README，而不是 SQL 脚本。

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the local [`supabase/setup.sql`](supabase/setup.sql) file.
3. Copy **everything inside `setup.sql`**, from the first `-- VORTKART DATABASE SETUP` line to the final verification query.
4. In Supabase, open **SQL Editor > New query**, paste the SQL, and click **Run**.
5. Confirm the result table shows `VORTKART database setup completed`.
6. Open **Authentication > Users > Add user** and create your single admin user with email and password.
7. Open [`supabase/add-admin.sql`](supabase/add-admin.sql), replace `YOUR_ADMIN_EMAIL@example.com` with the exact Auth user email, then paste that SQL into a **new** SQL Editor query and click **Run**.
8. Confirm the result shows the administrator email.
9. Open **Project Settings > API** and copy the Project URL, anon key, and service role key.
10. The SQL creates a public `media` Storage bucket. Upload images/PDF/video there, copy each public URL, and paste URLs into `/admin` content fields.

### Supabase 中文快速说明

```text
第一步：运行 supabase/setup.sql        → 创建数据库表、权限和媒体桶
第二步：Authentication > Users        → 创建登录邮箱和密码
第三步：运行 supabase/add-admin.sql    → 授予这个用户后台管理员权限
```

不要在 SQL Editor 中运行以下文件：

```text
README.md
.env.example
package.json
```

The service role key is server-only. Never expose it in a variable beginning with `NEXT_PUBLIC_`.

## 3. Environment variables

Create `.env.local` locally and add the same variables in Vercel:

> Windows users: the filename must be exactly `.env.local`, with no spaces.  
> `.env .local` is incorrect and Next.js will ignore it. Restart `npm run dev` after changing environment variables.

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
RESEND_API_KEY=re_xxxxxxxxx
INQUIRY_TO_EMAIL=your-real-email@example.com
RESEND_FROM_EMAIL=VORTKART <inquiries@your-verified-domain.com>
```

For Resend, create an account at [resend.com](https://resend.com), verify your sending domain, and create an API key. Until a domain is verified, use Resend's test sender.

## 4. Use the admin panel

1. Visit `/admin`.
2. Sign in with the Supabase Auth user added to `admin_users`.
3. Use the tabs to manage products, projects, site settings, and inquiries.
4. Select **New / Edit settings** or **Edit**. Content is displayed as simple JSON so every supported field remains editable.
5. For product images, project galleries, brochures, logo, or hero video: upload the file to Supabase Storage's `media` bucket, copy its public URL, then add that URL in the relevant JSON array/field.

Important JSON shapes:

```json
{
  "images": ["https://.../media/front.jpg", "https://.../media/detail.jpg"],
  "specs": { "Powertrain": "Electric", "Application": "Rental tracks" }
}
```

Inquiry emails are sent through Resend and every valid inquiry is also saved to the `inquiries` table.

## 5. Deploy to Vercel

1. Create a GitHub repository and push this project.
2. Visit [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep the detected **Next.js** settings.
4. Add all environment variables from the section above.
5. Click **Deploy**.
6. After deployment, set `NEXT_PUBLIC_SITE_URL` to the final Vercel/custom domain and redeploy.

Vercel automatically builds the dynamic sitemap at `/sitemap.xml` and robots rules at `/robots.txt`.

## Content and SEO

- Public routes: `/`, `/products`, `/products/[slug]`, `/projects`, `/projects/[slug]`, `/contact`
- CMS route: `/admin`
- Structured data: Organization, Product, VideoObject
- Product pricing is optional and intentionally presented as quote-led B2B content.
- Bundled starter stories avoid unverified client names or testimonials.

## Commands

```bash
npm run dev
npm test
npm run build
```
