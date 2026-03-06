<?php

namespace App\Models\Kit;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class kit extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_kit',
        'prix_kit',
        'etat'
    ];
}
