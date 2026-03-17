<div class="heading-elements mt-0">
    <div class="modal fade" id="AjoutArticleEntreeDetaileModal" style="z-index: 9999999999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="content_modal_article_entree_detail">
                <div class="card-content collpase show">
                    <div class="card-body">

                        <h3 class="modal-header entete_modal">
                            Ajouter une article
                        </h3>

                        <br>
                        <form class="form" method="post" action="ajout_article_entree_detail"
                            id="ajout_article_entree_detail">

                            @csrf

                            <div class="form-body">

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput2" class="">Médiacment</label>
                                            <select class="selectpicker  form-control btn-sm" name="article_id" required
                                                id="article_id" data-live-search='true' data-size='5'
                                                title='Médicament'>

                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput1" class="">Quantité à Entrée</label>
                                            <input type="text" id="qte_entree" required name="qte_entree"
                                                class="form-control input-sm format-number" placeholder="Quantité en unité">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput1" class="">Prix d'achat en boîte</label>
                                            <input type="text" id="prix_achat_boite" required name="prix_achat_boite"
                                                class="form-control input-sm format-number" placeholder="Prix d'achat en boîte">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput3" class="">Prix unitaire proposé</label>
                                            <input class="form-control input-sm format-number" name="pu_proposee" required
                                                type="text" placeholder="pu_proposee" id="pu_proposee">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput1" class="">Date de péremption</label>
                                            <div class="input-group">
                                                <input type="text" id="date_peremption" name="date_peremption"
                                                    class="form-control input-sm" placeholder="mm-yyyy">
                                                <div class="input-group-append">
                                                    <span class="input-group-text input-group-addon"
                                                        id="date_peremption-icon"
                                                        style="padding-bottom: 0rem !important; padding-top: 0.0rem !important; margin-top: 0px !important">
                                                        <i class="la la-calendar"></i> <!-- Icône Line Awesome -->
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>



                            </div>

                            <div class="form-actions right" style="height: 80px;">
                                <button type="submit" id="btn_add_article_entree_detail"
                                    class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                                    Ajouter</button>
                                <button type="button" data-dismiss="modal" data-action = 'close_modal_entree_detail'
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
