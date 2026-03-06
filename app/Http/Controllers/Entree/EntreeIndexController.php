<?php

namespace App\Http\Controllers\Entree;

use App\Http\Controllers\Controller;
use App\Models\EntreeIndex\entree_index;
use Illuminate\Http\Request;

class EntreeIndexController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('entree.index');
    }


    public function liste_entreeIndex(){
        try {

            $entrees = entree_index::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Referance</th>
                        <th style='text-align: center;'>Nb d'article</th>
                        <th style='text-align: center;'>Motif</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .="<tbody>";
            foreach($entrees as $entree){

               

                $th .= "<tr>
                            <td  style='width:5%'>{$entree->id}</td>
                            <td  style='width:20%'>{$entree->ref_entree}</td>
                            <td  style='width:10%'>{$entree->nb_article}</td>
                            <td style='width:10%'>{$entree->motif}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-rer_entree='{$entree->ref_entree}'
                             data-motif='{$entree->motif}' 
                             id='en_{$entree->id}' data-action='edit_entree_index' data-id='{$entree->id}'><i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_entree_index' data-id='{$entree->id}'  ><i class='la la-trash-o'></i></a>
                        </tr>";
            }
            $th .="</tbody>";
            var_dump($th);die();



        return response()->json([
            'success' => true,
            'data' => $th
        ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }




}
