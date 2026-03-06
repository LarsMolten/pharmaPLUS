<?php

namespace App\Models\DetailKit;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class detailKit extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_kit',
        'id_article',
        'qte_kit',
        'etat'
    ];
}
