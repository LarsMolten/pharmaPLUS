<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Article\article;
use App\Models\Unite\unite;
use App\Http\Requests\Article\StorearticleRequest;
use App\Http\Requests\Article\UpdatearticleRequest;
use App\Models\EntreeDetail\entree_detail;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('article.index', [
            'articles' => article::all()
        ]);
    }

    // affichage de la liste des articles en json
    public function liste_article()
    {
        try {

            // Récupérer tous les articles
            $articles = article::where('etat', 1)->orderBy('designation', 'asc')->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>ID</th>
                        <th style='text-align: center;'>Designation</th>
                        <th style='text-align: center;'>Unité</th>
                        <th style='text-align: center;'>Présentation</th>
                        <th style='text-align: center;'>Stock</th>
                        <th style='text-align: center;'>Nb Lot Dispo</th>
                        <th style='text-align: center;'>Seui de stock</th>
                        <th style='text-align: center;'>Statut</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";
            foreach ($articles as $article) {

                $unite = unite::find($article->unite);

                $nb_lot = entree_detail::where([
                                            ['article_id', $article->id],
                                            ['stock_restant_lot', '>', 0],
                                            ['isValide', 1],
                                            ['etat', 1]
                                        ])
                                        ->selectRaw('COUNT(*) as nb_lot')
                                        ->first();

                $presentationMedic = "{$unite->nomUnite}/{$article->presentation}";

                $Medic_presentatio = $unite->nomUnite == "Unité" ? "Unité" : $presentationMedic;

                $s_boite = round($article->stock / $article->presentation, 2);
                $stock_article = "<strong>{$s_boite}</strong> / {$article->stock}";

                $statut_medic = ($article->statut == 1) ? "Actif" : "Inactif";

                $bg_color = "";

                if ($article->stock == 0) {
                    $bg_color .= "background-color: rgb(251, 102, 61);";
                } elseif ($article->stock <= $article->seuil) {
                    $bg_color .= "background-color: rgb(241, 163, 122);";
                }

                $th .= "<tr>
                            <td  style='width:5%'>REF-{$article->id}</td>
                            <td  style='width:20%; text-align: left;'>{$article->designation}</td>
                            <td  style='width:10%'>{$Medic_presentatio}</td>
                            <td style='width:5%'>{$article->presentation}</td>
                            <td style='width:10% ; {$bg_color}'>{$stock_article}</td>
                            <td style='width:5%'>{$nb_lot->nb_lot}</td>
                            <td style='width:5%'>{$article->seuil}</td>
                            <td style='width:5%'>{$statut_medic}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>

                            <a class='success mr-1' data-action='afficher_stock_detail' id='ar_{$article->id}' data-design='{$article->designation}' data-id='{$article->id}'  ><i class='la la-list'></i></a>

                            <a class='primary edit mr-1' data-designation='{$article->designation}'
                             data-presentation='{$article->presentation}'  data-unite='{$article->unite}' data-seuil='{$article->seuil}'
                             id='art_{$article->id}' data-action='edit_article' data-id='{$article->id}'><i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_article' data-id='{$article->id}' onclick='delete_article({$article->id})' ><i class='la la-trash-o'></i></a>
                        </tr>";
            }
            $th .= "</tbody>";
            // var_dump($th);



            return response()->json([
                'success' => true,
                'data' => $th
            ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }

    // affichage de la liste des unités en json
    public function charge_unite()
    {
        try {

            $unites = unite::all();
            // var_dump($unites);die();

            $un = "";

            foreach ($unites as $unite) {
                $un .= "<option value='{$unite->id}' data-supun='{$unite->supun}'>{$unite->nomComplet}</option>";
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


    public function liste_stock_detail(Request $request)
    {
        try {

            // Récupérer tous les detail de stock d'article par lot ayant encore de quantité
            $details = entree_detail::where([
                                            ['article_id', $request->article_id],
                                            ['stock_restant_lot', '>', 0],
                                            ['isValide', 1],
                                            ['etat', 1]
                                        ])->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>#</th>
                        <th style='text-align: center;'>Lot</th>
                        <th style='text-align: center;'>Stock dispo</th>
                        <th style='text-align: center;'>Prix unitaire</th>
                        <th style='text-align: center;'>Date de péremption</th>
                        <th style='text-align: center;'>Date d'entré</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";
            $num = 1;
            foreach ($details as $detail) {

                $article = article::where('id', $request->article_id)->first();


                $s_boite = (round($detail->stock_restant_lot / $article->presentation, 2)) ?? 0;
                $stock_restan_lot = "{$s_boite} / {$detail->stock_restant_lot}";


                $bg_color_s = "";
                $bg_color_p = "";

                if ($detail->stock_restant_lot == 0) {
                    $bg_color_s .= "background-color: rgb(251, 102, 61);";
                } elseif ($article->stock <= $article->seuil) {
                    $bg_color_s .= "background-color: rgb(255, 205, 178);";
                }


                if (date('YYmm') >= $detail->date_peremption) {                         //condition de péremption
                    $bg_color_p .= "background-color: rgb(251, 102, 61);";
                }

                // if($article->stock <= $article->seuil) {
                //     $bg_color_p .= "background-color: rgb(241, 163, 122);";
                // }

                $th .= "<tr>
                            <td  style='width:5%'>{$num}</td>
                            <td  style='width:20%'>{$detail->lot}</td>
                            <td  style='width:10%' {$bg_color_p}>{$stock_restan_lot}</td>
                            <td style='width:10%'>{$detail->prix_unitaire}</td>
                            <td style='width:20% ; {$bg_color_p}'>{$detail->date_peremption}</td>
                            <td style='width:10%'>{$detail->created_at}</td>";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:10%'>

                            <a class='success mr-1' data-action='retirer_stock_lot_perimee' id='ar_{$detail->id}' data-design='{$article->designation}' data-id='{$detail->id}'  ><i class='la la-list'></i></a>

                           
                        </tr>";
                $num++;
            }
            $th .= "</tbody>";
            // var_dump($th);



            return response()->json([
                'success' => true,
                'data' => $th
            ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }

    // ajout d'un article
    public function ajout_article(StorearticleRequest $request)
    {
        try {

            $validated = $request->validated();

            if ($request->id_article != "") {
                // var_dump($validated);die();
                $article = article::where('id', $request->id_article)->update($validated);
            } else {
                $article = article::create($validated);
            }
            return response()->json([

                'status' => "success",
                'data' => $article

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }


    // suppression d'un article
    public function delete_article(Request $request)
    {
        try {
            $article = article::where('id', $request->id_article)->update(['etat' => 0]);

            return response()->json([
                'status' => "success",
                'data' => $article
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
