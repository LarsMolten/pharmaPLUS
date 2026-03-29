<?php

namespace App\Http\Controllers\Panier;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vente\StorePanierRequest;
use App\Models\Analyse\analyse;
use App\Models\Article\article;
use App\Models\Panier\panier;
use App\Models\EntreeDetail\entree_detail;
use App\Models\Kit\kit;
use App\Models\Service\service;
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

            $paniers = panier::where('user_id', auth()->id())->get();
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

            $designation = "";
            $produit_id = "";
            $type = "";
            $stock_art = "";
            $qte_edit = 0;
            $data_ana = "";

            $total_brut = 0.00;
            $total_proposee = 0.00;
            $total_ecart = 0.00;

            $btn_edit_panier = "";

            foreach ($paniers as $panier) {
                    // dd($panier);

                if ($panier->article_id) {
                    $art = article::find($panier->article_id);
                    $produit_id = $art->id;
                    $designation = $art->designation;
                    $stock_art = $art->stock;
                    $type = "article";

                    $q = panier::where([
                        ['article_id', $panier->article_id],
                        ['user_id', auth()->id()]
                    ])
                        ->selectRaw('SUM(qte) as qte_edit')
                        ->first();
                    $qte_edit = $q->qte_edit;
                }
                if ($panier->analyse_id) { // ########################################## multiple id

                    $designation = analyse::whereIn('id', explode(',', $panier->analyse_id))
                        ->pluck('nom')->implode(', ');

                    $produit_id = $panier->analyse_id; //"2,4,5,6"
                    $type = "analyse";
                    $qte_edit = $panier->qte; //1

                    $analys = json_encode(explode(',', $panier->analyse_id));
                }
              
                if ($panier->consultation_id) {
                    $consult = service::find($panier->consultation_id);
                    $produit_id = $consult->id;
                    $designation = $consult->nom_service;
                    $type = "consultation";
                    $qte_edit = 1;
                    $btn_edit_consult = " <a class='primary edit mr-1' 
                            id='pan_{$panier->id}'
                            data-action='edit_consultation_panier'
                            data-id='{$panier->id}-{$type}-{$produit_id}-{$panier->p_u_brut}-{$qte_edit}-{$panier->nom_patient}-{$panier->sex_patient}-{$panier->age_patient}-{$panier->unite_age}-{$panier->type_docteur}-{$panier->docteur}'><i class='la la-pencil-square-o'></i></a>
                    ";
                }
                if ($panier->service_id) {
                    $serv = service::find($panier->service_id);
                    $produit_id = $serv->id;
                    $designation = $serv->nom_service;
                    $type = "service";
                    $qte_edit = $panier->qte;
                }
                if ($panier->kit_id) {
                    $kit = kit::find($panier->kit_id);
                    $produit_id = $kit->id;
                    $designation = $kit->nom_kit;
                    $type = "kit";
                    $qte_edit = $panier->qte;
                }



                $total_brut = bcadd($total_brut, $panier->montant_brut, 2);
                $total_proposee = bcadd($total_proposee, $panier->montant_proposee, 2);
                $total_ecart = bcsub($total_proposee, $total_brut, 2);
                $data_ana = (!empty($analys)) ? $analys : "";

                $btn_edit = " <a class='primary edit mr-1' 
                                        id='pan_{$panier->id}'
                                        data-action='edit_panier'
                                        data-id='{$panier->id}-{$type}-{$produit_id}-{$panier->p_u_brut}-{$qte_edit}-{$type}-{$data_ana}'><i class='la la-pencil-square-o'></i></a>
                                ";
              
                $btn_edit_panier = ($panier->consultation_id) ? $btn_edit_consult : $btn_edit;   
                

                $th .= "<tr>
                            <td  style='width:5%'>{$_n}</td>
                            <td  style='width:20%; text-align: left;'>{$designation}</td>
                            <td  style='width:5%; text-align: right;' class='format-prix '>{$panier->p_u_brut}</td>
                            <td style='width:5%;' class='format-prix'>{$panier->qte}</td>
                            <td style='width:10%; text-align: right;' class='format-prix'>{$panier->montant_brut}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:5%'>
                            {$btn_edit_panier}
                           
                             <a class='danger delete mr-1' data-action='delete_one_or_all_panier' data-id='{$panier->id}' ><i class='la la-trash-o'></i></a>
                        </tr>";

                $_n++;
            }
            // $total_ecart = (($total_proposee - $total_brut) > 0) ? $total_proposee - $total_brut : 0;

            $th .= "</tbody>";
            // dd($total_proposee);

            $pan = "
                     <h1 class='content-header-title text-center white format-prix'
                                         style='font-weight: 800; font-size: 45px '>{$total_brut} Ar</h1>
                                     
                   
                                       

                                    
            ";

            //  <h6  class='mx-2 row white'> 
            //                              <p class='col-6' style='text-align: left;'>Brut : <span class='format-prix'>$total_brut</span> Ar</p>
            //                              <p class='col-6' style='text-align: right;'> Ecart : <span class ='format-prix'>$total_ecart</span> Ar</p> 
            //                             </h6>
            

            $bt = "

                    <div class='form-actions right' style='height: 96px;'>

                    <button type='button' data-action='afficher_modal_validation_vente' id='btn_encaisser'
                        class='mr-1 mb-1 btn btn-sm btn-info btn-min-width'><i class='ft-check'></i>
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
            // dd($request);

            // verifier le type de vente
            switch ($request->page_type) {

                case 'service':
                    $data = $this->ajout_service_panier($request->id_panier, $request->service_id, $request->prix_produit, $request->qte);
                    break;

                case 'article':
                    $data = $this->fifoVente($request->id_panier, $request->article_id, $request->qte);
                    break;

                case 'analyse':
                    $analyse_ids = implode(',', $request->analyse_id);
                    $data = $this->ajout_analyse_panier($request->id_panier, $analyse_ids);
                    break;

                case 'kit':

                    $data = $this->ajout_kit_panier($request->id_panier, $request->kit_id, $request->prix_produit, $request->qte);
                    break;

                default:
                    $data = $this->ajout_consultation_panier($request->id_panier, $request->consultation_id, $request->nom_patient, $request->sex_patient, $request->age_patient, $request->unite_age, $request->type_docteur, $request->docteur, $request->prix_consultation);
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

    private function ajout_consultation_panier($id_panier, $consultation_id, $nom_patient, $sex_patient, $age_patient, $unite_age, $type_docteur, $docteur, $prix_consultatio)
    {
        try {

            DB::beginTransaction();

            $userId = auth()->id();

            // $montant = bcmul($prix_consultatio, 1, 2);

            $data = [
                'consultation_id' => $consultation_id,
                'nom_patient' => $nom_patient,
                'sex_patient' => $sex_patient,
                'age_patient' => $age_patient,
                'unite_age' => $unite_age,
                'type_docteur' => $type_docteur,
                'docteur' => $docteur,
                'p_u_brut' => $prix_consultatio,
                'p_u_proposee' => $prix_consultatio,
                'qte' => 1,
                'montant_brut' => $prix_consultatio,
                'montant_proposee' => $prix_consultatio,
                'montant_ecart' => 0,
                'user_id' => $userId,
            ];

            if ($id_panier) {

                // modification
                panier::where([
                    ['id', $id_panier],
                    ['user_id', $userId]
                ])->update($data);
            } else {

                // vérification déjà dans panier
                // $exists = panier::where([
                //     ['consultation_id', $consultation_id],
                //     ['user_id', $userId]
                // ])->exists();

                // if ($exists) {
                //     throw new \Exception("deja_ajoutee"); 
                // }

                panier::create($data);
            }

            DB::commit();

            return "success";
        } catch (\Throwable $e) {

            DB::rollBack();

            return $e->getMessage();
        }
    }



    private function ajout_service_panier($id_panier, $service_id, $prix_service, $qte)
    {
        try {

            DB::beginTransaction();

            $userId = auth()->id();

            $montant = bcmul($prix_service, $qte, 2);

            $data = [
                'service_id' => $service_id,
                'p_u_brut' => $prix_service,
                'p_u_proposee' => $prix_service,
                'qte' => $qte,
                'montant_brut' => $montant,
                'montant_proposee' => $montant,
                'montant_ecart' => 0,
                'user_id' => $userId,
            ];

            if ($id_panier) {

                // modification
                panier::where([
                    ['id', $id_panier],
                    ['user_id', $userId]
                ])->update($data);
            } else {

                // vérification déjà dans panier
                $exists = panier::where([
                    ['service_id', $service_id],
                    ['user_id', $userId]
                ])->exists();

                if ($exists) {
                    throw new \Exception("deja_ajoutee");
                }

                panier::create($data);
            }

            DB::commit();

            return "success";
        } catch (\Throwable $e) {

            DB::rollBack();

            return $e->getMessage();
        }
    }


    private function ajout_analyse_panier($id_panier, $analyse_ids)
    {
        try {

            DB::beginTransaction();

            $userId = auth()->id();

            // convertir "2,3,4" → [2,3,4]
            $ids = array_filter(explode(',', $analyse_ids));

            // calcul du montant total directement en SQL
            $montant = analyse::whereIn('id', $ids)->sum('prix');

            $data = [
                'analyse_id'       => $analyse_ids,
                'p_u_brut'         => $montant,
                'p_u_proposee'     => $montant,
                'qte'              => 1,
                'montant_brut'     => $montant,
                'montant_proposee' => $montant,
                'montant_ecart'    => 0,
                'user_id'          => $userId,
            ];

            if ($id_panier) {

                panier::where('id', $id_panier)
                    ->where('user_id', $userId)
                    ->update($data);
            } else {

                panier::create($data);
            }

            DB::commit();

            return "success";
        } catch (\Throwable $e) {

            DB::rollBack();

            return $e->getMessage();
        }
    }

    private function ajout_kit_panier($id_panier, $kit_id, $prix_kit, $qte)
    {
        try {

            DB::beginTransaction();

            $userId = auth()->id();

            $montant = bcmul($prix_kit, $qte, 2);

            $data = [
                'kit_id' => $kit_id,
                'p_u_brut' => $prix_kit,
                'p_u_proposee' => $prix_kit,
                'qte' => $qte,
                'montant_brut' => $montant,
                'montant_proposee' => $montant,
                'montant_ecart' => 0,
                'user_id' => $userId,
            ];

            if ($id_panier) {

                // modification
                panier::where([
                    ['id', $id_panier],
                    ['user_id', $userId]
                ])->update($data);
            } else {

                // vérification déjà dans panier
                $exists = panier::where([
                    ['kit_id', $kit_id],
                    ['user_id', $userId]
                ])->exists();

                if ($exists) {
                    throw new \Exception("deja_ajoutee");
                }

                panier::create($data);
            }

            DB::commit();

            return "success";
        } catch (\Throwable $e) {

            DB::rollBack();

            return $e->getMessage();
        }
    }

    private function fifoVente($id_panier, $article_id, $qte)
    {
        try {

            DB::beginTransaction();

            $userId = auth()->id();

            $article = article::where('id', $article_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($article->stock < $qte) {
                throw new \Exception("insuffisant");
            }

            /*
        ==============================
        RESTAURATION STOCK SI MODIF
        ==============================
        */

            if ($id_panier) {

                $old = panier::where([
                    ['article_id', $article_id],
                    ['user_id', $userId]
                ])->lockForUpdate()->get();

                foreach ($old as $p) {

                    entree_detail::where('id', $p->entree_detail_id)
                        ->increment('stock_restant_lot', $p->qte);

                    entree_detail::where('id', $p->entree_detail_id)
                        ->increment('stock_dispo', $p->qte);

                    $article->increment('stock', $p->qte);
                }

                panier::where([
                    ['article_id', $article_id],
                    ['user_id', $userId]
                ])->delete();
            } else {

                $exist = panier::where([
                    ['article_id', $article_id],
                    ['user_id', $userId]
                ])->exists();

                if ($exist) {
                    throw new \Exception("deja_ajoutee");
                }
            }

            /*
        ==============================
        FIFO
        ==============================
        */

            $lots = entree_detail::where([
                ['article_id', $article_id],
                ['stock_restant_lot', '>', 0],
                ['isValide', 1],
                ['etat', 1]
            ])
                ->orderBy('date_peremption')
                ->lockForUpdate()
                ->get();

            foreach ($lots as $lot) {

                if ($qte <= 0) {
                    break;
                }

                $prendre = min($qte, $lot->stock_restant_lot);

                if ($prendre <= 0) {
                    continue;
                }

                $montant_brut = bcmul($lot->prix_unitaire, $prendre, 2);
                $montant_proposee = bcmul($lot->pu_proposee, $prendre, 2);

                $montant_ecart = bcsub($montant_proposee, $montant_brut, 2);

                if ($montant_ecart < 0) {
                    $montant_ecart = 0;
                }

                panier::create([
                    'entree_detail_id' => $lot->id,
                    'article_id' => $article_id,
                    'p_u_brut' => $lot->prix_unitaire,
                    'p_u_proposee' => $lot->pu_proposee,
                    'qte' => $prendre,
                    'montant_brut' => $montant_brut,
                    'montant_proposee' => $montant_proposee,
                    'montant_ecart' => $montant_ecart,
                    'user_id' => $userId
                ]);

                $lot->decrement('stock_restant_lot', $prendre);
                $lot->decrement('stock_dispo', $prendre);

                $article->decrement('stock', $prendre);

                $qte -= $prendre;
            }

            DB::commit();

            return "success";
        } catch (\Throwable $e) {

            DB::rollBack();

            return $e->getMessage();
        }
    }



    public function delete_one_or_all_panier(Request $request)
    {
        try {

            DB::beginTransaction();

            $userId = auth()->id();

            if ($request->id_panier != '0') {

                $paniers = panier::where([
                    ['id', $request->id_panier],
                    ['user_id', $userId]
                ])->lockForUpdate()->get();
            } else {

                $paniers = panier::where([
                    ['user_id', $userId]
                ])->lockForUpdate()->get();
            }

            foreach ($paniers as $p) {

                // restitution stock lot
                if ($p->entree_detail_id) {

                    entree_detail::where('id', $p->entree_detail_id)
                        ->increment('stock_restant_lot', $p->qte);

                    entree_detail::where('id', $p->entree_detail_id)
                        ->increment('stock_dispo', $p->qte);
                }

                // restitution stock article
                if ($p->article_id) {

                    article::where('id', $p->article_id)
                        ->increment('stock', $p->qte);
                }
            }

            // suppression panier
            $deleted = panier::whereIn('id', $paniers->pluck('id'))->delete();

            DB::commit();

            return response()->json([
                'status' => "success",
                'data' => $deleted
            ]);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
