

$(document).ready(function () {
    $("#date_debut").val(dateDebutISO);
    $("#date_fin").val(dateFinISO);
    $("#AddEntrerDetail").insertAfter("#detailentrergros");
    $("#deleteentrergrosdetail").insertAfter("#detailentrergros");
    liste_entrergros();
    formatPrixImput();
    generation_dropdown_fournisseur();

    $("#dateperemption").datepicker({
        format: "mm-yyyy",
        viewMode: "months",
        minViewMode: "months",
        forceParse: true,
        clearBtn: true
    });

    $("#dateperemption-icon").on("click", function () {
        $("#dateperemption").focus(); // Déclenche le calendrier
    });



});

var ancienQte;
var id_article;
var id_fournisseur;
var identrergrosdetail;
var idsaisitype;
var enCours = false;


function charge_medicament_entrer_gros() {
    $.ajax({

        beforeSend: function () {

            $("#modal_medicament").block({
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
        url: base + 'charge_medicament_entrer_gros',
        type: "POST",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: {
            qte: ancienQte,
            id_article: id_article

        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#id_article").empty();
            $("#id_article").append(data);
            $('select').selectpicker('refresh');
            if (id_article != "") {
                $('#id_article').val(id_article).selectpicker('refresh');
                chargetypesaisie();
            }

            $("#modal_medicament").unblock();

        }
    });

}


// ***********************************liste consultation

function liste_entrergros() {


    $.ajax({
        beforeSend: function () {

            $("#card_entrergros").block({
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
        url: base + "liste_entrergros",
        type: "POST",
        dataType: "JSON",
        data: {
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val()
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_entrergros")) {
                $("#table_entrergros").DataTable().destroy();
            } else {
            }
            $('#table_entrergros').empty();
            $("#table_entrergros").append(res.table);


            $('#table_entrergros').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                autoWidth: true,

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

                            liste_entrergros();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Entré Gros",
                        className: "btn btn-sm mr-1 btn-success",
                        text: 'Excel',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }

                    },
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {

                            affiche_entrergrosdetail_add();

                        }
                    },






                ],
            });
            $("#card_entrergros").unblock();

        },
    });

}


// delete entrer gros
var identrergrosindex;

function delete_entrergrosindex(id) {

    identrergrosindex = id;

    $("#deleteentrergrosindex").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deleteentrergrosindex").unblock();


}


