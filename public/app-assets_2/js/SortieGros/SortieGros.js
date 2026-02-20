

$(document).ready(function () {
    $("#date_debut").val(dateDebutISO);
    $("#date_fin").val(dateFinISO);
    $("#AddSortieDetail").insertAfter("#detailsortiegros");
    $("#deletesortiegrosdetail").insertAfter("#detailsortiegros");
    liste_sortiegros();
    formatPrixImput();

});

var ancienQte;
var id_article;
var id_fournisseur;
var idsortiegrosdetail;
var idsaisitype;
var enCours = false;


function charge_medicament_sortie_gros() {
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
        url: base + 'charge_medicament_sortie_gros',
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

function liste_sortiegros() {


    $.ajax({
        beforeSend: function () {

            $("#card_sortiegros").block({
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
        url: base + "liste_sortiegros",
        type: "POST",
        dataType: "JSON",
        data: {
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val()
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_sortiegros")) {
                $("#table_sortiegros").DataTable().destroy();
            } else {
            }
            $('#table_sortiegros').empty();
            $("#table_sortiegros").append(res.table);


            $('#table_sortiegros').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                autoWidth: true,

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

                            liste_sortiegros();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Sortie Gros",
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

                            affiche_sortiegrosdetail_add();


                        }
                    },






                ],
            });
            $("#card_sortiegros").unblock();

        },
    });

}


var idsortiegrosindex;

function delete_sortiegrosindex(id) {

    idsortiegrosindex = id;

    $("#deletesortiegrosindex").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deletesortiegrosindex").unblock();


}


