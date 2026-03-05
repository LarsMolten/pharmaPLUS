<div class="content-wrapper" style="padding: 0 !important;" id="card_gestion_serv">

    <div class="sidebar-detached sidebar-right" id="hide_service_form">
        <div class="sidebar" style="min-width: 405px">
            <div class="bug-list-sidebar-content">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title" id="entete_form_service">Ajout</h4>
                    </div>

                    <div class="card-body">
                        <form id="ajout_service" class="form" method="post" action="ajout_service">

                            @csrf

                            <fieldset class="form-group">
                                <label for="categorie_id" class="">Catégorie</label>
                                <select class="selectpicker  form-control btn-sm" name="categorie_id" required
                                    id="categorie_id" data-live-search='true' data-size='5' title='Catégorie'>

                                </select>
                            </fieldset>

                            <fieldset class="form-group">
                                <label for="nom_service">Nom service</label>
                                <input type="text" id="nom_service" name="nom_service" class="form-control input-sm"
                                    data-toggle="tooltip" data-trigger="hover" data-placement="top"
                                    placeholder="Nom service" data-title="Nom service" required>
                            </fieldset>

                            <fieldset class="form-group">
                                <label for="prix_service">Prix</label>
                                <input type="number" id="prix_service" name="prix_service" class="form-control input-sm"
                                    data-toggle="tooltip" data-trigger="hover" data-placement="top"
                                    placeholder="Prix du service" data-title="Prix du service" required>
                            </fieldset>


                            <div class="form-actions">
                                <button type="submit"
                                    class="btn btn-sm btn-warning btn-min-width mr-1 mb-1 ajouter_service">Ajouter</button>
                                <button type="button" id="annuler" data-action="annuler_form_service"
                                    data-type="service"
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
                            <div class="card-body card-dashboard" id="card_liste_service">

                                <table id="table_service"
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
