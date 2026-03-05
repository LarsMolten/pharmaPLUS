<?php

namespace App\Http\Controllers\Categorie;


use App\Http\Controllers\Controller;

use App\Models\Categorie\categorie;


use Illuminate\Http\Request;

class CategorieController extends Controller
{



    public function liste_categorie()
    {
        try {

            // Récupérer tous les analyse
            $categories = categorie::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Nom catégorie</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= '<tbody>';
            foreach ($categories as $categorie) {

                $th .= "<tr>
                            <td  style='width:5%'>{$categorie->id}</td>
                            <td  style='width:20%'>{$categorie->nom_cat}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-nom='{$categorie->nom_cat}'
                                                        id='cat_{$categorie->id}'
                                                        data-action='edit_categorie'
                                                         data-id='{$categorie->id}'>
                                <i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_categorie' data-id='{$categorie->id}'><i class='la la-trash-o'></i></a>
                        </tr>";
            }
            $th .= '</tbody>';
            // var_dump($th);die();

            return response()->json([
                'success' => true,
                'data' => $th,
            ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }


     public function ajout_categorie(Request $request){
        try {


            $validated = $request->validate([
                'nom_cat' => 'required|string|max:255',
            ]);


            if($request->id_categorie != ""){
                $categorie = categorie::where('id', $request->id_categorie)->update($validated);
            }else{
            $categorie = categorie::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $categorie

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }


     public function delete_categorie(Request $request){
        try {
             $categorie = categorie::where('id', $request->id_categorie)->update(['etat' => 0]);

                return response()->json([
                    'status' => "success",
                    'data' => $categorie
                ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }





}
