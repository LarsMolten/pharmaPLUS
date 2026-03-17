<?php

namespace App\Http\Controllers\Panier;

use App\Http\Controllers\Controller;
use App\Models\Panier\panier;
use Illuminate\Http\Request;

class PanierController extends Controller
{
    public function index()
    {
        return view('vente.vente_layout');
    }



    public function liste_panier()
    {
        try {

            $paniers = panier::all();
            // dd($paniers);
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
            foreach ($paniers as $panier) {

                $designation = "";
                $produit_id = "";



                $th .= "<tr>
                            <td  style='width:5%'>{$_n}</td>
                            <td  style='width:20%'>{$designation}</td>
                            <td  style='width:5%'>{$panier->p_u}</td>
                            <td style='width:5%'>{$panier->qte}</td>
                            <td style='width:10%'>{$panier->montant}</td> ";
                // on a utilisé SPA pour éviter de recharger la page à chaque action, donc on a besoin de l'id passer en 'data-id' de l'article pour faire les actions d'édition et de suppression en ajax par data-action
                $th .= "<td style='width:5%'>

                            <a class='primary edit mr-1' 
                              data-qte='{$panier->qte}'
                             id='art_{$panier->id}' data-action='edit_panier' data-id='{$produit_id}'><i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' data-action='delete_panier' data-id='{$panier->id}' ><i class='la la-trash-o'></i></a>
                        </tr>";

                        $_n++;
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
}
