<?php

namespace App\Models;

use CodeIgniter\Model;

class PhotosModel extends Model
{
    protected $table = 'photos';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'email',
        'album_title',
        'img_src',
        'is_visible',
        'created_at',
        'updated_at'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}