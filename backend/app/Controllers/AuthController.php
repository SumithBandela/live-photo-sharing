<?php
namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use CodeIgniter\I18n\Time; // ✅ Add this line
use App\Models\OtpModel;
use CodeIgniter\API\ResponseTrait;
use Exception;
use CodeIgniter\Email\Email;
use Config\Services;

class AuthController extends ResourceController
{
    private $key = "d6f7a94c5e1b8e81f842a87d72b7593f8434c5a4b9e5b0b30f2aebd5c4839c52";

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

 
    public function sendOtp()
    {
        $data = $this->request->getJSON(true); // associative array
        $email = $data['email'] ?? null;

        if (!$email) {
            return $this->failValidationErrors('Email is required');
        }

        // Generate OTP
        $otp = random_int(100000, 999999);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+5 minutes'));

        // Save to database
        $model = new \App\Models\OtpModel();
        $model->insert([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => $expiresAt,
        ]);
        $emailService = \Config\Services::email();

        $emailService->setFrom('bandhelasumith@gmail.com', 'RS Photography'); // ✅ Set From here
        $emailService->setTo($email);
        $emailService->setSubject('Your OTP Code');
        $emailService->setMessage("Your OTP is: $otp. It is valid for 5 minutes.");

        if (!$emailService->send()) {
            log_message('error', $emailService->printDebugger(['headers', 'subject', 'body']));
            return $this->fail('Failed to send email');
        }

            return $this->respond(['message' => 'OTP sent successfully'], 200);
    }

  public function verifyOtp()
    {
        $data = $this->request->getJSON();
        $email = $data->email ?? '';
        $otp = $data->otp ?? '';

        if (!$email || !$otp) {
            return $this->fail('Email and OTP are required');
        }

        $otpModel = new \App\Models\OtpModel();
        $record = $otpModel
            ->where('email', $email)
            ->where('otp', $otp)
            ->where('expires_at >=', Time::now()->toDateTimeString())
            ->where('verified', 0)
            ->first();

        if (!$record) {
            return $this->fail('Invalid or expired OTP');
        }

        $otpModel->update($record['id'], ['verified' => 1]);

        return $this->respond(['success' => true, 'message' => 'OTP verified']);
    }


    public function resetPassword()
    {
        $data = $this->request->getJSON();
        $email = $data->email ?? '';
        $newPassword = $data->password ?? '';

        if (!$email || !$newPassword) {
            return $this->fail('Email and password are required');
        }

        $otpModel = new OtpModel();
        $record = $otpModel
            ->where('email', $email)
            ->where('verified', 1)
            ->orderBy('id', 'desc')
            ->first();

        if (!$record) {
            return $this->fail('OTP not verified');
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $userModel->update($user['id'], ['password' => $hashedPassword]);

        return $this->respond(['success' => true, 'message' => 'Password reset successful']);
    }
}
