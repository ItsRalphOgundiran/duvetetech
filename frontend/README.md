# Duvete Technologies — Storefront (Next.js)

The entire customer-facing site. Fully custom React UI — no WordPress rendering.
Data comes from the WooCommerce Store API (public reads) and Next.js API routes
(privileged writes via WooCommerce REST v3).

## Commands

```bash
npm run dev    # dev server (turbopack)
npm run build  # production build
npm run start  # serve production build
npm run lint   # eslint
```

## Environment

Copy `.env.example` → `.env`. With `WOOCOMMERCE_API_URL` unset the app runs in
demo mode using `src/lib/demo-data.ts` (same catalog the backend seeds).

| Variable | Used for |
|---|---|
| `WOOCOMMERCE_API_URL` | base URL of the WordPress backend |
| `WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET` | REST v3 auth — server-side only |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack popup |
| `PAYSTACK_SECRET_KEY` | server-side payment verification |
| `SMTP_*` / `QUOTE_NOTIFY_EMAIL` | corporate quote form email |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` etc. | contact details across the site |

## Code map

- `src/lib/catalog.ts` — catalog reads (Store API → demo fallback)
- `src/lib/woo-server.ts` — order create/lookup/mark-paid (REST v3, server only)
- `src/lib/demo-data.ts` — demo catalog (mirrors `backend/scripts/seed-products.php`)
- `src/lib/cart-context.tsx`, `wishlist-context.tsx` — client state (localStorage)
- `src/lib/site.ts` — business constants, delivery zones
- `src/components/` — all UI; `home/`, `product/`, `shop/`, `cart/`, `checkout/`, `layout/`
- `src/app/api/` — search, orders, verify, track, quote, newsletter routes
- `src/app/` — pages: `/`, `/shop`, `/category/[slug]`, `/product/[slug]`, `/cart`,
  `/checkout`, `/checkout/success`, `/track-order`, `/corporate`, `/about`,
  `/contact`, `/faq`, `/wishlist`, `/account`

## Brand tokens

Tailwind theme in `src/app/globals.css` (`@theme`): `brand` #1652F0, `navy`
#0B1739, `amber` #FFB020 (CTAs only), `bg` #F7F8FA, `ink` #1A1D29, `trust`
#1FAA59. Font: Sora (next/font).
