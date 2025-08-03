<?php
namespace App\Models;

use CodeIgniter\Model;

class OtpModel extends Model
{
    protected $table = 'otps';
    protected $allowedFields = ['email', 'otp', 'expires_at', 'verified'];
    protected $useTimestamps = false;
}
