{{-- <div class="heading-elements mt-0">
    <div class="modal fade" id="ValiderVenteModal" style="z-index: 9999999999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="content_modal_valider_vente">
                <div class="card-content collpase show">
                    <div class="card-body">

                        <h3 class="modal-header entete_modal">
                            VALIDATION
                        </h3>
                        <br>
                        <form class="form" method="post" action="ajout_vente_validee" id="ajout_vente_validee">

                            @csrf

                            <div class="form-body px-2">

                                <div class="row">

                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Patient</label>
                                                <input type="text" id="patient_vente" required name="patient"
                                                    class="form-control input-sm" placeholder="Patient / Client">
                                            </div>
                                        </div>
                                    </div>


                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Nom Patient</label>
                                                <input type="text" id="patient_consult" required name="patient"
                                                    class="form-control input-sm format-number"
                                                    placeholder="Nom & Prénom">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Nom Patient</label>
                                                <input type="text" id="patient_consult" required name="patient"
                                                    class="form-control input-sm format-number"
                                                    placeholder="Nom & Prénom">
                                            </div>
                                        </div>
                                    </div>

                                    <div id="form_for_consultation">

                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput2" class="">Type de consultation</label>
                                                    <select class="selectpicker  form-control btn-sm"
                                                        name="type_consultation" required id="type_consultation"
                                                        data-live-search='true' data-size='5'
                                                        title='type de consultation'>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput2" class="">Paramètre</label>
                                                    <select class="selectpicker  form-control btn-sm" name="parametre"
                                                        id="parametre_consult" data-live-search='true' data-size='5'
                                                        title='parametre'>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput2" class="">Docteur</label>
                                                    <select class="selectpicker  form-control btn-sm" name="docteur"
                                                        id="docteur_consult" data-live-search='true' data-size='5'
                                                        title='Docteur'>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput1" class="">Motif</label>
                                                    <textarea type="text" id="motif_consult" required name="motif_consult" class="form-control input-sm "
                                                        placeholder="Motif"></textarea>

                                                </div>
                                            </div>
                                        </div>


                                    </div>


                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Espèce</label>
                                                <input type="text" id="espece_payee" required name="espece_payee"
                                                    class="form-control input-sm format-number"
                                                    placeholder="Espèce">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Monnaie</label>
                                                <input readonly type="text" id="monnaie"  name="monnaie"
                                                    class="form-control input-sm format-number"
                                                    placeholder="Monnaie">
                                            </div>
                                        </div>
                                    </div>


                                </div>



                                <div class="form-actions right" style="height: 80px;">
                                    <button type="submit" id="btn_add_vente_valided"
                                        class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i
                                            class="ft-check"></i>
                                        Confirmer</button>
                                    <button type="button" data-dismiss="modal"
                                        data-action = 'close_modal_validation'
                                        class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i
                                            class="ft-x"></i>
                                        Annuler</button>


                                </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>


</div> --}}



<div class="modal fade" id="ValiderVenteModal" style="z-index: 1050 ; margin-top: 0% !important" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel1" aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content" id="modal_visites" style="box-shadow: 0px 19px 38px 10px rgb(0 0 0 / 30% )">
            <div class="card-content collpase show">
                <div class="card-body">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h3 class="modal-header entete_modal_pat">
                        VALIDATION
                    </h3>
                    <br>
                    <!-- <form method="post" id="add_consultation"> -->
                    <form class="form" method="post" id="ajout_patient">
                        <div class="form-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Patient</label>
                                        <input type="text" id="patient_vente" required name="patient"
                                            class="form-control input-sm" placeholder="Patient / Client">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Nom Patient</label>
                                        <input type="text" id="patient_consult" required name="patient"
                                            class="form-control input-sm format-number" placeholder="Nom & Prénom">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Nom Patient</label>
                                        <input type="text" id="patient_consult" required name="patient"
                                            class="form-control input-sm format-number" placeholder="Nom & Prénom">
                                    </div>
                                </div>
                            </div>


                            <div id="form_for_consultation">

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput2" class="">Type de consultation</label>
                                            <select class="selectpicker  form-control btn-sm" name="type_consultation"
                                                required id="type_consultation" data-live-search='true' data-size='5'
                                                title='type de consultation'>

                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput2" class="">Paramètre</label>
                                            <select class="selectpicker  form-control btn-sm" name="parametre"
                                                id="parametre_consult" data-live-search='true' data-size='5'
                                                title='parametre'>

                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput2" class="">Docteur</label>
                                            <select class="selectpicker  form-control btn-sm" name="docteur"
                                                id="docteur_consult" data-live-search='true' data-size='5'
                                                title='Docteur'>

                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput1" class="">Motif</label>
                                            <textarea type="text" id="motif_consult" required name="motif_consult" class="form-control input-sm "
                                                placeholder="Motif"></textarea>

                                        </div>
                                    </div>
                                </div>


                            </div>


                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Espèce</label>
                                        <input type="text" id="espece_payee" required name="espece_payee"
                                            class="form-control input-sm format-number" placeholder="Espèce">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="userinput1" class="">Monnaie</label>
                                        <input readonly type="text" id="monnaie" name="monnaie"
                                            class="form-control input-sm format-number" placeholder="Monnaie">
                                    </div>
                                </div>
                            </div>
                            <div class="form-actions right" style="height: 80px;">
                                <button type="submit" id="btn_add_vente_valided"
                                    class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                                    Confirmer</button>
                                <button type="button" data-dismiss="modal" data-action = 'close_modal_validation'
                                    class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i
                                        class="ft-x"></i>
                                    Annuler</button>


                            </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
