<?php

namespace App\Models\Vente;

use App\Models\Consultation\consultation;
use App\Models\detail_ventes;
use App\Models\User;
use App\Models\Vente_detail\vente_detail;
use App\Models\VenteDetail\VenteDetail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class vente extends Model
{
    use HasFactory;
    public $timestamps = true;

    protected $fillable = [
        'reference_vente',
        'user_id',
        'client',
        'montant_brut',
        'montant_proposee',
        'montant_ecart',
        'montant_paye',
        'monnaie',
        'mode_paiement'

    ];

    public function details()
    {
        return $this->hasMany(VenteDetail::class, 'vente_id');
    }

    public function consultation()
    {
        return $this->hasMany(consultation::class, 'vente_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
