window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.panier = function () {
    // ************************************************ initialisation de la page ******************************
    let id_panier = "";
    let id_article_vente = "";
    let produit_id = "";
    let id_categorie = "";
    let id_service = "";
    let prix_produit = "";
    let analyse_selected = [];
    let page_type = "consultation";
    let type_doc_selected = "";
    let doc_selected = "";

    // ************************************************** declaration *******************************************

    liste_panier();
    charge_article_vente();
    charge_analyse_panier();
    // charge_categorie_panier();
    charge_service_panier();
    charge_kit_vente();
    charge_personnel(type_doc_selected);

    // ************************************************** declaration *******************************************

    window.get_tab_consultation = function (id) {
        page_type = id;
        reset_form_vente_service();
        reset_form_vente_article();
        reset_form_vente_analyse();
        reset_form_vente_kit();
    };
    window.get_tab_service = function (id) {
        page_type = id;
        reset_form_vente_article();
        reset_form_vente_analyse();
        reset_form_vente_kit();
        reset_form_vente_consultation();
    };
    window.get_tab_article = function (id) {
        page_type = id;
        reset_form_vente_service();
        reset_form_vente_analyse();
        reset_form_vente_kit();
        reset_form_vente_consultation();
    };
    window.get_tab_analyse = function (id) {
        page_type = id;
        reset_form_vente_service();
        reset_form_vente_article();
        reset_form_vente_kit();
        reset_form_vente_consultation();
    };
    window.get_tab_kit = function (id) {
        page_type = id;
        reset_form_vente_service();
        reset_form_vente_article();
        reset_form_vente_analyse();
        reset_form_vente_consultation();
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

                // pour consultation
                $("#type_docteur").empty();
                $("#type_docteur").append(res.t_dr);
                $("#type_docteur").selectpicker("refresh");

                $("#type_docteur").on("change", function () {
                    type_doc_selected = $("#type_docteur")
                        .find("option:selected")
                        .val();
                    // console.log(type_doc_selected);
                    charge_personnel(type_doc_selected);
                });

                $("#consultation_id").val(res.consult_id);
                $("#prix_consultation").val(res.consult_prix);

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
    function charge_personnel(type_doc) {
        $.ajax({
            beforeSend: function () {
                $("#choix_docteur").block({
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
            url: base + "charge_personnel",
            type: "POST",
            dataType: "JSON",
            error: function (xhr, status, error) {
                alertCustom("danger", "ft-x", "Une erreur s'est produite");
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: { type_docteur: type_doc },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            success: function (res) {
                $("#docteur").empty();
                $("#docteur").append(res.data);
                $("#docteur").selectpicker("refresh");
                if (doc_selected != "") {
                    $("#docteur").val(doc_selected).selectpicker("refresh");
                }

                $("#choix_docteur").unblock();
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
                    doc_selected = "";
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
                        charge_service_panier();
                        charge_personnel(doc_selected);
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

    window.edit_consultation_panier = function (id) {
        const parts = String(id).split("-");
        console.log(parts);

        id_panier = parts[0];
        let type = parts[1];
        produit_id = parts[2];
        let prix_consulation = parts[3];
        let quantite = parts[4];
        page_type = type;
        let nom_patient = parts[5];
        let sex_patient = parts[6];
        let age_patient = parts[7];
        let unite_age = parts[8];
        type_doc_selected = parts[9];
        doc_selected = parts[10];

        $("#title_form").text("Modification");
        $("#btn_add_panier").text("Modifier");

        // Reset tabs
        $("#card_tab_g ul li a").removeClass("active");
        $(".tab-content .tab-pane").removeClass("active");

        $("#active-tab21").addClass("active").focus();
        $("#active21").addClass("active");

        $("#nom_patient").val(nom_patient);
        $("input[name='sex_patient'][value='" + sex_patient + "']").prop(
            "checked",
            true,
        );

        $("#age_patient").val(age_patient);
        $("input[name='unite_age'][value='" + unite_age + "']").prop(
            "checked",
            true,
        );

        $("#type_docteur").val(type_doc_selected).selectpicker("refresh");

        charge_personnel(type_doc_selected);

        $("#consultation_id").val(produit_id);
        $("#prix_consultation").val(prix_consulation);
    };

    window.edit_panier = function (id) {
        const parts = String(id).split("-");
        // console.log(parts);

        id_panier = parts[0];
        const type = parts[1];
        produit_id = parts[2];
        prix_service = parts[3];
        const quantite = parts[4];
        // page_type = parts[5];
        page_type = type;
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
        } else if (type == "kit") {
            $("#link-tab33").addClass("active").focus();
            $("#link33").addClass("active");

            $("#kit_id_vente").val(produit_id).selectpicker("refresh");
            $("#qte_kit").val(quantite);
        } else {
            $("#active-tab11").addClass("active").focus();
            $("#active11").addClass("active");
            $("#id_service").val(produit_id).selectpicker("refresh");
            $("#qte_service").val(quantite);
        }
    };

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
    window.reset_form_vente_consultation = function () {
        id_panier = "";
        produit_id = "";
        type_doc_selected = "";
        doc_selected = "";
        $("#title_form").text("Ajout");
        $("#btn_add_panier").text("Ajouter");
        $("#nom_patient").val("");
        $("input[name='sex_patient'][value='1']").prop("checked", true);

        $("#age_patient").val("");
        $("input[name='unite_age'][value='1']").prop("checked", true);

        $("#type_docteur").selectpicker("val", []);
        charge_personnel(type_doc_selected);
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

    function charge_info_patient() {
        $.ajax({
            beforeSend: function () {
                $("#valider_vente").block({
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
            url: base + "charge_info_patient",
            type: "GET",
            dataType: "json",
            error: function (xhr, status, error) {
                alertCustom("danger", "ft-x", "Une erreur s'est produite");
            },

            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            success: function (res) {
                $("#patient_vente").val(res.data);
                $("#net_payer").text(res.net);

                $("#net_payer .format-prix ").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).html(formatNumberDisplay(val));
                    }
                });
                $("#valider_vente").unblock();
            },
        });
    }

    window.afficher_modal_validation_vente = function () {
        charge_info_patient();
        $("#ValiderVenteModal").modal(
            { backdrop: "static", keyboard: false },
            "show",
        );
    };

    $(document).on("input", "#montant_paye", function () {
        // récupérer net à payer
        let net = $("#net_payer").text();

        // retirer espaces
        net = net.replace(/\s/g, "");

        let montantPaye = $(this).val().replace(/\s/g, "");

        // convertir en nombre
        net = parseFloat(net) || 0;
        montantPaye = parseFloat(montantPaye) || 0;

        // calcul monnaie
        let monnaie = montantPaye - net;

        // empêcher valeur négative
        if (monnaie < 0) monnaie = 0;

        // afficher
        $("#monnaie").val(monnaie.toLocaleString("fr-FR"));
    });

    $(document)
        .off("submit", "#valider_vente")
        .on("submit", "#valider_vente", function (e) {
            e.preventDefault();
            if (enCours) return; // Empêche un deuxième clic si une requête est en cours
            // enCours = true;

            let form = $(this);
            let data = new FormData(this);

            $.ajax({
                beforeSend: function () {},
                url: base + "valider_vente",
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
                    doc_selected = "";
                    if (res.status == "success") {
                        // Reset formulaire
                        form[0].reset();
                        form.removeData("id"); // supprime mode modification

                        alertCustom(
                            "success",
                            "ft-check",
                            "Validation effectué avec succès",
                        );

                        $("#patient_vente").val("");
                        $("#montant_paye").val("");

                        // printPDF(res);

                        let urlPrintPdf =
                            BASE_URL +
                            "/print_recu_consultation/" +
                            res.vente_id;

                        setTimeout(function () {
                            window.open(urlPrintPdf, "_blank");
                        }, 500);

                        liste_panier();
                        $('[data-dismiss="modal"]').focus(); // Déplacer le focus ailleurs (sur un élément visible)
                        $("#ValiderVenteModal").modal("hide");
                    } else if (res.status == "insuffisant") {
                        alertCustom("warning", "ft-x", "Espèce insuffisant !");
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

    // function printPDF(res) {
    //     if (res.has_article) {
    //         let urlArticle = BASE_URL + "/print_recu_article/" + res.vente_id;

    //         window.open(urlArticle, "_blank");
    //     }

    //     if (res.has_consultation) {
    //         let urlConsult =
    //             BASE_URL + "/print_recu_consultation/" + res.vente_id;

    //         setTimeout(function () {
    //             window.open(urlConsult, "_blank");
    //         }, 500);
    //     }
    // }
};
