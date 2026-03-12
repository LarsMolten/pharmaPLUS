<div class="heading-elements mt-0">
    <div class="modal fade" id="ImportExcelModal" style="z-index: 9999999" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="content_modal_ImportExcel">
                <div class="card-content collpase show">
                    <div class="card-body">

                        <h3 class="modal-header entete_modal">
                            Importer un fichier Excel
                        </h3>

                        <br>
                        <form class="form" method="post" action="import_excel" enctype="multipart/form-data" id="import_excel">

                            @csrf

                            <div class="form-body">

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="file" class="">Fichier Excel</label>
                                            <input type="file" id="file" required name="file"
                                                class="form-control input-sm" placeholder="Fichier Excel">
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="form-actions right">
                                <button type="submit" id="btn_import_excel"
                                    class="mr-1 mb-1 btn btn-sm btn-success btn-min-width"><i class="ft-check"></i>
                                    Importer</button>
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
