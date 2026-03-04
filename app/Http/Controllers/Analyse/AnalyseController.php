<?php

namespace App\Http\Controllers\Analyse;

use App\Http\Controllers\Controller;
use App\Models\Analyse\analyse;
use App\Http\Requests\Analyse\AnalyseRequest;
use Illuminate\Http\Request;

class AnalyseController extends Controller
{

    /**
     * Display a listing of the resource.
     */


    public function liste_analyse()
    {
        try {

            // Récupérer tous les analyse
            $analyses = analyse::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Nom d'analyse</th>
                        <th style='text-align: center;'>Prix Unitaire</th>
                        <th style='text-align: center;'>Date de modifiation</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= '<tbody>';
            foreach ($analyses as $analyse) {

                $th .= "<tr>
                            <td  style='width:5%'>{$analyse->id}</td>
                            <td  style='width:20%'>{$analyse->nom}</td>
                            <td class='format-prix' style='width:20%' >{$analyse->prix}</td>
                            <td style='width:10%'>{$analyse->updated_at}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-nom='{$analyse->nom}'
                                                        data-prix='{$analyse->prix}'
                                                        id='an_{$analyse->id}'
                                                        data-action='edit_analyse'
                                                         data-id='{$analyse->id}'>
                                <i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_analyse' data-id='{$analyse->id}'><i class='la la-trash-o'></i></a>
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


     public function ajout_analyse(AnalyseRequest $request){
        try {

            $validated = $request->validated();
            // var_dump($validated);die();

            if($request->id_analyse != ""){
                $analyse = analyse::where('id', $request->id_analyse)->update($validated);
            }else{
            $analyse = analyse::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $analyse

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }

     // suppression d'un analyse
    public function delete_analyse(Request $request){
        try {
             $analyse = analyse::where('id', $request->id_analyse)->update(['etat' => 0]);

                return response()->json([
                    'status' => "success",
                    'data' => $analyse
                ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
