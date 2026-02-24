<div class="heading-elements mt-0">
            <div class="modal fade" id="AjoutUtilisateurModal" style="z-index: 99999999" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel1" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content" id="content_modal_utilisateur">
                        <div class="card-content collapse show">
                            <div class="card-body">

                                <h3 class="modal-header entete_modal">
                                    Nouvel Utilisateur
                                </h3>

                                <br>
                                <form class="form" method="post" action="#" id="ajout_utilisateur">

                                    @csrf
                                    <div class="form-body">

                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput3" class="">Nom d'utilisateur</label>
                                                    <input type="text" id="designation" required name="designation"
                                                        class="form-control input-sm" placeholder="Nom d'utilisateur">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput1" class="">Role</label>
                                                    <select class="selectpicker  form-control btn-sm" name="role"
                                                        required id="role" data-live-search='true' data-size='5'
                                                        title='Role'>

                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput1" class="">Mot de passe</label>
                                                    <input class="form-control input-sm" name="password" required
                                                        type="password" placeholder="Mot de passe" id="password">
                                                </div>
                                            </div>

                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="userinput1" class="">Image</label>
                                                    <input class="form-control input-sm" name="image" required
                                                        type="file" placeholder="Image" id="image">
                                                </div>
                                            </div>

                                        </div>

                                        <div class="form-actions right" style="height: 50px;">
                                            <button type="submit" id="btn_add_article"
                                                class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i
                                                    class="ft-check"></i> Ajouter</button>
                                            <button type="button" data-dismiss="modal"
                                                class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i
                                                    class="ft-x"></i> Annuler</button>


                                        </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
