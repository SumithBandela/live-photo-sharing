<?php
namespace App\Models;

use CodeIgniter\Model;

class PhotoModel extends Model
{
    protected $table = 'photos';
    protected $primaryKey = 'id';
    protected $allowedFields = ['album_title', 'img_src', 'created_at','email'];
    public $timestamps = true;
}
