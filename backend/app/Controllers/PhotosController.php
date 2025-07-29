<?php
namespace App\Controllers;

use App\Models\PhotosModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use CodeIgniter\API\ResponseTrait;

class PhotosController extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';
    protected $photosModel;

    public function __construct()
    {
        $this->photosModel = new PhotosModel();
    }

    public function upload()
    {
        $token = $this->request->getHeaderLine('Authorization');
        if (!$token) {
            return $this->failUnauthorized('Missing token');
        }

        try {
            $key = getenv('JWT_SECRET');
            $decoded = JWT::decode(str_replace('Bearer ', '', $token), new Key($key, 'HS256'));
            $email = $decoded->email;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }

        $title = $this->request->getPost('title');
        if (!$title) {
            return $this->fail('Album title is required', 400);
        }

        $files = $this->request->getFiles();
        if (!isset($files['images'])) {
            return $this->fail('No images uploaded', 400);
        }

        $uploadDir = FCPATH . 'uploads/' . $email . '/' . $title . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $uploaded = [];

        foreach ($files['images'] as $image) {
            if ($image->isValid() && !$image->hasMoved()) {
                $name = $image->getRandomName();
                $image->move($uploadDir, $name);
                $imgPath = 'uploads/' . $email . '/' . $title . '/' . $name;

                $this->photosModel->insert([
                    'email' => $email,
                    'album_title' => $title,
                    'img_src' => $imgPath,
                    'is_visible' => 1,
                ]);

                $uploaded[] = $imgPath;
            }
        }

        return $this->respond([
            'status' => 'success',
            'message' => 'Images uploaded successfully!',
            'files' => $uploaded
        ]);
    }

    public function getPhotos()
    {
        $album = $this->request->getGet('album');
        $email = $this->request->getGet('email');

        if (!$email || !$album) {
            return $this->fail('Email and album are required', 400);
        }

        $images = $this->photosModel
            ->where('email', $email)
            ->where('album_title', $album)
            ->findAll();

        return $this->respond([
            'status' => 'success',
            'images' => $images
        ]);
    }
}
