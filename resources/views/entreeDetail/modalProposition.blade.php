<div class="heading-elements mt-0">
    <div class="modal fade" id="EditPropositionModal" style="z-index: 99999999999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="content_modal_proposition_pu">
                <div class="card-content collpase show">
                    <div class="card-body">

                        <h3 class="modal-header entete_modal">
                            Quel est votre proposition ?
                        </h3>

                        <br>
                        <form class="form" method="post" action="modifier_proposition_pu"
                            id="modifier_proposition_pu">

                            @csrf

                            <div class="form-body">


                                <div class="row">
                                    <div class="col-md-12">
                                        <h3 class="format-number" style="text-align: center; font-weight: bold" id="prix_unitaire_brut"></h3>
                                    </div>
                                </div>
                                </br>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput3" class="">Prix unitaire proposé</label>
                                            <input class="form-control input-sm format-number" name="pu_proposee"
                                                required type="text" placeholder="Proposition" id="proposee_prix">
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="form-actions right" style="height: 80px;">
                                <button type="submit" id="edit_proposition_pu"
                                    class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                                    Modifier</button>
                                <button type="button" data-dismiss="modal" data-action = 'close_modal_proposition_pu'
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
