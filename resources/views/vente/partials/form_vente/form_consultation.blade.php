<div role="tabpanel" class="tab-pane active" id="active21" aria-labelledby="active-tab21" aria-expanded="true">

    <form class="form" method="post" action="ajout_panier" id="ajout_panier">

        @csrf

        <div class="form-body">

            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput1" class="">Patient</label>
                        <input type="text" id="nom_patient" required name="nom_patient" class="form-control input-sm"
                            placeholder="Patient / Client">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-3">
                    <span>Sex:</span>
                </div>

                <div class="col-md-6 d-flex align-items-center">
                    <div class="form-check mr-3">
                        <input class="form-check-input" type="radio" name="sex_patient" id="sex_homme" value="1"
                            checked>
                        <label class="form-check-label" for="sex_homme">Homme</label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="sex_patient" id="sex_femme" value="0">
                        <label class="form-check-label" for="sex_femme">Femme</label>
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-6">
                    <input type="text" id="age_patient" name="age_patient"
                        class="form-control input-sm format-number" placeholder="Age" required>
                </div>

                <div class="col-md-6 d-flex align-items-center">
                    <div class="form-check mr-3">
                        <input class="form-check-input" type="radio" name="unite_age" id="unite_ans" value="1"
                            checked>
                        <label class="form-check-label" for="unite_ans">ans</label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="unite_age" id="unite_mois" value="0">
                        <label class="form-check-label" for="unite_mois">mois</label>
                    </div>
                </div>
            </div>
            <br>


            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="type_docteur" class="">Type Docteur</label>
                        <select class="selectpicker  form-control btn-sm" name="type_docteur" required id="type_docteur"
                            data-live-search='true' data-size='5' title='type de docteur'>


                        </select>
                    </div>
                </div>
            </div>
            <div id="choix_docteur">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="doctuer" class="">Choix Docteur</label>
                            <select class="selectpicker  form-control btn-sm" name="docteur" required id="docteur"
                                data-live-search='true' data-size='5' title='Choix docteur'>

                            </select>
                        </div>
                    </div>
                </div>

            </div>

            <div class="row">
                <div class="col-md-3">
                    <label for="age_patient" class="">Prix :</label>
                </div>
                <div class="col-md-8">
                    <input type="text" hidden id="consultation_id" name="consultation_id">
                    <input type="text" readonly id="prix_consultation" name="prix_consultation"
                        class="form-control input-sm format-number" placeholder="0,00 Ar">
                </div>


            </div>

            <div class="form-actions right" style="height: 80px;">
                <button type="submit" id="btn_add_panier" class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i
                        class="ft-check"></i>
                    Ajouter</button>
                <br>
                <button type="button" data-dismiss="modal" data-action = 'reset_form_vente_consultation'
                    class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i>
                    Annuler</button>

            </div>
        </div>
    </form>
</div>
