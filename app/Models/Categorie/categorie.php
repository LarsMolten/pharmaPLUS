<?php

namespace App\Models\Categorie;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class categorie extends Model
{
    use HasFactory;

    protected $fillable = [
       'nom_cat',
       'etat',
    ];
}
