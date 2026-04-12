@extends('layouts.app')

@section('title', 'Page - Liste vente')


{{--     
@section('content-filter')
    
@endsection --}}

@section('app-content')
    <section class="page-wrapper" data-page="listeVente">
        <div class="row">
            <div class="col-12">

                <div class="row" id="card_stat_histo">
                    <div class="col-xl-2 col-lg-3 col-12">
                        <div class="card pull-up ">
                            <div class="card-content ">
                                <div class="card-body">
                                    <div class="media d-flex">
                                        <div class="media-body text-left">
                                            <h3 class="success" id="nb_totalVente">0</h3>
                                            <h6>TOTAL VENTE</h6>
                                        </div>
                                        <div>
                                            <i class="icon-basket-loaded success font-large-2 float-right"></i>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Details :</small>
                                        <strong id="nb_totalDetail">0</strong>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Montant :</small>
                                        <strong id="montant_total_vente">0 Ar</strong>
                                    </div>
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-3 col-12">
                        <div class="card pull-up">
                            <div class="card-content">
                                <div class="card-body">
                                    <div class="media d-flex">
                                        <div class="media-body text-left">
                                            <h3 class="info" id="nb_consultation">0</h3>
                                            <h6>Consultation</h6>
                                        </div>
                                        <div>
                                            <i class="la la-stethoscope info font-large-2 float-right"></i>
                                        </div>
                                    </div>
                                     <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Montant :</small>
                                        <strong id="montant_consultation">0 Ar</strong>
                                    </div>
                                    <div class="progress progress-sm mt-1 mb-0 box-shadow-2">
                                        <div id="bar_consultation" class="progress-bar bg-gradient-x-info"
                                            role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0"
                                            aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-3 col-12">
                        <div class="card pull-up">
                            <div class="card-content">
                                <div class="card-body">
                                    <div class="media d-flex">
                                        <div class="media-body text-left">
                                            <h3 class="warning" id="nb_service">0</h3>
                                            <h6>Service</h6>
                                        </div>
                                        <div>
                                            <i class="la la-hospital-o warning font-large-2 float-right"></i>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Montant :</small>
                                        <strong id="montant_service">0 Ar</strong>
                                    </div>
                                    <div class="progress progress-sm mt-1 mb-0 box-shadow-2">
                                        <div id="bar_service" class="progress-bar bg-gradient-x-warning" role="progressbar"
                                            style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-6 col-12">
                        <div class="card pull-up">
                            <div class="card-content">
                                <div class="card-body">
                                    <div class="media d-flex">
                                        <div class="media-body text-left">
                                            <h3 class="success" id="nb_article">0</h3>
                                            <h6>Médicament</h6>
                                        </div>
                                        <div>
                                            <i class="la la-medkit success font-large-2 float-right"></i>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Montant :</small>
                                        <strong id="montant_article">0 Ar</strong>
                                    </div>
                                    <div class="progress progress-sm mt-1 mb-0 box-shadow-2">
                                        <div id="bar_article" class="progress-bar bg-gradient-x-success" role="progressbar"
                                            style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-6 col-12">
                        <div class="card pull-up">
                            <div class="card-content">
                                <div class="card-body">
                                    <div class="media d-flex">
                                        <div class="media-body text-left">
                                            <h3 class="danger" id="nb_analyse">0</h3>
                                            <h6>Analse</h6>
                                        </div>
                                        <div>
                                            <i class="la la-flask danger font-large-2 float-right"></i>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Montant :</small>
                                        <strong id="montant_analyse">0 Ar</strong>
                                    </div>
                                    <div class="progress progress-sm mt-1 mb-0 box-shadow-2">
                                        <div id="bar_analyse" class="progress-bar bg-gradient-x-danger" role="progressbar"
                                            style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-6 col-12">
                        <div class="card pull-up">
                            <div class="card-content">
                                <div class="card-body">
                                    <div class="media d-flex">
                                        <div class="media-body text-left">
                                            <h3 class="primary" id="nb_kit">0</h3>
                                            <h6>Kit</h6>
                                        </div>
                                        <div>
                                            <i class="la la-medkit primary font-large-2 float-right"></i>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Montant :</small>
                                        <strong id="montant_kit">0 Ar</strong>
                                    </div>
                                    <div class="progress progress-sm mt-1 mb-0 box-shadow-2">
                                        <div id="bar_kit" class="progress-bar bg-gradient-x-primary" role="progressbar"
                                            style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="card">


                    <div class="card-content">
                        <div class="card-body" id="card_liste_vente">
                            <center>
                                <h6 class="text-center" style="font-size: 14px; margin-bottom: -25px;">Liste ventes</h6>
                            </center>

                            <table id="card_listeVente"
                                class="table table-white-space table-bordered  no-wrap  text-center"
                                style="width: 100% !important; overflow: auto !important;">




                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>


    </section>


    @include("ListeVente.listeVenteDetail")

     <script>
         const BASE_URL = "{{ url('/') }}";
     </script>

@endsection
