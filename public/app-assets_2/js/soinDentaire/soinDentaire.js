

$(document).ready(function () {
    $('select').selectpicker('refresh');

    if (idtypeconsult == 3) {
        
        $("#date_debut").val(dateDebutISO30);
        
    } else {
        $("#date_debut").val(dateDebutISO);
        
    }
    $("#date_fin").val(dateFinISO);
    $("#AddSoinDentaire").insertAfter("#detailsoin");
    $("#deleteSoin").insertAfter("#detailsoin");
    charge_membre1();
    liste_soinDentaire();

});

var idsoinDentaireIndex;
var idsoindentairedetail;

//affihce modal detail for soin

function affiche_detailsoinDentaire(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    idsoinDentaireIndex = id;
    $("#detailsoinDentaire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_detailsoinDentaire();
}

function affichage_prescription(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    type = "Soin dentaire";

    $("#ListesLaboSoinDentaire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    idsoindentairedetail = id;

    fill_prescription(id, type);
}


// *************************dialogue suppression soin detail
function supprimersoindentaire(id , idIndex) {
    idsoindentairedetail = id;
    idsoinDentaireIndex = idIndex ;
    $("#deleteSoinDentaire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
}


// **************************suppression apres boite dialogue de suppression
function delete_soindentaire() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
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
        url: base + "delete_soindentaire",
        type: "POST",
        dataType: "JSON",
        data: { idsoindentairedetail: idsoindentairedetail , idsoindentaireIndex : idsoinDentaireIndex },
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            $("#deleteSoinDentaire").modal(
                "hide"
            );
            if (res.id > 0) {
                $("#delmodal").unblock();
                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_detailsoinDentaire();
            } else {
                alertCustom("danger", 'ft-x', "Suppression non effectué");
            }
        },
    });
}


function infos_soinDentaire(id) {
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
        url: base + "infos_soindentaire",
        type: "POST",
        dataType: "JSON",
        data: { id: id },
        error: function (message) {
            alertCustom("danger", 'ft-x', "Error");
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            $("#placeinfo").block({
                message: `    
                  <div class="card" style="max-width:400px ; ">
                    <div class="card-header" style="max-width:400px ;">
                            <i class="ft-info primary" style='font-size:20px'></i>
                    </div>
                    <div class="card-content">
                        <div class="card-body">
                            <p>${res.descriptionsoin}</p>            
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
function liste_detailsoinDentaire() {

    typeEnvoie = "Soin dentaire";

    $.ajax({
        beforeSend: function () {
            $("#modal_detailsoinDentaire").block({
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
        url: base + "affiche_soindetailDentaire",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        type: "POST",
        dataType: "JSON",
        data: {
            id: idsoinDentaireIndex,
            idtypeconsult: idtypeconsult
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#modal_detailsoinDentaire").unblock();
        }, success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_soindetailDentaire")) {
                $("#table_soindetailDentaire").DataTable().destroy();
            }
            $('#table_soindetailDentaire').empty();
            $("#table_soindetailDentaire").append(res.table);
            $('#table_soindetailDentaire').DataTable({
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
                },
                dom: res.dom,
                buttons: [
                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {
                            liste_detailsoinDentaire();
                        },
                    },
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {
                            $("#AddSoinDentaire").unblock();
                            idsoindentairedetail = "";
                            $('#add_soinDentaire').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function () {
                                if ($(this).is('select.selectpicker')) {
                                    $(this).selectpicker('val', []);
                                } else {
                                    $(this).val('');
                                }
                            });
                            $('.entete_modal_soin').text("AJOUT SOIN DENTAIRE");
                            $('#btn_add_soin_dentaire').text("Ajouter");
                            $("#AddSoinDentaire").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                            );
                        }
                    },
                ],
            });
            $("#modal_detailsoinDentaire").unblock();
        },
    });
}

// cloture soin index 
function cloturesoin(id) {
    idsoinDentaireIndex = id;
    $("#cloture_soindentaire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
}



function cloture_soindentaire() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;


    data = {
        idsoinDentaireIndex: idsoinDentaireIndex
    };


    $("#cloture_soindentairemodal").block({
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
        beforeSend: function () {

        },
        url: base + "cloture_soindentaire",
        type: "POST",
        dataType: "JSON",
        data: data,
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#cloture_soindentairemodal").unblock();

        }, success: function (res) {

            $("#cloture_soindentairemodal").unblock();

            if (res.id == 1) {

                $("#cloture_soindentaire").modal(
                    "hide"
                );

                alertCustom("success", "ft-check", "Cloture effectué avec succée");


                liste_soinDentaire();


            }
            else {

                alertCustom("danger", 'ft-x', "Une erreur s'est produite");

            }


        },
    });

}

//edit soin detail
function edit_soindentaire(id) {
    idsoindentairedetail = id;
    $('.entete_modal_soin').text("MODIFICATION SOIN");
    $('#btn_add_soin_dentaire').text("Modifier");
    var element = $("#soindetairedetail" + id);
    $('#description').val(element.data('description'));
    $('#rendezvousprochain').val(element.data('rendezvousprochain'));
    $("#AddSoinDentaire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
}


// ajout soin detail


$("#add_soinDentaire").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    let data = new FormData(this);
    data.append("idsoindentaireIndex", idsoinDentaireIndex);
    data.append("iddetailsoindentaire", idsoindentairedetail);
    $.ajax({
        beforeSend: function () {
            $("#modal_soin_dentaire").block({
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
        url: base + "ajout_soin_dentaire",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            $("#modal_soin_dentaire").unblock();
            if ($('#btn_add_soin_dentaire').text() === "Modifier") {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                    $("#AddSoinDentaire").modal("hide");
                    liste_detailsoinDentaire();
                    liste_soinDentaire();
                } else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");
                }
            } else {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    liste_detailsoinDentaire();
                    liste_soinDentaire();
                    $("#AddSoinDentaire").modal("hide");
                } else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");
                }
            }
        },
    });
});


// ***********************************liste consultation

function liste_soinDentaire() {
    $.ajax({
        beforeSend: function () {
            $("#card_soinDentaire").block({
                message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important;"></div>',
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
        url: base + "liste_soinDentaire",
        type: "POST",
        data: {
            id_membre: $('#membre_choix').val(),
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val(),
            idtypeconsult: idtypeconsult

        },
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);
            if ($.fn.DataTable.isDataTable("#table_soinDentaire")) {
                $("#table_soinDentaire").DataTable().destroy();
            } else {
            }
            $('#table_soinDentaire').empty();
            $("#table_soinDentaire").append(res.table);
            $('#table_soinDentaire').DataTable({
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
                },
                dom: "frtip",

            });
            $("#card_soinDentaire").unblock();
        },
    });
}


// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerSoin() {

    liste_soinDentaire();

}

