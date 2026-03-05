window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.gestion = function () {



    // ***************************Initialisation de la page gestion************************

    liste_analyse();
    liste_categorie();
    liste_service();
    charge_categorie()
    // liste_echographie();

    // ************************************************************************************

    let id_analyse = "";
    let id_categorie = "";
    let id_service = "";


    /* #############################################################  ANALYSE ################################################################# */


    function liste_analyse() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_analyse").block({
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
            url: base + "liste_analyse",
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
                if ($.fn.DataTable.isDataTable("#table_analyse")) {
                    $("#table_analyse").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#table_analyse").empty();
                $("#table_analyse").append(res.data);

                // formatage des nombres
                $("#table_analyse td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).text(formatNumberDisplay(val));
                    }
                });

                $("#table_analyse").DataTable({
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
                        "zeroRecords": "Aucun analyse",
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
                                liste_analyse();
                            },
                        },
                    ],
                });

                $("#card_liste_analyse").unblock();
            },
            error: function (xhr) {
                console.error('Erreur:', xhr);
                $("#card_liste_analyse").unblock();
            }
        });



    }


    // Action d'ajouter ou modifier une analyse

    $(document).off("submit", "#ajout_analyse").on("submit", "#ajout_analyse", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        let form = $(this);
        id_analyse = form.data('id') || "";
        let data = new FormData(this);

        // récupérer la valeur brute en enlevant les espaces
        let prixBrut = $('input[name="prix"]').val().replace(/\s/g, '');
        data.set('prix', prixBrut);

        data.append("id_analyse", id_analyse);

        $.ajax({
            beforeSend: function () { },
            url: base + "ajout_analyse",
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            dataType: "JSON",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: data, complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            success: function (res) {

                if (res.status === "success") {
                    // Reset formulaire
                    form[0].reset();
                    form.removeData('id'); // supprime mode modification

                    $('#entete_form').text("Ajout");
                    $('.ajouter_analyse').text("Ajouter");

                    alertCustom("success", "ft-check",
                        id_analyse ? "Modification effectuée avec succès"
                            : "Ajout effectué avec succès");

                    // Rafraîchir DataTable proprement
                    liste_analyse();

                } else {
                    alertCustom("danger", "ft-x", "Opération non effectuée");
                }

            },
        });
    });


    window.edit_analyse = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours

        let row = $('#an_' + id);
        if (!row.length) {
            console.warn("Ligne introuvable :", id);
            return;
        }

        $('#ajout_analyse').data('id', id);
        // formatPrixImput();
        $('#entete_form_analyse').text("Modification");
        $('.ajouter_analyse').text("Modifier");

        var nom = $('#an_' + id).data('nom');
        var prix = $('#an_' + id).data('prix');

        $('#nom_analyse').val(nom);

        // Formater le prix pour l'affichage dans le champ input
        $('#pu_analyse').val(formatNumberDisplay(prix));

    }

    window.annuler_form_analyse = function () {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_analyse = "";
        // formatPrixImput();
        $('#entete_form_analyse').text("Ajout");
        $('.ajouter_analyse').text("Ajouter");

        $('#nom_analyse').val('');
        $('#pu_analyse').val('');

    }

    window.delete_analyse = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_analyse = id;
        show_delete_dialog_modal(id_analyse, "Êtes-vous sûr de vouloir supprimer cette analyse ?", "#card_gestion_echo", "confirmer_delete_analyse", "annuler_delete_analyse");


    }


    window.confirmer_delete_analyse = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        $("#card_gestion_echo").unblock();

        $.ajax({
            beforeSend: function () {

                $("#card_liste_analyse").block({
                    message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto"></div>',

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
            url: base + "delete_analyse",
            type: "POST",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            data: { id_analyse: id },
            success: function (res) {
                $("#card_liste_analyse").unblock();

                id_analyse = "";

                if (res.data > 0) {

                    alertCustom("success", 'ft-check', "Suppression effectué avec succée");

                } else {

                    alertCustom("danger", 'ft-x', "Suppression non effectué");

                }

                liste_analyse();

            },
        });

    }

    window.annuler_delete_analyse = function () {
        $("#card_gestion_echo").unblock();
        id_analyse = "";
    }


    /* ########################################################## CATEGORIE ################################################################# */

    function liste_categorie() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_categorie").block({
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
            url: base + "liste_categorie",
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
                if ($.fn.DataTable.isDataTable("#table_categorie")) {
                    $("#table_categorie").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#table_categorie").empty();
                $("#table_categorie").append(res.data);

                // formatage des nombres
                // $("#table_categorie td.format-prix").each(function () {
                //     let val = $(this).text().trim();
                //     if (val !== "" && !isNaN(parseFloat(val))) {
                //         $(this).text(formatNumberDisplay(val));
                //     }
                // });

                $("#table_categorie").DataTable({
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
                        "zeroRecords": "Aucun analyse",
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
                                liste_categorie();
                            },
                        },
                    ],
                });

                $("#card_liste_categorie").unblock();
            },
            error: function (xhr) {
                console.error('Erreur:', xhr);
                $("#card_liste_categorie").unblock();
            }
        });



    }


    // Action d'ajouter ou modifier une catégorie

    $(document).off("submit", "#ajout_categorie").on("submit", "#ajout_categorie", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        let form = $(this);
        id_categorie = form.data('id') || "";
        let data = new FormData(this);

        data.append("id_categorie", id_categorie);

        $.ajax({
            beforeSend: function () { },
            url: base + "ajout_categorie",
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            dataType: "JSON",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: data, complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            success: function (res) {

                if (res.status == "success") {
                    // Reset formulaire
                    form[0].reset();
                    form.removeData('id'); // supprime mode modification

                    $('#entete_form_categorie').text("Ajout");
                    $('.ajouter_categorie').text("Ajouter");

                    alertCustom("success", "ft-check",
                        id_categorie ? "Modification effectuée avec succès"
                            : "Ajout effectué avec succès");

                    // Rafraîchir DataTable proprement
                    liste_categorie();

                } else {
                    alertCustom("danger", "ft-x", "Opération non effectuée");
                }

            },
        });
    });



    window.edit_categorie = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours

        let row = $('#cat_' + id);
        if (!row.length) {
            console.warn("Ligne introuvable :", id);
            return;
        }

        $('#ajout_categorie').data('id', id);
        // formatPrixImput();
        $('#entete_form_categorie').text("Modification");
        $('.ajouter_categorie').text("Modifier");

        var nom = $('#cat_' + id).data('nom');

        $('#nom_categorie').val(nom);


    }


    window.annuler_form_categorie = function () {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_categorie = "";
        // formatPrixImput();
        $('#entete_form_categorie').text("Ajout");
        $('.ajouter_categorie').text("Ajouter");

        $('#nom_categorie').val('');

    }

    window.delete_categorie = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_categorie = id;
        show_delete_dialog_modal(id_categorie, "Êtes-vous sûr de vouloir supprimer cette catégorie ?", "#card_gestio_cat", "confirmer_delete_categorie", "annuler_delete_categorie");


    }



    window.confirmer_delete_categorie = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        $("#card_gestio_cat").unblock();

        $.ajax({
            beforeSend: function () {

                $("#card_liste_categorie").block({
                    message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto"></div>',

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
            url: base + "delete_categorie",
            type: "POST",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            data: { id_categorie: id },
            success: function (res) {
                $("#card_liste_categorie").unblock();

                id_categorie = "";

                if (res.data > 0) {

                    alertCustom("success", 'ft-check', "Suppression effectué avec succée");

                } else {

                    alertCustom("danger", 'ft-x', "Suppression non effectué");

                }

                liste_categorie();

            },
        });

    }

    window.annuler_delete_categorie = function () {
        $("#card_gestio_cat").unblock();
        id_categorie = "";
    }


    /* ########################################################## SERVICES ################################################################# */



    function liste_service() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_service").block({
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
            url: base + "liste_service",
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
                if ($.fn.DataTable.isDataTable("#table_service")) {
                    $("#table_service").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#table_service").empty();
                $("#table_service").append(res.data);

                // formatage des nombres
                $("#table_service td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).text(formatNumberDisplay(val));
                    }
                });

                $("#table_service").DataTable({
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
                        "zeroRecords": "Aucun analyse",
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
                                liste_service();
                            },
                        },
                    ],
                });

                $("#card_liste_service").unblock();
            },
            error: function (xhr) {
                console.error('Erreur:', xhr);
                $("#card_liste_service").unblock();
            }
        });



    }


    function charge_categorie() {
        $.ajax({

            beforeSend: function () {

                $("#hide_service_form").block({
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
            url: base + 'charge_categorie',
            type: "GET",
            dataType: "json",
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            }, success: function (res) {
                $("#categorie_id").empty();
                $("#categorie_id").append(res.data);
                $("#categorie_id").selectpicker('refresh');
                if (id_categorie != "") {
                    $('#categorie_id').val(id_categorie).selectpicker('refresh');

                }

                $("#hide_service_form").unblock();

            }
        });

    }



    $(document).off("submit", "#ajout_service").on("submit", "#ajout_service", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        let data = new FormData(this);

        data.append("id_service", id_service);

        $.ajax({
            beforeSend: function () { },
            url: base + "ajout_service",
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            dataType: "JSON",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: data, complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            success: function (res) {

                if (id_service != "") {
                    if (res.status == "success") {
                        id_service = "";
                        alertCustom("success", "ft-check", "Modification effectué avec succée");
                        $('#ajout_service').find(':input:not([type="radio"])').each(function () {
                            if ($(this).is('select.selectpicker')) {
                                // Réinitialiser le selectpicker en vidant les sélections
                                $(this).selectpicker('val', []);
                            } else {
                                // Réinitialiser les autres champs en vidant leur valeur
                                $(this).val('');
                            }
                        });
                    } else {
                        alertCustom("danger", "ft-x", "Modification non effectué");
                    }

                } else {

                    if (res.status == "success") {
                        alertCustom("success", "ft-check", "Ajout effectué avec succée");

                        $('#ajout_service').find(':input:not([type="radio"])').each(function () {
                            if ($(this).is('select.selectpicker')) {
                                // Réinitialiser le selectpicker en vidant les sélections
                                $(this).selectpicker('val', []);
                            } else {
                                // Réinitialiser les autres champs en vidant leur valeur
                                $(this).val('');
                            }
                        });
                    } else {
                        alertCustom("danger", "ft-x", "Ajout non effectué");
                    }
                }

                liste_service();

            },
        });
    });



     window.edit_service = function(id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        id_service = id;
        //   formatPrixImput();
        $('.entete_form_service').text("Modification");
        $('.ajouter_service').text("Modifier");


        id_categorie = $('#ser_' + id).data('categorie');
        let service = $('#ser_' + id).data('service');
        let prix_serv = $('#ser_' + id).data('prix');

        charge_categorie();


        $('#categorie_id').val(id_categorie).selectpicker('refresh');
        $('input[name="nom_service"]').val(service);
        $('input[name="prix_service"]').val(prix_serv);


        // // Formater le prix pour l'affichage dans le champ input
        // $('#prix_service').val(formatNumberDisplay(prix_serv));

    }



    window.annuler_form_service = function () {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_analyse = "";
        // formatPrixImput();
        $('#entete_form_service').text("Ajout");
        $('.ajouter_service').text("Ajouter");

        $('#ajout_service').find(':input:not([type="radio"])').each(function () {
            if ($(this).is('select.selectpicker')) {
                // Réinitialiser le selectpicker en vidant les sélections
                $(this).selectpicker('val', []);
            } else {
                // Réinitialiser les autres champs en vidant leur valeur
                $(this).val('');
            }
        });

    }



    window.delete_service = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        id_service = id;
        show_delete_dialog_modal(id_service, "Êtes-vous sûr de vouloir supprimer ce service ?", "#card_gestion_serv", "confirmer_delete_service", "annuler_delete_service");


    }




    window.confirmer_delete_service = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        $("#card_gestion_serv").unblock();

        $.ajax({
            beforeSend: function () {

                $("#card_liste_service").block({
                    message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto"></div>',

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
            url: base + "delete_service",
            type: "POST",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            data: { id_service: id },
            success: function (res) {
                $("#card_liste_service").unblock();

                id_service = "";

                if (res.data > 0) {

                    alertCustom("success", 'ft-check', "Suppression effectué avec succée");

                } else {

                    alertCustom("danger", 'ft-x', "Suppression non effectué");

                }

                liste_service();

            },
        });

    }

     window.annuler_delete_service = function () {
        $("#card_gestion_serv").unblock();
        id_service = "";
    }













































}




