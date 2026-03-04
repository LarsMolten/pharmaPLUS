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
                                        aria-controls="link1" aria-expanded="false">Echographie</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="link-tab2" data-toggle="tab" href="#link2"
                                        aria-controls="link2" aria-expanded="false">Radiographie</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="linkOpt-tab1" data-toggle="tab" href="#linkOpt1"
                                        aria-controls="linkOpt1">Kit Medicament</a>
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
                        @include('gestion.ongletEchographie')
                    </div>
                    <div class="tab-pane" id="link2" role="tabpanel" aria-labelledby="link-tab2" aria-expanded="false">
                        <p>Chocolate bar gummies sesame snaps. Liquorice cake sesame snaps cotton candy cake
                            sweet
                            brownie.
                        </p>
                    </div>
                    <div class="tab-pane" id="linkOpt1" role="tabpanel" aria-labelledby="linkOpt-tab1"
                        aria-expanded="false">
                        <p>Cookie icing tootsie roll cupcake jelly-o sesame snaps. Gummies cookie dragée cake
                            jelly
                            marzipan
                            donut pie macaroon. Gingerbread powder chocolate cake icing. Cheesecake gummi bears
                            ice
                            cream
                            marzipan.</p>
                    </div>
                </div>
            </div>


    </section>

@endsection
