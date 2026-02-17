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
Route::resource('article', ArticleController::class); // Routes RESTful pour les articles


