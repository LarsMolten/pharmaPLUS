<?php

namespace App\Imports;

use App\Models\Article\article;
use App\Models\EntreeDetail\entree_detail;
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

        foreach ($rows as $row) {

            $ref = trim($row[0]); //REF-008
            $id_article = $this->parseReference($ref); //8

            $article = article::where('id', $id_article)->first();

            if (! $article) {
                continue; // ignore article inexistant
            }

            // -------- Quantité --------
            $qte = explode('/', $row[1]); // 2/200

            $boite = trim($qte[0]);
            $qte_unite = trim($qte[1]);

            $stock_dispo_detail = $article->stock; //en unité

            // -------- Prix --------
            $prix_boite = $this->cleanPrice($row[2]);
            $p_u = $prix_boite / ($article->presentation);

            $prix_unitaire_vente = $p_u + ($p_u * 20 / 100); //+20%

            // -------- Date --------
            $date_peremption = $this->parseDate($row[4]);

            // -------- Calculs --------
            // $stock_unite = $boite * $unite;

            $lot = $this->generateLot($article->id, $date_peremption);

            entree_detail::create([

                'entree_indices_id' => $this->entree_index_id,
                'article_id' => $article->id,
                'lot' => $lot,

                'qte_initial' => $article->stock,
                'qte_entree' => $boite,

                'stock_dispo' => $stock_dispo_detail + $qte_unite,

                'prix_achat_boite' => $prix_boite,
                'prix_unitaire' => $prix_unitaire_vente,

                'montant_entree' => $prix_unitaire_vente * $qte_unite,

                'nb_lot_dispo' => 1,

                'date_peremption' => $date_peremption,
            ]);
        }
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
        return 'LOT-'.$article.'-'.date('Ymd').'-'.date('Ym', strtotime($date));
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

        return Carbon::create($year,$month,1);
    }
}
