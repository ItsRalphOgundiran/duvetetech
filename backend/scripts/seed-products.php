<?php
/**
 * Seed script — run via `wp eval-file scripts/seed-products.php`.
 * Creates product categories and ~20 placeholder products matching the
 * frontend demo catalog. Safe to re-run: skips products whose SKU exists.
 */

if (!class_exists('WooCommerce')) {
    WP_CLI::error('WooCommerce is not active.');
}

$categories = [
    'smartphones-tablets' => 'Smartphones & Tablets',
    'laptops-computers'   => 'Laptops & Computers',
    'accessories'         => 'Accessories',
    'gadgets'             => 'Gadgets',
    'networking'          => 'Networking',
];

$cat_ids = [];
foreach ($categories as $slug => $name) {
    $term = get_term_by('slug', $slug, 'product_cat');
    if (!$term) {
        $term = wp_insert_term($name, 'product_cat', ['slug' => $slug]);
        $cat_ids[$slug] = is_wp_error($term) ? 0 : $term['term_id'];
    } else {
        $cat_ids[$slug] = $term->term_id;
    }
}

// [name, slug, sku, price, sale_price, category_slug, featured, condition, grade, short_desc, attrs{name: options}]
$products = [
    ['Samsung Galaxy A55 5G (8GB/256GB)', 'samsung-galaxy-a55-5g', 'SAM-A55-256', 645000, 598000, 'smartphones-tablets', true, 'genuine', '', '6.6" Super AMOLED 120Hz, 50MP OIS camera, 5000mAh battery.', ['Brand' => ['Samsung'], 'Storage' => ['256GB'], 'RAM' => ['8GB']]],
    ['Tecno Camon 40 Pro (12GB/256GB)', 'tecno-camon-40-pro', 'TEC-C40P', 385000, null, 'smartphones-tablets', true, 'genuine', '', '108MP camera, 6.78" AMOLED, 5120mAh. Nigeria warranty.', ['Brand' => ['Tecno'], 'Storage' => ['256GB']]],
    ['Apple iPhone 15 (128GB) — Brand New', 'apple-iphone-15-128gb', 'APL-IP15-128', 1250000, null, 'smartphones-tablets', true, 'genuine', '', 'A16 Bionic, 48MP camera, USB-C. Sealed, 1-year warranty.', ['Brand' => ['Apple'], 'Storage' => ['128GB']]],
    ['Xiaomi Redmi Pad SE 11" (8GB/256GB)', 'xiaomi-redmi-pad-se', 'XIA-PADSE', 340000, 312000, 'smartphones-tablets', false, 'genuine', '', '11" 90Hz display, Snapdragon 680, quad speakers.', ['Brand' => ['Xiaomi']]],
    ['HP Pavilion 15 — Core i7, 16GB/512GB SSD', 'hp-pavilion-15-i7', 'HP-PAV15-I7', 1150000, null, 'laptops-computers', true, 'genuine', '', '13th-gen Intel Core i7, 15.6" FHD, backlit keyboard.', ['Brand' => ['HP'], 'Processor' => ['Intel Core i7'], 'RAM' => ['16GB']]],
    ['Lenovo ThinkPad E14 — Ryzen 5, 16GB/512GB', 'lenovo-thinkpad-e14', 'LEN-E14-R5', 1060000, 980000, 'laptops-computers', true, 'genuine', '', 'Business-grade durability, fingerprint reader, DOS.', ['Brand' => ['Lenovo'], 'Processor' => ['AMD Ryzen 5']]],
    ['Apple MacBook Air 13" M3 (8GB/256GB)', 'macbook-air-13-m3', 'APL-MBA-M3', 1780000, null, 'laptops-computers', true, 'genuine', '', 'Apple M3 chip, 18-hour battery, Midnight. Sealed.', ['Brand' => ['Apple'], 'Processor' => ['Apple M3']]],
    ['Dell OptiPlex 7010 Desktop — i5, 8GB/256GB (Refurb A)', 'dell-optiplex-7010-refurb', 'DEL-7010-REF', 385000, null, 'laptops-computers', false, 'refurbished', 'Grade A', 'Certified refurbished workstation, 6-month warranty.', ['Brand' => ['Dell']]],
    ['Anker PowerCore 20000mAh Power Bank', 'anker-powercore-20000', 'ANK-PC20K', 48000, 42000, 'accessories', true, 'genuine', '', '22.5W fast charge, dual USB, LED display.', ['Brand' => ['Anker']]],
    ['Apple 20W USB-C Power Adapter', 'apple-20w-usbc-adapter', 'APL-20W-USB', 28500, null, 'accessories', false, 'genuine', '', 'Genuine Apple fast charger.', ['Brand' => ['Apple']]],
    ['Samsung Galaxy Buds3 Pro', 'samsung-galaxy-buds3-pro', 'SAM-BUDS3P', 215000, null, 'accessories', true, 'genuine', '', 'ANC, 360 audio, wireless charging case.', ['Brand' => ['Samsung']]],
    ['Amazfit GTS 4 Smartwatch', 'amazfit-gts-4', 'AMZ-GTS4', 165000, 148000, 'accessories', false, 'genuine', '', '1.75" AMOLED, GPS, 8-day battery.', ['Brand' => ['Amazfit']]],
    ['DJI Mini 4K Drone', 'dji-mini-4k-drone', 'DJI-MINI4K', 720000, null, 'gadgets', true, 'genuine', '', '4K UHD camera, 31-min flight, under 249g.', ['Brand' => ['DJI']]],
    ['JBL Flip 6 Portable Speaker', 'jbl-flip-6', 'JBL-FLIP6', 180000, 165000, 'gadgets', true, 'genuine', '', 'IP67 waterproof, 12h playtime, PartyBoost.', ['Brand' => ['JBL']]],
    ['Logitech G502 HERO Gaming Mouse', 'logitech-g502-hero', 'LOG-G502', 78000, null, 'gadgets', false, 'genuine', '', '25K DPI sensor, 11 programmable buttons.', ['Brand' => ['Logitech']]],
    ['Amazon Echo Dot (5th Gen) Smart Speaker', 'amazon-echo-dot-5', 'AMZ-DOT5', 95000, null, 'gadgets', false, 'genuine', '', 'Alexa smart speaker, smart-home hub.', ['Brand' => ['Amazon']]],
    ['TP-Link Archer C6 AC1200 Router', 'tp-link-archer-c6', 'TPL-ARCHERC6', 68000, 62000, 'networking', true, 'genuine', '', 'Dual-band gigabit Wi-Fi, MU-MIMO, 4 antennas.', ['Brand' => ['TP-Link']]],
    ['MTN 5G MiFi Router (Unlocked)', 'mtn-5g-mifi-unlocked', 'MTN-5G-MIFI', 85000, null, 'networking', true, 'genuine', '', '5G/4G LTE, connects up to 32 devices.', ['Brand' => ['ZTE']]],
    ['Starlink Standard Kit (Gen 3)', 'starlink-standard-kit-gen3', 'STLK-GEN3', 980000, null, 'networking', false, 'genuine', '', 'High-speed satellite internet kit, nationwide.', ['Brand' => ['Starlink']]],
    ['TP-Link Deco M4 Mesh Wi-Fi (3-Pack)', 'tp-link-deco-m4-3pack', 'TPL-DECOM4', 205000, 185000, 'networking', false, 'genuine', '', 'Whole-home coverage up to 5,500 sq ft.', ['Brand' => ['TP-Link']]],
];