function delete_sortiegrosind() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $.ajax({
        beforeSend: function () {
            $("#deletesortiegrosindex").block({
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
        url: base + "delete_sortiegrosindex",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { idsortiegrosindex: idsortiegrosindex },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#deletesortiegrosindex").modal("hide");
            $("#deletesortiegrosindex").unblock();
        }, success: function (res) {


            $("#deletesortiegrosindex").modal("hide");
            $("#deletesortiegrosindex").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_sortiegros();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function edit_sortiegrosdetail(iddetail, idindex, idfrs, idart, ancienQt, idsaisity) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    idsortiegrosdetail = iddetail;
    idsortiegrosindex = idindex;
    id_fournisseur = idfrs;
    id_article = idart;
    idsaisitype = idsaisity;
    ancienQte = ancienQt;

    generation_dropdown_fournisseur();

    $("#AddSortieDetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    $('.entete_modal').text("Modifier");
    $('#btn_add_sortie_gros').text("Modification");
    charge_medicament_sortie_gros();


}
function supprimersortiegrosdetail(id) {

    idsortiegrosdetail = id;

    $("#deletesortiegrosdetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deletesortiegrosdetail").unblock();


}


function delete_sortiedetailind() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $.ajax({
        beforeSend: function () {
            $("#deletesortiegrosdetail").block({
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
        url: base + "delete_sortiegrosdetail",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { idsortiegrosdetail: idsortiegrosdetail },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");

        }, success: function (res) {


            $("#deletesortiegrosdetail").modal("hide");
            $("#deletesortiegrosdetail").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_sortiegros();
                liste_sortiegrosdetail();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function affiche_sortiegrosdetail(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    idsortiegrosindex = id;

    $("#detailsortiegros").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_sortiegrosdetail();

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

function affiche_sortiegrosdetail_add() {

    idsortiegrosindex = "";

    $("#detailsortiegros").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_sortiegrosdetail();
    addMedicModal();

}


function liste_sortiegrosdetail() {


    $.ajax({
        beforeSend: function () {

            $("#table_sortiegrosdetail").block({
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
        url: base + "affiche_sortiegrosdetail",
        type: "POST",
        dataType: "JSON",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: {
            idsortiegrosindex: idsortiegrosindex
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#table_sortiegrosdetail").unblock();
        }, success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_sortiegrosdetail")) {
                $("#table_sortiegrosdetail").DataTable().destroy();
            } else {
            }
            $('#table_sortiegrosdetail').empty();
            $("#table_sortiegrosdetail").append(res.table);


            $('#table_sortiegrosdetail').DataTable({
                destroy: true,
                ordering: true,
                order: [[1, "asc"]],
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

                            liste_sortiegrosdetail();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Sortie Gros",
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
            $("#table_sortiegrosdetail").unblock();

        },
    });

}




$("#ajout_sortie_gros").off("submit").on("submit", function (e) {
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

    data.append('idsortiegrosdetail', idsortiegrosdetail);
    data.append('ancienQte', ancienQte);
    data.append('idsortiegrosindex', idsortiegrosindex);

    $.ajax({
        beforeSend: function () {

        },
        url: base + "ajout_sortie_gros",
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

            if (res.id == 1 && idsortiegrosdetail == "") {

                idsortiegrosindex = res.idindex;

                alertCustom("success", "ft-check", "Ajout effectué avec succée");

                addMedicModal();

                liste_sortiegrosdetail();
                liste_sortiegros();

            }
            else if (res.id == 1 && idsortiegrosdetail != "") {
                idsortiegrosindex = res.idindex;
                alertCustom("success", "ft-check", "Modification effectué avec succée");
                $("#AddSortieDetail").modal("hide");

                liste_sortiegrosdetail();
                liste_sortiegros();
            }
            else {

                alertCustom("warning", "ft-check", res.message);

            }


        },
    });
});



function addMedicModal() {
    $('#ajout_sortie_gros').find(':input:not([type="submit"], [type="hidden"])').each(function () {
        if ($(this).is('select.selectpicker')) {
            $(this).selectpicker('val', []); // Réinitialiser le selectpicker
        } else {
            $(this).val('');
        }
    });

    ancienQte = 0;

    $("#AddSortieDetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#detailartmedicament").hide();
    $("#typeqte").html("");


    id_article = "";
    idsortiegrosdetail = "";

    $('.entete_modal').text("Ajout");
    $('#btn_add_sortie_gros').text("Ajouter");
    charge_medicament_sortie_gros();
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
        url: base + 'check_medicament_sortie_gros',
        type: "POST",
        dataType: "JSON",
        data: {
            id_article: $('#id_article').val(),
            idsortiegrosdetail: idsortiegrosdetail
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

            id_article = $('#id_article').val();

            if (idsaisitype != "") {
                $('#istypeqte').val(idsaisitype).selectpicker('refresh');
            }

            onChangeOnTypeQte();


            $("#modal_medicament").unblock();

        }
    });
}

function onChangeOnTypeQte() {
    $('#istypeqte').on('change', function (e) {

        let optionTrouvee = $("#id_article").find(`option[value='${id_article}']`);

        if (optionTrouvee.length > 0) {
            $('#qte').val("");
            optionTrouvee.attr("data-qte-max", $(this).find('option:selected').data('qte-max'));
        }

    });
}

// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerSortieGros() {

    liste_sortiegros();

}


function imprimerSortieGros() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $.ajax({
        beforeSend: function () {
            $("#modal_listeDetailCmd").block({
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
        url: base + "imprimerSortieGros",
        type: "POST",
        data: {
            idsortiegrosindex: idsortiegrosindex,
        },
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        dataType: "JSON",
        success: function (file) {
            $("#modal_listeDetailCmd").unblock();
            console.log(file.file);

            window.open(file.file, '_blank');
            alertCustom("success", 'ft-check', "Bien imprimé");
        },
        error: function (data) {
            $("#modal_listeDetailCmd").unblock();
            alertCustom("danger", 'ft-check', "Non imprimer");
        }
    })
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


$('#id_article').on('change', function () {

    $('#qte').val("");  // Stocker la quantité max dans le champ qte
    /*var maxQuantity = $('#istypeqte').find('option:selected').data('qte-max');
    // Si maxQuantity est 0, vider le champ et sortir
    if (maxQuantity <= 0) {
        alertCustom("warning", 'ft-x', "Stock epuisé");
    }else{*/
        chargetypesaisie();
    //}

});




