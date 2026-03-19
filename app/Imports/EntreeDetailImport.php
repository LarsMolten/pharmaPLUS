<?php

namespace App\Imports;

use App\Models\Article\article;
use App\Models\EntreeDetail\entree_detail;
use App\Models\EntreeIndex\entree_index;
use App\Models\pourcentage;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class EntreeDetailImport implements ToCollection
{
    /**
     * @param  Collection  $collection
     */
    protected $entree_index_id;


    public function __construct($entree_index_id)
    {
        $this->entree_index_id = $entree_index_id;
    }


    public function collection(Collection $rows)
    {


        unset($rows[0]); // supprimer la première ligne
        unset($rows[1]); // supprimer la deuxieme ligne
        $pourcent = pourcentage::first();
        $pourcentage = $pourcent->pourcentage;

        foreach ($rows as $row) {

            $ref = trim($row[0]); //REF-008
            $id_article = $this->parseReference($ref); //8

            $article = article::where('id', $id_article)->first();

            if (! $article) {
                continue; // ignore article inexistant
            }

            // -------- Quantité --------
            $qte = explode('/', $row[5]); // 2/200

            $boite = trim($qte[0]);
            $qte_unite = (int)trim($qte[1]);

            // -------- Prix --------
            $prix_boite = $this->cleanPrice($row[8]);
            $p_u = $prix_boite / ($article->presentation);

            $prix_unitaire_vente = $p_u + ($p_u * $pourcentage / 100); //+20%
            $pu_proposee = bcmul(round($prix_unitaire_vente / 100), 100, 2);

            // -------- Date --------
            $date_peremption = $this->parseDate($row[11]);

            // -------- Calculs --------
            // $stock_unite = $boite * $unite;

            // incrementation nombre d'article entré


            $lot = $this->generateLot($article->id, $date_peremption);


            entree_detail::create([

                'entree_indices_id' => $this->entree_index_id,
                'article_id' => $article->id,
                'lot' => $lot,

                'qte_initial' => $article->stock,
                'qte_entree' => $qte_unite,

                'prix_achat_boite' => $prix_boite,

                'prix_unitaire' => $prix_unitaire_vente,
                'pu_proposee' => $pu_proposee,

                'montant_entree' => bcmul($prix_boite, $boite, 2),
                'montant_gain_brut' => bcmul($prix_unitaire_vente, $qte_unite, 2),
                'montant_gain_proposee' => bcmul($pu_proposee, $qte_unite, 2),

                'date_peremption' => $date_peremption,
            ]);
        }
        return "success";
    }



    // Traiteur de Référence pour avoir le id tout buite
    private function parseReference($value)
    {
        $parts = explode('-', $value);

        return (int) trim($parts[1]);
    }



    // generation automatique le numéro Lot
    private function generateLot($article, $date)
    {
        return 'LOT-' . $article . '-' . date('ymd') . '-' . date('ym', strtotime($date));
    }



    // Nettoyeur du colonne Prix
    private function cleanPrice($price)
    {
        $price = str_replace('Ar', '', $price);
        $price = str_replace(' ', '', $price);
        $price = str_replace('.', '', $price);
        $price = str_replace(',', '.', $price);

        return floatval($price);
    }



    // Traiteur et formateur de date de péremption
    private function parseDate($text)
    {
        $mois = [

            'Janvier' => 1,
            'Février' => 2,
            'Mars' => 3,
            'Avril' => 4,
            'Mai' => 5,
            'Juin' => 6,
            'Juillet' => 7,
            'Août' => 8,
            'Septembre' => 9,
            'Octobre' => 10,
            'Novembre' => 11,
            'Décembre' => 12,
        ];

        $parts = explode(' ', $text);

        $month = $mois[$parts[0]];
        $year = $parts[1];

        return Carbon::create($year, $month, 1);
    }
}
