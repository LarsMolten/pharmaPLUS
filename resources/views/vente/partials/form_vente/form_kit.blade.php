<div role="tabpanel" class="tab-pane " id="link33" aria-labelledby="link-tab33" aria-expanded="false">

    <div class="category-title pb-1">
        <h5 id="title_form"></h5>
    </div>
    <form class="form" method="post" action="ajout_panier" id="ajout_panier">

        @csrf

        <div class="form-body">

            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput2" class="">Maternité</label>
                        <select class="selectpicker  form-control btn-sm" name="kit_id" required id="kit_id_vente"
                            data-live-search='true' data-size='5' title='kit & chambre'>

                        </select>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput1" class="">Quantité</label>
                        <input type="text" id="qte_kit" required name="qte"
                            class="form-control input-sm format-number" placeholder="Quantité">
                    </div>
                </div>
            </div>

        </div>

        <div class="form-actions right" style="height: 90px;">
            <button type="submit" id="btn_add_panier" class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i
                    class="ft-check"></i>
                Ajouter</button>
            <button type="button" data-dismiss="modal" data-action="reset_form_vente_kit"
                class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i>
                Annuler</button>


        </div>
    </form>
</div>
