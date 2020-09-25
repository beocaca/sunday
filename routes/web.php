<?php

use App\Actions\Sunday\CreateTask;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\StageController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Notifications\Action;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// pages
Route::middleware(['auth:sanctum', 'verified'])->group(function() {
    Route::get('/dashboard', [BoardController::class, 'list'])->name('dashboard');
    Route::get('/boards/{id}', [BoardController::class, 'edit'])->name('boards');
});

// resource route
Route::middleware(['auth:sanctum', 'verified'])->group(function() {
    Route::apiResource('/items', ItemController::class);
    Route::apiResource('/stages', StageController::class);
    Route::apiResource('/api/boards', BoardController::class);
});
