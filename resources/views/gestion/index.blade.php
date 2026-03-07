@extends('layouts.app')

@section('title', 'Page - Gestion')

@section('app-content')

    <section class="page-wrapper" data-page="gestion">
        <div class="row">

            <div class="col-12">
                <div class="card" id="card_tab_gestion">
                    <div class="card-header">
                        <h4 class="card-title">Gestion de catalogues</h4>
                    </div>
                    <div class="card-content">
                        <div class="card-body">

                            <ul class="nav nav-tabs nav-top-border no-hover-bg nav-justified">
                                <li class="nav-item">
                                    <a class="nav-link active" id="active-tab1" data-toggle="tab" href="#active1"
                                        aria-controls="active1" aria-expanded="true">Analyse</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="link-tab1" data-toggle="tab" href="#link1"
                                        aria-controls="link1" aria-expanded="false">Catégorie</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="link-tab2" data-toggle="tab" href="#link2"
                                        aria-controls="link2" aria-expanded="false">Services médicaux</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="linkOpt-tab1" data-toggle="tab" href="#linkOpt1"
                                        aria-controls="linkOpt1">Kit médicaux</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="linkOpt-tab2" data-toggle="tab" href="#linkOpt2" data-action="charge_options"
                                        aria-controls="linkOpt2">Details Kit</a>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>
                <div class="tab-content px-1 pt-1">
                    <div role="tabpanel" class="tab-pane active" id="active1" aria-labelledby="active-tab1"
                        aria-expanded="true">
                        @include('gestion.ongletAnalyse')
                    </div>
                    <div class="tab-pane" id="link1" role="tabpanel" aria-labelledby="link-tab1" aria-expanded="false">
                        @include('gestion.ongletCategorie')
                    </div>
                    <div class="tab-pane" id="link2" role="tabpanel" aria-labelledby="link-tab2" aria-expanded="false">
                        @include('gestion.ongletService')
                    </div>
                    <div class="tab-pane" id="linkOpt1" role="tabpanel" aria-labelledby="linkOpt-tab1"
                        aria-expanded="false">
                        @include('gestion.ongletKit')
                    </div>
                    <div class="tab-pane" id="linkOpt2" role="tabpanel" aria-labelledby="linkOpt-tab2"
                        aria-expanded="false">
                        @include('gestion.ongletDetailKit')
                    </div>
                </div>
            </div>


    </section>

@endsection
