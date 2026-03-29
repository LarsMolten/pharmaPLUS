<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class personnels extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'fonction',
        'contact',
    ];

   
}
