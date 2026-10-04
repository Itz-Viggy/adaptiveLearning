# Vector — Adaptive Learning

Stage 0/1 of `ProductTechnicalIntegrationSpecification.md`: the existing React/Vite
design plus a TypeScript/Fastify API, PostgreSQL identity/catalog migration and
provisioned Supabase email-code authentication. No hosted project has been created.

## Local setup

Use Node 24 LTS (`.node-version`) and npm. Node 22.18+ is also supported.

```sh
npm ci
cp .env.example .env
```

Fill the local environment file with the public Supabase project URL/publishable
key for both the frontend and server, a restricted `DATABASE_URL`, and a separate
owner `MIGRATION_DATABASE_URL`. No credential is committed. Server secrets must
never use a `VITE_` prefix. Keep API base blank for the same origin.

Run the migration using the owner connection, then run the API and Vite in separate
terminals:

```sh
npm run db:migrate
npm run dev:server
npm run dev
```

The API defaults to `127.0.0.1:3001`; Vite proxies `/api` and `/health` to it.
Changing the backend port also requires changing the Vite proxy. `/` redirects to
the guarded `/app`. Direct assessment URLs require verified authentication too.
With no Supabase settings the existing login shows a setup message, with no demo
authentication fallback.

## Create the Supabase development project

These are operator setup steps; no project, purchase, account or remote schema was
created during implementation.

1. Create an isolated development project with fake student accounts. Keep
   `app_private` outside the exposed schemas and disable the unused Data API.
2. Enable email Auth and disable public sign-ups. The app calls
   `signInWithOtp({email,options:{shouldCreateUser:false}})` and then
   `verifyOtp({email,token,type:'email'})`. Provision accounts through Auth admin
   tooling; never insert ordinary application SQL into `auth.users`.
3. Configure custom SMTP and the email template to show `{{ .Token }}` instead of
   a magic link. Configure the local Site URL and intended production URL in Auth.
   Default SMTP is restricted and may not support the required template for new
   projects. Follow the current [email OTP guide](https://supabase.com/docs/guides/auth/auth-email-passwordless)
   and [SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp).
4. Enable asymmetric signing (ES256 by default; RS256 is configurable), configure
   issuer `<SUPABASE_URL>/auth/v1`, audience `authenticated`, and a 15-minute access
   token lifetime. The server uses project JWKS and verifies signature, algorithm,
   issuer, audience, expiry and UUID subject, then asks Auth for the verified user.
   Legacy HS256 and service-role authentication are rejected. See the
   [JWT guide](https://supabase.com/docs/guides/auth/jwts).
5. Obtain a current `sb_publishable_...` key. Set the public project settings in
   `.env`; neither frontend nor server auth verification needs a service-role key.
6. Use the owner connection to run `npm run db:migrate`. The migration creates a
   NOLOGIN `app_runtime` role. Enable its LOGIN and assign a strong password through
   operator-controlled SQL/secrets (for example, `ALTER ROLE app_runtime LOGIN
   PASSWORD '<locally-generated-secret>';`). Put only this role's connection in
   `DATABASE_URL`, using the provider's direct or session-pooler settings for custom
   roles. Do not grant content writes, schema creation, superuser or bypass access.
7. Keep verified TLS enabled. Supply the provider CA through
   `DATABASE_SSL_CA_FILE` if required. URL TLS overrides are removed; certificate
   verification is never disabled for a hosted connection. `DATABASE_SSL_MODE=disable`
   is accepted only for local development databases.
8. Provision fake A/B accounts with distinct display names. Their first `/me`
   calls lazily create profiles; operator-only enrollment rows can then be added
   against actual Auth user UUIDs and course IDs. A new account with no enrollment
   receives an empty list, without fabricated history or a fallback topic.
9. Verify live code delivery, A/B sign-in, refresh, logout and private-schema denial
   in that development project. These live provider checks are still pending.

## Verification and production

```sh
npm test           # API/JWT/SQL/contracts/client tests plus the existing demo unit tests
npm run typecheck  # Frontend, backend, contracts and tests
npm run lint
npm run build      # Checked frontend bundle and compiled backend
npm run api:docs   # Regenerate schema-derived server/contracts/openapi.json
npm run test:auth  # Controlled OTP/API mocks in headless Chrome; starts its own Vite server
```

The auth browser test needs Google Chrome installed. It verifies route guards,
assessment return paths, reload, account cleanup, failures, accessibility and five
viewport widths without a live project or email delivery. Embedded PostgreSQL tests
execute migration SQL and role/constraint queries using PGlite. They do not verify
hosted network/TLS/pooler behavior. See `docs/verification.md` for measured results.
The historical `scripts/e2e-check.mjs` and `scripts/visual-check.mjs` are retained;
their old demo-entry flow needs adaptation when later learning stages are connected.

Production uses one Node service:

```sh
npm run build
NODE_ENV=production npm start
```

It serves `dist/`, the `/api/v1` endpoints and public liveness-only `/health`.
Application deep links fall back to `index.html`; unknown `/api` URLs return JSON
404s. API data is private/no-store. The runtime refuses migration-owner credentials.
Production static responses include a CSP for the app, configured Auth origin and
existing Google Fonts. No deployment is included.

## Incremental boundary

The existing learning screens and all their styling remain intact as Vite
development fixtures. They are not approved instructional content or durable
learner evidence. Production excludes their question keys/demo calculations and
uses the existing shell and empty-state primitives until the approved read side
is implemented. `/app/settings` already shows the verified account and real local
provider sign-out. Appearance preferences remain local; the authenticated API also
supports validated profile/preference updates for later integration.

The old `vector-session=demo` marker never authorizes access. Legacy
`vector-learning-v1` identity, scores, answers, progress and history are discarded;
only validated display preferences can migrate. Tokens belong exclusively to the
Auth SDK, and learner/query state clears and playback stops on sign-out or account
change. Nothing imports demo evidence into the database.

`server/contracts/` freezes Section 13 public DTOs, safe response schemas and the
Section 9 policy defaults. `content/schema.json` freezes bundle shape and external
approval fields without implementing content import. `server/tests/fixtures/` is
synthetic test data, not faculty-approved content. The initial migration introduces
only profiles/courses/modules/topics/enrollments; the full 18-table plan and exact
file changes are in `docs/stage-0-1.md`.

Stage 2 adds concepts, source/range mappings, optional audio and immutable question
versions, validated dry-run/idempotent operator import and transactional publication.
It needs a course-owner-approved sample bundle. Read-side UI integration, private
media, durable assessments, grading/mastery and pilot operations remain later stages.
