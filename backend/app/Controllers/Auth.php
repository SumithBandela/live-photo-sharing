<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth extends ResourceController
{
    private $key;

    public function __construct()
    {
        $this->key = getenv('JWT_SECRET') ?? 'your_default_jwt_secret_key'; // Put this in your .env
        helper(['form']);
    }

    public function signup()
    {
        $data = $this->request->getJSON(true); // Accept JSON body

        $rules = [
            'name'     => 'required',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validateData($data, $rules)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'messages' => $this->validator->getErrors()
            ], 400);
        }

        $userModel = new UserModel();
        $userModel->save([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
        ]);

        return $this->respondCreated([
            'status'  => 201,
            'error'   => false,
            'message' => 'User registered successfully'
        ]);
    }

    public function login()
    {
        $data = $this->request->getJSON(true); // Accept JSON body

        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validateData($data, $rules)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'messages' => $this->validator->getErrors()
            ], 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $data['email'])->first();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            return $this->respond([
                'status'  => 401,
                'error'   => true,
                'message' => 'Invalid email or password'
            ], 401);
        }

        $payload = [
            'iat'   => time(),
            'exp'   => time() + 3600, // Token expires in 1 hour
            'uid'   => $user['id'],
            'email' => $user['email'],
        ];

        $token = JWT::encode($payload, $this->key, 'HS256');

        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'message' => 'Login successful',
            'token'   => $token
        ]);
    }

    public function changePassword()
    {
        // Get JWT from Authorization header
        $authHeader = $this->request->getHeaderLine('Authorization');

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $this->respond([
                'status' => 401,
                'error' => true,
                'message' => 'Authorization token not found'
            ], 401);
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            $userId = $decoded->uid;
        } catch (\Exception $e) {
            return $this->respond([
                'status' => 401,
                'error' => true,
                'message' => 'Invalid or expired token'
            ], 401);
        }

        $data = $this->request->getJSON(true); // Accept JSON body

        $rules = [
            'old_password' => 'required',
            'new_password' => 'required|min_length[6]',
        ];

        if (!$this->validateData($data, $rules)) {
            return $this->respond([
                'status' => 400,
                'error' => true,
                'messages' => $this->validator->getErrors()
            ], 400);
        }

        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user || !password_verify($data['old_password'], $user['password'])) {
            return $this->respond([
                'status' => 401,
                'error' => true,
                'message' => 'Old password is incorrect'
            ], 401);
        }

        $userModel->update($userId, [
            'password' => password_hash($data['new_password'], PASSWORD_DEFAULT)
        ]);

        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'message' => 'Password changed successfully'
        ]);
    }

    public function sendOtp()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? '';

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user) {
            return $this->respond(['status' => 404, 'message' => 'Email not found'], 404);
        }

        $otp = rand(100000, 999999);
        $expires = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        // Save OTP
        $userModel->update($user['id'], [
            'otp_code' => $otp,
            'otp_expires' => $expires
        ]);

        // Send email
        $emailService = \Config\Services::email();
        $emailService->setTo($email);
        $emailService->setSubject('OTP for Password Reset');
        $emailService->setMessage("Your OTP code is: $otp. It will expire in 10 minutes.");
        $emailService->send();

        return $this->respond(['status' => 200, 'message' => 'OTP sent to email']);
    }

    public function verifyOtp()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? '';
        $otp = $data['otp'] ?? '';

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user || $user['otp_code'] !== $otp) {
            return $this->respond(['status' => 401, 'message' => 'Invalid OTP'], 401);
        }

        if (strtotime($user['otp_expires']) < time()) {
            return $this->respond(['status' => 410, 'message' => 'OTP expired'], 410);
        }

        return $this->respond(['status' => 200, 'message' => 'OTP verified']);
    }
    
    public function resetPassword()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? '';
        $newPassword = $data['new_password'] ?? '';

        if (strlen($newPassword) < 6) {
            return $this->respond(['status' => 400, 'message' => 'Password too short'], 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user) {
            return $this->respond(['status' => 404, 'message' => 'User not found'], 404);
        }

        $userModel->update($user['id'], [
            'password' => password_hash($newPassword, PASSWORD_DEFAULT),
            'otp_code' => null,
            'otp_expires' => null
        ]);

        return $this->respond(['status' => 200, 'message' => 'Password reset successfully']);
    }

}
