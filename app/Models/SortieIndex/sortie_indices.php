<?php

namespace App\Models\SortieIndex;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class sortie_indices extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_sortie',
        'motif',
        'nb_article',
        'montant_total',
        'etat'
    ];

}
