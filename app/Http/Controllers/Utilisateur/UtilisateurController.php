<?php

namespace App\Http\Controllers\Utilisateur;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

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
    public function liste_utilisateur()
    {
        try {

            // Récupérer tous les utilisateurs

            $utilisateurs = User::with('roles')->get();

            $th = "
            <thead>
                <tr>
                    <th style='text-align: center;'>Photo</th>
                    <th style='text-align: center;'>Nom</th>
                    <th style='text-align: center;'>Nom d'utilisateur</th>
                    <th style='text-align: center;'>Rôle</th>
                    <th style='text-align: center;'>Actions</th>
                </tr>
            </thead>";

            $th .= '<tbody>';

            foreach ($utilisateurs as $utilisateur) {

                $role = $utilisateur->getRoleNames()->first();

                $imagePath = $utilisateur->image ? asset('storage/'.$utilisateur->image) : asset('images/avatar-s-14.png');

                $image = "<img src='{$imagePath}'
            width='40'
            height='40'
            style='border-radius:50%; object-fit:cover; border:1px solid #ddd;'>";

                $th .= "<tr>
                        <td style='width:5%'>{$image}</td>
                        <td style='width:20%'>{$utilisateur->name}</td>
                        <td style='width:20%'>{$utilisateur->username}</td>
                        <td style='width:10%'>{$role}</td>";

                $th .= "<td style='width:10%'>
                        <a class='primary edit mr-1'
                            id='user_{$utilisateur->id}'
                            data-name='{$utilisateur->name}'
                            data-username='{$utilisateur->username}'
                            data-role='{$role}'
                            data-image='{$utilisateur->image}'
                            onclick='edit_utilisateur({$utilisateur->id})'
                            data-action='edit_utilisateur'
                            data-id='{$utilisateur->id}'>
                            <i class='la la-pencil-square-o'></i>
                        </a>


                    </td>
                  </tr>";
            }

            $th .= '</tbody>';

            // var_dump($th);

            return response()->json([
                'success' => true,
                'data' => $th,
            ]);
        } catch (\Exception $e) {
            return response()->json($th, 500);
        }
    }

    public function charge_role()
    {
        try {

            $roles = Role::all();

            $opt = '';

            foreach ($roles as $role) {
                $opt .= "<option value='{$role->name}' >{$role->name}</option>";
            }

            return response()->json([
                'success' => true,
                'data' => $opt,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // public function ajout_utilisateur(StoreUserRequest $request)
    // {
    //     try {

    //         if ($request->role === 'superAdmin' && !auth()->user()->hasRole('superAdmin')) {
    //             abort(403);
    //         }

    //         // Upload image
    //         $imagePath = null;

    //         if ($request->hasFile('image')) {
    //             $imagePath = $request->file('image')
    //                 ->store('users', 'public');
    //         }

    //         if($request->id_utilisateur !== ""){

    //             $user = User::findOrFail($request->id_utilisateur);

    //             // Supprimer l'ancienne image si une nouvelle est téléchargée
    //             if ($imagePath && $user->image) {
    //                 Storage::disk('public')->delete($user->image);
    //             }

    //             // Mise à jour utilisateur
    //             $user->update([
    //                 'name' => $request->name,
    //                 'username' => $request->username,
    //                 'image' => $imagePath ?? $user->image,
    //             ]);

    //              if ($request->filled('password')) {
    //                 $user->password = Hash::make($request->password);
    //                 $user->save();
    //             }

    //             // Synchronisation rôle
    //             $user->syncRoles($request->role);

    //         }else{

    //             // Création utilisateur
    //             $user = User::create([
    //                 'name' => $request->name,
    //                 'username' => $request->username,
    //                 'password' => Hash::make($request->password),
    //                 'image' => $imagePath,
    //             ]);

    //             // Attribution rôle
    //             $user->assignRole($request->role);
    //         }

    //         return response()->json([
    //             'status' => 'success' ,
    //         ]);

    //     } catch (\Exception $e) {

    //         return response()->json([
    //             'status' => 'error',
    //             'message' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    public function ajout_utilisateur(StoreUserRequest $request)
    {
        try {

            // 🔐 sécurité rôle
            if ($request->role === 'superAdmin' && ! auth()->user()->hasRole('superAdmin')) {
                abort(403);
            }

            DB::beginTransaction();

            $user = null;
            $imagePath = null;
            dd([
                'hasFile' => $request->hasFile('image'),
                'file' => $request->file('image'),
            ]);
            // 📸 upload image (si existe)
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('users', 'public');
            }

            // ================== UPDATE ==================
            if (! empty($request->id_utilisateur)) {

                $user = User::findOrFail($request->id_utilisateur);

                // supprimer ancienne image si nouvelle
                if ($imagePath && $user->image) {
                    Storage::disk('public')->delete($user->image);
                }

                $data = [
                    'name' => $request->name,
                    'username' => $request->username,
                    'image' => $imagePath ?? $user->image,
                ];

                // 🔐 password optionnel
                if ($request->filled('password')) {
                    $data['password'] = Hash::make($request->password);
                }

                $user->update($data);

                $user->syncRoles([$request->role]);

            }
            // ================== CREATE ==================
            else {

                $user = User::create([
                    'name' => $request->name,
                    'username' => $request->username,
                    'password' => Hash::make($request->password),
                    'image' => $imagePath,
                ]);

                $user->assignRole($request->role);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
