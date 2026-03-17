<?php

namespace App\Models\EntreeDetail;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class entree_detail extends Model
{
    use HasFactory;

    protected $fillable = [
        'entree_indices_id',
        'article_id',
        'lot',
        'qte_initial',
        'qte_entree',
        'stock_restant_lot',
        'stock_dispo',
        'prix_achat_boite',
        'prix_unitaire',
        'pu_proposee',
        'montant_entree',
        'montant_gain_brut',
        'montant_gain_proposee',
        'nb_lot_dispo',
        'date_peremption',
        'isValide',
        'isVandus',
        'etat'

    ];
}
