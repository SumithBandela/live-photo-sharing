<?php

namespace App\Controllers;

use App\Models\AlbumModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AlbumController extends ResourceController
{
    private $key;

    public function __construct()
    {
        $this->key ='d6f7a94c5e1b8e81f842a87d72b7593f8434c5a4b9e5b0b30f2aebd5c4839c52';  // use only one consistent key source
    }

    private function generateSlug($title)
    {
        $baseSlug = preg_replace('/[^a-z0-9]+/i', '-', strtolower(trim($title)));
        $timestamp = time();
        $randomStr = substr(md5(uniqid()), 0, 5);
        return "{$baseSlug}-{$randomStr}-{$timestamp}";
    }

    public function addAlbum()
    {
        // Token decode
        $authHeader = $this->request->getHeaderLine("Authorization");

        if (!$authHeader || !str_contains($authHeader, 'Bearer ')) {
            return $this->failUnauthorized('Missing or invalid Authorization header');
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            $email = $decoded->email;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token: ' . $e->getMessage());
        }

        // Form data
        $data = $this->request->getPost();
        $file = $this->request->getFile('thumbnail');

        if (!$file || !$file->isValid()) {
            return $this->failValidationErrors('Invalid or missing thumbnail image');
        }

        // File upload
        $newName = $file->getRandomName();
        $folderPath = FCPATH . 'images/' . $email;

        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }

        if (!$file->move($folderPath, $newName)) {
            return $this->fail('Failed to upload thumbnail');
        }

        // Insert into DB
        $albumModel = new AlbumModel();
        $slug = $this->generateSlug($data['title']);

        $insertData = [
            'title'       => $data['title'],
            'description' => $data['description'],
            'thumbnail'   => 'images/' . $email . '/' . $newName,
            'email'       => $email,
            'slug'        => $slug,
            'download'    => $data['download'] ?? 0,
            'is_visible'  => $data['isVisible'] ?? 1  // match DB column name
        ];

        if (!$albumModel->insert($insertData)) {
            return $this->failServerError('Failed to create album');
        }

        return $this->respondCreated([
            'status'  => 'success',
            'message' => 'Album created successfully',
            'slug'    => $slug
        ]);
    }

    public function getAlbums()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $this->respond(['success' => false, 'message' => 'Token not provided'], 401);
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            $email = $decoded->email;

            $albumModel = new AlbumModel();
            $albums = $albumModel->where('email', $email)->findAll();

            return $this->respond(['success' => true, 'albums' => $albums]);
        } catch (\Exception $e) {
            return $this->respond(['success' => false, 'message' => 'Invalid token: ' . $e->getMessage()], 401);
        }
    }
}
