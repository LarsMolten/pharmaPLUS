<?php

namespace App\Models\SortieDetail;

use App\Models\EntreeDetail\entree_detail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class sortie_detail extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_entree_detail',
        'sortie_indices_id',
        'qte_initial',
        'qte_sortie',
        'stock_restant_lot',
        'stock_dispo',
        'montant_perte',
        'isValide',
        'etat'
    ];

       public function entrees()
    {
        return $this->belongsTo(entree_detail::class, 'id_entree_detail');
    }
}
