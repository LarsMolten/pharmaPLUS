<?php

namespace App\Http\Controllers\Echographie;

use Illuminate\Http\Request;
use App\Http\Requests\Analyse\AnalyseRequest;
use App\Http\Controllers\Controller;
use App\Models\Echographie\echographie;

class EchographieController extends Controller
{



    public function liste_echographie()
    {
        try {

            // Récupérer tous les analyse
            $echographies = echographie::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Nom d'echographie</th>
                        <th style='text-align: center;'>Prix Unitaire</th>
                        <th style='text-align: center;'>Date de modifiation</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= '<tbody>';
            foreach ($echographies as $echographie) {

                $th .= "<tr>
                            <td  style='width:5%'>{$echographie->id}</td>
                            <td  style='width:20%'>{$echographie->nom}</td>
                            <td class='format-prix-echo' style='width:20%' date-value='{$echographie->prix}'>{$echographie->prix}</td>
                            <td style='width:10%'>{$echographie->updated_at}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-nom='{$echographie->nom}'
                                                        data-prix='{$echographie->prix}'
                                                        id='ec_{$echographie->id}'
                                                        data-action='edit_echographie'
                                                         data-id='{$echographie->id}'>
                                <i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_echographie' data-id='{$echographie->id}'><i class='la la-trash-o'></i></a>
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

    public function ajout_echographie(Request $request){
        try {

            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prix' => 'required|numeric|min:0',
            ]);

            var_dump($validated);die();



            if($request->id_echographie != ""){
                $echographie = echographie::where('id', $request->id_echographie)->update($validated);
            }else{
            $echographie = echographie::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $echographie

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }

    }
















}
