<?php

namespace App\Http\Controllers\SortieDetail;

use App\Http\Controllers\Controller;
use App\Models\SortieDetail\sortie_detail;
use Illuminate\Http\Request;

class SortieDetailController extends Controller
{
      public function liste_sortieDetail(Request $request)
    {
        try {

            $details = sortie_detail::with('entrees', 'entrees.article')->where([['etat', 1], ['sortie_indices_id', $request->id_index_sortie]])->orderBy('created_at', 'desc')->get();
            // dd($details);


            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>#</th>
                        <th style='text-align: center;'>REF</th>
                        <th style='text-align: center;'>Designation</th>
                        <th style='text-align: center;'>Présentation</th>
                        <th style='text-align: center;'>Lot</th>
                        <th style='text-align: center;'>Stock Initial</th>
                        <th style='text-align: center;'>Qté sortie</th>
                        <th style='text-align: center; background-color: rgba(240, 240, 241, 0.75)'>Stock restant (Lot)</th>
                        <th style='text-align: center; background-color: rgb(200, 200, 215)'>Stock dispo global</th>
                        <th style='text-align: center;'>Prix en Boite</th>
                        <th style='text-align: center;'>Prix Unitaire</th>
                        <th style='text-align: center; color: red;'>Montant Perte</th>
                        <th style='text-align: center;'>Date de péremption</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";
            $a = 1;
            foreach ($details as $d) {


                $btn_supp = ($d->isValide == 0) ? "<a class='danger delete mr-1' data-action='delete_sortie_detail' data-id='{$d->id}'  ><i class='la la-trash-o'></i></a>" : "";
                // $montant_total = ($stats->montant_total)?? 0;

                $th .= "<tr>
                            <td  style='width:10%'>{$a}</td>
                            <td  style='width:10%'>REF-{$d->entree->article->id}</td>
                            <td  style='width:10%'>{$d->entree->article->designation}</td>
                            <td  style='width:10%'>{$d->entree->article->presentation}</td>
                            <td  style='width:10%'>{$d->entree->lot}</td>
                            <td  style='width:10%'>{$d->stock_initial}</td> 
                            <td  style='width:10%'>{$d->qte_sortie}</td> 
                            <td style='width:10%'>{$d->stock_restant_lot}</td>
                            <td style='width:10%'>{$d->stock_dispo}</td>
                            <td  style='width:10%'class='format-prix'>{$d->entree->prix_achat_boite} A</td>
                            <td  style='width:10%'class='format-prix'>{$d->entree->prix_unitaire} Ar</td>
                            <td  style='width:10%' class='format-prix'>{$d->montant_perte} Ar</td>
                            <td  style='width:10%'class='format-prix'>{$d->entree->date_peremption}</td>
                            <td  style='width:10%'>{$d->created_at}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>


                            <a class='primary edit mr-1' 
                             data-motif='{$d->id}' 
                             id='srd_{$d->id}' data-action='edit_sortie_detail' data-id='{$d->id}'><i class='la la-pencil-square-o'></i></a>

                            $btn_supp
                             
                        </tr>";
                        $a++;
            }
            $th .= "</tbody>";

         


            return response()->json([
                'success' => true,
                'data' => $th,
            
            ]);
        } catch (\Exception $th) {
            return response()->json($th, 500);
        }
    }

}
