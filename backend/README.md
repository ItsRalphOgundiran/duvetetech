# Duvete Technologies — Headless Backend (WordPress + WooCommerce)

This WordPress install is **API-only**. It renders no customer-facing pages — the
storefront is the separate Next.js app in `../frontend`. WordPress is used purely
for product/order/inventory management (`/wp-admin`) and to expose the
WooCommerce REST & Store APIs.

## Quick start (Docker)

Requires Docker. If you host WordPress on a managed host instead, skip to
"Manual install" below — only the `wp-content/` files and plugin choices matter.

```bash
cd backend
docker compose up -d
bash scripts/provision.sh
```

The provision script will:

1. Install WordPress (admin/admin123 — change via `WP_ADMIN_USER`/`WP_ADMIN_PASS` env)
2. Install & activate **WooCommerce** and **JWT Authentication for WP REST API**
3. Activate the blank `duvete-headless` theme and set pretty permalinks
4. Set currency to **NGN**, store address to Ikeja Lagos, discourage indexing
5. Create shipping zones (Lagos same-day ₦3,500 / next-day ₦2,000, Abuja ₦4,500,
   nationwide ₦5,500, free store pickup)
6. Seed 5 categories + 20 sample products
7. Generate a WooCommerce REST API consumer key/secret — **copy these into
   `frontend/.env`** (printed once at the end)

## What's configured

| Piece | Where |
|---|---|
| CORS for the storefront origin | `wp-content/mu-plugins/duvete-headless.php` |
| Blocks public theme rendering (redirects to storefront) | same file |
| `Genuine`/`Refurbished` product meta exposed on Store API | same file (`duvete_condition`, `duvete_grade` meta keys) |
| Blank active theme | `wp-content/themes/duvete-headless/` |

Set the storefront origin via `DUVETE_STOREFRONT_URL` in `docker-compose.yml`
(or `define('DUVETE_STOREFRONT_URL', '...')` in wp-config.php). Default `*`.

## JWT auth

The JWT plugin is installed for any future authenticated endpoints (customer
accounts). Add to `wp-config.php`:

```php
define('JWT_AUTH_SECRET_KEY', 'a-long-random-string');
```

Note: the current frontend flow does not require JWT — the catalog/cart use the
public Store API, and order writes go through the Next.js server which holds the
WooCommerce consumer key/secret server-side.

## Endpoints used by the frontend

- `GET /wp-json/wc/store/v1/products` — catalog (public)
- `GET /wp-json/wc/store/v1/products/categories` — categories (public)
- `POST /wp-json/wc/v3/orders` — order creation (consumer key, server-side only)
- `GET /wp-json/wc/v3/orders/:id` — order status (server-side only)
- `PUT /wp-json/wc/v3/orders/:id` — mark paid after Paystack verification

## Managing the store

Everything catalog-related lives in **WP Admin → WooCommerce**:

- **Products → All Products** — add/edit products, upload photos (they appear on
  the frontend automatically via the API, optimized through next/image)
- **Products → Categories** — add/remove categories (they appear as homepage tiles)
- **WooCommerce → Settings → Shipping** — edit delivery zones/fees
- **WooCommerce → Orders** — manage orders created by the storefront
- **Products → (a product) → Custom fields** — set `duvete_condition` to
  `refurbished` and `duvete_grade` (e.g. `Grade A`) to show the green badges

## Manual install (managed WP host)

1. Install WordPress normally
2. Copy `wp-content/mu-plugins/duvete-headless.php` and
   `wp-content/themes/duvete-headless/` into your site's `wp-content`
3. Install WooCommerce + JWT Authentication plugins, activate
4. Activate the Duvete Headless theme, set permalinks to "Post name"
5. WooCommerce → Settings → Advanced → REST API → create a read/write key
6. Run `scripts/seed-products.php` via wp-cli if you want the sample catalog:
   `wp eval-file scripts/seed-products.php`
