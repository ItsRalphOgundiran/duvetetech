#!/usr/bin/env bash
#
# Duvete Technologies — WordPress/WooCommerce headless backend provisioner.
#
# Usage (with the bundled docker-compose):
#   docker compose up -d
#   bash scripts/provision.sh
#
# On a managed WordPress host instead of Docker, run the wp-cli commands
# directly (the script auto-detects: if `docker compose` works it uses the
# `cli` service, otherwise it expects `wp` on PATH inside the WP directory).
#
set -euo pipefail
cd "$(dirname "$0")/.."

WP_URL="${WP_URL:-http://localhost:8080}"
ADMIN_USER="${WP_ADMIN_USER:-admin}"
ADMIN_PASS="${WP_ADMIN_PASS:-admin123}"
ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@duvetetech.com}"
STOREFRONT_URL="${DUVETE_STOREFRONT_URL:-http://localhost:3000}"

if docker compose version >/dev/null 2>&1; then
  WP() { docker compose exec -T cli wp "$@"; }
  echo ">> Using docker compose cli service"
else
  WP() { wp "$@"; }
  echo ">> Using wp-cli on PATH"
fi

echo ">> Waiting for WordPress…"
until WP core is-installed 2>/dev/null || curl -sf "$WP_URL" >/dev/null; do sleep 3; done

# 1. Core install (idempotent)
if ! WP core is-installed 2>/dev/null; then
  WP core install --url="$WP_URL" --title="Duvete Technologies API" \
    --admin_user="$ADMIN_USER" --admin_password="$ADMIN_PASS" --admin_email="$ADMIN_EMAIL" --skip-email
fi

# 2. Plugins: WooCommerce + JWT auth
WP plugin install woocommerce jwt-authentication-for-wp-rest-api --activate

# 3. Headless theme + permalinks + NGN currency
WP theme activate duvete-headless
WP rewrite structure '/%postname%/' --hard
WP option update woocommerce_currency NGN
WP option update woocommerce_default_country "NG:LA"
WP option update woocommerce_store_address "123 Tech Avenue"
WP option update woocommerce_store_city "Ikeja"
WP option update woocommerce_store_postcode "100001"
WP option update woocommerce_price_num_decimals 0
WP option update blogdescription "Headless commerce API for Duvete Technologies"
# discourage search engines — the WP site is not the public site
WP option update blog_public 0

# 4. Shipping zones (Lagos same-day, Lagos next-day, Abuja, nationwide, pickup)
wp_shipping_zone() {
  WP wc shipping_zone create --name="$1" --user="$ADMIN_USER" 2>/dev/null \
    | grep -oE '[0-9]+' | tail -1 || true
}

echo ">> Configuring shipping zones…"
ZID_LAGOS_SD=$(wp_shipping_zone "Lagos — Same Day")
ZID_LAGOS_ND=$(wp_shipping_zone "Lagos — Next Day")
ZID_ABUJA=$(wp_shipping_zone "Abuja")
ZID_NAT=$(wp_shipping_zone "Nationwide")
for spec in "$ZID_LAGOS_SD flat_rate 3500" "$ZID_LAGOS_ND flat_rate 2000" "$ZID_ABUJA flat_rate 4500" "$ZID_NAT flat_rate 5500"; do
  set -- $spec
  [ -n "${1:-}" ] && WP wc shipping_zone_method create "$1" --method_id=flat_rate --user="$ADMIN_USER" \
    --settings="{\"cost\":\"$3\",\"title\":\"Delivery\"}" || true
done
WP wc shipping_zone_method create 0 --method_id=local_pickup --user="$ADMIN_USER" \
  --settings='{"title":"Store pickup — Ikeja"}' || true

# 5. Seed catalog (categories + products)
echo ">> Seeding products…"
WP eval-file /scripts/seed-products.php

# 6. WooCommerce REST API key (read/write) for the Next.js server routes
echo ">> Creating WooCommerce API key…"
WP eval-file /scripts/create-api-key.php --user="$ADMIN_USER"

# 7. JWT secret reminder
cat <<'EOF'

=================================================================
 DONE — headless backend provisioned.

 Admin panel:        ${WP_URL}/wp-admin   (${ADMIN_USER} / ${ADMIN_PASS})
 Store API:          ${WP_URL}/wp-json/wc/store/v1
 REST API v3:        ${WP_URL}/wp-json/wc/v3   (consumer key printed above)

 IMPORTANT: add the JWT secret to wp-config.php for JWT auth plugin:
   define('JWT_AUTH_SECRET_KEY', '<long random string>');

 Copy the consumer key/secret printed above into frontend/.env:
   WOOCOMMERCE_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET
=================================================================
EOF
