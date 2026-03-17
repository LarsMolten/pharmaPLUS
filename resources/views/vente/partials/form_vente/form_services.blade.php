<div role="tabpanel" class="tab-pane active" id="active1" aria-labelledby="active-tab11" aria-expanded="true">

    <div class="category-title pb-1">
        <h6>Consultation</h6>
    </div>
    <form class="form" method="post" action="ajout_service_panier" id="ajout_service_panier">

        @csrf

        <div class="form-body">

             <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput2" class="">Service</label>
                        <select class="selectpicker  form-control btn-sm" name="service" required id="service"
                            data-live-search='true' data-size='5' title='service'>

                        </select>
                    </div>
                </div>
            </div>

             <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput1" class="">Désignation</label>
                        <input type="text" id="designation" required name="designation" class="form-control input-sm"
                            placeholder="Désignation">
                    </div>
                </div>
            </div>

             <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput2" class="">Type Docteur</label>
                        <select class="selectpicker  form-control btn-sm" name="type" required id="type"
                            data-live-search='true' data-size='5' title='service'>

                        </select>
                    </div>
                </div>

            </div>

            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput1" class="">Désignation</label>
                        <input type="text" id="designation" required name="designation" class="form-control input-sm"
                            placeholder="Désignation">
                    </div>
                </div>
            </div>

           
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput3" class="">Presentation</label>
                        <input class="form-control input-sm" name="presentation" required type="number"
                            placeholder="Presentation" id="presentation">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="userinput4" class=""> Seuil de stock</label>
                        <input class="form-control input-sm" name="seuil" required type="number"
                            placeholder="Ne doit pas être inférieur à la présentation" id="seuil">
                    </div>
                </div>
            </div>

        </div>

        <div class="form-actions right" style="height: 50px;">
            <button type="submit" id="btn_add_article" class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i
                    class="ft-check"></i> Ajouter</button>
            <button type="button" data-dismiss="modal" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i
                    class="ft-x"></i> Annuler</button>


        </div>
    </form>
</div>
