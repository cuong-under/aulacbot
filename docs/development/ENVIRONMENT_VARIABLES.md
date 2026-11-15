# Environment Variables

The single source of truth is `packages/config/src/schema.ts`. `.env.example` is generated from it
by `bun run docs:env`; the file in the repository is therefore upstream-owned and must not be edited
by hand.

`.env` is read only by `bun run dev` and `bun run start` (both use `--env-file`). Tests never read it.

## Required for any run

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL 15+ with the `vector` extension, or `pglite:///<folder>` for the built-in database |
| `AGENTES_SECRET` | Master secret: session signing and the key that encrypts stored provider credentials derive from it |

## AULACBOT-relevant settings

These matter for branding, licensing and deployment — they are upstream variables, no new ones were
added.

| Variable | AULACBOT value |
| --- | --- |
| `SOURCE_URL` | AULACBOT's public repository. Shown as "Source code" on every About screen (AGPL §13). Default in upstream points at agentes.chat. |
| `PUBLIC_URL` | The instance's public base URL; drives sign-in callbacks, invitation links and the allowed browser origin |
| `APP_VERSION` | The deploy's version, reported by `GET /api/instance` and `/api/health` |
| `TERMS_URL`, `PRIVACY_URL` | Linked on sign-in/sign-up and served at `/terms`, `/privacy` |
| `EMAIL_FROM` | Sender of transactional email; default is derived from `HOST` |
| `ALLOW_SIGNUP` | Keep `false` on any internet-reachable instance |
| `OWNER_CLAIM_SHA256`, `OWNER_KEY_SHA256` | First-owner claim paths |
| `TELEMETRY`, `TELEMETRY_URL` | Anonymous daily usage report to agentes.chat — **decide whether AULACBOT keeps it on** |
| `FEEDBACK_RELAY`, `FEEDBACK_URL` | Sends in-app feedback to the agentes.chat team — **decide whether AULACBOT keeps it on** |
| `DESKTOP_RELEASES_REPO`, `DESKTOP_RELEASES_TOKEN` | Which GitHub repo serves desktop/native releases; upstream default is `agentes-chat/agentes-chat` |
| `PUSH_RELAY_URL` | Phone push relay; upstream default is agentes.chat's |
| `LANDING_URL` | Upstream landing page; enables waiting lists. Leave unset for AULACBOT unless replaced |

The telemetry, feedback-relay and release-repo defaults are the places where upstream identity
actually leaves a deployment. They are already configuration, so no source edit is required — but a
decision is required. See `docs/upstream/CUSTOMIZATION_REGISTRY.md`.

## Optional integrations

Grouped as upstream documents them. All optional; each is off unless set.

- **Sign-in**: `GOOGLE_CLIENT_ID`/`SECRET`, `GITHUB_CLIENT_ID`/`SECRET`, `APPLE_*`,
  `TURNSTILE_*`, `TRUSTED_PROXIES`
- **Mobile deep links**: `APPLE_TEAM_ID`, `APPLE_APP_BUNDLE_ID`, `ANDROID_APP_PACKAGE`,
  `ANDROID_APP_CERT_SHA256`
- **Agents and routing**: `ROUTER_*`, `TYPESAFE_API_KEY`, `AGENT_*`, `REFLECT_*`, `LEARN_*`,
  `SUMMARY_MODEL`, `PLATFORM_ANTHROPIC_API_KEY`, `MODEL_ENDPOINTS_PRIVATE`
- **Search**: `EMBEDDINGS_PROVIDER`, `VOYAGE_API_KEY`, `EMBEDDINGS_URL`, `EMBEDDINGS_API_KEY`
- **Email**: `MILLIONSEND_API_KEY`, `SMTP_URL`, `EMAIL_ART`, `EMAIL_REPLY_TO`
- **Connectors**: `COMPOSIO_*`, `CONNECTOR_*`, `MCP_CALLER_IDENTITY`
- **Push**: `FIREBASE_SERVICE_ACCOUNT`, `APNS_*`, `PUSH_SENDER`, `PUSH_RELAY_SERVE`, `WEB_PUSH`,
  `WEB_PUSH_VAPID_*`
- **Storage**: `FILES_DIR`, `S3_*`
- **Sandbox / computers**: `HOST_COMPUTER_TOKEN`, `MACHINE_PROVISIONING`
- **Operator API**: `OPERATOR_API_TOKEN`, `OPERATOR_API_READ_TOKEN`, `OPERATOR_API_PORT`
- **Billing hooks**: `BILLING_URL`, `BILLING_LINK_SECRET`, `BILLING_HOLD_NEW_WORKSPACES`
- **Observability**: `LOG_LEVEL`, `SENTRY_DSN`, `SENTRY_WEB_DSN`, `SENTRY_MOBILE_DSN`,
  `SENTRY_ENVIRONMENT`
- **Install/ops**: `HOST`, `PORT`, `WEB_DIR`, `RUN_MIGRATIONS_ON_BOOT`, `SERVER_ROLE`,
  `OUTBOX_*`, `SHUTDOWN_DELAY_MS`, `SUPPORT_EMAIL`, `OPS_REPORT_EMAIL`

Full prose for every variable is in `.env.example` (generated) and
`packages/config/src/schema.ts` (source).

## Secrets policy

- Never commit `.env`, credentials, tokens or provider keys.
- `.gitleaks.toml` exists at the root; keep it passing.
- Provider keys are encrypted per organization in the database and never returned to clients.

