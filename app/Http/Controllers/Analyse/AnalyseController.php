<?php

namespace App\Http\Controllers\Analyse;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class AnalyseController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('gestion.index');
    }
}
