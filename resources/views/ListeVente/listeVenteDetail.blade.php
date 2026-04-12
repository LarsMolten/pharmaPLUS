<div class="heading-elements mt-0">
    <div class="modal fade" id="listeVenteDetailModal" style="z-index: 99999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" id="content_modal_venteDetail">
                <div class="card-content collpase show">
                    <div class="card-body" id="card_liste_venteDetail">

                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>

                        <br><br><br>
                        <center style="font-size: 20px; margin-bottom: 20px;">
                            <h6 class="text-center"> 
                                Réf : <strong id="ref_vente_to_detail"></strong>
                            </h6>
                            <h6 class="text-left"> 
                                Client : <strong id="client_vente_to_detail"></strong>
                            </h6>
                            <h6 class="text-left"> 
                                Caissier : <strong id="caissier_vente_to_detail"></strong>
                            </h6>
                            <h6 class="text-left"> 
                                Date : <strong id="date_vente_to_detail"></strong>
                            </h6>
                        </center>

                        <table id="table_venteDetail"
                            class="table table-white-space table-bordered  no-wrap  text-center"
                            style="width: 100% !important; overflow: auto !important;">




                        </table>

                        <div id="somme_m" class=" mt-2" style="font-size: 20px;">
                              <h6 class="text-right"> 
                                MONTANT TOTAL : <strong class="format-prix" id="total_vente_to_detail">0</strong>
                            </h6>
                            <h6 class="text-right"> 
                                Montant payé : <strong class="format-prix" id="paye_vente_to_detail">0</strong>
                            </h6>
                            <h6 class="text-right"> 
                                Monnaie rendue : <strong class="format-prix" id="monnaie_vente_to_detail">0</strong>
                            </h6>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    </div>


</div>





