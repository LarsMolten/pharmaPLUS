<?php

namespace App\Http\Controllers\ListeVente;

use App\Http\Controllers\Controller;
use App\Models\Vente\vente;
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
            // dd($ventes);

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
                            <td style='width:10%; text-align: right;' class='format-prix'>{$vente->user->name}</td>
                            <td style='width:10%; text-align: right;' class='format-prix'>{$vente->created_at}</td> ";

                $th .= "<td style='width:5%'>
                          
                             <a class='success mr-1' data-action='afficher_detail_vente' data-id='{$vente->id}'  ><i class='la la-list'></i></a>
                        </td>
                        
                    </tr>";
            }

            $th .= "</tbody>";

           

            // $pan = "
            //          <h1 class='content-header-title text-center white format-prix'
            //                              style='font-weight: 800; font-size: 45px '>{$total_brut} Ar</h1>





            // ";

            //  <h6  class='mx-2 row white'> 
            //                              <p class='col-6' style='text-align: left;'>Brut : <span class='format-prix'>$total_brut</span> Ar</p>
            //                              <p class='col-6' style='text-align: right;'> Ecart : <span class ='format-prix'>$total_ecart</span> Ar</p> 
            //                             </h6>





            return response()->json([
                'success' => true,
                'data' => $th,
                // 'pan' => $pan,
            ]);
        } catch (\Exception $th) {
            return response()->json($th, 500);
        }
    }
}
