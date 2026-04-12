<div class="heading-elements mt-0">
    <div class="modal fade" id="AjoutUtilisateurModal" style="z-index: 99999999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="content_modal_utilisateur">
                <div class="card-content collpase show">
                    <div class="card-body">

                        <h3 class="modal-header entete_modal">
                            Nouvel Article
                        </h3>

                        <br>
                        <form class="form" method="post" action="ajout_utilisateur" id="ajout_utilisateur" enctype="multipart/form-data">

                            @csrf

                            <div class="form-body">

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput3" class="">Nom</label>
                                            <input type="text" id="name" required name="name"
                                                class="form-control input-sm" placeholder="Nom">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput3" class="">Nom d'utilisateur</label>
                                            <input type="text" id="username" required name="username"
                                                class="form-control input-sm" placeholder="Nom d'utilisateur">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput1" class="">Rôle</label>
                                            <select class="selectpicker  form-control btn-sm" name="role" required
                                                id="role" data-live-search='true' data-size='5' title='Role'>

                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="userinput3" class="">Mot de passe</label>
                                            <input type="password" id="password" required name="password"
                                                class="form-control input-sm" placeholder="Mot de passe">
                                        </div>
                                    </div>
                                    @error('password')
                                        <p class="text-danger">{{ $message }}</p>
                                    @enderror
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="image" class="">Photo</label>
                                            <input class="form-control input-sm" name="image"  type="file"
                                                id="image">
                                        </div>
                                    </div>

                                </div>

                                <div class="form-actions right">
                                    <button type="submit" id="btn_add_user"
                                        class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                                        Ajouter</button>
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
