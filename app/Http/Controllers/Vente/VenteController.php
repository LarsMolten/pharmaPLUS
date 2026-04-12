<?php

namespace App\Http\Controllers\Vente;

use App\Http\Controllers\Controller;
use App\Models\Analyse\analyse;
use App\Models\Consultation\consultation;
use App\Models\Panier\panier;
use App\Models\Service\service;
use App\Models\Vente\vente;
use App\Models\VenteDetail\VenteDetail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Milon\Barcode\DNS1D;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class VenteController extends Controller
{


    public function charge_info_patient()
    {
        try {
            $user = auth()->id();

            $pat = panier::where([
                ['consultation_id', '!=', null],
                ['unite_age', 1],
                ['user_id', $user],
            ])->orderBy('age_patient', 'desc')->first();

            $patient = ($pat != "") ? $pat->nom_patient :  "";

            $net = panier::where('user_id', $user)->sum('montant_brut');

            return response()->json([
                'success' => true,
                'data' => $patient,
                'net' =>  number_format($net, 2, '.', ' ')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function valider_vente(Request $request)
    {
        try {

            DB::beginTransaction();

            $user = auth()->id();

            $paniers = panier::where('user_id', $user)->get();
            $totals = $paniers->sum('montant_brut');

            if ($request->montant_paye < $totals) {
                return response()->json([
                    'status' => 'insuffisant'
                ]);
            }

            if ($paniers->isEmpty()) {
                return response()->json([
                    'status' => 'panier_vide'
                ]);
            }

            $total_brut = "0";
            $total_propose = "0";
            $total_ecart = "0";

            foreach ($paniers as $p) {

                $total_brut = bcadd($total_brut, $p->montant_brut, 2);
                $total_propose = bcadd($total_propose, $p->montant_proposee, 2);
                $total_ecart = bcadd($total_ecart, $p->montant_ecart, 2);
            }

            $vente = vente::create([
                'reference_vente' => 'V' . date('YmdHis'),
                'user_id' => $user,
                'client' => $request->client,
                'montant_brut' => $total_brut,
                'montant_proposee' => $total_propose,
                'montant_ecart' => $total_ecart,
                'montant_paye' => $request->montant_paye,
                'monnaie' => bcsub($request->montant_paye, $total_brut, 2),
                'mode_paiement' => 'cash'
            ]);

            foreach ($paniers as $p) {


                VenteDetail::create([
                    'vente_id' => $vente->id,
                    'article_id' => $p->article_id,
                    'entree_detail_id' => $p->entree_detail_id,
                    'consultation_id' => $p->consultation_id,
                    'service_id' => $p->service_id,
                    'analyse_id' => $p->analyse_id,
                    'kit_id' => $p->kit_id,
                    'prix_unitaire' => $p->p_u_brut,
                    'qte' => $p->qte,
                    'montant' => $p->montant_brut
                ]);

                if ($p->consultation_id != "") {
                    consultation::create([
                        'vente_id' => $vente->id,
                        'nom_patient' => $p->nom_patient,
                        'sex_patient' => $p->sex_patient,
                        'age_patient' => $p->age_patient,
                        'unite_age' => $p->unite_age,
                        'type_docteur' => $p->type_docteur,
                        'docteur' => $p->docteur
                    ]);
                }
            }

            panier::where('user_id', $user)->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'vente_id' => $vente->id,
                'has_consultation' => $paniers->whereNotNull('consultation_id')->count() > 0,
                'has_article' => $paniers->whereNotNull('article_id')->count() > 0
            ]);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }



    // ================================================================================================================================================================

    public function print_recu_consultation($id)
    {
        // Récupérer la vente et les relations
        $vente = Vente::with(['details.article', 'details.service', 'details.kit', 'user'])->findOrFail($id);

        $details = $vente->details;

        // $totalVente = $details->sum('montant');
        $totalVente = $vente->montant_brut;

        /*** ============================================================ ARTICLES =================== ***/
        $articles = "";
        $totalArticle = "";
        $payeArticle = "";
        $monnaieArticle = "";
        if ($details->whereNotNull('article_id')->count() > 0) {

            $articles = $details->whereNotNull('article_id');
            $totalArticle = $articles->sum('montant');

            $payeArticle = "0.00";
            if (bccomp($totalVente, "0", 2) > 0) {
                $ratio = bcdiv($totalArticle, $totalVente, 8);
                $payeArticle = bcmul($ratio, $vente->montant_paye, 2);
            }

            $monnaieArticle = bcsub($payeArticle, $totalArticle, 2);
            if (bccomp($monnaieArticle, "0", 2) < 0) {
                $ecart = bcmul($monnaieArticle, "-1", 2);
                $payeArticle = bcadd($payeArticle, $ecart, 2);
                $monnaieArticle = "0.00";
            }
        }
        /*** ============================================================= ANALYSE =================== ***/
        $analyses = "";
        $totalAnalyse = "";
        $payeAnalyse = "";
        $monnaieAnalyse = "";
        $nomsAnalyses = "";


        if ($details->whereNotNull('analyse_id')->count() > 0) {
            $analyses = $details->whereNotNull('analyse_id');
            $ids = collect($details)
                ->pluck('analyse_id')
                ->filter()
                ->flatMap(fn($item) => explode(',', $item))
                ->unique()
                ->values()
                ->toArray();

            $nomsAnalyses = analyse::whereIn('id', $ids)
                ->pluck('nom')
                ->implode(', ');

            $totalAnalyse = $analyses->sum('montant');

            $payeAnalyse = "0.00";
            if (bccomp($totalVente, "0", 2) > 0) {
                $ratio = bcdiv($totalAnalyse, $totalVente, 8);
                $payeAnalyse = bcmul($ratio, $vente->montant_paye, 2);
            }

            $monnaieAnalyse = bcsub($payeAnalyse, $totalAnalyse, 2);
            if (bccomp($monnaieAnalyse, "0", 2) < 0) {
                $ecart = bcmul($monnaieAnalyse, "-1", 2);
                $payeAnalyse = bcadd($payeAnalyse, $ecart, 2);
                $monnaieAnalyse = "0.00";
            }
        }

        /*** ============================================================= SERVICES =================== ***/
        $services = "";
        $ticketsService = [];
        if ($details->whereNotNull('service_id')->count() > 0) {

            $services = $details->whereNotNull('service_id');
            $totalService = $services->sum('montant');

            $payeService = "0.00";
            if (bccomp($totalVente, "0", 2) > 0) {
                $ratio = bcdiv($totalService, $totalVente, 8);
                $payeService = bcmul($ratio, $vente->montant_paye, 2);
            }

            $restePayeS = $payeService;

            $services = $services->values();

            foreach ($services as $index => $serv) {
                $_service = service::find($serv->service_id);
                $montantS = $serv->montant; //30

                if ($restePayeS >= $montantS) { //33    30
                    $payeS = $montantS;
                    $monnaieS = 0;
                    // $restePayeS -= $montantS;
                    $restePayeS = bcsub($restePayeS, $montantS, 2);
                } else {
                    $payeS = $restePayeS;
                    $monnaieS = 0;
                    $restePayeS = 0;
                }

                if ($index == $services->count() - 1) {
                    $payeS = bcadd($payeS, $restePayeS, 2);
                    $monnaieS = bcsub($payeS, $montantS, 2);
                }

                $ticketsService[] = [
                    'service' => $serv,
                    'serviceInfo' => $_service,
                    'montant' => $montantS,
                    'paye' => $payeS,
                    'monnaie' => $monnaieS
                ];
            }
        }
        /*** ============================================================= KITS =================== ***/
        $kits = "";
        $totalKit = "";
        $payeKit = "";
        $monnaieKit = "";

        if ($details->whereNotNull('kit_id')->count() > 0) {

            $kits = $details->whereNotNull('kit_id');
            $totalKit = $kits->sum('montant');

            $payeKit = "0.00";
            if (bccomp($totalVente, "0", 2) > 0) {
                $ratio = bcdiv($totalKit, $totalVente, 8);
                $payeKit = bcmul($ratio, $vente->montant_paye, 2);
            }

            $monnaieKit = bcsub($payeKit, $totalKit, 2);
            if (bccomp($monnaieKit, "0", 2) < 0) {
                $ecart = bcmul($monnaieKit, "-1", 2);
                $payeKit = bcadd($payeKit, $ecart, 2);
                $monnaieKit = "0.00";
            }
        }

        /*** ============================================================= CONSULTATIONS =================== ***/
        $consultations = "";
          $ticketsConsultation = [];
        if ($details->whereNotNull('consultation_id')->count() > 0) {

            $consultations = Consultation::with('docteurInfo')
                ->where('vente_id', $id)
                ->get();

            $totalConsultation = $details
                ->whereNotNull('consultation_id')
                ->sum('montant');



            $partPayeConsultation = "0.00";
            if (bccomp($totalVente, "0", 2) > 0) {
                $ratio = bcdiv($totalConsultation, $totalVente, 8);
                $partPayeConsultation = bcmul($ratio, $vente->montant_paye, 2);
            }

            $restePaye = $partPayeConsultation;

            $serviceConsult = service::find(1);
            $prixConsultation = $serviceConsult->prix_service;


            foreach ($consultations as $index => $consult) {
                $montant = $prixConsultation;

                if ($restePaye >= $montant) {
                    $paye = $montant;
                    $monnaie = 0;
                    // $restePaye -= $montant;
                    $restePaye = bcsub($restePaye, $montant, 2);
                } else {
                    $paye = $restePaye;
                    $monnaie = 0;
                    $restePaye = 0;
                }

                if ($index == $consultations->count() - 1) {
                    $paye = bcadd($paye, $restePaye, 2);
                    $monnaie = bcsub($paye, $montant, 2);
                }

                $ticketsConsultation[] = [
                    'consultation' => $consult,
                    'montant' => $montant,
                    'paye' => $paye,
                    'monnaie' => $monnaie
                ];
            }
        }


        /*** ============================================================== PDF =================== ***/
        $pdf = Pdf::loadView('Vente.partials.pdf.recu_consultation', [
            'vente' => $vente,

            'articles' => $articles,
            'totalArticle' => $totalArticle,
            'payeArticle' => $payeArticle,
            'monnaieArticle' => $monnaieArticle,

            'Consultation' => $ticketsConsultation,

            // 'Analyse' => $analyses,
            'totalAnalyse' => $totalAnalyse,
            'payeAnalyse' => $payeAnalyse,
            'monnaieAnalyse' => $monnaieAnalyse,
            'nomsAnalyses' => $nomsAnalyses,

            'Service' => $ticketsService,

            'kits' => $kits,
            'totalKit' =>  $totalKit,
            'payeKit' => $payeKit,
            'monnaieKit' => $monnaieKit,



        ]);

        $pdf->setPaper([0, 0, 226.77, 800], 'portrait');

        return $pdf->stream('recu_consultation.pdf');
    }
}
