window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.gestion = function () {



    // ***************************Initialisation de la page gestion************************

    liste_analyse();
    liste_echographie()

    // ************************************************************************************


    /* #############################################################  ANALYSE ################################################################# */


    let id_analyse = "";
    // var id_unite = "";

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
        let id_analyse = form.data('id') || "";
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
                $("#table_categorie td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).text(formatNumberDisplay(val));
                    }
                });

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
                                liste_analyse();
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





































    /* ########################################################## ECHOGRAPHIE ################################################################# */


    function liste_echographie() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_echographie").block({
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
            url: base + "liste_echographie",
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
                if ($.fn.DataTable.isDataTable("#table_echographie")) {
                    $("#table_echographie").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#table_echographie").empty();
                $("#table_echographie").append(res.data);

                // formatage des nombres
                $("#table_echographie td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).text(formatNumberDisplay(val));
                    }
                });

                $("#table_echographie").DataTable({
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
                        "zeroRecords": "Aucun echographie",
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
                                liste_echographie();
                            },
                        },
                    ],
                });

                $("#card_liste_echographie").unblock();
            },
            error: function (xhr) {
                console.error('Erreur:', xhr);
                $("#card_liste_echographie").unblock();
            }
        });



    }


    $(document).on("submit", "#ajout_echographie", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        let form = $(this);
        let id_echographie = form.data('id') || "";
        let data = new FormData(this);

        // récupérer la valeur brute en enlevant les espaces
        let prixBrut = $('input[name="prix-echo"]').val().replace(/\s/g, '');
        data.set('prix', prixBrut);

        data.append("id_echographie", id_echographie);

        $.ajax({
            beforeSend: function () { },
            url: base + "ajout_echographie",
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

                    $('#entete_form_echographie').text("Ajout");
                    $('.ajouter_echographie').text("Ajouter");

                    alertCustom("success", "ft-check",
                        id_echographie ? "Modification effectuée avec succès"
                            : "Ajout effectué avec succès");

                    // Rafraîchir DataTable proprement
                    liste_echographie();

                } else {
                    alertCustom("danger", "ft-x", "Opération non effectuée");
                }

            },
        });
    });

    window.edit_echographie = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours

        let row = $('#ec_' + id);
        if (!row.length) {
            console.warn("Ligne introuvable :", id);
            return;
        }

        $('#ajout_echographie').data('id', id);
        // formatPrixImput();
        $('#entete_form_echographie').text("Modification");
        $('.ajouter_echographie').text("Modifier");

        var nom = $('#ec_' + id).data('nom');
        var prix = $('#ec_' + id).data('prix');

        $('input[name="nom"]').val(nom);
        // $('input[name="prix"]').val(prix);

        // Formater le prix pour l'affichage dans le champ input
        $('input[name="prix"]').val(formatNumberDisplay(prix));

    }




















}




