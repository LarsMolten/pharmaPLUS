<?php

namespace App\Http\Controllers\DetailKit;

use App\Http\Controllers\Controller;
use App\Http\Requests\DetailKit\StoreDetailKitRequest;
use App\Models\Article\article;
use App\Models\DetailKit\detailKit;
use App\Models\Kit\kit;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;

class DetailKitController extends Controller
{


    public function liste_detailkit()
    {
        try {

            // Récupérer tous les articles
            $detailkits = detailKit::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Kit</th>
                        <th style='text-align: center;'>Article</th>
                        <th style='text-align: center;'>Quantité</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";
            foreach ($detailkits as $detailkit) {

                $kits = kit::find($detailkit->id_kit);
                if($kits){
                    $kit_id = $kits->id;
                    $kit_nom = $kits->nom_kit;
                }

                $articles = article::find($detailkit->id_article);
                if($articles){
                    $art_designation = $articles->designation;
                    $art_id = $articles->id;
                }


                $th .= "<tr>
                            <td  style='width:5%'>{$detailkit->id}</td>
                            <td  style='width:20%'>{$kit_nom}</td>
                            <td  style='width:20%'>{$art_designation}</td>
                            <td  style='width:10%'>{$detailkit->qte_kit}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-kit='{$kit_id}'
                             data-article='{$art_id}'  data-qte_kit='{$detailkit->qte_kit}'
                             id='dk_{$detailkit->id}' data-action='edit_detailkit' data-id='{$detailkit->id}'><i class='la la-pencil-square-o'></i></a>

                            <a class='danger delete mr-1' data-action='delete_service' data-id='{$detailkit->id}' ><i class='la la-trash-o'></i></a>
                            </td>
                        </tr>";
            }
            $th .= "</tbody>";


            return response()->json([
                'success' => true,
                'data' => $th
            ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }

    public function charge_kit()
    {
        try {

            $kits = kit::where('etat', 1)->get();

            $kt = "";

            foreach ($kits as $kit) {
                $kt .= "<option value='{$kit->id}'>{$kit->nom_kit}</option>";
            }
            // var_dump($cat);die();

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

    public function charge_article()
    {
        try {

            $articles = article::where('etat', 1)->get();

            $art = "";

            foreach ($articles as $article) {
                $art .= "<option value='{$article->id}'>{$article->designation}</option>";
            }
            // var_dump($cat);die();

            return response()->json([
                'success' => true,
                'data' => $art
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function ajout_detailkit(StoreDetailKitRequest $request)
    {
        try {

            $validated = $request->validated();

            // var_dump($validated);
            // die();
            if ($request->id_service != "") {
                $detailkit = detailKit::where('id', $request->id_service)->update($validated);
            } else {
                $detailkit = detailKit::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $detailkit

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
