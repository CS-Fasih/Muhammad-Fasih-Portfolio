# Muhammad Fasih — Portfolio

A responsive React portfolio with an editorial black, white, and red design. The site includes the original single-page portfolio, a public activity feed, a private activity dashboard, serverless API routes, MongoDB Atlas persistence, signed Cloudinary image uploads, and the existing portfolio chatbot.

**Live:** [muhammadfasih.vercel.app](https://muhammadfasih.vercel.app)

## Routes

| Route | Purpose |
|---|---|
| `/` | Portfolio homepage |
| `/activity` | Published activity feed |
| `/admin/login` | Private administrator sign-in |
| `/admin/activity` | Authenticated activity management |

The public navbar never exposes the admin routes.

## Technology

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Vanilla CSS |
| API | Node.js serverless functions under `api/` |
| Database | MongoDB Atlas with Mongoose |
| Authentication | bcrypt password verification and an HttpOnly JWT cookie |
| Images | Signed browser-to-Cloudinary uploads |
| Hosting | Vercel |

## Environment variables

Copy the root template and replace every placeholder:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|---|---:|---|
| `MONGODB_URI` | Yes | Atlas application connection string, including the database name |
| `ADMIN_EMAIL` | Yes | The single allowed administrator email |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of the administrator password; never use plaintext |
| `JWT_SECRET` | Yes | Long random value used to sign the administrator session |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary product-environment cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Server-only Cloudinary API secret |
| `GROQ_API_KEY` | Chatbot only | Keeps the existing chatbot API operational |

Do not prefix server secrets with `VITE_`; Vite-prefixed values are exposed to the browser. Keep `.env.local` out of Git. For Vercel, add the variables to the project’s Development, Preview, and Production environments as appropriate, then redeploy because environment changes do not alter an existing deployment.

Generate a strong JWT secret locally:

```bash
openssl rand -base64 48
```

### Generate the administrator password hash

Install the root dependencies first, then enter the password without placing it in the command itself:

```bash
read -rsp "Admin password: " ADMIN_PASSWORD && echo
ADMIN_PASSWORD="$ADMIN_PASSWORD" node -e "require('bcryptjs').hash(process.env.ADMIN_PASSWORD, 12).then(console.log)"
unset ADMIN_PASSWORD
```

Copy the complete output, including its leading `$2...`, into `ADMIN_PASSWORD_HASH`. Put only the hash in Vercel. Do not commit the password, the hash, or a real `.env` file.

## MongoDB Atlas setup

1. Create an Atlas project and a **Free cluster** (formerly M0) in a supported region.
2. Create a dedicated database user with a strong, unique password. An Atlas database user is separate from the user that signs in to the Atlas website.
3. Add your development IP address under Network Access. Vercel functions do not normally have one fixed outbound IP on the free plan, so a serverless deployment may require `0.0.0.0/0`; if used, rely on strong database credentials and least-privilege database access. Restrict the rule when fixed egress is available.
4. Choose **Connect → Drivers**, copy the `mongodb+srv://...` URI, URL-encode special characters in the database password, and include a database name such as `portfolio`.
5. Save the result as `MONGODB_URI` locally and in Vercel.

The serverless database helper caches a connection between warm invocations, but Atlas connection and storage limits still apply. Free clusters are intended for small projects and light traffic; review the current [Atlas free-cluster documentation](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) before production use.

## Cloudinary setup

1. Create a Cloudinary account and open the product-environment dashboard.
2. Copy its cloud name, API key, and API secret into the matching environment variables. Never put the API secret in client code.
3. No unsigned upload preset is needed. The authenticated dashboard obtains a short-lived signature from `/api/uploads/sign`, then uploads directly from the browser into `muhammad-fasih-portfolio/activities`.
4. The application accepts image files up to 5 MB each and up to four images per activity. Add useful alt text for every image.

Cloudinary’s Free plan measures transformations, storage, and bandwidth with a shared monthly credit allowance. Responsive transformations and delivered images consume that allowance, so monitor usage in the Cloudinary console; see the current [Cloudinary plan documentation](https://cloudinary.com/documentation/billing_and_plans).

### Image removal behavior

Each saved image includes its Cloudinary `public_id`. Saving an edit that removes a previously stored image, or deleting the activity itself, asks the server to destroy the corresponding Cloudinary asset. Failed edit cleanups are retained in an internal retry queue; saving that activity again retries them. Removing only a newly selected local preview does not call Cloudinary. A deleted asset may remain visible briefly in a CDN cache, and Cloudinary backups—if enabled on the account—have their own retention behavior. If cleanup repeatedly fails—or an uploaded image is abandoned before its activity is saved—check `muhammad-fasih-portfolio/activities` in Cloudinary’s Media Library and remove the orphan manually.

## Run locally

Use Node.js 22 or newer. Install both dependency sets:

```bash
npm ci
npm --prefix client ci
cp .env.example .env.local
```

Fill `.env.local`, then run the full Vercel application from the repository root so the React app and `/api` functions share one origin:

```bash
vercel dev
```

Unless the port is already occupied, the local URLs are:

- Homepage: `http://localhost:3000/`
- Public activity: `http://localhost:3000/activity`
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin/activity`

For frontend-only styling work, `npm --prefix client run dev` starts Vite (normally on `http://localhost:5173`), but the activity API, authentication cookie, and signed uploads require `vercel dev` or another same-origin API runtime.

Before deployment, run:

```bash
npm --prefix client run lint
npm --prefix client run build
```

## Administrator workflow and first post

1. Open `/admin/login` and sign in with `ADMIN_EMAIL` and the original password whose hash was configured.
2. The server verifies the password with bcrypt and stores the signed session in an HttpOnly cookie. A direct visit to `/admin/activity` without a valid session redirects to login, and all write APIs independently enforce authentication.
3. In the dashboard, choose **Create Activity**, complete the required title, content, category, and activity date fields, then optionally add metadata, tags, links, and up to four images with alt text.
4. Select **Published** to show the first post immediately, or save it as a draft for later. Submit once and wait for the success state before navigating away.
5. Use the dashboard to edit, publish/unpublish, feature/unfeature, or delete posts, and use **Logout** when finished.

## Public feed behavior

- The public API returns published posts only; drafts remain visible only in the authenticated dashboard.
- Results are filtered on the server by category and loaded six at a time rather than downloading every post.
- Ordering is featured posts first, then activity date descending, then creation date descending.
- **Load More** appends the next page. The feed also provides loading, retryable error, and “No activities published yet.” empty states.
- Each post has a stable direct activity link. Sharing uses the Web Share API when available and otherwise copies the link to the clipboard.
- Content is rendered as plain text with preserved line breaks. Arbitrary post HTML is not stored or rendered.

## Deploy to Vercel

1. Authenticate the CLI if this machine is not signed in, then link or confirm the project from the repository root:

   ```bash
   vercel login
   vercel link
   ```

2. Add every required environment variable in **Project Settings → Environment Variables**. At minimum configure Production; configure Preview and Development when those deployments must use the feature. The CLI can also add values interactively with `vercel env add VARIABLE_NAME`.
3. Create a preview deployment and test login, CRUD, image cleanup, the empty/feed states, and direct refreshes of all React routes:

   ```bash
   vercel
   ```

4. Deploy production:

   ```bash
   vercel --prod
   ```

Vercel rewrites non-API browser routes to the React entry point while keeping `/api/*` mapped to serverless functions. Free/Hobby serverless functions have execution, bandwidth, and cold-start constraints, and their filesystem is ephemeral. Images therefore upload directly to Cloudinary and durable data belongs in Atlas—not in local files. Check each provider’s dashboard for current quota usage and limits.

## Project structure

```text
.
├── api/                 # Vercel serverless API functions
├── client/              # React/Vite application
│   └── src/
│       ├── components/  # Shared and activity UI
│       ├── pages/       # Home, activity, login, and admin pages
│       └── index.css    # Existing Vanilla CSS design system
├── lib/                 # Database, authentication, validation, Cloudinary
├── models/              # Mongoose models
├── server/              # Legacy standalone Express contact server
├── .env.example         # Placeholder server environment variables
└── vercel.json          # Build, headers, API, and SPA route handling
```

## Author

**Muhammad Fasih** — [GitHub](https://github.com/CS-Fasih) · [LinkedIn](https://linkedin.com/in/muhammad-fasih-19f) · [Email](mailto:muhammadfasih146@gmail.com)

© 2026 Muhammad Fasih. All rights reserved.
