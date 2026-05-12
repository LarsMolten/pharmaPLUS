window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.sortie = function () {
    // ************************************************** declaration *******************************************
    id_index_sortie = "";
    // ************************************************ initialisation de la page ******************************
    liste_sortieIndex();
    // ************************************************ ************************* ******************************

    function liste_sortieIndex() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_sortieIndex").block({
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
            url: base + "liste_sortieIndex",
            type: "GET", // on utilise GET pour récupérer les données sans csrf
            dataType: "json",
            //   headers: {
            //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            // },
            success: function (res) {
                //Detruire la table avant de la reconstruire
                if ($.fn.DataTable.isDataTable("#table_sortieIndex")) {
                    $("#table_sortieIndex").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#table_sortieIndex").empty();
                $("#table_sortieIndex").append(res.data);

                // formatage des nombres
                $("#table_sortieIndex td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).html(formatNumberDisplay(val));
                    }
                });

                $("#table_sortieIndex").DataTable({
                    destroy: true,
                    ordering: true,
                    order: [[4, "desc"]],
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
                        zeroRecords: "Aucun sortie",
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
                                liste_sortieIndex();
                            },
                        },
                        {
                            className:
                                "btn btn-sm mr-1 btn-success btn-min-width ",
                            text: '<i class="ft-plus"> Ajouter</i>',
                            action: function () {
                                // id_index = "";
                                $(".entets_modal").text("Nouvel entré");
                                $("#btn_add_sortieIndex").text("Ajouter");
                                $("#AjoutSortieIndexModal").modal(
                                    { backdrop: "static", keyboard: false },
                                    "show",
                                );

                                $("#motif_sortie").empty();
                                $("#motif_sortie").append(res.option);
                                $("#motif_sortie").selectpicker("refresh");
                                // $("#ajout_entreeIndex")
                                //     .find(
                                //         ':input:not([type="submit"], [type="hidden"]):not([type="radio"])',
                                //     )
                                //     .each(function () {
                                //         // Réinitialiser les autres champs en vidant leur valeur
                                //
                                //     });
                            },
                        },
                    ],
                });

                $("#card_liste_sortieIndex").unblock();
            },
            error: function (xhr) {
                console.error("Erreur:", xhr);
                $("#card_liste_sortieIndex").unblock();
            },
        });
    }

    $(document)
        .off("submit", "#ajout_sortieIndex")
        .on("submit", "#ajout_sortieIndex", function (e) {
            e.preventDefault();
            if (enCours) return; // Empêche un deuxième clic si une requête est en cours
            enCours = true;

            let form = $(this);
            let data = new FormData(this);

            data.append("id_index_sortie", id_index_sortie);

            $.ajax({
                beforeSend: function () {},
                url: base + "ajout_sortie_index",
                type: "POST",
                processData: false,
                contentType: false,
                cache: false,
                dataType: "JSON",
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content",
                    ),
                },
                data: data,
                complete: function () {
                    enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
                },
                success: function (res) {
                    enCours = false;
                    if (res.status == "success") {
                        // Reset formulaire
                        form[0].reset();
                        form.removeData("id"); // supprime mode modification

                        $("#entets_modal").text("Ajouter");
                        $("#btn_add_sortieIndex").text("Ajouter");

                        alertCustom(
                            "success",
                            "ft-check",
                            id_index_sortie
                                ? "Modification effectuée avec succès"
                                : "Ajout effectué avec succès",
                        );
                        $("#AjoutSortieIndexModal").modal("hide");
                        $('[data-dismiss="modal"]').focus();


                        // if (id_article_entree) {
                        //     $('[data-dismiss="modal"]').focus();
                        //     $("#AjoutArticleEntreeDetaileModal").modal("hide");
                        // }

                        liste_sortieIndex();
                    } else {
                        alertCustom(
                            "danger",
                            "ft-x",
                            "Opération non effectuée",
                        );
                    }
                },
            });
        });

    window.edit_sortie_index = function (id) {
        id_index_sortie = id;
        //   formatPrixImput();
        $(".entets_modal").text("Modification");
        $("#btn_add_sortieIndex").text("Modifier");
        $("#AjoutSortieIndexModal").modal(
            { backdrop: "static", keyboard: false },
            "show",
        );

        let ref_sortie = $("#sr_" + id).data("ref_sortie");
        let motif = $("#sr_" + id).data("motif");
        let options = "";

        options += "<option value='ajustement'>Ajustement</option>";
        options += "<option value='perte'>Perte</option>";
        $("#motif_sortie").html(options);

        $("#ref_sortie").val(ref_sortie);
        $("#motif_sortie").val(motif).selectpicker("refresh");
    };

    window.delete_sortie_index = function (id) {
        id_index_sortie = id;
        show_delete_dialog_modal(
            id_index_sortie,
            "Êtes-vous sûr de vouloir supprimer cette sortie ?",
            "#card_liste_sortieIndex",
            "confirmer_delete_sortie_index",
            "annuler_delete_sortie_index",
        );
    };

    window.confirmer_delete_sortie_index = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        $("#card_liste_sortieIndex").unblock();

        $.ajax({
            beforeSend: function () {
                $("#table_sortieIndex").block({
                    message:
                        '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto"></div>',

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
            url: base + "delete_sortie_index",
            type: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            data: { id_index_sortie: id },
            success: function (res) {
                id_index_sortie = "";

                if (res.data > 0) {
                    alertCustom(
                        "success",
                        "ft-check",
                        "Suppression effectué avec succée",
                    );
                } else {
                    alertCustom("danger", "ft-x", "Suppression non effectué");
                }

                $("#table_sortieIndex").unblock();
                liste_sortieIndex();
            },
        });
    };

    window.annuler_delete_sortie_index = function () {
        $("#card_liste_sortieIndex").unblock();
        id_index_sortie = "";
    };

    window.afficher_sortie_detail = function (id) {
        id_index_sortie = id;
        $("#listeSortieDetailModal").modal(
            { backdrop: "static", keyboard: false },
            "show",
        );

        $.ajax({
            beforeSend: function () {
                $("#card_liste_sortieIndex").block({
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

            url: base + "liste_sortieDetail",
            type: "POST", // on utilise GET pour récupérer les données sans csrf
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: { id_index_sortie: id_index_sortie },
            // complete: function () {
            //     enCours = false;
            // },
            success: function (res) {
                if ($.fn.DataTable.isDataTable("#table_sortiedetail")) {
                    $("#table_sortiedetail").DataTable().destroy();
                }

                $("#table_sortiedetail").empty();
                $("#table_sortiedetail").append(res.data);

                // formatage des nombres
                $("#table_sortiedetail td.format-prix ").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).html(formatNumberDisplay(val));
                    }
                });

                $("#table_sortiedetail").DataTable({
                    destroy: true,
                    ordering: true,
                    order: [[0, "asc"]],
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
                        zeroRecords: "Aucune sortie",
                        paginate: {
                            previous: "Précédent",
                            next: "Suivant",
                        },
                    },
                    dom: "Bfrtip",
                    buttons: [
                        {
                            className:
                                "btn btn-sm mr-1 btn-success btn-min-width ",
                            text: '<i class="ft-plus"> Ajouter</i>',
                            action: function () {
                                // id_article = "";
                                // $(".entete_modal").text("Ajouter");
                                // $("#btn_add_article_entree_detail").text(
                                //     "Ajouter",
                                // );

                     

                                // $("#AjoutArticleEntreeDetaileModal").modal(
                                //     { backdrop: "static", keyboard: false },
                                //     "show",
                                // );

                                // $("#card_liste_entreeDetail").block({
                                //     message:
                                //         '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

                                //     overlayCSS: {
                                //         backgroundColor: "black",
                                //         opacity: 0.1,
                                //         cursor: "wait",
                                //     },
                                //     css: {
                                //         border: 0,
                                //         padding: 0,
                                //         backgroundColor: "transparent",
                                //     },
                                // });

                                // $("#ajout_article_entree_detail")
                                //     .find(
                                //         ':input:not([type="submit"], [type="hidden"]):not([type="radio"])',
                                //     )
                                //     .each(function () {
                                //         // Réinitialiser les autres champs en vidant leur valeur
                                //         $(this).val("");
                                //     });

                                // $("#date_peremption").datepicker({
                                //     format: "mm-yyyy",
                                //     viewMode: "months",
                                //     minViewMode: "months",
                                //     forceParse: true,
                                //     clearBtn: true,
                                // });

                                // $(document)
                                //     .off("click", "#date_peremption")
                                //     .on(
                                //         "click",
                                //         "#date_peremption-icon",
                                //         function () {
                                //             $("#date_peremption").focus(); // Déclenche le calendrier
                                //         },
                                //     );
                            },
                        },
                        {
                            className:
                                "btn btn-sm mr-1 btn-info btn-min-width ",
                            text: '<i class="ft-upload"> Importer</i>',
                            action: function () {
                                // id_index = id;
                                // $("#ImportExcelModal").modal(
                                //     { backdrop: "static", keyboard: false },
                                //     "show",
                                // );
                                // $("#import_excel")
                                //     .find(
                                //         ':input:not([type="submit"], [type="hidden"]):not([type="radio"])',
                                //     )
                                //     .each(function () {
                                //         $(this).val("");
                                //     });
                            },
                        },
                    ],
                });

                $("#card_liste_sortieIndex").unblock();
            },
            error: function (xhr) {
                console.error("Erreur:", xhr);
                $("#card_liste_sortieIndex").unblock();
            },
        });
    };
};
