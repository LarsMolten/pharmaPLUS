<div class="content-wrapper" style="padding: 0 !important;" id="card_gestion_detailkit">

    <div class="sidebar-detached sidebar-right" id="hide_detailkit_form">
        <div class="sidebar" style="min-width: 405px">
            <div class="bug-list-sidebar-content">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title" id="entete_form_detailkit">Ajout</h4>
                    </div>

                    <div class="card-body">
                        <form id="ajout_detailkit" class="form" method="post" action="ajout_detailkit">

                            @csrf

                            <fieldset class="form-group">
                                <label for="id_kit" class="">Kit</label>
                                <select class="selectpicker  form-control btn-sm" name="id_kit" required
                                    id="id_kit" data-live-search='true' data-size='5' title='Kit'>

                                </select>
                            </fieldset>

                            <fieldset class="form-group">
                                <label for="id_article" class="">Article</label>
                                <select class="selectpicker  form-control btn-sm" name="id_article" required
                                    id="id_article" data-live-search='true' data-size='5' title='Kit'>

                                </select>
                            </fieldset>

                            <fieldset class="form-group">
                                <label for="qte_kit">Quantité</label>
                                <input type="number" id="qte_kit" name="qte_kit" class="form-control input-sm"
                                    data-toggle="tooltip" data-trigger="hover" data-placement="top"
                                    placeholder="Quantité" data-title="Quantité" required>
                            </fieldset>


                            <div class="form-actions">
                                <button type="submit"
                                    class="btn btn-sm btn-warning btn-min-width mr-1 mb-1 ajouter_detailkit">Ajouter</button>
                                <button type="button" id="annuler" data-action="annuler_form_detailkit"
                                    data-type="detailkit"
                                    class="btn btn-sm btn-outline-light btn-min-width mr-1 mb-1">Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="content-detached content-center">
        <div class="content-body">
            <section class="row ">
                <div class="col-12">
                    <div class="card">
                        <div class="card-content collapse show">
                            <div class="card-body card-dashboard" id="card_liste_detailkit">

                                <table id="table_detailkit"
                                    class="table table-white-space table-bordered  no-wrap  text-center"
                                    style="width: 100% ">

                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>

</div>
