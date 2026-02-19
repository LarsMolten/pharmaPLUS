

$(document).ready(function () {
    $("#date_debut").val(dateDebutISO);
    $("#date_fin").val(dateFinISO);
    $("#AddEntrerDetail").insertAfter("#detailentrerdetail");
    $("#deleteentrerdetaildetail").insertAfter("#detailentrerdetail");
    $("#retirerentrerdetaildetail").insertAfter("#detailentrerdetail");
    liste_entrerdetail();
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
var identrerdetaildetail;
var idsaisitype;
var qteSortieeee;
var manqueeee;
var refsortie;
var enCours = false;



function charge_medicament_entrer_detail() {
    if (manqueeee == 1) {
        ancienQte = 0;
    }

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
        url: base + 'charge_medicament_entrer_detail',
        type: "POST",
        data: {
            qte: ancienQte,
            id_article: id_article

        },
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            enCours = false;
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

function liste_entrerdetail() {


    $.ajax({
        beforeSend: function () {

            $("#card_entrerdetail").block({
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
        url: base + "liste_entrerdetail",
        type: "POST",
        dataType: "JSON",
        data: {
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val()
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_entrerdetail")) {
                $("#table_entrerdetail").DataTable().destroy();
            } else {
            }
            $('#table_entrerdetail').empty();
            $("#table_entrerdetail").append(res.table);


            $('#table_entrerdetail').DataTable({
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



                dom: res.dom,
                buttons: [

                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_entrerdetail();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Entré Detail",
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

                            validerEntrer();

                        }
                    },






                ],
            });
            $("#card_entrerdetail").unblock();

        },
    });

}


// delete entrer detail
var identrerdetailindex;

function delete_entrerdetailindex(id) {



    identrerdetailindex = id;

    $("#deleteentrerdetailindex").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deleteentrerdetailindex").unblock();


}


function delete_entrerdetailindexwithoutcode() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $.ajax({
        beforeSend: function () {
            $("#deleteentrerdetailindex").block({
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
        url: base + "delete_entrerdetailindex",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { identrerdetailindex: identrerdetailindex },
        error: function (xhr, status, error) {
            enCours = false;
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#deleteentrerdetailindex").modal("hide");
            $("#deleteentrerdetailindex").unblock();
        }, success: function (res) {


            $("#deleteentrerdetailindex").modal("hide");
            $("#deleteentrerdetailindex").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_entrerdetail();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function edit_entrerdetaildetail(iddetail, idindex, idfrs, idart, ancienQt, idsaisity, qteSortie, manque) {

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    identrerdetaildetail = iddetail;
    identrerdetailindex = idindex;
    id_fournisseur = idfrs;
    id_article = idart;
    idsaisitype = idsaisity;
    qteSortieeee = qteSortie;
    manqueeee = manque;
    ancienQte = ancienQt;

    generation_dropdown_fournisseur();

    $("#AddEntrerDetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    if (manqueeee == 1) {
        $('.entete_modal').text("Ajout");
        $('#btn_add_entrer_detail').text("Ajout");
    } else {
        $('.entete_modal').text("Modifier");
        $('#btn_add_entrer_detail').text("Modification");
    }

    $('.entete_modal').text("Modifier");
    $('#btn_add_entrer_detail').text("Modification");
    charge_medicament_entrer_detail();


}
function supprimerentrerdetaildetail(id) {

    identrerdetaildetail = id;

    $("#deleteentrerdetaildetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deleteentrerdetaildetail").unblock();


}
function retirer_entrerdetaildetail(id) {

    identrerdetaildetail = id;

    $("#retirerentrerdetaildetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#retirerentrerdetaildetail").unblock();


}


function delete_entrerdetailind() {

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $.ajax({
        beforeSend: function () {
            $("#deleteentrerdetaildetail").block({
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
        url: base + "delete_entrerdetaildetail",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { identrerdetaildetail: identrerdetaildetail },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");

        }, success: function (res) {

            $("#deleteentrerdetaildetail").modal("hide");
            $("#deleteentrerdetaildetail").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_entrerdetail();
                liste_entrerdetaildetail();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function retirer_entrerdetailind() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $.ajax({
        beforeSend: function () {
            $("#deleteentrerdetaildetail").block({
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
        url: base + "retire_entrerdetaildetail",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { identrerdetaildetail: identrerdetaildetail },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");

        }, success: function (res) {


            $("#retirerentrerdetaildetail").modal("hide");
            $("#retirerentrerdetaildetail").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Medicament retiré avec succée");
                liste_entrerdetail();
                liste_entrerdetaildetail();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function affiche_entrerdetaildetail(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    identrerdetailindex = id;

    $("#detailentrerdetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_entrerdetaildetail();

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

function affiche_entrerdetaildetail_add() {

    identrerdetailindex = "";

    $("#detailentrerdetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_entrerdetaildetail();


}
function validerEntrer() {


    $("#validerEntrer").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    annuler_entrer_final()

}


function liste_entrerdetaildetail() {


    $.ajax({
        beforeSend: function () {

            $("#table_entrerdetaildetail").block({
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
        url: base + "affiche_entrerdetaildetail",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: {
            identrerdetailindex: identrerdetailindex
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#table_entrerdetaildetail").unblock();
        }, success: function (res) {
            enCours = false;
            if ($.fn.DataTable.isDataTable("#table_entrerdetaildetail")) {
                $("#table_entrerdetaildetail").DataTable().destroy();
            } else {
            }
            $('#table_entrerdetaildetail').empty();
            $("#table_entrerdetaildetail").append(res.table);

            var array = [



                {
                    className: "btn btn-sm mr-1 btn-secondary",
                    text: '<i class="ft-rotate-cw"> </i>',
                    action: function () {

                        liste_entrerdetaildetail();

                    },
                },
                {
                    extend: "excelHtml5",
                    title: "Entré Detail",
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
            ];

            if (res.dom == "Bfrtip") {
                array = array;
            } else {
                var array = [



                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_entrerdetaildetail();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Entré Detail",
                        className: "btn btn-sm mr-1 btn-success",
                        text: 'Excel',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }

                    },


                ];
            }

            $('#table_entrerdetaildetail').DataTable({
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
                buttons: array




            });
            $("#table_entrerdetaildetail").unblock();

        },
    });

}

$('#id_article').on('change', function () {


    var previousValue;
    if (manqueeee == 1 || manqueeee == 0) {
        $('#id_article').val(id_article).selectpicker('refresh');
        return;
    }
    chargetypesaisie();

});



$("#ajout_entrer_detail").off("submit").on("submit", function (e) {
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

    data.append('identrerdetaildetail', identrerdetaildetail);
    data.append('ancienQte', ancienQte);
    data.append('identrerdetailindex', identrerdetailindex);
    data.append('quantitesortie', qteSortieeee);
    data.append('manque', manqueeee);

    $.ajax({
        beforeSend: function () {

        },
        url: base + "ajout_entrer_detail",
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

            if (res.id == 1 && identrerdetaildetail == "") {

                identrerdetailindex = res.idindex;


                alertCustom("success", "ft-check", "Ajout effectué avec succée");

                addMedicModal();

                liste_entrerdetaildetail();
                liste_entrerdetail();

            }
            else if (res.id == 1 && identrerdetaildetail != "") {
                identrerdetailindex = res.idindex;

                if (manqueeee == 1) {
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                } else {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                }

                $("#AddEntrerDetail").modal("hide");

                liste_entrerdetaildetail();
                liste_entrerdetail();
            }
            else {

                alertCustom("warning", "ft-check", res.message);

            }


        },
    });
});




function valider_entrer_final() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $("#validerEntrertat").block({
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
        url: base + "valider_entrer_final",
        type: "POST",
        dataType: "JSON",
        data: { refsortie: refsortie },
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {

            if (res.id == 1) {
                $("#validerEntrertat").unblock();
                $("#validerEntrer").modal("hide");
                identrerdetailindex = res.idindex;

                affiche_entrerdetaildetail(identrerdetailindex)
                liste_entrerdetail();
            }
            else {

                $("#validerEntrertat").unblock();
                alertCustom("warning", "ft-check", res.message);

            }


        },
    });

}









function afficher_confirmtoloadSortie() {
    $("#valider_entrer").off("submit").on("submit", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        refsortie = $("#refsortie").val();


        $("#validerEntrertat").block({
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

        $.ajax({
            beforeSend: function () {
            },
            url: base + "valider_entrer",
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

                if (res.id == 1) {

                    $("#validerEntrer").html(res.suite);

                }
                else {

                    $("#validerEntrertat").unblock();
                    alertCustom("warning", "ft-check", res.message);

                }


            },
        });
    });
}

function annuler_entrer_final() {


    $("#validerEntrer").html(`
    
    <div class="modal-dialog" role="document">
            <div class="modal-content" id="validerEntrertat" style="box-shadow: 0px 19px 38px 10px rgb(0 0 0 / 30% )">
                <div class="card-content collpase show">
                    <div class="card-body">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <form method="post" id="valider_entrer">
                            <br><br>
                            <div class="form-body">



                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="" class="">Reference Sortie</label>
                                            <input class="form-control input-sm" name="refsortie" required type="text" placeholder="refsortie" id="refsortie">
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div class="form-actions right">
                                <button type="submit" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width">Valider <i class="ft-arrow-right"></i></button>


                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    
    `);

    afficher_confirmtoloadSortie();


}




function addMedicModal() {

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $('#ajout_entrer_detail').find(':input:not([type="submit"], [type="hidden"])').each(function () {
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
    $("#detailartmedicament").hide();
    $("#typeqte").html("");

    id_article = "";
    identrerdetaildetail = "";
    manqueeee = 2;
    $('.entete_modal').text("Ajout");
    $('#btn_add_entrer_detail').text("Ajouter");
    charge_medicament_entrer_detail();
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
        url: base + 'check_medicament_entrer_detail',
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: {
            id_article: $('#id_article').val(),
            identrerdetaildetail: identrerdetaildetail
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {

            $("#typeqte").empty();
            $("#typeqte").append(data.type);
            $("#dateperemption").text(data.dateperemption);
            $("#prix_boite").text(data.prix_boite);
            $("#presentation").text(data.presentation);
            $("#detailartmedicament").show();
            $("#qte").val(data.ancienQte);
            $("#dateperemption").datepicker('update');
            $('select').selectpicker('refresh');
            if (idsaisitype != "") {
                $('#typeqte').val(idsaisitype).selectpicker('refresh');
            }

            onChangeOnTypeQte();

            $("#modal_medicament").unblock();

        }
    });
}

// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerEntrerDetail() {

    liste_entrerdetail();

}


$('#qte').on('input', function () {
    var enteredQuantity = $(this).val();  // Obtenir la valeur actuelle
    var maxQuantity = $('#istypeqte').find('option:selected').data('qte-max');

    // Si le champ est vide, ne rien faire
    if (enteredQuantity === '') {
        return;
    }

    // Si maxQuantity est 0, vider le champ et sortir
    if (maxQuantity <= 0) {
        $(this).val('');
        alertCustom("warning", 'ft-x', "Stock epuisé");
        return;
    }

    // Convertir en nombre à virgule flottante pour la vérification
    enteredQuantity = parseFloat(enteredQuantity);

    // Empêcher la saisie de valeurs inférieures à 1 ou supérieures à la quantité maximale
    if (enteredQuantity > maxQuantity) {
        $(this).val(maxQuantity);  // Fixer la valeur au maximum si elle dépasse
    } else if (enteredQuantity < 1) {
        $(this).val(1);  // Fixer la valeur à 1 si elle est inférieure
    }
});


$('#qte').on('keydown', function (e) {

    var maxQuantity = $('#istypeqte').find('option:selected').data('qte-max');

    if (maxQuantity === 0) {
        $(this).val('');
        //alertCustom("warning", 'ft-x', "Stock epuisé");
        return;
    }

    if ($(this).val() == "") {
        return;
    }


    let value = parseInt($(this).val());

    if (e.key === 'ArrowUp') {
        e.preventDefault(); // Empêcher le comportement par défaut

        if (value == maxQuantity) {
            $(this).val(maxQuantity);
        }
        else {

            $(this).val(value + 1); // Incrémenter la valeur
        }

    } else if (e.key === 'ArrowDown') {
        e.preventDefault(); // Empêcher le comportement par défaut
        if (value == 1) {
            $(this).val(1);
        }
        else {
            $(this).val(value - 1); // Décrémenter la valeur
        }
    }
});


function onChangeOnTypeQte() {
    $('#istypeqte').on('change', function (e) {

        let optionTrouvee = $("#id_article").find(`option[value='${id_article}']`);

        if (optionTrouvee.length > 0) {
            $('#qte').val("");
            optionTrouvee.attr("data-qte-max", $(this).find('option:selected').data('qte-max'));
        }

    });
}