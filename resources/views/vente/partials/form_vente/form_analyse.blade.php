<div class="tab-pane" id="link22" role="tabpanel" aria-labelledby="link-tab22" aria-expanded="false">

    <div class="category-title pb-1">
        <h5 id="title_form"></h5>
    </div>

    <form class="form" method="post" action="ajout_panier" id="ajout_panier">

        @csrf

        <div class="form-body">

            {{-- <div class="row" id="info_art_vente">
                <div class="col-md-12">
                    <div class="form-group" id="info_detail_selected">
                        <h4 hidden id="m_select_title">Montant de selection : <strong id="m_select"></strong> </h4>
                    </div>
                </div>
            </div> --}}
            
            <div class="row">
                <div class='col-md-12'>
                    <div class='form-group'>
                        <label for='analyse_id_vente' class=''>Nature de l'examen</label>
                        <select class='selectpicker  form-control btn-sm' name = 'analyse_id[]' data-selected-text-format='count > 4'  required id='analyse_id_vente' multiple data-live-search='true' data-size='7' title='Analyse' 
                        data-count-selected-text='{0} Nature selectionnée'>
                                       
                        </select>
                    </div>
                </div>
            </div>


        </div>

        <div class="form-actions right" style="height: 90px;">
            <button type="submit" id="btn_add_panier" class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i
                    class="ft-check"></i>
                Ajouter</button>
            <button type="button" data-dismiss="modal" data-action="reset_form_vente_analyse"
                class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i>
                Annuler</button>


        </div>
    </form>
</div>
