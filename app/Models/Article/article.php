<?php

namespace App\Models\Article;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class article extends Model
{
    use HasFactory;

    protected $fillable = [
        'designation',
        'presentation',
        'unite',
        'stock',
        'statut',
        'etat',
    ];
}
