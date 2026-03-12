<?php

namespace App\Http\Controllers\EntreeDetail;


use App\Http\Controllers\Controller;
use App\Imports\EntreeDetailImport;
use App\Models\EntreeDetail\entree_detail;
use App\Models\Article\article;
use App\Models\EntreeIndex\entree_index;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use PhpParser\Node\Stmt\TryCatch;

class EntreeDetailController extends Controller
{




    public function liste_entreeDetail(Request $request)
    {
        try {



            $entrees = entree_detail::where('etat', 1)->where('entree_indices_id', $request->id_index)->orderby('entree_indices_id', 'desc')->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>#</th>
                        <th style='text-align: center;'>REF-Article</th>
                        <th style='text-align: center;'>Présentation</th>
                        <th style='text-align: center;'>Lot</th>
                        <th style='text-align: center;'>Stock Initial</th>
                        <th style='text-align: center;'>Qté entrée</th>
                        <th style='text-align: center;'>Stock restant</th>
                        <th style='text-align: center;'>Stock dispo global</th>
                        <th style='text-align: center;'>Prix en Boite</th>
                        <th style='text-align: center;'>Prix Unitaire</th>
                        <th style='text-align: center;'>Montant</th>
                        <th style='text-align: center;'>Date de péremption</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";

            $id_detail = 1;

            foreach ($entrees as $entree) {

                $presentation = "-";
                $quantite_initial = "0 / 0";
                $quantite_entree = "0 / 0";
                $stock_restant_lot = "0 / 0";
                $quantite_dispo_global = "0 / 0";

                $qt_i = $entree->qte_initial;
                $qt_e = $entree->qte_entree;
                $stock_rest = $entree->stock_restant_lot;
                $stock_d_g = $entree->stock_dispo;

                $article = article::with('uniteRelation')->where([
                                                        ['id', $entree->article_id],
                                                        ['etat', 1]
                                                    ])
                                                    ->first();
                if ($article) {

                    $pres_b = $article->presentation;

                    $presentation = ($article->uniteRelation->nomUnite == 'BT') ? "{$article->uniteRelation->nomUnite}/{$pres_b}" : $article->uniteRelation->nomUnite; // tokony ho BT/100 na Unité na Flacon na Tube

                    $boite_i = round($qt_i / $pres_b, 2); // à arrondisser 2 chiffre apres virgule s'il y a************************************
                    $quantite_initial = "{$boite_i} / {$qt_i}";

                    $boite_e = round($qt_e / $pres_b, 2); // à arrondisser 2 chiffre apres virgule s'il y a*************************************
                    $quantite_entree = "{$boite_e} / {$qt_e}";

                    $boite_rest_lot = round($stock_rest / $pres_b, 2);
                    $stock_restant_lot = "{$boite_rest_lot} / {$stock_rest}";

                    $boite_d_g = round($stock_d_g / $pres_b, 2); // à arrondisser 2 chiffre apres virgule s'il y a*************************************
                    $quantite_dispo_global = "{$boite_d_g} / {$stock_d_g}";
                }

                $btn_class = ($entree->isValide == 0) ? "success" : "danger";
                $i_class = ($entree->isValide == 0) ? "la la-check" : "la la-stop";
                $action_validation = ($entree->isValide == 0) ? "valider_entree_detail" : "annuler_entree_detail_validee";

                $btn_validation = ($entree->isVendus == 0) ? "<a class='{$btn_class}  mr-1' id='en_{$entree->id}' data-action='{$action_validation}' data-qte='{$quantite_entree}' data-id='{$entree->id}'><i class='{$i_class}'></i></a> " : "";


                $btn_delete = ($entree->isValide == 0) ? "<a class='danger delete mr-1' data-action='delete_entree_index' data-id='{$entree->id}'  ><i class='la la-trash-o'></i></a>" : "";

                $btn_edit = ($entree->isValide == 0) ? "<a class='primary edit mr-1' id='en_{$entree->id}' data-action='edit_entree_article' data-id='{$entree->id}'><i class='la la-pencil-square-o'></i></a>" : "";


                $th .= "<tr>
                            <td  style='width:5%'>{$id_detail}</td>
                            <td  style='width:10%'>REF-{$entree->article_id}</td>
                            <td  style='width:5%'>{$presentation}</td>
                            <td style='width:15%'>{$entree->lot}</td>
                            <td style='width:10%'>{$quantite_initial}</td>
                            <td style='width:10%'>{$quantite_entree}</td>
                            <td style='width:10%'>{$stock_restant_lot}</td>
                            <td style='width:10%'>{$quantite_dispo_global}</td>
                            <td style='width:10%' class='format-prix'>{$entree->prix_achat_boite} Ar</td>
                            <td style='width:10%' class='format-prix'>{$entree->prix_unitaire} Ar</td>
                            <td style='width:20%' class='format-prix'>{$entree->montant_entree} Ar</td>
                            <td style='width:10%'>{$entree->date_peremption}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>

                        $btn_validation
                       
                        $btn_edit
                        
                        $btn_delete
                        </tr>";

                $id_detail++;
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

    public function import_excel(Request $request)
    {
        try {

            $request->validate([
                'file' => 'required|file|mimes:xlsx,xls'
            ]);

            Excel::import(
                new EntreeDetailImport($request->id_index),
                $request->file('file')
            );

            // $nb = ;

            $nb_art = entree_detail::where('entree_indices_id', $request->id_index)->count();
            // var_dump($nb_art);die();
            entree_index::where('id', $request->id_index)->update(['nb_article' => $nb_art]);



            return response()->json([
                'status' => 'success'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function valider_entree_detail(Request $request)
    {
        DB::beginTransaction();

        try {

            $detail = entree_detail::findOrFail($request->id_entree_detail);
            $article = article::findOrFail($detail->article_id);

            $stock_entree = $article->stock + $detail->qte_entree;



            // Mise à jour détail
            $detail->update([
                'qte_initial' => $article->stock,
                'stock_restant_lot' => $detail->qte_entree,
                'stock_dispo' => $stock_entree,
                'isValide' => true
            ]);

            // Mise à jour article
            $article->update([
                'stock' => $stock_entree
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success'
            ]);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function annuler_validation_entree_detail(Request $request)
    {
        DB::beginTransaction();

        try {

            $detail = entree_detail::findOrFail($request->id_entree_detail);
            $article = article::findOrFail($detail->article_id);

            $stock_entree = $article->stock - $detail->qte_entree;
            $stock_rest_lot = $detail->stock_restant_lot - $detail->qte_entree;

            $article->update([
                'stock' => $stock_entree
            ]);

            $detail->update([
                'qte_initial' => $article->stock - $detail->qte_entree,
                'stock_restant_lot' => $stock_rest_lot,
                'stock_dispo' => $stock_entree,
                'isValide' => false
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success'
            ]);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
