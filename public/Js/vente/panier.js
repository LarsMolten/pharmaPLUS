window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.panier = function () {
    // ************************************************ initialisation de la page ******************************
    liste_panier();
    charge_article_vente();

    // ************************************************** declaration *******************************************

    let id_panier = "";
    let id_article_vente = "";
    let type_vente = "";
    let produit_id = "";

    // **********************************************************************************************************

    function liste_panier() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_panier").block({
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
            url: base + "liste_panier",
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
                if ($.fn.DataTable.isDataTable("#table_panier")) {
                    $("#table_panier").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#table_panier").empty();
                $("#table_panier").append(res.data);
                
                $("#affichage_montant_panier").empty();
                $("#affichage_montant_panier").html(res.pan);

                $("#btn_display").html(res.bt);

                // formatage des nombres
                 $("#table_panier td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).html(formatNumberDisplay(val));
                    }
                });

                $("#table_panier").DataTable({
                    destroy: true,
                    ordering: false,
                    order: [[0, "asc"]],
                    responsive: true,
                    info: false,
                    paging: false,
                    deferRender: true,
                    pageLength: 10,
                    initComplete: false,
                    language: {
                        search: "",
                        zeroRecords: "Aucun entré",
                    },
                    // dom: "Bfrtip",
                });

                $("#card_liste_panier").unblock();
            },
            error: function (xhr) {
                console.error("Erreur:", xhr);
                $("#card_liste_panier").unblock();
            },
        });
    }

    function charge_info_article() {
        type_vente = "article";

        let stock_dispo = $("#article_id_vente")
            .find("option:selected")
            .data("stock_dispo");
        let stock = $("#article_id_vente")
            .find("option:selected")
            .data("stock");

        if (stock == 0) {
            alertCustom("danger", "ft-x", "Stock épuisé pour cet artile");
            $("#qte_vente").attr("readonly", true);
        } else {
            $("#qte_vente").attr("readonly", false);
        }

        $("#s_dispo_title").attr("hidden", false);
        $("#s_dispo").text(stock_dispo);
    }

    function charge_article_vente() {
        $.ajax({
            beforeSend: function () {
                $("#link11").block({
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
            url: base + "charge_article",
            type: "GET",
            dataType: "json",
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", "ft-x", "Une erreur s'est produite");
            },
            success: function (res) {
                $("#article_id_vente").empty();
                $("#article_id_vente").append(res.data);
                $("#article_id_vente").selectpicker("refresh");
                if (id_article_vente != "") {
                    $("#article_id_vente")
                        .val(id_article_vente)
                        .selectpicker("refresh");
                }

                $("#article_id_vente").on("change", function () {
                    charge_info_article();
                });

                $("#link11").unblock();
            },
        });
    }

    $(document)
        .off("submit", "#ajout_panier")
        .on("submit", "#ajout_panier", function (e) {
            e.preventDefault();
            if (enCours) return; // Empêche un deuxième clic si une requête est en cours
            enCours = true;

            let form = $(this);
            let data = new FormData(this);

            data.append("id_panier", id_panier);
            data.append("type_vente", type_vente);

            $.ajax({
                beforeSend: function () {},
                url: base + "ajout_panier",
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

                        $("#title_form").text("Ajouter");
                        $("#btn_add_panier").text("Ajouter");

                        alertCustom(
                            "success",
                            "ft-check",
                            id_panier
                                ? "Modification effectuée avec succès"
                                : "Ajout effectué avec succès",
                        );

                        $("#ajout_panier")
                            .find(':input:not([type="radio"])')
                            .each(function () {
                                if ($(this).is("select.selectpicker")) {
                                    // Réinitialiser le selectpicker en vidant les sélections
                                    $(this).selectpicker("val", []);
                                } else {
                                    // Réinitialiser les autres champs en vidant leur valeur
                                    $(this).val("");

                                    $("#s_dispo_title").attr("hidden", true);
                                    $("#s_dispo").text("");
                                }
                            });

                        liste_panier();
                    } else if (res.status == "insuffisant") {
                        alertCustom("warning", "ft-x", "Stock insuffisant");
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


     window.delete_one_or_all_panier = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_panier = id;
        show_delete_dialog_modal(
            id_panier,
            "Êtes-vous sûr de vouloir supprimer le panier ?",
            "#card_liste_panier",
            "confirmer_delete_one_or_all_panier",
            "annuler_delete_one_or_all_panier",
        );
    };

    window.confirmer_delete_one_or_all_panier = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        $("#card_liste_panier").unblock();

        $.ajax({
            beforeSend: function () {
                $("#table_panier").block({
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
            url: base + "delete_one_or_all_panier",
            type: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            data: { id_panier: id },
            success: function (res) {
                $("#table_panier").unblock();

                id_panier = "";

                if (res.data > 0) {
                    alertCustom(
                        "success",
                        "ft-check",
                        "Suppression effectué avec succée",
                    );
                } else {
                    alertCustom("danger", "ft-x", "Suppression non effectué");
                }

                liste_panier();
            },
        });
    };

    window.annuler_delete_one_or_all_panier = function () {
        $("#card_liste_panier").unblock();
        id_panier = "";
    };
};
