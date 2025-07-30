<?php
namespace App\Models;

use CodeIgniter\Model;

class AlbumModel extends Model
{
    protected $table = 'albums';
    protected $primaryKey = 'id';
   protected $allowedFields = [
    'title',
    'description',
    'thumbnail',
    'email',
    'slug',
    'download',
    'isVisible'
    ];
    protected $useTimestamps = false;
}