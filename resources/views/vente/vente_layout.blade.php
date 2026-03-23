 @extends('layouts.app')

 @section('title', 'page - vente')

 @section('app-content')


     <section class="page-wrapper" data-page="panier">

         <div class="row">

             <div class="col-12">

                 @include('vente.partials.navbar_vente.navbar_vente')

             </div>


             <div class="col-12">

                 <div class="row">

                     <div class="md-col-12 col-4">
                         <div class="card" >
                             <div class="card-body" id="card_tab_content_vente">


                                 <div class="tab-content px-1 pt-1">

                                     @include('vente.partials.form_vente.form_services')

                                     @include('vente.partials.form_vente.form_medicament')

                                     @include('vente.partials.form_vente.form_analyse')

                                     @include('vente.partials.form_vente.form_kit')

                                 </div>


                             </div>
                         </div>
                     </div>

                     <div class="md-col-12 col-8">

                         <div class="row">

                             <div class="col-12">
                                 <div class="card bg-dark" id="affichage_montant_panier">
                                     

                                 </div>
                             </div>

                             <div class="col-12">
                                 <section id="css-classes" class="card">
                                     <div class="card-content">

                                         <div class="card-body" id="card_liste_panier">
                                             <center>
                                                 <h6 class="text-center" style="font-size: 14px; margin-bottom: -25px;">
                                                     Panier</h6>
                                             </center>

                                             <table id="table_panier"
                                                 class="table table-white-space table-bordered  no-wrap  text-center"
                                                 style="width: 100% !important; overflow: auto !important;">




                                             </table>

                                         </div>

                                     </div>
                                 </section>
                             </div>
                             <div class="col-12">
                                 <section id="btn_display" class="">

                                    
                                     
                                 </section>
                             </div>

                         </div>

                     </div>


                 </div>


             </div>

     </section>
 @endsection
