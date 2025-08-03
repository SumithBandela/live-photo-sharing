<?php
namespace App\Controllers;

use App\Models\PhotoModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class PhotoController extends ResourceController
{
    protected $modelName = 'App\Models\PhotoModel';
    protected $format = 'json';

    public function upload()
    {
        helper(['filesystem']);

        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->failUnauthorized('Authorization header missing or malformed.');
        }

        $token = str_replace('Bearer ', '', $authHeader);
        $jwtSecret = 'd6f7a94c5e1b8e81f842a87d72b7593f8434c5a4b9e5b0b30f2aebd5c4839c52';// replace with actual secret

        try {
            $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));
            $email = $decoded->email ?? null;
            if (!$email) {
                return $this->failUnauthorized("Email not found in token.");
            }

            $title = $this->request->getPost('title');
            $photos = $this->request->getFiles()['images'] ?? null;

            if (!$title || !$photos) {
                return $this->failValidationErrors("Missing album title or photo files.");
            }

            $targetDir = FCPATH . "images/{$email}/{$title}/";
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            $photoModel = new PhotoModel();
            $savedFiles = [];

            foreach ((is_array($photos) ? $photos : [$photos]) as $photo) {
                if ($photo->isValid() && !$photo->hasMoved()) {
                    $newName = $photo->getRandomName();
                    $photo->move($targetDir, $newName);

                    $photoModel->insert([
                        'album_title' => $title,
                        'img_src' => "images/{$email}/{$title}/{$newName}",
                        'email' => $email,
                    ]);

                    $savedFiles[] = $newName;
                }
            }

            return $this->respond([
                'status' => 'success',
                'message' => 'Photos uploaded successfully.',
                'uploaded' => $savedFiles
            ]);
        } catch (\Exception $e) {
            log_message('critical', 'Upload error: ' . $e->getMessage());
            return $this->failServerError("Upload failed: " . $e->getMessage());
        }
    }

     public function getPhotos()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $this->failUnauthorized('Missing or invalid token');
        }

        $token = $matches[1];
        try {
            $decoded = JWT::decode($token, new Key('d6f7a94c5e1b8e81f842a87d72b7593f8434c5a4b9e5b0b30f2aebd5c4839c52', 'HS256'));
            $email = $decoded->email;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }

        $title = $this->request->getGet('title');
        $photoModel = new \App\Models\PhotoModel();
        $photos = $photoModel
            ->where('email', $email)
            ->where('album_title', $title)
            ->findAll();

        return $this->respond([
            'status' => 'success',
            'photos' => $photos
        ]);
    }
}
