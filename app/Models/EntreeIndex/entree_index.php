<?php

namespace App\Models\EntreeIndex;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class entree_index extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_entree',
        'motif',
        'nb_article',
        'montant_total',
        'etat'
    ];
}
