window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.entree = function () {
    // ************************************************ initialisation de la page ******************************
    liste_entreeIndex();

    // ************************************************** declaration *******************************************

    let id_index = "";

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
                        zeroRecords: "Aucun entré",
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
                            className:
                                "btn btn-sm mr-1 btn-success btn-min-width ",
                            text: '<i class="ft-plus"> Ajouter</i>',
                            action: function () {
                                // id_article = "";
                                $(".entete_modal").text("Nouvel entré");
                                $("#btn_add_entreeIndex").text("Ajouter");
                                $("#AjoutEntreeIndexModal").modal(
                                    { backdrop: "static", keyboard: false },
                                    "show",
                                );
                                $("#ajout_entreeIndex")
                                    .find(
                                        ':input:not([type="submit"], [type="hidden"]):not([type="radio"])',
                                    )
                                    .each(function () {
                                        // Réinitialiser les autres champs en vidant leur valeur
                                        $(this).val("");
                                    });
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


    $(document)
        .off("submit", "#ajout_entreeIndex")
        .on("submit", "#ajout_entreeIndex", function (e) {
            e.preventDefault();
            if (enCours) return; // Empêche un deuxième clic si une requête est en cours
            enCours = true;

            let form = $(this);
            // id_index = form.data("id") || "";
            let data = new FormData(this);

            // récupérer la valeur brute en enlevant les espaces

            data.append("id_entreeIndex", id_index);

            $.ajax({
                beforeSend: function () { },
                url: base + "ajout_entreeIndex",
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
                    if (res.status == "success") {
                        // Reset formulaire
                        form[0].reset();
                        form.removeData("id"); // supprime mode modification

                        $("#entete_modal").text("Nouvel entré");
                        $("#btn_add_entreeIndex").text("Ajouter");

                        alertCustom(
                            "success",
                            "ft-check",
                            id_index
                                ? "Modification effectuée avec succès"
                                : "Ajout effectué avec succès",
                        );

                        // Rafraîchir DataTable proprement

                        $('[data-dismiss="modal"]').focus();  // Déplacer le focus ailleurs (sur un élément visible)
                        $("#AjoutEntreeIndexModal").modal("hide");

                        liste_entreeIndex();

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




    window.edit_entree_index = function (id) {

        id_index = id;
        //   formatPrixImput();
        $('.entete_modal').text("Modification");
        $('#btn_add_entreeIndex').text("Modifier");
        $("#AjoutEntreeIndexModal").modal(
            { backdrop: "static", keyboard: false },
            "show"
        );

        let ref_entree = $('#en_' + id).data('ref_entree');
        let motif = $('#en_' + id).data('motif');


        $('input[name="ref_entree"]').val(ref_entree);
        $('#motif').val(motif);

    }

    window.delete_entree_index = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_index = id;
        show_delete_dialog_modal(
            id_index,
            "Êtes-vous sûr de vouloir supprimer cette entrée ?",
            "#card_liste_entreeIndex",
            "confirmer_delete_entree_index",
            "annuler_delete_entree_index",
        );
    };

    window.confirmer_delete_entree_index = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        $("#card_liste_entreeIndex").unblock();

        $.ajax({
            beforeSend: function () {
                $("#table_entreeIndex").block({
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
            url: base + "delete_entree_index",
            type: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            data: { id_index: id },
            success: function (res) {
                $("#table_entreeIndex").unblock();

                id_index = "";

                if (res.data > 0) {
                    alertCustom(
                        "success",
                        "ft-check",
                        "Suppression effectué avec succée",
                    );
                } else {
                    alertCustom("danger", "ft-x", "Suppression non effectué");
                }

                liste_entreeIndex();
            },
        });
    };

    window.annuler_delete_entree_index = function () {
        $("#card_liste_entreeIndex").unblock();
        id_index = "";
    };

    /* ############################################### ENTREE DETAILS #################################################################*/


    window.afficher_entree_detail = function (id) {

        $("#listeEntreeDetailModal").modal(
            { backdrop: "static", keyboard: false },
            "show"
        );

        $.ajax({
            beforeSend: function () {
                $("#card_liste_entreeDetail").block({
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


            url: base + "liste_entreeDetail",
            type: "GET", // on utilise GET pour récupérer les données sans csrf
            dataType: "json",
            //   headers: {
            //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            // },
            // complete: function () {
            //     enCours = false;
            // },
            success: function (res) {

                if ($.fn.DataTable.isDataTable("#table_entreedetail")) {
                    $("#table_entreedetail").DataTable().destroy();
                }

                $("#table_entreedetail").empty();
                $("#table_entreedetail").append(res.data);

                // formatage des nombres
                // $("#table_entreeIndex td.format-prix").each(function () {
                //     let val = $(this).text().trim();
                //     if (val !== "" && !isNaN(parseFloat(val))) {
                //         $(this).text(formatNumberDisplay(val));
                //     }
                // });

                $("#table_entreedetail").DataTable({
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
                        zeroRecords: "Aucun entré",
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
                                // $(".entete_modal").text("Nouvel entré");
                                // $("#btn_add_entreeIndex").text("Ajouter");
                                // $("#AjoutEntreeIndexModal").modal(
                                //     { backdrop: "static", keyboard: false },
                                //     "show",
                                // );
                                // $("#ajout_entreeIndex")
                                //     .find(
                                //         ':input:not([type="submit"], [type="hidden"]):not([type="radio"])',
                                //     )
                                //     .each(function () {
                                //         // Réinitialiser les autres champs en vidant leur valeur
                                //         $(this).val("");
                                //     });
                            },
                        },
                    ],
                });

                $("#card_liste_entreeDetail").unblock();
            },
            error: function (xhr) {
                console.error("Erreur:", xhr);
                $("#card_liste_entreeDetail").unblock();
            },
        });
    }





};
