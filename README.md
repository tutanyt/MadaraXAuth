# MadaraXAuth

Responsive dark anime-inspired authentication portal built with React + Vite, Supabase Auth, and Netlify deployment support.

## Included
- Responsive PC/mobile UI
- Sign up and sign in using Supabase email/password authentication
- Session restore and sign out
- Accessible form labels, password visibility toggle, loading/error/success states
- Netlify build configuration and SPA redirect
- No fake local-only login and no hard-coded owner credentials

## Run locally
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project at https://supabase.com and copy its Project URL and publishable/anon key into `.env.local`.
4. In Supabase Authentication settings, configure your Site URL and allowed redirect URLs (for local development, `http://localhost:5173`; add your deployed Netlify URL later).
5. Run:
   ```bash
   npm install
   npm run dev
   ```
6. For a production build: `npm run build`. Output is in `dist/`.

## GitHub
Create a new empty repository, extract/upload these files, and push the project. Do not commit `.env.local` or any secret keys. The `.gitignore` excludes `.env` files.

## Netlify
Import the GitHub repository into Netlify. Build command: `npm run build`; publish directory: `dist`. `netlify.toml` already contains these settings. Add the following under Site configuration → Environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (Supabase publishable/anon client key only; never use a service-role key in browser code)

Redeploy after setting variables. Configure the deployed URL in Supabase Auth redirect settings.

## Owner/admin access
This starter does **not** grant admin privileges automatically. To create a real owner/admin role, add a server-verified role system (for example Supabase custom claims/secure database policies or a trusted server function). Never trust a role stored only in browser local storage or a client-editable profile field. Do not put a Supabase service-role key in frontend environment variables.

## PC `.exe` integration
The web page alone does not connect an arbitrary desktop app automatically. Your `.exe` needs its own authentication integration, using a supported OAuth/device flow or a backend endpoint that verifies tokens. Do not embed privileged secrets in the executable. This project is a web authentication front-end foundation; desktop integration is a separate step.

## Troubleshooting
- **“Authentication is not configured yet”**: add the two environment variables and redeploy.
- **Signup does not immediately sign in**: email confirmation may be enabled; check the confirmation email.
- **Redirect errors**: add the exact local/deployed origin to Supabase Auth URL configuration.
