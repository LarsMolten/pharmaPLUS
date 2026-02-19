

$(document).ready(function () {

    $("#date_debut").val(dateFinISO);
    $("#date_fin").val(dateFinISO);

    liste_rapport_consulatation();

});


// *************** Affichage du rapport sur la consulatation *************


function liste_rapport_consulatation(){

    
    $.ajax({
        beforeSend: function () {

            $("#card_rapport").block({
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
        url: base + "listes_rapport_consultation",
        type: "POST",
        data: {
            date_debut :  $('#date_debut').val() ,
            date_fin :  $('#date_fin').val()
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if ($.fn.DataTable.isDataTable("table_rapport")) {
                $("#table_rapport").DataTable().destroy();
            } else {
            }
            $('#table_rapport').empty();
            $("#table_rapport").append(res);


            $('#table_rapport').DataTable({
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
                
                rowCallback: function (row, data) {
                    
                
                },

                buttons: [
                    {
                        className: "btn btn-sm mr-1 btn-secondary btn-min-width ",
                        text: '<i class="ft-refresh"> Actualiser</i>',
                        action: function () {

                            liste_rapport_consulatation();


                        },
                    },

                    {
                        extend: "excelHtml5",
                        title: "Rapport sur les consultations",
                        className: "btn btn-sm mr-1 btn-success",
                        text: 'Excel',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }

                    }


                ],
            });
            $("#card_rapport").unblock();

        },

    });

}

    function filtreRapportCons(){
        liste_rapport_consulatation();
    }