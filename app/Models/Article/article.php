<?php

namespace App\Models\Article;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Unite\unite;


class article extends Model
{
    use HasFactory;

    protected $fillable = [
        'designation',
        'presentation',
        'unite',
        'stock',
        'seuil',
        'statut',
        'etat',
    ];


     public function uniteRelation()
    {
        return $this->belongsTo(unite::class,'unite');
    }
}
