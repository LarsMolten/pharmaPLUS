<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Article\ArticleController;
use App\Http\Controllers\Dashboard\Dashboard;
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
});


// Route pour le dashboard
// Route::get('/dashboard', [Dashboard::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard.index');

//  ROUTES ARTICLE
// Route::get('/article', [ArticleController::class, 'index'])->name('article.index'); // Affiche la vue
Route::get('/liste_article', [ArticleController::class, 'liste_article'])->name('liste_article'); // Retourne JSON
Route::get('/charge_unite', [ArticleController::class, 'charge_unite'])->name('charge_unite'); // Retourne JSON des unités
Route::post('/ajout_article', [ArticleController::class, 'ajout_article'])->name('ajout_article'); // Ajoute et modificatio un article
Route::post('/delete_article', [ArticleController::class, 'delete_article'])->name('delete_article'); // Supprime un article
Route::resource('article', ArticleController::class); // Routes RESTful pour les articles










require __DIR__.'/auth.php';
