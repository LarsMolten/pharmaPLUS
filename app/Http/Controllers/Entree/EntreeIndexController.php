<?php

namespace App\Http\Controllers\Entree;

use App\Http\Controllers\Controller;
use App\Http\Requests\EntreeIndex\StoreEntreeIndexRequest;
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


    // generation auto de lot
    // $lotSystem = strtoupper(substr($medicament->designation,0,4))
    //         ."-".date('Ymd')
    //         ."-".rand(10,99);


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


                $btn_delete = (($entree->nb_article) == 0) ? "<a class='danger delete mr-1' data-action='delete_entree_index' data-id='{$entree->id}'  ><i class='la la-trash-o'></i></a>" : "";


                $th .= "<tr>
                            <td  style='width:5%'>{$entree->id}</td>
                            <td  style='width:20%'>{$entree->ref_entree}</td>
                            <td  style='width:10%'>{$entree->nb_article}</td>
                            <td style='width:10%'>{$entree->motif}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>

                        <a class='success mr-1' data-action='afficher_entree_detail' data-id='{$entree->id}'  ><i class='la la-list'></i></a>

                        <a class='primary edit mr-1' data-ref_entree='{$entree->ref_entree}'
                             data-motif='{$entree->motif}'
                             id='en_{$entree->id}' data-action='edit_entree_index' data-id='{$entree->id}'><i class='la la-pencil-square-o'></i></a>

                            $btn_delete
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



    public function ajout_entreeIndex(StoreEntreeIndexRequest $request){
        try {

            $validated = $request->validated();

            if($request->id_entreeIndex != ""){
                $entree = entree_index::where('id', $request->id_entreeIndex)->update($validated);
            }else{
            $entree = entree_index::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $entree

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }


      public function delete_entree_index(Request $request){
        try {
             $entree = entree_index::where('id', $request->id_index)->update(['etat' => 0]);

                return response()->json([
                    'status' => "success",
                    'data' => $entree
                ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }




}
