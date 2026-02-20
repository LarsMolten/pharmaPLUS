<?php

namespace App\Models\Unite;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class unite extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
    ];
}
