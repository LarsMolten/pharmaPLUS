<?php

namespace App\Http\Controllers\Gestion;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class GestionController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('gestion.index');
    }
}
