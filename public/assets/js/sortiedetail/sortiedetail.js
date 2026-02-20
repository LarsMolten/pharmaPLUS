

$(document).ready(function () {

    $("#date_debut").val(dateDebutISO);
    $("#date_fin").val(dateFinISO);

    liste_sortiedetail();

    if (idtypeconsult == 28) {
        charge_typesortie();
    }

});

var enCours = false;
var medicament_select;
var typesortiedetailid;
var ancienQte;
var typesortiedetailid ;
var iddetailmedicament;




function charge_typesortie() {
    $.ajax({
        url: base + 'charge_typesortie',
        type: "POST",
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#typesortiedetailid").empty();
            $("#typesortiedetailid").append(data);
            $("#typesortiedetailid").selectpicker('refresh');
            if (typesortiedetailid != "") {
                $('#typesortiedetailid').val(typesortiedetailid).selectpicker('refresh');
            }
        }
    });
}

// ***********************************liste consultation

function liste_sortiedetail() {

    type = "Sortie manuelle";

    $.ajax({
        beforeSend: function () {

            $("#card_sortiedetail").block({
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
        url: base + "liste_sortiedetail",
        type: "POST",
        dataType: "JSON",
        data: {
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val(),
            idtypeconsult : idtypeconsult
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            if ($.fn.DataTable.isDataTable("#table_sortiedetail")) {
                $("#table_sortiedetail").DataTable().destroy();
            } else {
            }
            $('#table_sortiedetail').empty();
            $("#table_sortiedetail").append(res.table);

            if (res.dom == "Bfrtip") {
                $btn = [

                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {

                            addMedicModal();

                        },
                    },
                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_sortiedetail();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Sortie Detail",
                        className: "btn btn-sm mr-1 btn-success",
                        text: 'Excel',
                        /*exportOptions: {
                            columns: ':not(:last-child)'
                        }*/

                    },






                ];
            } else {
                $btn = [

                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_sortiedetail();

                        },
                    },
                    {
                        extend: "excelHtml5",
                        title: "Sortie Detail",
                        className: "btn btn-sm mr-1 btn-success",
                        text: 'Excel',
                        /*exportOptions: {
                            columns: ':not(:last-child)'
                        }*/

                    },






                ];
            }

            $('#table_sortiedetail').DataTable({
                destroy: true,
                ordering: true,
                order: [[11, "desc"]],
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
                buttons: $btn,
            });
            $("#card_sortiedetail").unblock();

        },
    });

}


// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerSortieDetail() {

    liste_sortiedetail();

}