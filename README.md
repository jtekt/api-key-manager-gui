# API Key Manager GUI

Frontend SPA for API Key Manager, the API key management microservice. Built with Vue 3 (Composition API), Vuetify 3, TypeScript, and Vite.

Users can create API keys, view their keys and status (active/expired/revoked), filter revoked keys out of the list, and revoke keys they no longer need.

## Requirements

- Node.js and npm
- A running instance of [`api-key-manager-api`](../api-key-manager-api) to talk to

## Setup

```bash
npm install
cp .env.example .env.development.local
```

Edit `.env.development.local` and set at least `VITE_API_BASE_URL` (defaults to `http://localhost:3000` if unset).

Authentication has two modes, selected by whether `VITE_OIDC_AUTHORITY` is set:

- **Unset (dev mode):** the GUI sends a `X-User-ID` header (editable in the UI, stored in `localStorage`) instead of logging in. Matches the API's header-based dev auth.
- **Set:** the GUI redirects to the OIDC provider for login and sends the resulting access token as a Bearer header. Also requires `VITE_OIDC_CLIENT_ID`.

## Development

```bash
npm run dev
```

Starts the Vite dev server on port `5173`.

## Other scripts

```bash
npm run build   # type-check (vue-tsc) + production build to dist/
npm run preview # preview the production build locally
npm run lint    # ESLint with auto-fix
```

## Project structure

- `src/pages/` — file-based routes (via `unplugin-vue-router`); add a `.vue` file here and the route is generated automatically
- `src/components/` — Vue components, auto-imported in templates (no explicit imports needed)
- `src/composables/` — `useAuth` (auth headers, login/logout) and `useUserId` (dev-mode user id)
- `src/api.ts` — resolves `apiBase` from `VITE_API_BASE_URL`
- `@` resolves to `src/`

## Deployment

The Docker image is built once and configured at container start. `40-env-config.sh` runs from nginx's `/docker-entrypoint.d/` and writes every `VITE_*` environment variable into `/env.js` as `window.__ENV__`, which `index.html` loads before the app. `src/runtimeEnv.ts` merges it over the build-time `import.meta.env`, so runtime values win. Read configuration through `runtimeEnv` rather than `import.meta.env`.
