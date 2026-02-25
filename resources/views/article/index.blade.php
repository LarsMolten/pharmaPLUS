@extends('layouts.app')

@section('title', 'Page - Articles')

@section('app-content')

    <section id="main-content">
        <div class="row">
            <div class="col-12">

                {{-- card filtre --}}
                <div class="card">
                    <div class="card-header">
                        <a data-action="collapse ">
                            <h3 class="card-title">Filtre</h3>
                            <a class="heading-elements-toggle"><i class="la la-ellipsis-v font-medium-3"></i></a>
                            <div class="heading-elements">
                                <ul class="list-inline mb-0">
                                    <li><a data-action="collapse"><i class="ft-minus"></i></a></li>
                                </ul>
                            </div>
                        </a>
                    </div>
                    <div class="card-content collapse show">
                        <div class="card-body card-dashboard">
                            <p class="card-text">On place ici les formulaire de filtrage</p>

                        </div>
                    </div>
                </div>


                <div class="card">


                    <div class="card-content">
                        <div class="card-body" id="card_liste_article">
                            <center>
                                <h6 class="text-center" style="font-size: 14px; margin-bottom: -25px;">Liste Articles</h6>
                            </center>

                            <table id="card_article" class="table table-white-space table-bordered  no-wrap  text-center"
                                style="width: 100% !important; overflow: auto !important;">




                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- les modale article --}}
        @include('article.modalArticle')




    </section>

@endsection

