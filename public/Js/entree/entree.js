window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.entree = function () {

    // ************************************************ initialisation de la page ******************************
    liste_entreeIndex();

    





    // ************************************************** declaration *******************************************








    /* ############################################### ENTREE INDEX #################################################################*/
    

  function liste_entreeIndex() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_entreeIndex").block({
                    message:
                        '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',
                    overlayCSS: {
                        backgroundColor: "black",
                        opacity: 0.1,
                        cursor: "wait",
                    },
                    css: {
                        border: 0,
                        padding: 0,
                        backgroundColor: "transparent",
                    },
                });
            },
            url: base + "liste_entreeIndex",
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
                if ($.fn.DataTable.isDataTable("#table_entreeIndex")) {
                    $("#table_entreeIndex").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#table_entreeIndex").empty();
                $("#table_entreeIndex").append(res.data);

                // formatage des nombres
                // $("#table_entreeIndex td.format-prix").each(function () {
                //     let val = $(this).text().trim();
                //     if (val !== "" && !isNaN(parseFloat(val))) {
                //         $(this).text(formatNumberDisplay(val));
                //     }
                // });

                $("#table_entreeIndex").DataTable({
                    destroy: true,
                    ordering: true,
                    order: [[0, "desc"]],
                    responsive: true,
                    info: false,
                    paging: true,
                    deferRender: true,
                    pageLength: 10,
                    initComplete: function (settings, json) {
                        $("div.dataTables_wrapper div.dataTables_filter input")
                            .attr("placeholder", "Recherche")
                            .css("font-size", "11px");
                    },
                    language: {
                        search: "",
                        zeroRecords: "Aucun analyse",
                        paginate: {
                            previous: "Précédent",
                            next: "Suivant",
                        },
                    },
                    dom: "Bfrtip",
                    buttons: [
                        {
                            className: "btn btn-sm mr-1 btn-secondary",
                            text: '<i class="ft-rotate-cw"> </i>',
                            action: function () {
                                liste_entreeIndex();
                            },
                        },
                        {
                            className: "btn btn-sm mr-1 btn-success btn-min-width ",
                            text: '<i class="ft-plus"> Ajouter</i>',
                            action: function () {
                                // id_article = "";
                                // $('.entete_modal').text("Ajout");
                                // $('#btn_add_article').text("Ajouter");
                                // $("#AjoutArticleModal").modal(
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

                $("#card_liste_entreeIndex").unblock();
            },
            error: function (xhr) {
                console.error("Erreur:", xhr);
                $("#card_liste_entreeIndex").unblock();
            },
        });
    }













}