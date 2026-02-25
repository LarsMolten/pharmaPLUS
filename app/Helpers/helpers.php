<?php

use Illuminate\Support\Facades\Route;

if (!function_exists('activeMenu')) {
    function activeMenu($route)
    {
        return request()->routeIs($route) ? 'active' : '';
    }
}