function delete_entrergrosind() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $.ajax({
        beforeSend: function () {
            $("#deleteentrergrosindex").block({
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
        url: base + "delete_entrergrosindex",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { identrergrosindex: identrergrosindex },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#deleteentrergrosindex").modal("hide");
            $("#deleteentrergrosindex").unblock();
        }, success: function (res) {


            $("#deleteentrergrosindex").modal("hide");
            $("#deleteentrergrosindex").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_entrergros();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function edit_entrergrosdetail(iddetail, idindex, idfrs, idart, ancienQt, idsaisity) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    identrergrosdetail = iddetail;
    identrergrosindex = idindex;
    id_fournisseur = idfrs;
    id_article = idart;
    idsaisitype = idsaisity;
    ancienQte = ancienQt;

    generation_dropdown_fournisseur();

    $("#AddEntrerDetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    $('.entete_modal').text("Modifier");
    $('#btn_add_entrer_gros').text("Modification");
    charge_medicament_entrer_gros();


}
function supprimerentrergrosdetail(id) {

    identrergrosdetail = id;

    $("#deleteentrergrosdetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deleteentrergrosdetail").unblock();


}


function delete_entrerdetailind() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $.ajax({
        beforeSend: function () {
            $("#deleteentrergrosdetail").block({
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
        url: base + "delete_entrergrosdetail",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { identrergrosdetail: identrergrosdetail },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");

        }, success: function (res) {


            $("#deleteentrergrosdetail").modal("hide");
            $("#deleteentrergrosdetail").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_entrergros();
                liste_entrergrosdetail();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function affiche_entrergrosdetail(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    identrergrosindex = id;

    $("#detailentrergros").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_entrergrosdetail();

}

function generation_dropdown_fournisseur() {

    $.ajax({
        beforeSend: function () { },
        url: base + "generation_dropdown_fournisseur",
        type: "POST",
        success: function (res) {
            $("#id_fournisseur").empty();
            $("#id_fournisseur").append(res);
            $(".selectpicker").selectpicker("refresh");
            if (id_fournisseur != "") {
                $('#id_fournisseur').val(id_fournisseur).selectpicker('refresh');
            }
        },
    });



}

function affiche_entrergrosdetail_add() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    identrergrosindex = "";

    $("#detailentrergros").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_entrergrosdetail();
    addMedicModal();


}


function liste_entrergrosdetail() {


    $.ajax({
        beforeSend: function () {

            $("#table_entrergrosdetail").block({
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
        url: base + "affiche_entrergrosdetail",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: {
            identrergrosindex: identrergrosindex
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#table_entrergrosdetail").unblock();
        }, success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_entrergrosdetail")) {
                $("#table_entrergrosdetail").DataTable().destroy();
            } else {
            }
            $('#table_entrergrosdetail').empty();
            $("#table_entrergrosdetail").append(res.table);


            $('#table_entrergrosdetail').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                deferRender: true,
                pageLength: 10,
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

                            liste_entrergrosdetail();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Entré Gros",
                        className: "btn btn-sm mr-1 btn-success",
                        text: 'Excel',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }

                    },

                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {

                            // $('#id_detail_consultattion').val('');

                            addMedicModal();

                        }
                    },




                ],
            });
            $("#table_entrergrosdetail").unblock();

        },
    });

}

$('#id_article').on('change', function () {


    chargetypesaisie();

});



$("#ajout_entrer_gros").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $("#modal_medicament").block({
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

    let data = new FormData(this);

    data.append('identrergrosdetail', identrergrosdetail);
    data.append('ancienQte', ancienQte);
    data.append('identrergrosindex', identrergrosindex);

    $.ajax({
        beforeSend: function () {

        },
        url: base + "ajout_entrer_gros",
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
            enCours = false;
            $("#modal_medicament").unblock();

            if (res.id == 1 && identrergrosdetail == "") {

                identrergrosindex = res.idindex;

                alertCustom("success", "ft-check", "Ajout effectué avec succée");

                addMedicModal();

                liste_entrergrosdetail();
                liste_entrergros();

            }
            else if (res.id == 1 && identrergrosdetail != "") {
                identrergrosindex = res.idindex;
                alertCustom("success", "ft-check", "Modification effectué avec succée");
                $("#AddEntrerDetail").modal("hide");

                liste_entrergrosdetail();
                liste_entrergros();
            }
            else {

                alertCustom("warning", "ft-check", res.message);

            }


        },
    });
});



function addMedicModal() {
    $('#ajout_entrer_gros').find(':input:not([type="submit"], [type="hidden"])').each(function () {
        if ($(this).is('select.selectpicker')) {
            $(this).selectpicker('val', []); // Réinitialiser le selectpicker
        } else {
            $(this).val('');
        }
    });

    ancienQte = 0;

    $("#AddEntrerDetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    id_article = "";
    identrergrosdetail = "";

    $('.entete_modal').text("Ajout");
    $('#btn_add_entrer_gros').text("Ajouter");
    charge_medicament_entrer_gros();
}

function chargetypesaisie() {
    $.ajax({
        beforeSend: function () {

            $("#modal_medicament").block({
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
        url: base + 'check_medicament_entrer_gros',
        type: "POST",
        dataType: "JSON",
        data: {
            id_article: $('#id_article').val(),
            identrergrosdetail: identrergrosdetail
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#typeqte").empty();
            $("#typeqte").append(data.type);
            $("#dateperemption").val(data.dateperemption);
            $("#prix_boite").val(data.prix_boite);
            $("#presentation").val(data.presentation);
            $("#qte").val(data.ancienQte);
            $("#dateperemption").datepicker('update');
            $('select').selectpicker('refresh');
            if (idsaisitype != "") {
                $('#typeqte').val(idsaisitype).selectpicker('refresh');
            }

            $("#modal_medicament").unblock();

        }
    });
}

// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerEntrerGros() {

    liste_entrergros();

}