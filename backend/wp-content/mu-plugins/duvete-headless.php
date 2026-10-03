<?php
/**
 * Plugin Name: Duvete Headless
 * Description: Turns this WordPress install into an API-only backend for the
 *              Duvete Technologies Next.js storefront. Handles CORS for the
 *              storefront origin and disables all public theme rendering.
 * Version:     1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The public storefront origin. Configure via wp-config.php:
 *   define('DUVETE_STOREFRONT_URL', 'https://duvetetech.com');
 */
if (!defined('DUVETE_STOREFRONT_URL')) {
    $env = getenv('DUVETE_STOREFRONT_URL');
    define('DUVETE_STOREFRONT_URL', $env ? rtrim($env, '/') : '*');
}

/* --------------------------------------------------------------------------
 * 1. CORS — let the Next.js storefront (separate domain) call the REST/Store APIs
 * ------------------------------------------------------------------------ */
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = DUVETE_STOREFRONT_URL === '*' ? '*' : DUVETE_STOREFRONT_URL;
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, Cart-Token');
        header('Access-Control-Expose-Headers: Cart-Token, X-WP-Total, X-WP-TotalPages');
        if (DUVETE_STOREFRONT_URL !== '*') {
            header('Access-Control-Allow-Credentials: true');
        }
        return $value;
    });
}, 15);

// Answer preflight requests early.
add_action('init', function () {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS' && isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        $origin = DUVETE_STOREFRONT_URL === '*' ? '*' : DUVETE_STOREFRONT_URL;
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, Cart-Token');
        status_header(204);
        exit;
    }
});

/* --------------------------------------------------------------------------
 * 2. Headless — no public-facing theme output. Anything that isn't wp-admin,
 *    wp-login, wp-json, wp-cron or a media/asset file gets redirected to the
 *    storefront (or a 404 JSON if no storefront URL is set).
 * ------------------------------------------------------------------------ */
add_action('template_redirect', function () {
    $uri = $_SERVER['REQUEST_URI'] ?? '/';

    // Allow API, admin, login, cron, and uploaded media files through.
    $allowed = ['wp-json', 'wp-admin', 'wp-login.php', 'wp-cron.php', 'wp-content/uploads'];
    foreach ($allowed as $frag) {
        if (strpos($uri, $frag) !== false) {
            return;
        }
    }

    if (defined('DUVETE_STOREFRONT_URL') && DUVETE_STOREFRONT_URL !== '*') {
        wp_redirect(DUVETE_STOREFRONT_URL, 301);
        exit;
    }

    status_header(404);
    wp_send_json(['message' => 'Duvete Technologies API. This site is headless — visit the storefront.'], 404);
});

/* --------------------------------------------------------------------------
 * 3. Expose custom product meta (condition, refurb grade) on the Store API so
 *    the frontend can render "Genuine" / "Refurbished Grade X" badges.
 * ------------------------------------------------------------------------ */
add_action('init', function () {
    if (!function_exists('woocommerce_store_api_register_endpoint_data')) {
        return;
    }
    woocommerce_store_api_register_endpoint_data([
        'endpoint'        => \Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::IDENTIFIER,
        'namespace'       => 'duvete',
        'data_callback'   => function ($product) {
            return [
                'condition' => $product->get_meta('duvete_condition') ?: 'genuine',
                'grade'     => $product->get_meta('duvete_grade') ?: '',
            ];
        },
        'schema_callback' => function () {
            return [
                'condition' => ['type' => 'string'],
                'grade'     => ['type' => 'string'],
            ];
        },
        'schema_type'     => ARRAY_A,
    ]);
});

/* --------------------------------------------------------------------------
 * 4. Register the meta keys as REST-visible so they can be managed from
 *    Woo admin / REST writes if needed.
 * ------------------------------------------------------------------------ */
add_action('init', function () {
    foreach (['duvete_condition', 'duvete_grade'] as $key) {
        register_post_meta('product', $key, [
            'type'         => 'string',
            'single'       => true,
            'show_in_rest' => true,
        ]);
    }
});
