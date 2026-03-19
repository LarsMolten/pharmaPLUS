<?php

namespace App\Http\Controllers\Panier;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vente\StorePanierRequest;
use App\Models\Article\article;
use App\Models\Panier\panier;
use App\Models\EntreeDetail\entree_detail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PanierController extends Controller
{
    public function index()
    {
        return view('vente.vente_layout');
    }



    public function liste_panier()
    {
        try {

            // dd(auth()->id());

            $paniers = panier::where('user_id', 1)->get();
            // $paniers = panier::all();
            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>#</th>
                        <th style='text-align: center;'>Designation</th>
                        <th style='text-align: center;'>Prix Unitaire</th>
                        <th style='text-align: center;'>Quantité</th>
                        <th style='text-align: center;'>Montant</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";

            $_n = 1;
            $produit_id = "";

            $total_brut = 0;
            $total_proposee = 0;
            $total_ecart = 0;

            foreach ($paniers as $panier) {


                $art = article::find($panier->article_id);
                $produit_id = $art->id;

                $total_brut = bcadd($panier->montant_brut, $panier->montant_brut, 4);
                $total_proposee = bcadd($panier->montant_proposee, $panier->montant_proposee, 4);
                $total_ecart = bcadd($panier->montant_ecart, $panier->montant_ecart, 2);



                $th .= "<tr>
                            <td  style='width:5%'>{$_n}</td>
                            <td  style='width:20%'>{$art->designation}</td>
                            <td  style='width:5%' class='format-prix'>{$panier->p_u_proposee}</td>
                            <td style='width:5%' class='format-prix'>{$panier->qte}</td>
                            <td style='width:10%' class='format-prix'>{$panier->montant_proposee}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:5%'>

                            <a class='primary edit mr-1' 
                              data-qte='{$panier->qte}'
                             id='art_{$panier->id}' data-action='edit_panier' data-id='{$produit_id}'><i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_one_or_all_panier' data-id='{$panier->id}' ><i class='la la-trash-o'></i></a>
                        </tr>";

                $_n++;
            }
            // $total_ecart = (($total_proposee - $total_brut) > 0) ? $total_proposee - $total_brut : 0;

            $th .= "</tbody>";
            // dd($total_proposee);

            $pan = "
                     <h1 class='content-header-title text-center white format-prix'
                                         style='font-weight: 800; font-size: 45px '>{$total_proposee} Ar</h1>
                                     <div class='ml-2 white'>

                                         <strong class='col-4 format-prix'>Brut : $total_brut Ar</strong>
                                         <strong class='col-4 format-prix'> Ecart : $total_ecart Ar</strong>

                                     </div>
            ";

            $bt = "

                    <div class='form-actions right' style='height: 96px;'>

                    <button type='button' data-action='encaisser_panier' id='btn_encaisser'
                        class='mr-1 mb-1 btn btn-sm btn-success btn-min-width'><i class='ft-check'></i>
                        Encaisser</button>

                    <button type='button' data-action='delete_one_or_all_panier' data-id='0'
                        class='mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width'><i class='ft-x'></i>
                        Vider</button>


                </div>

            
            ";


            return response()->json([
                'success' => true,
                'data' => $th,
                'pan' => $pan,
                'bt' => $bt,
            ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }


    public function ajout_panier(StorePanierRequest $request)
    {

        try {

            $validated = $request->validated();

            $data = "";

            // verifier le type de vente
            switch ($request->type_vente) {

                case 'service':
                    //code
                    break;


                case 'article':

                    $data = $this->fifoVente($request->id_panier, $request->article_id, $request->qte);

                    break;

                default:
                    # code...
                    break;
            }



            return response()->json([
                'status' => $data
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }


    //systeme FIFO afin de gerer les péremptions
    private function fifoVente($id_panier, $article_id, $qte)
    {
        try {
            DB::beginTransaction();

            $article = article::where('id', $article_id)->lockForUpdate()->first();

            if ($article->stock < $qte) {

                return "insuffisant";
            } else {



                if ($id_panier != "") {
                    //  Modification d'un panier

                    $old = panier::where([
                        ['article_id', $article_id],
                        ['user_id', auth()->id()]
                    ])->get();

                    foreach ($old as $p) {

                        entree_detail::where('id', $p->entree_detail_id)
                            ->increment('stock_restant_lot', $p->qte);
                    }

                    panier::where([
                        ['article_id', $article_id],
                        ['user_id', auth()->id()]
                    ])->delete();
                } else {

                    // Ajout d'un panier

                    $lots = entree_detail::where([
                        ['article_id', $article_id],
                        ['stock_restant_lot', '>', 0],
                        ['isValide', 1],
                    ])->orderBy('date_peremption')->lockForUpdate()->get();


                    foreach ($lots as $lot) {

                        if ($qte <= 0) break;

                        $prendre = min($qte, $lot->stock_restant_lot);

                        if($prendre <= 0) continue;

                        $montant_brut = bcmul($lot->prix_unitaire, $prendre, 4);
                        $montant_proposee = bcmul($lot->pu_proposee, $prendre, 4);
                        $montant_ecart = bcsub($montant_proposee, $montant_brut, 4);
                        $montant_ecart = ($montant_ecart > 0) ? $montant_ecart : 0;


                        panier::create([
                            'entree_detail_id' => $lot->id,
                            'article_id' => $article_id,
                            'p_u_brut' => $lot->prix_unitaire,
                            'p_u_proposee' => $lot->pu_proposee,
                            'qte' => $prendre,
                            'montant_brut' => $montant_brut,
                            'montant_proposee' => $montant_proposee,
                            'montant_ecart' => $montant_ecart,
                            'user_id' => auth()->id(),
                        ]);

                        $lot->decrement('stock_restant_lot', $prendre);
                        $article->decrement('stock', $prendre);

                        $qte -= $prendre;
                    }
                }
            }

            DB::commit();
            return 'success';
        } catch (\Throwable $e) {
            return $e->getMessage();
        }
    }


    public function delete_one_or_all_panier(Request $request)
    {
        try {

            if ($request->id_panier != '0') {

                $panier = panier::where([
                    ['id', $request->id_panier],
                    ['user_id', auth()->id()]
                ])->delete();
            } else {

                $panier = panier::where([
                    ['user_id', auth()->id()]
                ])->delete();
            }


            return response()->json([
                'status' => "success",
                'data' => $panier
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
