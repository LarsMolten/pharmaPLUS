<!DOCTYPE html>
<html class="loading" lang="fr" data-textdirection="ltr">
<!-- BEGIN: Head-->

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
    {{-- <meta name="description"
        content="Modern admin is super flexible, powerful, clean &amp; modern responsive bootstrap 4 admin template with unlimited possibilities with bitcoin dashboard."> --}}
    {{-- <meta name="keywords"
        content="admin template, modern admin template, dashboard template, flat admin template, responsive admin template, web app, crypto dashboard, bitcoin dashboard"> --}}
    {{-- <meta name="author" content="PIXINVENT"> --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title')</title>


    {{-- BEGIN: Style --}}
    @include('layouts.partials.styles')
    {{-- END: Style --}}



</head>
<!-- END: Head-->

<!-- BEGIN: Body-->

<body class="vertical-layout vertical-menu-modern 2-columns   fixed-navbar" data-open="click"
    data-menu="vertical-menu-modern" data-col="2-columns">

    <!-- BEGIN: Header-->
    @include('layouts.partials.header.header')
    <!-- END: Header-->

    <!-- BEGIN: Main Menu-->
    @include('layouts.partials.menus.menu')
    <!-- END: Main Menu-->




    <!-- BEGIN: Content-->
    <div class="app-content content">
        <div class="content-overlay"></div>
        <div class="content-wrapper">

            <div id="main-content">

                @yield('app-content')

            </div>


        </div>
    </div>
    <!-- END: Content-->
    <div class="sidenav-overlay"></div>
    <div class="drag-target"></div>





    <!-- BEGIN: Footer-->
    @include('layouts.partials.footer.footer')
    <!-- END: Footer-->


    @include('layouts.partials.script')


    {{-- @stack('scripts-page')  --}}

</body>
<!-- END: Body-->

</html>
