@extends('layouts.app')

@section('title', 'Page - Entré')

@section('app-content')

    <section class="page-wrapper" data-page="entree">
        <div class="row" >
            <div class="col-12">

                <div class="card">


                    <div class="card-content">
                        <div class="card-body" id="card_liste_entreeIndex">
                            <center>
                                <h6 class="text-center" style="font-size: 14px; margin-bottom: -25px;">Liste</h6>
                            </center>

                            <table id="table_entreeIndex" class="table table-white-space table-bordered  no-wrap  text-center"
                                style="width: 100% !important; overflow: auto !important;">




                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- les modale article --}}
        @include('entree.modalEntreeIndex')
        @include('entreeDetail.modalEntreeDetail')
        @include('entreeDetail.modalImportExcel')

    </section>

@endsection

