<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Production origins first, then local dev servers.
    'allowed_origins' => [
        // Production frontend (Vercel). aidesk.space 307-redirects to www,
        // so www is the origin browsers actually send, but keep both.
        'https://www.aidesk.space',
        'https://aidesk.space',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:8081',
        'http://127.0.0.1:8081',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Token auth, not cookie auth - no credentials needed on the wire.
    'supports_credentials' => false,
];
