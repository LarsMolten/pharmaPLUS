<?php

namespace App\Models\Panier;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class panier extends Model
{
    use HasFactory;

    protected $fillable = [
        'entree_detail_id',
        'article_id',
        'analyse_id',
        'service_id',
        'kit_id',
        'p_u_brut',
        'p_u_proposee',
        'qte',
        'montant_brut',
        'montant_proposee',
        'montant_ecart',
        'user_id'
    ];

}
