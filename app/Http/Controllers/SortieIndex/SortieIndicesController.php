<?php

namespace App\Http\Controllers\SortieIndex;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\SortieIndex\SortieIndexRequest;
use App\Models\SortieIndex\sortie_indices;


class SortieIndicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('SortieIndex.index');
    }



    public function liste_sortieIndex()
    {
        try {

            $sorties = sortie_indices::where('etat', 1)->orderBy('created_at', 'asc')->get();



            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>Referance</th>
                        <th style='text-align: center;'>Motif</th>
                        <th style='text-align: center;'>Nb d'article</th>
                        <th style='text-align: center;'>Montant perte</th>
                        <th style='text-align: center;'>Date</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";
            foreach ($sorties as $sortie) {

                //    natao tafara

                // $stats = entree_detail::where('entree_indices_id', $entree->id)
                //                         ->selectRaw('COUNT(*) as nb_article, SUM(montant_entree) as montant_total, SUM(montant_gain_brut) as montant_gain_brut, SUM(montant_gain_proposee) as montant_gain_proposee')
                //                         ->first();

                $btn_supp = ($sortie->nb_article <= 0) ? "<a class='danger delete mr-1' data-action='delete_sortie_index' data-id='{$sortie->id}'  ><i class='la la-trash-o'></i></a>" : "";
                // $montant_total = ($stats->montant_total)?? 0;

                $th .= "<tr>
                            <td  style='width:10%'>{$sortie->ref_sortie}</td>
                            <td style='width:20%'>{$sortie->motif}</td>
                            <td  style='width:10%'>{$sortie->nb_article}</td>
                            <td  style='width:10%' class='format-prix'>{$sortie->montant_total} Ar</td>
                            <td  style='width:10%'>{$sortie->created_at}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>

                             <a class='success mr-1' data-action='afficher_sortie_detail' data-id='{$sortie->id}'  ><i class='la la-list'></i></a>


                            <a class='primary edit mr-1' data-ref_sortie='{$sortie->ref_sortie}'
                             data-motif='{$sortie->motif}' 
                             id='sr_{$sortie->id}' data-action='edit_sortie_index' data-id='{$sortie->id}'><i class='la la-pencil-square-o'></i></a>

                            $btn_supp
                             
                        </tr>";
            }
            $th .= "</tbody>";

            $opt = "
                    <option value='ajustement'>Ajustement</option>
                    <option value='perte'>Perte</option>";



            return response()->json([
                'success' => true,
                'data' => $th,
                'option' => $opt
            ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }


    public function ajout_sortie_index(SortieIndexRequest $request)
    {
        try {

            $validated = $request->validated();
            if ($request->id_index_sortie != "") {
                $sortie = sortie_indices::where('id', $request->id_index_sortie)->update($validated);
            } else {
                $sortie = sortie_indices::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $sortie

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }


     public function delete_sortie_index(Request $request)
    {
        try {
            $sortie = sortie_indices::where('id', $request->id_index_sortie)->update(['etat' => 0]);

            return response()->json([
                'status' => "success",
                'data' => $sortie
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
