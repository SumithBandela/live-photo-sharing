<?php
namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends ResourceController
{
    private $key = "your-secret-key";

    public function register()
    {
        $data = $this->request->getJSON();

        if (!isset($data->name, $data->email, $data->password)) {
            return $this->fail('Missing fields');
        }

        $userModel = new UserModel();

        if ($userModel->where('email', $data->email)->first()) {
            return $this->fail('Email already exists');
        }

        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

        $userModel->insert([
            'name' => $data->name,
            'email' => $data->email,
            'password' => $hashedPassword
        ]);

        // Create folder: public/images/{email}
        $folderPath = FCPATH . 'images/' . $data->email;
        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }

        return $this->respondCreated(['success' => true, 'message' => 'User registered']);
    }

    public function login()
    {
        $data = $this->request->getJSON();
        $email = $data->email ?? '';
        $password = $data->password ?? '';

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Invalid credentials');
        }

        $payload = [
            'sub' => $user['id'],
            'email' => $user['email'],
            'iat' => time(),
            'exp' => time() + 86400
        ];

        $token = JWT::encode($payload, $this->key, 'HS256');

        return $this->respond([
            'success' => true,
            'token' => $token,
            'email' => $user['email'],
            'name' => $user['name']
        ]);
    }
}
