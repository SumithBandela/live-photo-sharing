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

$routes->options('auth/register', function () {
    return service('response')
        ->setStatusCode(200)
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});



$routes->post('auth/login', 'AuthController::login');
$routes->post('auth/register', 'AuthController::register');

$routes->group('api/albums', ['namespace' => 'App\Controllers'], function($routes) {
    $routes->post('add', 'AlbumController::addAlbum');  // POST /api/albums/add
    $routes->get('all', 'AlbumController::getAlbums');  // GET  /api/albums/all
});


$routes->get('api/photos', 'PhotoController::getPhotosByAlbum');
$routes->post('api/photos/upload', 'PhotosController::upload');
$routes->get('api/photos', 'PhotosController::getPhotos');



