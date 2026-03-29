<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Article\ArticleController;
use App\Http\Controllers\Utilisateur\UtilisateurController;
use App\Http\Controllers\Analyse\AnalyseController;
use App\Http\Controllers\Gestion\GestionController;
use App\Http\Controllers\Categorie\CategorieController;
use App\Http\Controllers\Service\ServiceController;
use App\Http\Controllers\Dashboard\Dashboard;
use App\Http\Controllers\DetailKit\DetailKitController;
use App\Http\Controllers\Kit\KitController;
use App\Http\Controllers\Entree\EntreeIndexController;
use App\Http\Controllers\EntreeDetail\EntreeDetailController;
use App\Http\Controllers\Panier\PanierController;
use App\Http\Controllers\Vente\VenteController;
use App\Models\Analyse\analyse;
use App\Models\Kit\kit;
use App\Models\Vente\vente;
use Spatie\Permission\Models\Role;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Route::get('/dashboard', function () {
    return view('dashboard.index');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    // Route pour le dashboard
    // Route::get('/dashboard', [Dashboard::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard.index');

    //  ROUTES ARTICLE
    Route::get('/article', [ArticleController::class, 'index'])->name('article.index'); // Affiche la vue
    Route::get('/liste_article', [ArticleController::class, 'liste_article'])->name('liste_article'); // Retourne JSON
    Route::post('/liste_stock_detail', [ArticleController::class, 'liste_stock_detail'])->name('liste_stock_detail'); // Retourne JSON
    Route::get('/charge_unite', [ArticleController::class, 'charge_unite'])->name('charge_unite'); // Retourne JSON des unités
    Route::post('/ajout_article', [ArticleController::class, 'ajout_article'])->name('ajout_article'); // Ajoute et modificatio un article
    Route::post('/delete_article', [ArticleController::class, 'delete_article'])->name('delete_article'); // Supprime un article
    // Route::resource('article', ArticleController::class); // Routes RESTful pour les articles

    // ROUTES UTILISATEUR
    Route::get('/utilisateur', [UtilisateurController::class, 'index'])->name('utilisateur.index');
    Route::get('/liste_utilisateur', [UtilisateurController::class, 'liste_utilisateur'])->name('liste_utilisateur');
    Route::get('/charge_role', [UtilisateurController::class, 'charge_role'])->name('charge_role');
    Route::post('/ajout_utilisateur', [UtilisateurController::class, 'ajout_utilisateur'])->name('ajout_utilisateur');

    // Route pour les Gestions
    Route::get('/gestion', [GestionController::class, 'index'])->name('gestion.index');

    Route::get('/liste_analyse', [AnalyseController::class, 'liste_analyse'])->name('liste_analyse');
    Route::post('/ajout_analyse', [AnalyseController::class, 'ajout_analyse'])->name('ajout_analyse');
    Route::post('/delete_analyse', [AnalyseController::class, 'delete_analyse'])->name('delete_analyse');

    Route::get('/liste_categorie', [CategorieController::class, 'liste_categorie'])->name('liste_categorie');
    Route::post('/ajout_categorie', [CategorieController::class, 'ajout_categorie'])->name('ajout_categorie');
    Route::post('/delete_categorie', [CategorieController::class, 'delete_categorie'])->name('delete_categorie');

    Route::get('/liste_service', [ServiceController::class, 'liste_service'])->name('liste_service');
    Route::get('/charge_categorie', [ServiceController::class, 'charge_categorie'])->name('charge_categorie');
    Route::get('/charge_service', [ServiceController::class, 'charge_service'])->name('charge_service');
    Route::post('/ajout_service', [ServiceController::class, 'ajout_service'])->name('ajout_service');
    Route::post('/delete_service', [ServiceController::class, 'delete_service'])->name('delete_service');

    Route::get('/liste_kit', [KitController::class, 'liste_kit'])->name('liste_kit');
    Route::post('/ajout_kit', [KitController::class, 'ajout_kit'])->name('ajout_kit');
    Route::post('/delete_kit', [KitController::class, 'delete_kit'])->name('delete_kit');

    Route::get('/liste_detailkit', [DetailKitController::class, 'liste_detailkit'])->name('liste_detailkit');
    Route::get('/charge_kit', [DetailKitController::class, 'charge_kit'])->name('charge_kit');
    Route::get('/charge_article', [DetailKitController::class, 'charge_article'])->name('charge_article');
    Route::post('/ajout_detailkit', [DetailKitController::class, 'ajout_detailkit'])->name('ajout_detailkit');

    // Entré article
    Route::get('/entreeIndex', [EntreeIndexController::class, 'index'])->name('entreeIndex');
    Route::get('/liste_entreeIndex', [EntreeIndexController::class, 'liste_entreeIndex'])->name('liste_entreeIndex');
    Route::post('/ajout_entreeIndex', [EntreeIndexController::class, 'ajout_entreeIndex'])->name('ajout_entreeIndex');
    Route::post('/delete_entree_index', [EntreeIndexController::class, 'delete_entree_index'])->name('delete_entree_index');

    // entrée detail
    Route::post('/liste_entreeDetail', [EntreeDetailController::class, 'liste_entreeDetail'])->name('liste_entreeDetail');
    Route::post('/ajout_entree_detail', [EntreeDetailController::class, 'ajout_entree_detail'])->name('ajout_entree_detail');
    Route::post('/import_excel', [EntreeDetailController::class, 'import_excel'])->name('import_excel');
    Route::post('/valider_entree_detail', [EntreeDetailController::class, 'valider_entree_detail'])->name('valider_entree_detail');
    Route::post('/annuler_validation_entree_detail', [EntreeDetailController::class, 'annuler_validation_entree_detail'])->name('annuler_validation_entree_detail');
    Route::get('/charge_article', [EntreeDetailController::class, 'charge_article'])->name('charge_article');
    Route::post('/modifier_proposition_pu', [EntreeDetailController::class, 'modifier_proposition_pu'])->name('modifier_proposition_pu');
    Route::post('/delete_entree_detail', [EntreeDetailController::class, 'delete_entree_detail'])->name('delete_entree_detail');


    // Vente
    Route::get('/afficher_panier', [PanierController::class, 'index'])->name('afficher_panier');
    Route::get('/liste_panier', [PanierController::class, 'liste_panier'])->name('liste_panier');
    Route::get('/charger_detail_article', [PanierController::class, 'charger_detail_article'])->name('charger_detail_article');
    Route::get('/charge_article_vente', [PanierController::class, 'charge_article_vente'])->name('charge_article_vente');
    Route::post('/ajout_panier', [PanierController::class, 'ajout_panier'])->name('ajout_panier');  // ***************************************standart*************
    Route::post('/delete_one_or_all_panier', [PanierController::class, 'delete_one_or_all_panier'])->name('delete_one_or_all_panier');
    Route::get('/charge_analyse', [AnalyseController::class, 'charge_analyse'])->name('charge_analyse');
    Route::get('/charge_kit', [KitController::class, 'charge_kit'])->name('charge_kit');
    Route::post('/charge_personnel', [ServiceController::class, 'charge_personnel'])->name('charge_personnel');

    // Route::get('/charge_info_patient', [VenteController::class, 'charge_info_patient'])->name('charge_info_patient');
    Route::get('/charge_info_patient', [VenteController::class, 'charge_info_patient'])->name('charge_info_patient');
    Route::post('/valider_vente', [VenteController::class, 'valider_vente'])->name('valider_vente');

    Route::get('/print_recu_article/{id}', [VenteController::class, 'print_recu_article'])->name('print.recu.article');
    Route::get('/print_recu_consultation/{id}', [VenteController::class, 'print_recu_consultation'])->name('print.recu.consultation');

    Route::get('/print_recu_complet/{id}', [VenteController::class, 'print_recu_complet'])->name('print.recu.complet');








});

require __DIR__ . '/auth.php';
