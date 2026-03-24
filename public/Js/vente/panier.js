window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.panier = function () {
    // ************************************************ initialisation de la page ******************************
    liste_panier();
    charge_article_vente();
    charge_analyse_panier();
    // charge_categorie_panier();
    charge_service_panier();
    charge_kit_vente();

    // ************************************************** declaration *******************************************

    let id_panier = "";
    let id_article_vente = "";
    let produit_id = "";
    let id_categorie = "";
    let id_service = "";
    let prix_produit = "";
    let analyse_selected = [];
    let page_type = "service";

    window.get_tab_service = function (id) {
        page_type = id;
        reset_form_vente_article();
        reset_form_vente_analyse();
        reset_form_vente_kit();
    };
    window.get_tab_article = function (id) {
        page_type = id;
        reset_form_vente_service();
        reset_form_vente_analyse();
        reset_form_vente_kit();
    };
    window.get_tab_analyse = function (id) {
        page_type = id;
        reset_form_vente_service();
        reset_form_vente_article();
        reset_form_vente_kit();
    };
    window.get_tab_kit = function (id) {
        page_type = id;
        reset_form_vente_service();
        reset_form_vente_article();
        reset_form_vente_analyse();
    };

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

                $("#affichage_montant_panier .format-prix ").each(function () {
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
        let stock_dispo = $("#article_id_vente")
            .find("option:selected")
            .data("stock_dispo");
        let stock = $("#article_id_vente")
            .find("option:selected")
            .data("stock");

        if (stock == 0) {
            alertCustom("warning", "ft-x", "Stock épuisé pour cet artile !");
            $("#qte_vente_art").attr("readonly", true);
        } else {
            $("#qte_vente_art").attr("readonly", false);
        }

        $("#s_dispo_title").attr("hidden", false);
        $("#s_dispo").text(stock_dispo);
    }

    function charge_service_panier() {
        $.ajax({
            beforeSend: function () {
                $("#active11").block({
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
            url: base + "charge_service",
            type: "GET",
            dataType: "json",
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", "ft-x", "Une erreur s'est produite");
            },
            success: function (res) {
                $("#id_service").empty();
                $("#id_service").append(res.data);
                $("#id_service").selectpicker("refresh");
                if (produit_id != "") {
                    $("#id_service").val(produit_id).selectpicker("refresh");
                }
                $("#id_service").on("change", function () {
                    $("#qte_service").val(1);

                    prix_produit = $("#id_service")
                        .find("option:selected")
                        .data("prix");
                });

                $("#active11").unblock();
            },
        });
    }

    function charge_analyse_panier() {
        $.ajax({
            beforeSend: function () {
                $("#link22").block({
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
            url: base + "charge_analyse",
            type: "GET",
            dataType: "json",
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", "ft-x", "Une erreur s'est produite");
            },
            success: function (res) {
                $("#analyse_id_vente").empty();
                $("#analyse_id_vente").append(res.data);
                $("#analyse_id_vente").selectpicker("refresh");
                if (analyse_selected != "" && analyse_selected != null) {
                    let ids = analyse_selected;

                    if (typeof analyse_selected === "string") {
                        ids = analyse_selected.split(",");
                    }

                    $("#analyse_id_vente").selectpicker("val", ids);
                }

                $("#link22").unblock();
            },
        });
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
                if (produit_id != "") {
                    $("#article_id_vente")
                        .val(produit_id)
                        .selectpicker("refresh");
                    charge_info_article();
                }

                $("#article_id_vente").on("change", function () {
                    charge_info_article();
                });

                $("#link11").unblock();
            },
        });
    }

    function charge_kit_vente() {
        $.ajax({
            beforeSend: function () {
                $("#link33").block({
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
            url: base + "charge_kit",
            type: "GET",
            dataType: "json",
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", "ft-x", "Une erreur s'est produite");
            },
            success: function (res) {
                $("#kit_id_vente").empty();
                $("#kit_id_vente").append(res.data);
                $("#kit_id_vente").selectpicker("refresh");
                if (produit_id != "") {
                    $("#kit_id_vente").val(produit_id).selectpicker("refresh");
                }

                $("#kit_id_vente").on("change", function () {
                    $("#qte_kit").val(1);
                    prix_produit = $("#kit_id_vente")
                        .find("option:selected")
                        .data("prix");
                });

                $("#link33").unblock();
            },
        });
    }

    /* ######################################################## AJOUT AU PANIER ################################################*/
    $(document)
        .off("submit", "#ajout_panier")
        .on("submit", "#ajout_panier", function (e) {
            e.preventDefault();
            if (enCours) return; // Empêche un deuxième clic si une requête est en cours
            // enCours = true;

            let form = $(this);
            let data = new FormData(this);

            data.append("id_panier", id_panier);
            data.append("page_type", page_type);
            data.append("prix_produit", prix_produit);

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
                        charge_article_vente();
                        liste_panier();
                        reset_form_vente_service();
                        reset_form_vente_article();
                        reset_form_vente_analyse();
                        reset_form_vente_kit();
                    } else if (res.status == "insuffisant") {
                        alertCustom("warning", "ft-x", "Stock insuffisant");
                    } else if (res.status == "deja_ajoutee") {
                        alertCustom("warning", "ft-x", "Déjà ajouté !");
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

    /* ######################################################## edit panier ################################################*/
    window.edit_panier = function (id) {
        const parts = String(id).split("-");

        id_panier = parts[0];
        const type = parts[1];
        produit_id = parts[2];
        prix_service = parts[3];
        const quantite = parts[4];
        page_type = parts[5];
        analyse_selected = parts[6];
        if (analyse_selected) {
            analyse_selected = JSON.parse(analyse_selected);
        }

        $("#title_form").text("Modification");
        $("#btn_add_panier").text("Modifier");

        // Reset tabs
        $("#card_tab_g ul li a").removeClass("active");
        $(".tab-content .tab-pane").removeClass("active");

        if (type === "article") {
            $("#link-tab11").addClass("active").focus();
            $("#link11").addClass("active");

            $("#s_dispo_title").prop("hidden", false);
            $("#qte_vente_art").prop("readonly", false);

            charge_article_vente();

            $("#article_id_vente").val(produit_id).selectpicker("refresh");

            $("#qte_vente_art").val(quantite);
        } else if (type == "analyse") {
            $("#link-tab22").addClass("active").focus();
            $("#link22").addClass("active");

            let ids = analyse_selected;
            if (typeof analyse_selected === "string") {
                ids = analyse_selected.split(",");
            }
            $("#analyse_id_vente").selectpicker("val", ids);
        } else {
            $("#active-tab11").addClass("active").focus();
            $("#active11").addClass("active");
            $("#id_service").val(produit_id).selectpicker("refresh");
            $("#qte_service").val(quantite);
        }
    };

    // window.edit_panier = function (id) {
    //     // Convertit en string si nécessaire
    //     value = id.toString();
    //     // Sépare partie entière et décimale
    //     let part = value.split("-");

    //     id_panier = part[0];
    //     let type = part[1];
    //     produit_id = part[2];
    //     prix_service = part[3];
    //     let quantite = part[4];
    //     page_type = part[5]; //type page

    //     $("#title_form").text("Modification");
    //     $("#btn_add_panier").text("Modifier");

    //     // desactiver tous les tab
    //     $("#card_tab_g ul li a")
    //         .removeClass("nav-link active")
    //         .addClass("nav-link");
    //     //desactiver tous les tab-content
    //     $("div .tab-content div")
    //         .removeClass("tab-pane active")
    //         .addClass("tab-pane");

    //     switch (type) {
    //         case "article":
    //             //reactiver le tab et tab-content concerné
    //             $("#link-tab11").addClass("nav-link active").focus();
    //             $("#link11").addClass("tab-pane active").focus();
    //             $("#s_dispo_title").attr("hidden", false);
    //             $("#qte_vente_art").attr("readonly", false);

    //             // $("#s_dispo").text(stock);
    //             charge_article_vente();
    //             $("#article_id_vente").val(produit_id).selectpicker("refresh");
    //             $("#qte_vente_art").val(quantite);
    //             break;

    //         default:
    //             $("#active-tab11").addClass("nav-link active").focus();
    //             $("#active11").addClass("tab-pane active").focus();

    //             $("#id_service").val(produit_id).selectpicker("refresh");
    //             $("#qte_service").val(quantite);
    //             break;
    //     }

    // };

    window.reset_form_vente_service = function () {
        id_panier = "";
        produit_id = "";
        prix_service = "";
        $("#title_form").text("Ajout");
        $("#btn_add_panier").text("Ajouter");
        $("#id_service").selectpicker("val", []);
        $("#qte_service").val("");
    };
    window.reset_form_vente_article = function () {
        id_panier = "";
        produit_id = "";
        prix_service = "";
        $("#title_form").text("Ajout");
        $("#btn_add_panier").text("Ajout");
        $("#article_id_vente").selectpicker("val", []);
        $("#s_dispo_title").attr("hidden", true);
        $("#qte_vente_art").attr("readonly", false);
        $("#s_dispo").text("");
        $("#qte_vente_art").val("");
    };
    window.reset_form_vente_analyse = function () {
        id_panier = "";
        analyse_selected = "";
        $("#title_form").text("Ajout");
        $("#btn_add_panier").text("Ajouter");
        $("#analyse_id_vente").selectpicker("val", []);
    };
    window.reset_form_vente_kit = function () {
        id_panier = "";
        produit_id = "";
        $("#title_form").text("Ajout");
        $("#btn_add_panier").text("Ajouter");
        $("#kit_id_vente").selectpicker("val", []);
        $("#qte_kit").val("");
    };

    /* ######################################################## ############### ################################################*/

    // function charge_categorie_panier() {
    //     $.ajax({
    //         beforeSend: function () {
    //             $("#active11").block({
    //                 message:
    //                     '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

    //                 overlayCSS: {
    //                     backgroundColor: "black",
    //                     opacity: 0.1,
    //                     cursor: "wait",
    //                 },
    //                 css: {
    //                     border: 0,
    //                     padding: 0,
    //                     backgroundColor: "transparent",
    //                 },
    //             });
    //         },
    //         url: base + "charge_categorie",
    //         type: "GET",
    //         dataType: "json",
    //         complete: function () {
    //             enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
    //         },
    //         error: function (xhr, status, error) {
    //             alertCustom("danger", "ft-x", "Une erreur s'est produite");
    //         },
    //         success: function (res) {
    //             $("#id_categorie").empty();
    //             $("#id_categorie").append(res.data);
    //             $("#id_categorie").selectpicker("refresh");
    //             if (id_categorie != "") {
    //                 $("#id_categorie")
    //                     .val(id_categorie)
    //                     .selectpicker("refresh");
    //             }

    //             $("#active11").unblock();
    //         },
    //     });
    // }

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
                charge_article_vente();
            },
        });
    };

    window.annuler_delete_one_or_all_panier = function () {
        $("#card_liste_panier").unblock();
        id_panier = "";
    };

    /*################################################# VALIDER UN PANIER ###############################################*/

    window.afficher_modal_validation_vente = function () {
        $("#ValiderVenteModal").modal(
            { backdrop: "static", keyboard: false },
            "show",
        );
    };
};
