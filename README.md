# Duvete Technologies — Headless E-Commerce

Decoupled store for a Lagos-based gadget, computer & accessories retailer.

```
duvetetech/
├── backend/    WordPress + WooCommerce — admin panel + APIs only (headless)
└── frontend/   Next.js 16 storefront — the entire customer-facing experience
```

## Architecture

```
Browser ──► Next.js storefront (Vercel/Node host)
              │  public reads (no secrets)
              ├──► WooCommerce Store API  /wp-json/wc/store/v1  (products, categories)
              │
              │  server-side only (consumer key/secret in env)
              └──► Next.js API routes ──► WooCommerce REST v3   /wp-json/wc/v3
                          │                  (orders, order status, mark paid)
                          └──► Paystack verify  api.paystack.co

WordPress (separate host) ── /wp-admin for catalog/orders/stock; no public pages
```

- **Catalog reads** — the frontend calls the public **WooCommerce Store API**
  (`products`, `products/categories`) server-side with ISR (60s revalidation).
- **Cart** — client-side (localStorage) for instant UX; at checkout the order is
  created server-side through **REST API v3** with the consumer key/secret, so
  WooCommerce owns inventory and order records. (The Store API cart is
  cookie/session-bound and awkward cross-domain; this keeps secrets server-side.)
- **Payments** — Paystack Inline JS in the checkout; on success the Next.js
  `/api/orders/verify` route verifies the transaction with Paystack and marks
  the WooCommerce order `processing`. Pay on Delivery is a built-in second option.
- **Order tracking** — `/track-order` looks up the order via REST v3, gated by
  billing-email match.

## Run the frontend

```bash
cd frontend
cp .env.example .env   # fill in later — works standalone in demo mode
npm install
npm run dev            # http://localhost:3000
```

**Demo mode:** with `WOOCOMMERCE_API_URL` unset, the storefront serves the
bundled 20-product demo catalog and simulates checkout — so the site is fully
usable before WordPress is deployed.

## Run the backend

See `backend/README.md`. TL;DR:

```bash
cd backend
docker compose up -d
bash scripts/provision.sh   # installs WP + WooCommerce, seeds catalog, prints API keys
```

Then set in `frontend/.env`:

```
WOOCOMMERCE_API_URL=https://your-wp-domain.com
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
```

## How the two parts connect

| Concern | Endpoint | Auth |
|---|---|---|
| Products/categories/search | `GET /wp-json/wc/store/v1/...` | none (public) |
| Order create / status / mark-paid | `GET|POST|PUT /wp-json/wc/v3/orders` | consumer key + secret (server env) |
| Payment | Paystack Inline + `/transaction/verify` | public key client-side, secret server-side |

CORS and headless behaviour are handled by `backend/wp-content/mu-plugins/duvete-headless.php`.

## Managing content

- **Products, prices, stock, images, categories** — WP Admin → WooCommerce.
  Changes appear on the storefront within ~60s (ISR revalidation).
- **Homepage hero/banners** — hardcoded in the frontend for speed:
  `frontend/src/components/home/Hero.tsx` (hero copy/CTA),
  `frontend/src/components/layout/Header.tsx` (top promo bar),
  `frontend/src/components/home/CorporateBanner.tsx` and `NewsletterBlock.tsx`.
- **Delivery zones shown at checkout** — `frontend/src/lib/site.ts`
  (`DELIVERY_ZONES`); keep in sync with WooCommerce shipping zones.
- **Contact details / WhatsApp number** — env vars (`NEXT_PUBLIC_WHATSAPP_NUMBER`
  etc.) or defaults in `frontend/src/lib/site.ts`.
- **FAQ content** — `frontend/src/app/faq/page.tsx`.

## Paystack go-live

1. Get keys from https://dashboard.paystack.com → Settings → API Keys.
2. In `frontend/.env`: set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (pk_live_…) and
   `PAYSTACK_SECRET_KEY` (sk_live_…). Redeploy.
3. Checkout will then open the real Paystack popup and verify server-side.

## Deployment (two separate targets)

- **Frontend** → Vercel (recommended) or any Node host (`npm run build && npm start`).
  Set all env vars from `.env.example`.
- **Backend** → any WordPress-capable host (cPanel/shared with WP, or a VPS
  running the provided `backend/docker-compose.yml`). Needs: HTTPS domain
  (e.g. `api.duvetetech.com`), MySQL, PHP 8.1+. Point `WOOCOMMERCE_API_URL` at it,
  and set `DUVETE_STOREFRONT_URL` on the WP side to the frontend domain for CORS.
