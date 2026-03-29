<?php

namespace App\Models\VenteDetail;

use App\Models\Article\article;
use App\Models\Vente\vente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenteDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'vente_id',
        'article_id',
        'entree_detail_id',
        'consultation_id',
        'service_id',
        'analyse_id',
        'kit_id',
        'prix_unitaire',
        'qte',
        'montant'
    ];


     public function venteRelation()
    {
        return $this->belongsTo(vente::class,'vente_id');
    }

     public function article()
    {
        return $this->belongsTo(article::class, 'article_id');
    }
}
