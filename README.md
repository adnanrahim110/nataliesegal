This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Admin + Blogs (MySQL)

This project now supports an admin login and dynamic blogs stored in MySQL (no Prisma).

### 1) Install dependencies

```
npm install mysql2
```

### 2) Configure database

Create the database and tables (schema is managed outside of HTTP requests):

```
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS natalie_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p natalie_site < sql/schema.sql
```

Set env variables (create `.env.local`):

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=natalie_site
DB_CONNECTION_LIMIT=5
```

### 3) Create admin user (dev only)

Start dev server and visit:

```
http://localhost:3000/api/dev/create-admin?email=admin@example.com&password=yourpassword&name=Admin
```

This endpoint is disabled in production and only works when there are no users.

### 4) Login and add blogs

- Open `/admin/login` to sign in.
- After login, `/admin` shows a form to create a blog post.
- The blogs page (`/blogs`) fetches posts from the database.

Content paragraphs are split by blank lines (two newlines) in the editor.
