<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;

use App\Models\Article\article;
use App\Models\Unite\unite;
use App\Http\Requests\Article\StorearticleRequest;
use App\Http\Requests\Article\UpdatearticleRequest;

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
                            <td style='width:10%'>{$article->statut}</td> ";

                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-designation='{$article->designation}'
                             data-presentation='{$article->presentation}'  data-unite='{$article->unite}'
                             id='art_{$article->id}' onclick='edit_article({$article->id})'><i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' onclick='delete_article({$article->id})' ><i class='la la-trash-o'></i></a>
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

    // affichage de la liste des unités en json
    public function charge_unite(){
        try {

            $unites = unite::all();
            // var_dump($unites);

            $un = "";

            foreach($unites as $unite){
                $un .= "<option value='{$unite->id}'>{$unite->nom}</option>";
            }

            return response()->json([
                'success' => true,
                'data' => $un
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ajout d'un article
    public function ajout_article(StorearticleRequest $request){
        try {


            $validated = $request->validated();
            $article = article::create($validated);

            return response()->json([
                'status' => "success",
                'data' => $article
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
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
