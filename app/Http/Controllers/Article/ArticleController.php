<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;

use App\Models\Article\article;
use App\Http\Requests\StorearticleRequest;
use App\Http\Requests\UpdatearticleRequest;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('article.index', [
            'articles' => article::all()
        ]);
    }

    // affichage de la liste des articles en json
    public function liste_article(){
        try {
            // Récupérer tous les articles
            $articles = article::all();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Designation</th>
                        <th style='text-align: center;'>Présentation</th>
                        <th style='text-align: center;'>Unité</th>
                        <th style='text-align: center;'>Stock</th>
                        <th style='text-align: center;'>Statut</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .="<tbody>";
            foreach($articles as $article){
                $th .= "<tr>
                            <td  style='width:5%'>{$article->id}</td>
                            <td  style='width:20%'>{$article->designation}</td>
                            <td  style='width:10%'>{$article->presentation}</td>
                            <td style='width:10%'>{$article->unite}</td>
                            <td style='width:10%'>{$article->stock}</td>
                            <td style='width:10%'>{$article->statut}</td>
                            <td style='width:10%'>ACTION</td>
                        </tr>";
            }
            $th .="</tbody>";

        return response()->json([
            'success' => true,
            'data' => $th
        ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorearticleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(article $article)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(article $article)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatearticleRequest $request, article $article)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(article $article)
    {
        //
    }
}
