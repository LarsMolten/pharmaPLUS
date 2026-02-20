<div class="heading-elements mt-0">
        <div class="modal fade" id="AjoutArticleModal" style="z-index: 99999999" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content" id="content_modal_article">
                    <div class="card-content collpase show">
                        <div class="card-body">

                            <h3 class="modal-header entete_modal">
                                Nouvel Article
                            </h3>

                            <br>
                            <form class="form" method="post" action="ajout_article" id="ajout_article">
                                    
                                @csrf
                                
                                <div class="form-body">

                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="userinput3" class="">Désignation</label>
                                                <input type="text" id="designation" required name="designation" class="form-control input-sm" placeholder="Désignation">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Type</label>
                                                <select class="selectpicker  form-control btn-sm" name="unite" required id="unite" data-live-search='true' data-size='5' title='Unité'>

                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Presentation</label>
                                                <input class="form-control input-sm" name="presentation" required type="text" placeholder="Presentation" id="presentation">
                                            </div>
                                        </div>

                                    <!-- <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="userinput1" class="">Date peremption</label>
                                                <div class="input-group">
                                                    <input type="text" id="dateperemption" name="dateperemption" class="form-control input-sm" placeholder="mm-yyyy">
                                                    <div class="input-group-append">
                                                        <span class="input-group-text input-group-addon" id="dateperemption-icon" style="padding-bottom: 0rem !important; padding-top: 0.0rem !important; margin-top: 0px !important">
                                                            <i class="la la-calendar"></i>
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div> -->

                                </div>

                                <div class="form-actions right" style="height: 50px;">
                                    <button type="submit" id="btn_add_article" class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i> Ajouter</button>
                                    <button type="button" data-dismiss="modal" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>


</div>
