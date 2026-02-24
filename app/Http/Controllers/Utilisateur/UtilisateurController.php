<?php

namespace App\Http\Controllers\Utilisateur;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProfileUpdateRequest;


class UtilisateurController extends Controller
{
     public function __construct()
    {
        $this->middleware(['auth', 'role:superAdmin']);
    }

    public function index()
    {
        return view('utilisateur.index');
    }


      // affichage de la liste des utilisateurs en json
    public function liste_utilisateur(){
        try {

            // Récupérer tous les utilisateurs
            $utilisateurs = User::all();

            $th = "
                <thead>
                    <tr>
                        <th style='text-align: center;'>Id</th>
                        <th style='text-align: center;'>Photo</th>
                        <th style='text-align: center;'>Nom</th>
                        <th style='text-align: center;'>Nom d'utilisateur</th>
                        <th style='text-align: center;'>Rôle</th>
                        <th style='text-align: center;'>Actions</th>
                    </tr>
                </thead>";

            $th .="<tbody>";
            foreach($utilisateurs as $utilisateur){




                $th .= "<tr>
                            <td  style='width:5%'>REF-{$utilisateur->id}</td>
                            <td  style='width:5%'>REF-{$utilisateur->image}</td>
                            <td  style='width:20%'>{$utilisateur->name}</td>
                            <td  style='width:20%'>{$utilisateur->username}</td>
                            <td  style='width:10%'>{$utilisateur->role}</td> ";

                $th .= "<td style='width:10%'>
                            <a class='primary edit mr-1' data-name='{$utilisateur->name}'
                             data-presentation='{$utilisateur->username}'  data-role='{$utilisateur->role}' data-image='{$utilisateur->image}'
                             id='user_{$utilisateur->id}' onclick='edit_utilisateur({$utilisateur->id})'><i class='la la-pencil-square-o'></i></a>

                             <a class='danger delete mr-1' onclick='delete_utilisateur({$utilisateur->id})' ><i class='la la-trash-o'></i></a>
                        </tr>";
            }
            $th .="</tbody>";


        return response()->json([
            'success' => true,
            'data' => $th
        ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }



}
