<div class="content-wrapper" style="padding: 0 !important;" id="card_gestion_kit">

    <div class="sidebar-detached sidebar-right" id="hide_categ_form">
        <div class="sidebar" style="min-width: 405px">
            <div class="bug-list-sidebar-content">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title" id="entete_form_kit">Ajout</h4>
                    </div>

                    <div class="card-body">
                        <form id="ajout_kit" class="form" method="post" action="ajout_kit">

                            @csrf

                            <fieldset class="form-group">
                                <label for="nom_kit">Nom du Kit</label>
                                <input type="text" id="nom_kit" name="nom_kit" class="form-control input-sm"
                                    data-toggle="tooltip" data-trigger="hover" data-placement="top"
                                    placeholder="Nom du Kit" data-title="Nom du Kit" required>
                            </fieldset>

                            <fieldset class="form-group">
                                <label for="prix_kit">Prix </label>
                                <input type="text" id="prix_kit" name="prix_kit" class="form-control format-number input-sm"
                                    data-toggle="tooltip" data-trigger="hover" data-placement="top"
                                    placeholder="Prix kit" data-title="Prix kit" required>
                            </fieldset>

                            <div class="form-actions">
                                <button type="submit"
                                    class="btn btn-sm btn-warning btn-min-width mr-1 mb-1 ajouter_kit">Ajouter</button>
                                <button type="button" id="annuler" data-action="annuler_form_kit" data-type="kit"
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
                            <div class="card-body card-dashboard" id="card_liste_kit">

                                <table id="table_kit"
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
