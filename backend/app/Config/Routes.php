<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->options('auth/login', function () {
    return service('response')
        ->setStatusCode(200)
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

$routes->options('auth/signup', function () {
    return service('response')
        ->setStatusCode(200)
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});


$routes->post('auth/login', 'Auth::login');
$routes->post('auth/signup', 'Auth::signup');