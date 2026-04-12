<?php

namespace App\Http\Controllers\ListeVente;

use App\Http\Controllers\Controller;
use App\Models\Vente\vente;
use App\Models\Analyse\analyse;
use App\Models\VenteDetail\VenteDetail;
use Illuminate\Http\Request;

class ListeVenteController extends Controller
{
    public function index()
    {
        return view('ListeVente.listeVente');
    }




    public function liste_vente(Request $request)
    {
        try {


            $date_debut = $request->date_debut;
            $date_fin = $request->date_fin;

            $ventes = Vente::with('user')
                ->whereBetween('created_at', [
                    $date_debut . ' 00:00:00',
                    $date_fin . ' 23:59:59'
                ])
                ->get();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>Ref</th>
                        <th style='text-align: center;'>Client</th>
                        <th style='text-align: center;'>Montant</th>
                        <th style='text-align: center;'>Montant reçu</th>
                        <th style='text-align: center;'>Monnaie rendue</th>
                        <th style='text-align: center;'>Caissier</th>
                        <th style='text-align: center;'>Date</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";



            foreach ($ventes as $vente) {



                $th .= "<tr>
                            <td  style='width:5%'>{$vente->reference_vente}</td>
                            <td  style='width:20%;'>{$vente->client}</td>
                            <td  style='width:5%; text-align: right;' class='format-prix '>{$vente->montant_brut}</td>
                            <td  style='width:5%; text-align: right;' class='format-prix '>{$vente->montant_paye}</td>
                            <td  style='width:5%; text-align: right;' class='format-prix '>{$vente->monnaie}</td>
                            <td style='width:10%; text-align: center;' class='format-prix'>{$vente->user->name}</td>
                            <td style='width:10%; text-align: center;' class='format-prix'>{$vente->created_at}</td> ";

                $th .= "<td style='width:5%; text-align: center;'>

                             <a class='success mr-1' data-action='afficher_modal_liste_detail_vente'
                             data-id='{$vente->id}|{$vente->reference_vente}|{$vente->client}|{$vente->user->name}|{$vente->created_at}|{$vente->montant_brut}|{$vente->montant_paye}|{$vente->monnaie}' ><i class='la la-list'></i></a>
                        </td>

                    </tr>";
            }

            $th .= "</tbody>";


            $details = $ventes->pluck('details')->flatten();

            /* CONSULTATION */
            $totalConsultation = $details->whereNotNull('consultation_id');
            $nbConsultation = $totalConsultation->count();
            $montantConsultation = $totalConsultation->sum('montant');

            /* SERVICE */
            $totalService = $details->whereNotNull('service_id');
            $nbService = $totalService->count();
            $montantService = $totalService->sum('montant');

            /* ANALYSE */
            $totalAnalyse = $details->whereNotNull('analyse_id');
            $nbAnalyse = $totalAnalyse->count();
            $montantAnalyse = $totalAnalyse->sum('montant');

            /* ARTICLE */
            $totalArticle = $details->whereNotNull('article_id');
            $nbArticle = $totalArticle->sum('qte');
            $montantArticle = $totalArticle->sum('montant');

            /* KIT */
            $totalKit = $details->whereNotNull('kit_id');
            $nbKit = $totalKit->sum('qte');
            $montantKit = $totalKit->sum('montant');

            /* TOTAL GENERAL */
            // $totalMontant = $details->sum('montant');
            $totalMontant = $ventes->sum('montant_brut');
            $nbTotal = $ventes->count();
            $nbTotalDetail = $details->count();


            /* POURCENTAGES */
            $pourcConsultation = $totalMontant > 0 ? ($montantConsultation / $totalMontant) * 100 : 0;
            $pourcService = $totalMontant > 0 ? ($montantService / $totalMontant) * 100 : 0;
            $pourcAnalyse = $totalMontant > 0 ? ($montantAnalyse / $totalMontant) * 100 : 0;
            $pourcArticle = $totalMontant > 0 ? ($montantArticle / $totalMontant) * 100 : 0;
            $pourcKit = $totalMontant > 0 ? ($montantKit / $totalMontant) * 100 : 0;

            return response()->json([
                'success' => true,
                'data' => $th,
                'nbTotalVente' => $nbTotal,
                'nbTotalDetail' => $nbTotalDetail,
                'totalMontant' => $totalMontant,

                'consultation' => [
                    'count' => $nbConsultation,
                    'montant' => $montantConsultation,
                    'percent' => round($pourcConsultation)
                ],
                'service' => [
                    'count' => $nbService,
                    'montant' => $montantService,
                    'percent' => round($pourcService)
                ],
                'analyse' => [
                    'count' => $nbAnalyse,
                    'montant' => $montantAnalyse,
                    'percent' => round($pourcAnalyse)
                ],
                'article' => [
                    'count' => $nbArticle,
                    'montant' => $montantArticle,
                    'percent' => round($pourcArticle)
                ],
                'kit' => [
                    'count' => $nbKit,
                    'montant' => $montantKit,
                    'percent' => round($pourcKit)
                ]
            ]);
        } catch (\Exception $th) {
            return response()->json($th, 500);
        }
    }



    public function liste_vente_detail(Request $request)
    {
        try {



            $details = VenteDetail::with('article', 'service', 'kit')->where('vente_id', $request->vente_id)->get();

            // dd($details);

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>N°</th>
                        <th style='text-align: center;'>Designation</th>
                        <th style='text-align: center;'>Prix Unitaire</th>
                        <th style='text-align: center;'>Quantité</th>
                        <th style='text-align: center;'>Montant</th>
                    </tr>
                </thead>";

            $th .= "<tbody>";


            $n = 1;
            $designation = "";
            foreach ($details as $d) {

                if ($d->consultation_id) {
                    $designation = "Consultation";
                }

                if ($d->article_id) {
                    $designation = $d->article->designation;
                }

                if ($d->service) {
                    $designation = $d->service->nom_service;
                }

                if ($d->analyse_id) {
                    $designation = analyse::whereIn('id', explode(',', $d->analyse_id))
                        ->pluck('nom')->implode(', ');
                }

                if($d->kit_id){
                    $designation = $d->kit->nom_kit;
                }




                $th .= "<tr>
                            <td  style='width:5%'>{$n}</td>
                            <td  style='width:20%; text-align:left; word-break: break-word; white-space: normal;'>{$designation}</td>
                            <td  style='width:10%; text-align: right;' class='format-prix '>{$d->prix_unitaire}</td>
                            <td  style='width:10%;' class='format-prix '>{$d->qte}</td>
                            <td  style='width:10%; text-align: right;' class='format-prix '>{$d->montant}</td>

                        </tr>";


                $n++;
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
