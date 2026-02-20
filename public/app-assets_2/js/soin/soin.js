

$(document).ready(function () {
    $('select').selectpicker('refresh');
    $("#date_debut").val(dateDebutISO30);
    $("#date_fin").val(dateFinISO);
    $("#AddSoin").insertAfter("#detailsoin");
    $("#deleteSoin").insertAfter("#detailsoin");
    history.pushState({}, '', base + "soin");
    charge_membre1();
    liste_soin();

});

var idsoinIndex ;
var idsoindetail ;

//affihce modal detail for soin

function affiche_detailsoin(id) {

    idsoinIndex = id;

    $("#detailsoin").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_detailsoin();

}


// *************************dialogue suppression soin detail
function supprimersoin(id) {


    idsoindetail = id ;
    
    $("#deleteSoin").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}


// **************************suppression apres boite dialogue de suppression
function delete_soin() {


    $.ajax({
        beforeSend: function () {

            $("#delmodal").block({
                message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto"></div>',

                overlayCSS: {
                    backgroundColor: "black",
                    opacity: 0.1,
                    cursor: "wait",

                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: "transparent"
                }
            });

        },
        url: base + "delete_soin",
        type: "POST",
        dataType: "JSON",
        data: { idsoindetail : idsoindetail },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            $("#deleteSoin").modal(
                "hide"
            );

            if (res.id > 0) {

                $("#delmodal").unblock();
                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_detailsoin();
                liste_soin();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }


        },
    });

}


function infos_soin(id) {

    $("#placeinfo").block({
        message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

        overlayCSS: {
            backgroundColor: "black",
            opacity: 0.1,
            cursor: "wait",
        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: "transparent"
        }
    });

    $.ajax({
        url: base + "infos_soin",
        type: "POST",
        dataType: "JSON",
        data: { id: id },
        error: function(message) {
            alertCustom("danger", 'ft-x', "Error");

        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            $("#placeinfo").block({
                message: `
                  
                  
                  <div class="card" style="max-width:400px ; ">
                  <div class="card-header" style="max-width:400px ;">
                           <i class="ft-info primary" style='font-size:20px'></i>
                  </div>
                  <div class="card-content">
                      <div class="card-body">
                          <p>${res.diagnostique}</p>
          
                              <button type="button" onclick="close_del_membre()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Ok</button>
          
          
                      </div>
                  </div>
                  </div>
                
                  `,
        
                overlayCSS: {
                    backgroundColor: 'black',
                    opacity: 0.1,
                    cursor: "wait",
        
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: "transparent"
                }
            });

           

        },
    });


    


}


function close_del_membre() {
    $("#placeinfo").unblock();
}

// charge detail soin 
function liste_detailsoin() {


    $.ajax({
        beforeSend: function () {

            $("#modal_detailsoin").block({
                message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

                overlayCSS: {
                    backgroundColor: "black",
                    opacity: 0.1,
                    cursor: "wait",

                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: "transparent"
                }
            });

        },
        url: base + "affiche_soindetail",
        type: "POST",
        dataType: "JSON",
        data:{
            id :  idsoinIndex 
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
       $("#modal_detailsoin").unblock();
    } ,success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_soindetail")) {
                $("#table_soindetail").DataTable().destroy();
            } else {
            }
            $('#table_soindetail').empty();
            $("#table_soindetail").append(res.table);


            $('#table_soindetail').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                deferRender: true,
                pageLength: 20,
                "initComplete": function (settings, json) {
                    $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
                },
                language: {
                    "search": "",
                    "zeroRecords": "Aucun enregistrement",
                    paginate: {
                        previous: "Précédent",
                        next: "Suivant",
                    },
                }
                ,



                dom: "Bfrtip",
                buttons: [

                   

                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_detailsoin();

                        },
                    },
                   

                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {

                            $("#AddSoin").unblock();

                            idsoindetail = "";

                            $('#add_soin').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function() {
                                if ($(this).is('select.selectpicker')) {
                                    // Réinitialiser le selectpicker en vidant les sélections
                                    $(this).selectpicker('val', []);
                                } else {
                                    // Réinitialiser les autres champs en vidant leur valeur
                                    $(this).val('');
                                }
                            });
                            
                            $('.entete_modal_soin').text("AJOUT SOIN");
                            $('#btn_add_soin').text("Ajouter");

                            $("#AddSoin").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                            );

                        }
                    },
                    
                    


                ],
            });
            $("#modal_detailsoin").unblock();

        },
    });

}

//edit soin detail
function edit_soin(id) {
    idsoindetail = id;


    $('.entete_modal_soin').text("Modification SOIN");
    $('#btn_add_soin').text("Modifier");
    
    
    var element = $("#soindetail" + id);
    
    
    $('#description').val(element.data('description'));
    $('#rendezvousprochain').val(element.data('rendezvousprochain'));

    $("#AddSoin").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}


// ajout soin detail


$("#add_soin").off("submit").on("submit", function (e) {

    e.preventDefault();

    let data = new FormData(this);
    data.append("idsoinIndex",idsoinIndex);
    data.append("iddetailsoin",idsoindetail);

    $.ajax({
        beforeSend: function () {
            $("#modal_soin").block({
                message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

                overlayCSS: {
                    backgroundColor: "black",
                    opacity: 0.1,
                    cursor: "wait",
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: "transparent"
                }
            });
        },
        url: base + "ajout_soin",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            $("#modal_soin").unblock();
            if ($('#btn_add_soin').text() === "Modifier") {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");

                    $("#AddSoin").modal("hide");
                    liste_detailsoin();

                    
                    

                }  else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");

                }
                
            } else {

                if (res.id == 1) {
                   
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    liste_detailsoin();

                    $("#AddSoin").modal("hide");
                    


                }else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");

                }
            }

        },
    });
});


// ***********************************liste consultation

function liste_soin() {


    $.ajax({
        beforeSend: function () {

            $("#card_soin").block({
                message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

                overlayCSS: {
                    backgroundColor: "black",
                    opacity: 0.1,
                    cursor: "wait",

                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: "transparent"
                }
            });

        },
        url: base + "liste_soin",
        type: "POST",
        data:{
            id_membre :  $('#membre_choix').val() ,
            date_debut :  $('#date_debut').val() ,
            date_fin :  $('#date_fin').val()
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            
            var res = JSON.parse(res);

            if ($.fn.DataTable.isDataTable("#table_soin")) {
                $("#table_soin").DataTable().destroy();
            } else {
            }
            $('#table_soin').empty();
            $("#table_soin").append(res.table);


            $('#table_soin').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                deferRender: true,
                pageLength: 7,
                "initComplete": function (settings, json) {
                    $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
                },
                language: {
                    "search": "",
                    "zeroRecords": "Aucun enregistrement",
                    paginate: {
                        previous: "Précédent",
                        next: "Suivant",
                    },
                }
                ,



                dom: "Bfrtip",
                buttons: [

                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_soin();

                        },
                    },

                 
                    
                    


                ],
            });
            $("#card_soin").unblock();

        },
    });

}


function affichage_demande(id) {

    $("#ListesDemande").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    iddetail = id ;

    fill_labo(id);
}




// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerSoin() {

    liste_soin();

}

