

$(document).ready(function () {
    $("#date_debut").val(dateDebutISO);
    $("#date_fin").val(dateFinISO);
    liste_entrerproduit();
    formatPrixImput();
    generation_dropdown_fournisseur();

    $("#dateperemption").datepicker( {
        format: "mm-yyyy",
        viewMode: "months", 
        minViewMode: "months",
        forceParse: true,
        clearBtn: true
    });
    
    $("#dateperemption-icon").on("click", function() {
      $("#dateperemption").focus(); // Déclenche le calendrier
    });
      

    
});

var ancienQte;
var id_produit;
var id_fournisseur;
var identrerproduitdetail;
var idsaisitype  ;


function charge_medicament_entrer_produit() {
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
        url: base + 'charge_medicament_entrer_produit',
        type: "POST",
        data: {
            qte: ancienQte,
            id_produit: id_produit
            
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#id_produit").empty();
            $("#id_produit").append(data);
            $('select').selectpicker('refresh');
            if (id_produit != "") {
                $('#id_produit').val(id_produit).selectpicker('refresh');
                chargetypesaisie();
            }

            $("#modal_medicament").unblock();

        }
    });

}


// ***********************************liste consultation

function liste_entrerproduit() {


    $.ajax({
        beforeSend: function () {

            $("#card_entrerproduit").block({
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
        url: base + "liste_entrerproduit",
        type: "POST",
        dataType: "JSON",
        data:{
            date_debut :  $('#date_debut').val() ,
            date_fin :  $('#date_fin').val()
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_entrerproduit")) {
                $("#table_entrerproduit").DataTable().destroy();
            } else {
            }
            $('#table_entrerproduit').empty();
            $("#table_entrerproduit").append(res.table);


            $('#table_entrerproduit').DataTable({
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

                            liste_entrerproduit();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Entré produit",
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

                            affiche_entrerproduitdetail_add();

                        }
                    },

                 
                    
                    


                ],
            });
            $("#card_entrerproduit").unblock();

        },
    });

}


// delete entrer produit
var identrerproduitindex;

function delete_entrerproduitindex(id) {

    identrerproduitindex = id;

    $("#deleteentrerproduitindex").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deleteentrerproduitindex").unblock();


}


function delete_entrerproduitind() {

    $.ajax({
        beforeSend: function () {
            $("#deleteentrerproduitindex").block({
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
        url: base + "delete_entrerproduitindex",
        type: "POST",
        dataType: "JSON",
        data: { identrerproduitindex: identrerproduitindex },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#deleteentrerproduitindex").modal("hide");
            $("#deleteentrerproduitindex").unblock();
        }, success: function (res) {


            $("#deleteentrerproduitindex").modal("hide");
            $("#deleteentrerproduitindex").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_entrerproduit();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function edit_entrerproduitdetail(iddetail , idindex , idfrs , idart , ancienQt , idsaisity) {

    identrerproduitdetail = iddetail ;
    identrerproduitindex = idindex;
    id_fournisseur = idfrs ;
    id_produit = idart;
    idsaisitype = idsaisity ;
    ancienQte = ancienQt ;

    generation_dropdown_fournisseur();

    $("#AddEntrerDetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    $('.entete_modal').text("Modifier");
    $('#btn_add_entrer_produit').text("Modification");
    charge_medicament_entrer_produit();


}
function supprimerentrerproduitdetail(id) {

    identrerproduitdetail = id;

    $("#deleteentrerproduitdetail").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#deleteentrerproduitdetail").unblock();


}


function delete_entrerdetailind() {

    $.ajax({
        beforeSend: function () {
            $("#deleteentrerproduitdetail").block({
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
        url: base + "delete_entrerproduitdetail",
        type: "POST",
        dataType: "JSON",
        data: { identrerproduitdetail: identrerproduitdetail },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        
        }, success: function (res) {


            $("#deleteentrerproduitdetail").modal("hide");
            $("#deleteentrerproduitdetail").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                liste_entrerproduit();
                liste_entrerproduitdetail();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}

function affiche_entrerproduitdetail(id) {

    identrerproduitindex = id;

    $("#detailentrerproduit").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_entrerproduitdetail();

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

function affiche_entrerproduitdetail_add() {

    identrerproduitindex = "";

    $("#detailentrerproduit").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    liste_entrerproduitdetail();
    addMedicModal();


}


function liste_entrerproduitdetail() {


    $.ajax({
        beforeSend: function () {

            $("#table_entrerproduitdetail").block({
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
        url: base + "affiche_entrerproduitdetail",
        type: "POST",
        dataType: "JSON",
        data:{
            identrerproduitindex :  identrerproduitindex 
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
       $("#table_entrerproduitdetail").unblock();
    } ,success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_entrerproduitdetail")) {
                $("#table_entrerproduitdetail").DataTable().destroy();
            } else {
            }
            $('#table_entrerproduitdetail').empty();
            $("#table_entrerproduitdetail").append(res.table);


            $('#table_entrerproduitdetail').DataTable({
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

                            liste_entrerproduitdetail();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Entré produit",
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
            $("#table_entrerproduitdetail").unblock();

        },
    });

}

$('#id_produit').on('change', function () {


    chargetypesaisie();

});



$("#ajout_entrer_produit").off("submit").on("submit", function (e) {
    e.preventDefault();

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

    data.append('identrerproduitdetail', identrerproduitdetail);
    data.append('ancienQte', ancienQte);
    data.append('identrerproduitindex', identrerproduitindex);

    $.ajax({
        beforeSend: function () {
           
        },
        url: base + "ajout_entrer_produit",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {

            $("#modal_medicament").unblock();

            if (res.id == 1 && identrerproduitdetail == "") {

                identrerproduitindex = res.idindex ;

                alertCustom("success", "ft-check", "Ajout effectué avec succée");

                addMedicModal();

                liste_entrerproduitdetail();
                liste_entrerproduit();

            }
            else if (res.id == 1 && identrerproduitdetail != "") {
                identrerproduitindex = res.idindex ;
                alertCustom("success", "ft-check", "Modification effectué avec succée");
                $("#AddEntrerDetail").modal("hide");

                liste_entrerproduitdetail();
                liste_entrerproduit();
            }
            else {

                alertCustom("warning", "ft-check", res.message);

            }


        },
    });
});



function addMedicModal() {
    $('#ajout_entrer_produit').find(':input:not([type="submit"], [type="hidden"])').each(function () {
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

    id_produit = "";
    identrerproduitdetail = "";

    $('.entete_modal').text("Ajout");
    $('#btn_add_entrer_produit').text("Ajouter");
    charge_medicament_entrer_produit();
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
        url: base + 'check_medicament_entrer_produit',
        type: "POST",
        dataType: "JSON",
        data: {
            id_produit: $('#id_produit').val(),
            identrerproduitdetail : identrerproduitdetail
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

function filtrerEntrerproduit() {

    liste_entrerproduit();

}