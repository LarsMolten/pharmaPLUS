<div class="heading-elements mt-0">
    <div class="modal fade" id="ValiderVenteModal" style="z-index: 9999999999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="content_modal_valider_vente">
                <div class="card-content collpase show">
                    <div class="card-body">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h3 class="modal-header entete_modal_pat">
                        VALIDATION
                    </h3>
                    <br>
                    <form class="form" method="post" id="valider_vente">
                        <div class="form-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Patient / Client</label>
                                        <input type="text" id="patient_vente" required name="nom_patient"
                                            class="form-control input-sm" placeholder="Patient / Client">
                                    </div>
                                </div>
                            </div>

                            <br>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <h4>Net à payer : <strong class="format-prix" id="net_payer"></strong> Ar</h4>
                                    </div>
                                </div>
                            </div>
                            <br>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Espèce</label>
                                        <input type="text" id="montant_paye" required name="montant_paye"
                                             class=" pos-money-input format-number" placeholder="0">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Monnaie</label>
                                        <input readonly type="text" id="monnaie" name="monnaie" style="background-color: #e9e6e6; !important"
                                             class="pos-money-input format-number" placeholder="0">
                                    </div>
                                </div>
                            </div>
                            <div class="form-actions right" style="height: 80px;">
                                <button type="submit" id="btn_add_vente_valided"
                                    class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                                    Confirmer</button>
                                <button type="button" data-dismiss="modal" data-action = 'close_modal_validation'
                                    class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i>
                                    Annuler</button>


                            </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>


</div>



