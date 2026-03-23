<?php

namespace App\Http\Controllers\Kit;


use App\Http\Controllers\Controller;
use App\Models\Kit\kit;
use Illuminate\Http\Request;

class KitController extends Controller
{


    public function liste_kit()
    {
        try {

            // Récupérer tous les kit
            $kits = kit::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Nom du Kit</th>
                        <th style='text-align: center;'>Prix</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= '<tbody>';
            foreach ($kits as $kit) {

                $th .= "<tr>
                            <td  style='width:5%'>{$kit->id}</td>
                            <td  style='width:20%'>{$kit->nom_kit}</td>
                            <td class='format-prix' style='width:20%' >{$kit->prix_kit} Ar</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-nom_kit='{$kit->nom_kit}'
                                                        data-prix_kit='{$kit->prix_kit}'
                                                        id='kit_{$kit->id}'
                                                        data-action='edit_kit'
                                                         data-id='{$kit->id}'>
                                <i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_kit' data-id='{$kit->id}'><i class='la la-trash-o'></i></a>
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


    public function ajout_kit(Request $request)
    {
        try {

            $validated = $request->validate([
                'nom_kit' => 'required|string|max:255',
                'prix_kit' => 'required|numeric|min:0',
            ]);

            if ($request->id_kit != "") {
                $kit = kit::where('id', $request->id_kit)->update($validated);
            } else {
                $kit = kit::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $kit

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }

     public function charge_kit(){
        try {

            $kits = kit::where('etat', 1)->get();

            $kt = "";

            foreach($kits as $kit){
                $kt .= "<option data-prix='{$kit->prix_kit}' value='{$kit->id}'>{$kit->nom_kit} ........................<span style='text-align: right; !important'>{$kit->prix_kit} Ar</span></option>";
            }

            return response()->json([
                'success' => true,
                'data' => $kt
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function delete_kit(Request $request){
        try {
             $kit = kit::where('id', $request->id_kit)->update(['etat' => 0]);

                return response()->json([
                    'status' => "success",
                    'data' => $kit
                ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }



}
