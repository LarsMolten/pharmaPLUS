<?php

namespace App\Models\Unite;

use App\Models\Article\article;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class unite extends Model
{
    use HasFactory;

    protected $table = 'unites';

    protected $fillable = [
        'nomUnite',
        'nomComplet',
        'supun'

    ];

    public function articles()
    {
        return $this->hasMany(article::class,'unite');
    }

}
