# Task: Recreate 20 lost files (APIs + pages) for DROPES agent platform

## Environment Setup Notes (IMPORTANT)
- The user said "prisma/schema.prisma has models: Order, OrderItem, Agent, AgentClick, Lead, LeadEvent, AgentPromotion, AgentPayout" — but the actual schema only had `User` and `Post`. I had to ADD those models for the API routes to work.
- The user said "PostgreSQL" — but the dev sandbox only ships SQLite (db/custom.db). I switched the datasource to `sqlite` and set `DATABASE_URL="file:./db/custom.db"` in `.env.local`. Without this, every DB-backed route would crash at runtime.
- Schema was pushed with `bun run db:push` — confirmed working.
- Installed `bcryptjs` + `@types/bcryptjs` for password hashing.

## Design Style
- Brutalist: black bg (#0A0A0A), red (#FF1744), yellow (#FFDE00)
- Plus Jakarta Sans (display), Space Grotesk (mono), Inter (body)
- 2.5px solid borders, `4px 4px 0px black` shadows, uppercase text
- I used inline styles in page components (matches the pattern in cart-interactions.tsx) because the `bg-brand-*` / `brutal-border` utility classes referenced by some components are NOT defined in tailwind.config.ts. Inline styles guarantee consistent rendering.

## File Inventory Created
1. src/app/api/checkout/route.ts — POST creates order (v1 REST → v2 GraphQL → local DB fallback), GET api status
2. src/app/api/orders/route.ts — GET lists, PATCH updates status
3. src/app/api/mcp/route.ts — JSON-RPC 2.0 MCP server (8 tools)
4. src/app/api/opportunity/route.ts — GET opportunity card JSON
5. src/app/api/agents/register/route.ts — POST register agent
6. src/app/api/agents/login/route.ts — POST login + cookie
7. src/app/api/agents/me/route.ts — GET profile+stats / POST logout
8. src/app/api/agents/leads/route.ts — GET leads / PATCH status
9. src/app/api/leads/capture/route.ts — POST capture lead events
10. src/app/api/cron/sync-pending/route.ts — POST cron sync pending orders
11. src/app/api/cron/recover-leads/route.ts — POST cron recover leads
12. src/app/api/products/sync/route.ts — POST sync catalog / GET status
13. src/proxy.ts — Next.js proxy (ref detection, click tracking)
14. src/app/agentes/page.tsx — agent landing
15. src/app/agentes/registro/page.tsx — register form
16. src/app/agentes/login/page.tsx — login form
17. src/app/agentes/dashboard/page.tsx — dashboard (Suspense for useSearchParams)
18. src/app/opportunity/page.tsx — opportunity page
19. src/app/admin/pedidos/page.tsx — admin orders
20. src/app/admin/productos/page.tsx — admin products

All API routes use Prisma `db` client. MCP server reads products.json. All cookie names match spec ("dropes_agent_ref", "dropes_agent_token").
