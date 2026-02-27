<?php

namespace App\Models\Echographie;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class echographie extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'prix',
        'etat',
    ];
}
