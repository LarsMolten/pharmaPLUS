@extends('layouts.app')

@section('title', 'Page-Utilisateurs')

@section('content')

    <script src="{{ asset('Js/utilisateur.js') }}"></script>

    <section id="base-style">
        <div class="row">
            <div class="col-12">


                <div class="card">


                    <div class="card-content">
                        <div class="card-body" id="card_liste_utilisateur">
                            <center>
                                <h6 class="text-center" style="font-size: 14px; margin-bottom: -25px;">Liste Utilisateurs</h6>
                            </center>

                            <table id="card_utilisateur" class="table table-white-space table-bordered  no-wrap  text-center"
                                style="width: 100% !important; overflow: auto !important;">




                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        @include('utilisateur.modalUser')


    </section>
@endsection
