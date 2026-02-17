$(document).ready(function () {
    liste_article();
});

function liste_article() {
    $.ajax({
        beforeSend: function () {
            $("#card_liste_article").block({
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
        url: base + "liste_article",
        type: "GET", // on utilise GET pour récupérer les données sans csrf
        dataType: "json",
        //   headers: {
        //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        // },
        complete: function () {
            enCours = false;
        },
        success: function (res) {

            //Detruire la table avant de la reconstruire
            if ($.fn.DataTable.isDataTable("#card_article")) {
                $("#card_article").DataTable().destroy();
            }

            // Vider le contenu de la table avant de la remplir avec les nouvelles données
            $("#card_article").empty();
            $("#card_article").append(res.data);

            $("#card_article").DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                deferRender: true,
                pageLength: 10,
                "initComplete": function (settings, json) {
                    $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "11px");
                },
                language: {
                    "search": "",
                    "zeroRecords": "Aucun article",
                    paginate: {
                        previous: "Précédent",
                        next: "Suivant",
                    },
                },
                dom: 'Bfrtip',
                buttons: [
                    {
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {
                            liste_article();
                        },
                    },
                    {
                        className: "btn btn-sm mr-1 btn-success btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {
                            alert("Ajouter un article");

                            // id_article = "";
                            // $('.entete_modal').text("Ajout");
                            // $('#btn_add_article').text("Ajouter");
                            // $("#AddContactModal").modal(
                            //     { backdrop: "static", keyboard: false },
                            //     "show"
                            // );
                            // $('#ajout_article').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function () {
                            //     if ($(this).is('select.selectpicker')) {
                            //         // Réinitialiser le selectpicker en vidant les sélections
                            //         $(this).selectpicker('val', []);
                            //     } else {
                            //         // Réinitialiser les autres champs en vidant leur valeur
                            //         $(this).val('');
                            //     }
                            // });
                            // formatPrixImput();

                        },
                    },
                ],
            });

            $("#card_liste_article").unblock();
        },
        error: function (xhr) {
            console.error('Erreur:', xhr);
            $("#card_liste_article").unblock();
        }
    });
}
