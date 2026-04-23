<div class="heading-elements mt-0">
    <div class="modal fade" id="AjoutSortieIndexModal" style="z-index: 9999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="content_modal_sortieIndex">
                <div class="card-content collpase show">
                    <div class="card-body">

                        <h3 class="modal-header entets_modal">
                            Nouvel sortie
                        </h3>

                        <br>
                        <form class="form" method="post" action="ajout_sortieIndex" id="ajout_sortieIndex">

                            @csrf

                            <div class="form-body">

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="ref_sortie" class="">Référence Sortie</label>
                                            <input type="text" id="ref_sortie" required name="ref_sortie"
                                                class="form-control input-sm" placeholder="Référence">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="motif" class="">Motif</label>
                                            <select class="selectpicker  form-control btn-sm" name="motif" required
                                                id="motif_sortie" data-live-search='true' data-size='5'
                                                title='motif sortie'>
                                               

                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="form-actions right">
                                <button type="submit" id="btn_add_sortieIndex"
                                    class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                                    Ajouter</button>
                                <button type="button" data-dismiss="modal" 
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
