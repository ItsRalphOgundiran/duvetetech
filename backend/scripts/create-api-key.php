<?php
/**
 * Creates a WooCommerce REST API key (read/write) for the Next.js server and
 * prints the credentials. Run via `wp eval-file create-api-key.php`.
 */

global $wpdb;

$wpdb->hide_errors();

$consumer_key    = 'ck_' . wc_rand_hash();
$consumer_secret = 'cs_' . wc_rand_hash();
$user = get_users(['role' => 'administrator', 'number' => 1]);
$user_id = $user ? $user[0]->ID : 1;

$wpdb->insert(
    $wpdb->prefix . 'woocommerce_api_keys',
    [
        'user_id'         => $user_id,
        'description'     => 'Duvete Next.js storefront',
        'permissions'     => 'read_write',
        'consumer_key'    => wc_api_hash($consumer_key),
        'consumer_secret' => $consumer_secret,
        'truncated_key'   => substr($consumer_key, -7),
    ],
    ['%d', '%s', '%s', '%s', '%s', '%s']
);

if (!$wpdb->insert_id) {
    WP_CLI::error('Could not create API key: ' . $wpdb->last_error);
}

WP_CLI::log('');
WP_CLI::log('==== WooCommerce API credentials (save these — shown once) ====');
WP_CLI::log('WOOCOMMERCE_API_URL=' . home_url());
WP_CLI::log('WC_CONSUMER_KEY=' . $consumer_key);
WP_CLI::log('WC_CONSUMER_SECRET=' . $consumer_secret);
WP_CLI::log('');
