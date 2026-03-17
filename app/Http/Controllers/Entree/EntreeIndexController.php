<?php

namespace App\Http\Controllers\Entree;

use App\Http\Controllers\Controller;
use App\Http\Requests\EntreeIndex\StoreEntreeIndexRequest;
use App\Models\EntreeDetail\entree_detail;
use App\Models\EntreeIndex\entree_index;
use App\Models\pourcentage;
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


    public function liste_entreeIndex()
    {
        try {

            $entrees = entree_index::where('etat', 1)->orderBy('created_at', 'asc')->get();
            
            $pourcentage =  pourcentage::first();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>Referance</th>
                        <th style='text-align: center;'>Motif</th>
                        <th style='text-align: center;'>Nb d'article</th>
                        <th style='text-align: center;'>Montant d'achat</th>
                        <th style='text-align: center;'>Montant <span style='color: hsl(206, 100%, 67%)'>+$pourcentage->pourcentage %</span></th>
                        <th style='text-align: center;'>Montant estimé</th>
                        <th style='text-align: center;'>Date</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";
            foreach ($entrees as $entree) {

                //    natao tafara
                
                $stats = entree_detail::where('entree_indices_id', $entree->id)
                                        ->selectRaw('COUNT(*) as nb_article, SUM(montant_entree) as montant_total, SUM(montant_gain_brut) as montant_gain_brut, SUM(montant_gain_proposee) as montant_gain_proposee')
                                        ->first();
                                        
                $btn_supp = ($stats->nb_article == 0) ? "<a class='danger delete mr-1' data-action='delete_entree_index' data-id='{$entree->id}'  ><i class='la la-trash-o'></i></a>" : "";
                $montant_total = ($stats->montant_total)?? 0;
                $montant_gain_brut = ($stats->montant_gain_brut)?? 0;
                $montant_gain_proposee = ($stats->montant_gain_proposee)?? 0;
                $th .= "<tr>
                            <td  style='width:10%'>{$entree->ref_entree}</td>
                            <td style='width:20%'>{$entree->motif}</td>
                            <td  style='width:10%'>{$stats->nb_article}</td>
                            <td  style='width:10%' class='format-prix'>{$montant_total} Ar</td>
                            <td  style='width:10%' class='format-prix'>{$montant_gain_brut} Ar</td>
                            <td  style='width:10%' class='format-prix'>{$montant_gain_proposee} Ar</td>
                            <td  style='width:10%'>{$entree->created_at}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>

                             <a class='success mr-1' data-action='afficher_entree_detail' data-id='{$entree->id}'  ><i class='la la-list'></i></a>


                            <a class='primary edit mr-1' data-ref_entree='{$entree->ref_entree}'
                             data-motif='{$entree->motif}' 
                             id='en_{$entree->id}' data-action='edit_entree_index' data-id='{$entree->id}'><i class='la la-pencil-square-o'></i></a>

                             $btn_supp
                             
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



    public function ajout_entreeIndex(StoreEntreeIndexRequest $request)
    {
        try {

            $validated = $request->validated();

            if ($request->id_entreeIndex != "") {
                $entree = entree_index::where('id', $request->id_entreeIndex)->update($validated);
            } else {
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
}
