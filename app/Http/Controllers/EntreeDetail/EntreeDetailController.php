<?php

namespace App\Http\Controllers\EntreeDetail;


use App\Http\Controllers\Controller;
use App\Models\EntreeDetail\entree_detail;
use App\Models\Article\article;
use Illuminate\Http\Request;

class EntreeDetailController extends Controller
{




    public function liste_entreeDetail(){
        try {

            $entrees = entree_detail::where('etat', 1)->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>#</th>
                        <th style='text-align: center;'>REF-Article</th>
                        <th style='text-align: center;'>Présentation</th>
                        <th style='text-align: center;'>Lot</th>
                        <th style='text-align: center;'>Stock Initial</th>
                        <th style='text-align: center;'>Qté entrée</th>
                        <th style='text-align: center;'>Stock dispo</th>
                        <th style='text-align: center;'>Prix en Boite</th>
                        <th style='text-align: center;'>Prix Unitaire</th>
                        <th style='text-align: center;'>Montant</th>
                        <th style='text-align: center;'>Nb Lot</th>
                        <th style='text-align: center;'>Date de péremption</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .="<tbody>";
            foreach($entrees as $entree){


                $article = article::with('unite')->where('etat', 1)->find($entree->article_id);
                $presentaion = "{$article->nomUnite}/{$article->presentation}";

                $btn_delete = (($entree->isValide) == 0) ? "<a class='danger delete mr-1' data-action='delete_entree_index' data-id='{$entree->id}'  ><i class='la la-trash-o'></i></a>" : "";


                $th .= "<tr>
                            <td  style='width:5%'>{$entree->id}</td>
                            <td  style='width:20%'>REF-{$entree->article_id}</td>
                            <td  style='width:10%'>{$presentation}</td>
                            <td style='width:10%'>{$entree->lot}</td>
                            <td style='width:10%'>{$entree->qte_initial}</td>
                            <td style='width:10%'>{$entree->qte_entree}</td>
                            <td style='width:10%'>{$entree->stock_dispo}</td>
                            <td style='width:10%'>{$entree->prix_achat_boite}</td>
                            <td style='width:10%'>{$entree->prix_unitaire}</td>
                            <td style='width:10%'>{$entree->montant_entree}</td>
                            <td style='width:10%'>{$entree->nb_lot_dispo}</td>
                            <td style='width:10%'>{$entree->date_permeption}</td>
                            <td style='width:10%'>{$entree->lot}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>

                        <a class='primary edit mr-1'
                             id='en_{$entree->id}' data-action='edit_entree_article' data-id='{$entree->id}'><i class='la la-pencil-square-o'></i></a>

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

}
