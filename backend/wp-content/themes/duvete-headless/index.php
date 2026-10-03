<?php
// Headless install — the duvete-headless mu-plugin redirects/404s all public
// traffic before this file is reached. This fallback exists for safety.
status_header(404);
header('Content-Type: application/json');
echo wp_json_encode(['message' => 'Duvete Technologies API. This site is headless.']);
