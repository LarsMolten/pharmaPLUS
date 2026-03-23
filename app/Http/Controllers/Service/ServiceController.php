<?php

namespace App\Http\Controllers\Service;


use App\Http\Controllers\Controller;

use App\Models\Service\service;
use App\Models\Categorie\categorie;
use Illuminate\Http\Request;

class ServiceController extends Controller
{


    public function liste_service(){
        try {

            // Récupérer tous les articles
            $services = service::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Catégories</th>
                        <th style='text-align: center;'>Services</th>
                        <th style='text-align: center;'>Prix</th>
                        <th style='text-align: center;'>Date</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .="<tbody>";
            foreach($services as $service){

                $categorie = categorie::find($service->categorie_id);
                if($categorie){
                    $cat_id = $categorie->id;
                    $cat_nom = $categorie->nom_cat;
                }


                $th .= "<tr>
                            <td  style='width:5%'>{$service->id}</td>
                            <td  style='width:20%'>{$cat_nom}</td>
                            <td  style='width:20%'>{$service->nom_service}</td>
                            <td  style='width:10%' class='format-prix'>{$service->prix_service} Ar</td>
                            <td  style='width:10%' >{$service->created_at}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-categorie='{$cat_id}'
                             data-service='{$service->nom_service}'  data-prix='{$service->prix_service}'
                             id='ser_{$service->id}' data-action='edit_service' data-id='{$service->id}'><i class='la la-pencil-square-o'></i></a>

                            <a class='danger delete mr-1' data-action='delete_service' data-id='{$service->id}' ><i class='la la-trash-o'></i></a>
                        </tr>";
            }
            $th .="</tbody>";
            // var_dump($th);die();



        return response()->json([
            'success' => true,
            'data' => $th
        ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }


     public function charge_categorie(){
        try {

            $categories = categorie::where('etat', 1)->get();

            $cat = "";

            foreach($categories as $categorie){
                $cat .= "<option value='{$categorie->id}'>{$categorie->nom_cat}</option>";
            }
            // var_dump($cat);die();

            return response()->json([
                'success' => true,
                'data' => $cat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
     public function charge_service(){
        try {

            $services = service::where('etat', 1)->get();

            $sr = "";

            foreach($services as $service){
                $sr .= "<option data-prix='{$service->prix_service}' value='{$service->id}'>{$service->nom_service} ........................<span style='text-align: right; !important'>{$service->prix_service} Ar</span></option>";
            }
            // var_dump($cat);die();

            return response()->json([
                'success' => true,
                'data' => $sr
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


     public function ajout_service(Request $request){
        try {

             $validated = $request->validate([
                'categorie_id' => 'required|exists:categories,id',
                'nom_service' => 'required|string|max:255',
                'prix_service' => 'required|numeric|min:0',
            ]);

            if($request->id_service != ""){
                // var_dump($validated);die();
                $service = service::where('id', $request->id_service)->update($validated);
            }else{
            $service = service::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $service

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }

      // suppression d'un article
    public function delete_service(Request $request){
        try {
             $service = service::where('id', $request->id_service)->update(['etat' => 0]);

                return response()->json([
                    'status' => "success",
                    'data' => $service
                ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }


}
