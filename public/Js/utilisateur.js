window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.utilisateur = function () {

    // ****************************Initialisation de la page utilisateur************************
    liste_utilisateur();
    charge_role();

    // *****************************************************************************************


    var enCours = false;
    let id_utilisateur = "";
    let role = "";

    function liste_utilisateur() {
        $.ajax({
            beforeSend: function () {
                $("#card_liste_utilisateur").block({
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
            url: base + "liste_utilisateur",
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
                if ($.fn.DataTable.isDataTable("#card_utilisateur")) {
                    $("#card_utilisateur").DataTable().destroy();
                }

                // Vider le contenu de la table avant de la remplir avec les nouvelles données
                $("#card_utilisateur").empty();
                $("#card_utilisateur").append(res.data);

                $("#card_utilisateur").DataTable({
                    destroy: true,
                    ordering: true,
                    order: [[0, "desc"]],
                    responsive: true,
                    info: false,
                    paging: false,
                    deferRender: true,
                    pageLength: 10,
                    "initComplete": function (settings, json) {
                        $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "11px");
                    },
                    language: {
                        "search": "",
                        "zeroRecords": "Aucun utilisateur trouvé",
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
                                liste_utilisateur();
                            },
                        },
                        {
                            className: "btn btn-sm mr-1 btn-success btn-min-width ",
                            text: '<i class="ft-plus"> Ajouter</i>',
                            action: function () {
                                // id_utilisateur = "";
                                $('.entete_modal').text("Ajout");
                                $('#btn_add_utilisateur').text("Ajouter");
                                $("#AjoutUtilisateurModal").modal(
                                    { backdrop: "static", keyboard: false },
                                    "show"
                                );
                                $('#ajout_utilisateur').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function () {
                                    if ($(this).is('select.selectpicker')) {
                                        // Réinitialiser le selectpicker en vidant les sélections
                                        $(this).selectpicker('val', []);
                                    } else {
                                        // Réinitialiser les autres champs en vidant leur valeur
                                        $(this).val('');
                                    }
                                });
                                // formatPrixImput();

                            },
                        },
                    ],
                });

                $("#card_liste_utilisateur").unblock();
            },
            error: function (xhr) {
                console.error('Erreur:', xhr);
                $("#card_liste_utilisateur").unblock();
            }
        });



    }


    function charge_role() {
        $.ajax({

            beforeSend: function () {

                $("#AjoutUtilisateurModal").block({
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
            url: base + 'charge_role',
            type: "GET",
            dataType: "json",
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            }, success: function (res) {
                $("#role").empty();
                $("#role").append(res.data);
                $("#role").selectpicker('refresh');

                if (role != "") {
                    $('#role').val(role).selectpicker('refresh');
                }

                $("#AjoutUtilisateurModal").unblock();

            }
        });

    }



    $(document).off("submit", "#ajout_utilisateur").on("submit", "#ajout_utilisateur", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        let data = new FormData(this);

        data.append('image', $('#image')[0].files[0]);
        data.append("id_utilisateur", id_utilisateur);

        $.ajax({
            beforeSend: function () { },
            url: base + "ajout_utilisateur",
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            dataType: "JSON",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: data,
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            success: function (res) {
                if (id_utilisateur != "") {
                    if (res.status == "success") {
                        id_utilisateur = "";
                        role = "";
                        alertCustom("success", "ft-check", "Modification effectué avec succée");
                        $('#ajout_utilisateur').find(':input:not([type="radio"])').each(function () {
                            if ($(this).is('select.selectpicker')) {
                                // Réinitialiser le selectpicker en vidant les sélections
                                $(this).selectpicker('val', []);
                            } else {
                                // Réinitialiser les autres champs en vidant leur valeur
                                $(this).val('');
                            }
                            $("#AjoutUtilisateurModal").modal("hide");
                        });
                    } else {
                        alertCustom("danger", "ft-x", "Modification non effectué");
                    }

                } else {

                    $("#card_liste_utilisateur").unblock();
                    if (res.status == "success") {
                        alertCustom("success", "ft-check", "Ajout effectué avec succée");

                        $('#ajout_utilisateur').find(':input:not([type="radio"])').each(function () {
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
                    $('[data-dismiss="modal"]').focus();  // Déplacer le focus ailleurs (sur un élément visible)
                    $("#AjoutUtilisateurModal").modal("hide");
                }

                liste_utilisateur();

            },
        });
    });



    window.edit_utilisateur = function (id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        id_utilisateur = id;
        //   formatPrixImput();
        $('.entete_modal').text("Modification");
        $('#btn_add_utilisateur').text("Modifier");
        $("#AjoutUtilisateurModal").modal(
            { backdrop: "static", keyboard: false },
            "show"
        );


        // var image = $('#user' + id).data('image');
        var name = $('#user_' + id).data('name');
        var username = $('#user_' + id).data('username');
        role = $('#user_' + id).data('role');

        console.log(id);
        console.log(role);
        console.log(name);
        console.log(username);

        charge_role();


        $('input[name="name"]').val(name);
        $('input[name="username"]').val(username);
        $('#role').val(role).selectpicker('refresh');


    }


}

