<?php

use App\Http\Controllers\Article\ArticleController;
use App\Http\Controllers\Dashboard\Dashboard;
use Illuminate\Support\Facades\Route;

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
    return view('dashboard.index');
});

// Route pour le dashboard
Route::get('/dashboard', [Dashboard::class, 'index'])->name('dashboard.index');

//  ROUTES ARTICLE
// Route::get('/article', [ArticleController::class, 'index'])->name('article.index'); // Affiche la vue
Route::get('/liste_article', [ArticleController::class, 'liste_article'])->name('liste_article'); // Retourne JSON
Route::get('/charge_unite', [ArticleController::class, 'charge_unite'])->name('charge_unite'); // Retourne JSON des unités
Route::post('/ajout_article', [ArticleController::class, 'ajout_article'])->name('ajout_article'); // Ajoute et modificatio un article
Route::post('/delete_article', [ArticleController::class, 'delete_article'])->name('delete_article'); // Supprime un article
Route::resource('article', ArticleController::class); // Routes RESTful pour les articles


