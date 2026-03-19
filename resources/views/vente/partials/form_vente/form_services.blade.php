<div role="tabpanel" class="tab-pane active" id="active1" aria-labelledby="active-tab11" aria-expanded="true">

    <div class="category-title pb-1">
        <h6>Consultation</h6>
    </div>
    <form class="form" method="post" action="ajout_panier" id="ajout_panier">

        @csrf

        <div class="form-body">

            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput2" class="">Médiacment</label>
                        <select class="selectpicker  form-control btn-sm" name="article_id" required id="article_id_vente"
                            data-live-search='true' data-size='5' title='Médicament'>

                        </select>
                    </div>
                </div>
            </div>

            <div class="row" id="info_art_vente">
                <div class="col-md-12">
                    <div class="form-group" id="info_detail_vente_article">
                        <h4 hidden id="s_dispo_title">Stock dispo : <strong id="s_dispo"></strong> </h4>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput1" class="">Quantité</label>
                        <input type="text" id="qte_vente" required name="qte"
                            class="form-control input-sm format-number" placeholder="Quantité">
                    </div>
                </div>
            </div>

        </div>

        <div class="form-actions right" style="height: 90px;">
            <button type="submit" id="btn_add_panier"
                class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                Ajouter</button>
            <button type="button" data-dismiss="modal" data-action="reset_form_vente_article"
                class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i>
                Annuler</button>


        </div>
    </form>
</div>
