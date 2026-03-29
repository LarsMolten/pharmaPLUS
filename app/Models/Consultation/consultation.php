<?php

namespace App\Models\Consultation;

use App\Models\personnels;
use App\Models\Vente\vente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'vente_id',
        'nom_patient',
        'sex_patient',
        'age_patient',
        'unite_age',
        'type_docteur',
        'docteur'
    ];


    public function venteConsultRelation()
    {
        return $this->belongsTo(vente::class,'vente_id');
    }

   public function docteurInfo()
{
    return $this->belongsTo(personnels::class, 'docteur');
}
}
