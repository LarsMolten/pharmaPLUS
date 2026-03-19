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
use App\Http\Requests\EntreeDetail\StoreEntreeDetailRequest;
use App\Models\pourcentage;
use Carbon\Carbon;


use PhpParser\Node\Stmt\TryCatch;


class EntreeDetailController extends Controller
{




    public function liste_entreeDetail(Request $request)
    {
        try {


            $entrees = entree_detail::where('etat', 1)->where('entree_indices_id', $request->id_index)->orderby('entree_indices_id', 'desc')->get();

            $pourcentage = pourcentage::first();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>#</th>
                        <th style='text-align: center;'>REF</th>
                        <th style='text-align: center;'>Designation</th>
                        <th style='text-align: center;'>Présentation</th>
                        <th style='text-align: center;'>Lot</th>
                        <th style='text-align: center;'>Stock Initial</th>
                        <th style='text-align: center;'>Qté entrée</th>
                        <th style='text-align: center; background-color: rgba(79, 233, 117, 0.75)'>Stock restant (Lot)</th>
                        <th style='text-align: center; background-color: rgb(46, 214, 20)'>Stock dispo global</th>
                        <th style='text-align: center;'>Prix en Boite</th>
                        <th style='text-align: center;'>Prix Unitaire <span style='color: hsl(206, 100%, 67%)'>+$pourcentage->pourcentage %</span></th>
                        <th style='text-align: center;'>P.U Proposé</th>
                        <th style='text-align: center;'>Montant Achat</th>
                        <th style='text-align: center;'>Montant Estimé Brut</th>
                        <th style='text-align: center;'>Montant Estimé Proposé</th>
                        <th style='text-align: center;'>Date de péremption</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";

            $id_detail = 1;

            foreach ($entrees as $entree) {

                $presentation = "-";
                $quantite_initial = "<strong>0</strong> / 0";
                $quantite_entree = "<strong>0</strong> / 0";
                $stock_restant_lot = "<strong>0</strong> / 0";
                $quantite_dispo_global = "<strong>0</strong> / 0";

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
                    $quantite_initial = "<strong>{$boite_i}</strong> / {$qt_i}";

                    $boite_e = round($qt_e / $pres_b, 2); // à arrondisser 2 chiffre apres virgule s'il y a*************************************
                    $quantite_entree = "<strong>{$boite_e}</strong> / {$qt_e}";

                    $boite_rest_lot = round($stock_rest / $pres_b, 2);
                    $stock_restant_lot = "<strong>{$boite_rest_lot}</strong> / {$stock_rest}";

                    $boite_d_g = round($stock_d_g / $pres_b, 2); // à arrondisser 2 chiffre apres virgule s'il y a*************************************
                    $quantite_dispo_global = "<strong>{$boite_d_g}</strong> / {$stock_d_g}";
                }

                $btn_class = ($entree->isValide == 0) ? "success" : "danger";
                $i_class = ($entree->isValide == 0) ? "la la-check-square la-2x" : "la la-minus-square la-2x";
                $action_validation = ($entree->isValide == 0) ? "valider_entree_detail" : "annuler_entree_detail_validee";

                $btn_validation = ($entree->isVendus == 0) ? "<a class='{$btn_class}  mr-1' id='en_{$entree->id}' data-action='{$action_validation}' data-qte='{$quantite_entree}' data-id='{$entree->id}'><i class='{$i_class}'></i></a> " : "";


                $btn_delete = ($entree->isValide == 0) ? "<a class='danger delete mr-1' data-action='delete_entree_detail' data-id='{$entree->id}'  ><i class='la la-trash-o'></i></a>" : "";

                $btn_edit = ($entree->isValide == 0) ? "<a class='primary edit mr-1' id='ent_{$entree->id}' 
                                                                                data-action='edit_entree_detail_article' 
                                                                                data-article_id='{$entree->article_id}' 
                                                                                data-qte_entree='{$entree->qte_entree}' 
                                                                                data-prix_achat_boite='{$entree->prix_achat_boite}' 
                                                                                data-pu_proposee='{$entree->pu_proposee}' 
                                                                                data-date_peremption='{$entree->date_peremption}' 
                                                                                data-id='{$entree->id}'><i class='la la-pencil-square-o'></i></a>" : "";

                $btn_edit_proposition = ($entree->isVendus == 0) ? "<a class='info edit mr-1' id='pr_{$entree->id}' data-proposition='{$entree->pu_proposee}' data-prix_unitaire='{$entree->prix_unitaire}' data-action='edit_proposition_pu' data-id='{$entree->id}'><i class='la la-pencil-square-o'></i></a>" : "";

                $bg1 = ($stock_rest > $article->seuil) ? "background-color: rgba(158, 236, 177, 0.91)" : "background-color: rgba(233, 244, 236, 0.99)";
                $bg2 = ($stock_d_g > $article->seuil) ? "background-color: rgb(46, 214, 20)" : "background-color: rgb(198, 218, 195)";

                $th .= "<tr>
                            <td  style='width:5%'>{$id_detail}</td>
                            <td  style='width:5%'>REF-{$entree->article_id}</td>
                            <td  style='width:20%; text-align: left;'>{$article->designation}</td>
                            <td  style='width:5%'>{$presentation}</td>
                            <td style='width:15%'>{$entree->lot}</td>
                            <td style='width:10%'>{$quantite_initial}</td>
                            <td style='width:10%'>{$quantite_entree}</td>
                            <td style='width:10%; $bg1'>{$stock_restant_lot}</td>
                            <td style='width:10%; $bg2'>{$quantite_dispo_global}</td>
                            <td style='width:10%' class='format-prix'>{$entree->prix_achat_boite} Ar</td>
                            <td style='width:10%' class='format-prix'>{$entree->prix_unitaire} Ar</td>
                            <td style='width:10%'> <span class='format-prix'>{$entree->pu_proposee}</span> Ar " . $btn_edit_proposition . "</td>
                            <td style='width:20%' class='format-prix'>{$entree->montant_entree} Ar</td>
                            <td style='width:20%' class='format-prix'>{$entree->montant_gain_brut} Ar</td>
                            <td style='width:20%' class='format-prix'>{$entree->montant_gain_proposee} Ar</td>
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




    public function ajout_entree_detail(Request $request)
    {
        try {


            // $validated = $request->validated();

            $article = article::find($request->article_id);

            //géneration Lot
            $lot = $this->generateLot($request->article_id, $request->date_peremption);

            $pourcentage = pourcentage::first();
            $p_u = $request->prix_achat_boite / $article->presentation;

            $prix_unitaire_vente = $p_u + ($p_u * $pourcentage->pourcentage / 100); //+20%


            if ($request->id_entree_detail != "") {

                $date_perem = $this->parseDateModified($request->date_peremption);

                $entree = entree_detail::where('id', $request->id_entree_detail)->update([
                    'article_id' => $request->article_id,

                    'qte_entree' => $request->qte_entree,

                    'prix_achat_boite' => $request->prix_achat_boite,
                    'prix_unitaire' => $prix_unitaire_vente,
                    'pu_proposee' => $request->pu_proposee,

                    'montant_entree' => $p_u * $request->qte_entree,
                    'montant_gain_brut' => $prix_unitaire_vente * $request->qte_entree,
                    'montant_gain_proposee' => $request->pu_proposee * $request->qte_entree,

                    'date_peremption' => $date_perem,
                ]);
            } else {

                $dateperemption = $this->parseDate($request->date_peremption);


                $entree = entree_detail::create([

                    'entree_indices_id' => $request->entree_indices_id,
                    'article_id' => $request->article_id,
                    'lot' => $lot,

                    'qte_initial' => $article->stock,
                    'qte_entree' => $request->qte_entree,

                    'prix_achat_boite' => $request->prix_achat_boite,
                    'prix_unitaire' => $prix_unitaire_vente,
                    'pu_proposee' => $request->pu_proposee,

                    'montant_entree' => $p_u * $request->qte_entree,
                    'montant_gain_brut' => $prix_unitaire_vente * $request->qte_entree,
                    'montant_gain_proposee' => $request->pu_proposee * $request->qte_entree,

                    'date_peremption' => $dateperemption,
                ]);
            }


            // dd($entree);



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
                'qte_initial' => $stock_entree,
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


    public function charge_article()
    {
        try {

            $articles = article::where([
                ['statut', 1],
                ['etat', 1]
            ])->get();

            $un = "";

            foreach ($articles as $article) {

                $s_boite = round($article->stock / $article->presentation, 2);
                $stock_article = "{$s_boite} / {$article->stock}";

                $color = ($article->stock <= $article->seuil) ? "color: red;" : "";


                $un .= "<option style='{$color}' data-stock_dispo='{$stock_article}' data-stock='{$article->stock}' data-presentation='{$article->presentation}' value='{$article->id}' >{$article->designation} ______ ($stock_article)</option>";
           
            }
            return response()->json([
                'success' => true,
                'data' => $un
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function modifier_proposition_pu(Request $request)
    {
        DB::beginTransaction();

        try {

            $detail = entree_detail::findOrFail($request->id_article_entree);

            $detail->update([
                'pu_proposee' => $request->pu_proposee,
                'montant_gain_proposee' => $detail->qte_entree * $request->pu_proposee,
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




    // generation automatique le numéro Lot
    private function generateLot($article, $date)
    {
        return 'LOT-' . $article . '-' . date('ymd') . '-' . date('ym', strtotime($date));
    }

    // Traiteur et formateur de date de péremption
    private function parseDate($text)
    {
        $parts = explode('-', $text);

        $month = $parts[0];
        $year = $parts[1];

        return Carbon::create($year, $month, 1);
    }

    private function parseDateModified($text)
    {
        $parts = explode('-', $text);

        $year = $parts[0];
        $month = $parts[1];
        $day = $parts[2];

        return Carbon::create($year, $month, $day);
    }


     public function delete_entree_detail(Request $request)
    {
        try {
            $entree = entree_detail::where('id', $request->id_entree_detail)->update(['etat' => 0]);

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
