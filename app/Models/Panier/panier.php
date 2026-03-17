<?php

namespace App\Models\Panier;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class panier extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'analyse_id',
        'service_id',
        'kit_id',
        'p_u',
        'qte',
        'montant',
        'user_id'
    ];

}
