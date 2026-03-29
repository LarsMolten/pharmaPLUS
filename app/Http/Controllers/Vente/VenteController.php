<?php

namespace App\Http\Controllers\Vente;

use App\Http\Controllers\Controller;
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
                'montant_brut' => $total_brut,
                'montant_proposee' => $total_propose,
                'montant_ecart' => $total_ecart,
                'montant_paye' => $request->montant_paye,
                'monnaie' => bcsub($request->montant_paye, $total_propose, 2),
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

    // impression reçu pdf pour les articles
    // public function print_recu_article($id)
    // {
    //     $vente = Vente::with('details.article', 'user')->findOrFail($id);

    //     $details = $vente->details;

    //     $totalArticle = $details
    //         ->whereNotNull('article_id')
    //         ->sum('montant');

    //     $totalVente = $details->sum('montant');

    //     $payeArticle = "0.00";

    //     if (bccomp($totalVente, "0", 2) > 0) {

    //         $ratio = bcdiv($totalArticle, $totalVente, 6);

    //         $payeArticle = bcmul($ratio, $vente->montant_paye, 2);
    //     }

    //     // Calcul monnaie
    //     $monnaieArticle = bcsub($payeArticle, $totalArticle, 2);

    //     // Correction si monnaie négative (problème d'arrondi)
    //     if (bccomp($monnaieArticle, "0", 2) < 0) {

    //         $ecart = bcmul($monnaieArticle, "-1", 2);

    //         $payeArticle = bcadd($payeArticle, $ecart, 2);

    //         $monnaieArticle = "0.00";
    //     }

    //     // créer une instance
    //     $generator = new DNS1D();
    //     $generator->setStorPath(public_path('images/barcodes/')); // chemin temporaire (optionnel)

    //     // générer le code-barres en base64
    //     $barcodeBase64 = 'data:image/png;base64,' . $generator->getBarcodePNG($vente->reference_vente, 'C128', 1, 30);

    //     $pdf = Pdf::loadView(
    //         'Vente.partials.pdf.recu_vente',
    //         [
    //             'vente' => $vente,
    //             'sous_total' => $totalArticle,
    //             'paye' => $payeArticle,
    //             'monnaie' => $monnaieArticle,
    //             'net_payer' => $totalArticle,
    //             'codeBarre' => $barcodeBase64,
    //         ]
    //     );

    //     $pdf->setPaper([0, 0, 226.77, 1000], 'portrait');

    //     return $pdf->stream('recu_vente.pdf');
    // }


    // public function print_recu_consultation($id)
    // {


    //     $vente = Vente::findOrFail($id);
    //     $consultations = Consultation::with('docteurInfo')
    //         ->where('vente_id', $id)
    //         ->get();

    //     $details = VenteDetail::where('vente_id', $id)->get();

    //     $totalConsultation = $details
    //         ->whereNotNull('consultation_id')
    //         ->sum('montant');

    //     $totalVente = $details->sum('montant');

    //     $partPayeConsultation = 0;
    //     if (bccomp($totalVente, "0", 2) > 0) {

    //         $ratio = bcdiv($totalConsultation, $totalVente, 6);
    //         $partPayeConsultation = bcmul($ratio, $vente->montant_paye, 2);
    //     }

    //     $restePaye = $partPayeConsultation;

    //     $cons = service::find(1);
    //     $prixConsultation = $cons->prix_service;


    //     $tickets = [];

    //     foreach ($consultations as $index => $consultation) {

    //         $montant = $prixConsultation;

    //         if ($restePaye >= $montant) {

    //             $paye = $montant;
    //             $monnaie = 0;

    //             $restePaye -= $montant;
    //         } else {

    //             $paye = $restePaye;
    //             $monnaie = 0;

    //             $restePaye = 0;
    //         }

    //         // si dernier ticket → ajouter monnaie restante
    //         if ($index == $consultations->count() - 1) {

    //             $paye += $restePaye;
    //             $monnaie = $paye - $montant;
    //         }

    //         $tickets[] = [
    //             'consultation' => $consultation,
    //             'montant' => $montant,
    //             'paye' => $paye,
    //             'monnaie' => $monnaie
    //         ];
    //     }

    //     $pdf = PDF::loadView(
    //         'Vente.partials.pdf.recu_consultation',
    //         compact('vente', 'tickets')
    //     );

    //     $pdf->setPaper([0, 0, 226.77, 800]);

    //     return $pdf->stream('recu_consultation.pdf');
    // }





    // ================================================================================================================================================================

    public function print_recu_consultation($id)
    {
        // Récupérer la vente et les relations
        $vente = Vente::with(['details.article', 'user'])->findOrFail($id);

        $details = $vente->details;

        $totalVente = $details->sum('montant');

        /*** ============================================================ ARTICLES =================== ***/
        $articles = $details->whereNotNull('article_id');
        $totalArticle = $articles->sum('montant');

        $payeArticle = "0.00";
        if (bccomp($totalVente, "0", 2) > 0) {
            $ratio = bcdiv($totalArticle, $totalVente, 6);
            $payeArticle = bcmul($ratio, $vente->montant_paye, 2);
        }

        $monnaieArticle = bcsub($payeArticle, $totalArticle, 2);
        if (bccomp($monnaieArticle, "0", 2) < 0) {
            $ecart = bcmul($monnaieArticle, "-1", 2);
            $payeArticle = bcadd($payeArticle, $ecart, 2);
            $monnaieArticle = "0.00";
        }

        /*** ============================================================= CONSULTATIONS =================== ***/

        $consultations = Consultation::with('docteurInfo')
            ->where('vente_id', $id)
            ->get();
            
        $totalConsultation = $details
            ->whereNotNull('consultation_id')
            ->sum('montant');



        $partPayeConsultation = "0.00";
        if (bccomp($totalVente, "0", 2) > 0) {
            $ratio = bcdiv($totalConsultation, $totalVente, 6);
            $partPayeConsultation = bcmul($ratio, $vente->montant_paye, 2);
        }

        $restePaye = $partPayeConsultation;

        $serviceConsult = service::find(1);
        $prixConsultation = $serviceConsult->prix_service;

        $ticketsConsultation = [];
        foreach ($consultations as $index => $consult) {
            $montant = $prixConsultation;

            if ($restePaye >= $montant) {
                $paye = $montant;
                $monnaie = 0;
                $restePaye -= $montant;
            } else {
                $paye = $restePaye;
                $monnaie = 0;
                $restePaye = 0;
            }

            if ($index == $consultations->count() - 1) {
                $paye += $restePaye;
                $monnaie = $paye - $montant;
            }

            $ticketsConsultation[] = [
                'consultation' => $consult,
                'montant' => $montant,
                'paye' => $paye,
                'monnaie' => $monnaie
            ];
        }











        /*** ============================================================== PDF =================== ***/
        $pdf = Pdf::loadView('Vente.partials.pdf.recu_consultation', [
            'vente' => $vente,
            'articles' => $articles,

            'totalArticle' => $totalArticle,
            'payeArticle' => $payeArticle,
            'monnaieArticle' => $monnaieArticle,

            'Consultation' => $ticketsConsultation,

        ]);

        $pdf->setPaper([0, 0, 226.77, 800], 'portrait');

        return $pdf->stream('recu_consultation.pdf');
    }
}
