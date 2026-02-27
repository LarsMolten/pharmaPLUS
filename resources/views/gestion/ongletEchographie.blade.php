<div class="content-wrapper" style="padding: 0 !important;">

    <div class="sidebar-detached sidebar-right" id="hide_categ_form">
        <div class="sidebar" style="min-width: 405px">
            <div class="bug-list-sidebar-content">
                <div class="card border-6 border-secondary">
                    <div class="card-header">
                        <h4 class="card-title" id="entete_form_echographie">Ajout</h4>
                    </div>

                    <div class="card-body">
                        <form id="ajout_echographie" class="form" method="post" action="ajout_echographie">

                            @csrf

                            <fieldset class="form-group">
                                <label for="nom_echographie">Nom d'Echographie</label>
                                <input type="text" id="nom_echographie" name="nom" class="form-control input-sm"
                                    data-toggle="tooltip" data-trigger="hover" data-placement="top"
                                    placeholder="Nom d'echographie" data-title="Nom d'echographie" required>
                            </fieldset>

                            <fieldset class="form-group">
                                <label for="prix_unitaire">Prix Unitaire</label>
                                <input type="text" id="prix_unitaire" name="prix" class="form-control format-number input-sm"
                                    data-toggle="tooltip" data-trigger="hover" data-placement="top"
                                    placeholder="Prix Unitaire" data-title="Prix Unitaire" required>
                            </fieldset>

                            <div class="form-actions">
                                <button type="submit"
                                    class="btn btn-sm btn-warning btn-min-width mr-1 mb-1 ajouter_echographie">Ajouter</button>
                                <button type="button" id="annuler" data-action="annuler_form_echographie" data-type="echographie"
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
                    <div class="card border-10 border-secondary">
                        <div class="card-content collapse show">
                            <div class="card-body card-dashboard" id="card_liste_echographie">

                                <table id="table_echographie"
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