$created = 0;
foreach ($products as [$name, $slug, $sku, $price, $sale, $cat_slug, $featured, $condition, $grade, $desc, $attrs]) {
    if (wc_get_product_id_by_sku($sku)) {
        continue; // already seeded
    }
    $p = new WC_Product_Simple();
    $p->set_name($name);
    $p->set_slug($slug);
    $p->set_sku($sku);
    $p->set_status('publish');
    $p->set_regular_price((string) $price);
    if ($sale) {
        $p->set_sale_price((string) $sale);
    }
    $p->set_manage_stock(true);
    $p->set_stock_quantity(12);
    $p->set_stock_status('instock');
    $p->set_short_description($desc);
    $p->set_description($desc);
    $p->set_featured($featured);
    $p->set_category_ids([$cat_ids[$cat_slug]]);

    $wc_attrs = [];
    foreach ($attrs as $attr_name => $options) {
        $attr = new WC_Product_Attribute();
        $attr->set_name($attr_name);
        $attr->set_options($options);
        $attr->set_visible(true);
        $wc_attrs[] = $attr;
    }
    $p->set_attributes($wc_attrs);

    $p->update_meta_data('duvete_condition', $condition);
    if ($grade) {
        $p->update_meta_data('duvete_grade', $grade);
    }

    $p->save();
    $created++;
}

WP_CLI::success("Seeded {$created} products (" . count($products) . ' defined).');
