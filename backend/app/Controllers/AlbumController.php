<?php

namespace App\Controllers;

use App\Models\AlbumModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AlbumController extends ResourceController
{
    private $key = "your-secret-key";

    private function generateSlug($title)
    {
        $baseSlug = preg_replace('/[^a-z0-9]+/i', '-', strtolower(trim($title)));
        $timestamp = time();
        $randomStr = substr(md5(uniqid()), 0, 5);
        return "{$baseSlug}-{$randomStr}-{$timestamp}";
    }

    public function addAlbum()
    {
        $authHeader = $this->request->getHeaderLine("Authorization");

        if (!$authHeader || !str_contains($authHeader, 'Bearer ')) {
            return $this->failUnauthorized('Missing or invalid Authorization header');
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            $email = $decoded->email;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }

        $data = $this->request->getPost();
        $file = $this->request->getFile('thumbnail');

        if (!$file || !$file->isValid()) {
            return $this->fail('Invalid or missing thumbnail image');
        }

        $newName = $file->getRandomName();
        $folderPath = FCPATH . 'images/' . $email;

        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }

        $file->move($folderPath, $newName);

        $albumModel = new AlbumModel();
        $slug = $this->generateSlug($data['title']);

        $insertData = [
            'title'       => $data['title'],
            'description' => $data['description'],
            'thumbnail'   => $newName,
            'email'       => $email,
            'slug'        => $slug,
            'download'    => $data['download'] ?? 0,
            'isVisible'   => $data['isVisible'] ?? 1
        ];

        $albumModel->insert($insertData);

        return $this->respondCreated([
            'status' => 'success',
            'message' => 'Album created successfully',
            'slug' => $slug
        ]);
    }

   public function getAlbums($email)
{
    $albumModel = new AlbumModel();
    $albums = $albumModel->where('email', urldecode($email))->findAll();

    if ($albums) {
        return $this->respond([
            'success' => true,
            'albums' => $albums
        ]);
    } else {
        return $this->respond([
            'success' => false,
            'message' => 'No albums found.'
        ]);
    }
}

}
