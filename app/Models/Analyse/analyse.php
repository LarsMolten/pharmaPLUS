<?php

namespace App\Models\Analyse;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class analyse extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prix',
        'etat',
    ];
}
