<?php
namespace App\Controllers;

use App\Models\AlbumModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AlbumController extends ResourceController
{
    private $key = "your-secret-key";

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

        if (!$file->isValid()) {
            return $this->fail('Invalid image');
        }

        $newName = $file->getRandomName();
        $folderPath = FCPATH . 'images/' . $email;
        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }

        $file->move($folderPath, $newName);

        $albumModel = new AlbumModel();
        $albumModel->insert([
            'title' => $data['title'],
            'description' => $data['description'],
            'thumbnail' => $newName,
            'email' => $email
        ]);

        return $this->respondCreated(['success' => true, 'message' => 'Album created']);
    }

    public function getAlbums($email)
    {
        $albumModel = new AlbumModel();
        $albums = $albumModel->where('email', $email)->findAll();
        return $this->respond($albums);
    }
}