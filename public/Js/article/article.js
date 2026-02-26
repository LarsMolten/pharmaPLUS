window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.article = function () {


    // ***************************Initialisation de la page article************************
    liste_article();
    charge_unite();

    // ************************************************************************************


    var enCours = false;
    var id_article = "";
    var id_unite = "";

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
                                // id_article = "";
                                $('.entete_modal').text("Ajout");
                                $('#btn_add_article').text("Ajouter");
                                $("#AjoutArticleModal").modal(
                                    { backdrop: "static", keyboard: false },
                                    "show"
                                );
                                $('#ajout_article').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function () {
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

                $("#card_liste_article").unblock();
            },
            error: function (xhr) {
                console.error('Erreur:', xhr);
                $("#card_liste_article").unblock();
            }
        });



    }

    function changeunite() {
        var maxQuantity = $('#unite').find('option:selected').data('supun');
        // Si maxQuantity est 0, vider le champ et sortir
        if (maxQuantity === 1) {
            $('#presentation').attr("readonly", true);
            $('#presentation').val(1);
        }
        else {
            $('#presentation').attr("readonly", false);
        }
    }

    function charge_unite() {
        $.ajax({

            beforeSend: function () {

                $("#AjoutArticleModal").block({
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
            url: base + 'charge_unite',
            type: "GET",
            dataType: "json",
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            }, success: function (res) {
                $("#unite").empty();
                $("#unite").append(res.data);
                $("#unite").selectpicker('refresh');
                if (id_unite != "") {
                    $('#unite').val(id_unite).selectpicker('refresh');
                    changeunite();

                }

                $('#unite').on('change', function () {

                    changeunite();


                });

                $("#AjoutArticleModal").unblock();

            }
        });

    }



    $(document).on("submit", "#ajout_article", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        let data = new FormData(this);

        data.append("id_article", id_article);

        $.ajax({
            beforeSend: function () { },
            url: base + "ajout_article",
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
                if (id_article != "") {
                    if (res.status == "success") {
                        id_article = "";
                        alertCustom("success", "ft-check", "Modification effectué avec succée");
                        $('#ajout_article').find(':input:not([type="radio"])').each(function () {
                            if ($(this).is('select.selectpicker')) {
                                // Réinitialiser le selectpicker en vidant les sélections
                                $(this).selectpicker('val', []);
                            } else {
                                // Réinitialiser les autres champs en vidant leur valeur
                                $(this).val('');
                            }
                            $("#AjoutArticleModal").modal("hide");
                        });
                    } else {
                        alertCustom("danger", "ft-x", "Modification non effectué");
                    }

                } else {

                    $("#card_liste_article").unblock();
                    if (res.status == "success") {
                        alertCustom("success", "ft-check", "Ajout effectué avec succée");

                        $('#ajout_article').find(':input:not([type="radio"])').each(function () {
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
                    $("#AjoutArticleModal").modal("hide");
                }

                liste_article();

            },
        });
    });



    // $(document).on('click', '.edit_article', function () {
    //     var id = $(this).data('id');
    //     edit_article(id);
    // });

     window.edit_article = function(id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        id_article = id;
        //   formatPrixImput();
        $('.entete_modal').text("Modification");
        $('#btn_add_article').text("Modifier");
        $("#AjoutArticleModal").modal(
            { backdrop: "static", keyboard: false },
            "show"
        );


        var designation = $('#art_' + id).data('designation');
        var presentation = $('#art_' + id).data('presentation');
        id_unite = $('#art_' + id).data('unite');

        charge_unite();


        $('input[name="designation"]').val(designation);
        $('input[name="presentation"]').val(presentation);
        $('#unite').val(id_unite).selectpicker('refresh');

    }



     window.delete_article = function(id) {


        $("#card_liste_article").block({
            message: `


        <div class="card" style="max-width:400px ; ">
        <div class="card-header" style="max-width:400px ;">
                 <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
        </div>
        <div class="card-content">
            <div class="card-body">
                <p>Voulez-vous supprimer cet article ?</p>

                    <button type="button" data-id="`+ id + `"  data-action="delete_article_from_dialog" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                    <button type="button" data-action="close_overlay_liste_article" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


            </div>
        </div>
        </div>



        `,

            overlayCSS: {
                backgroundColor: 'black',
                opacity: 0.1,
                cursor: "wait",

            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: "transparent"
            }
        });


    }




    window.delete_article_from_dialog = function(id) {
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        $("#card_liste_article").unblock();

        $.ajax({
            beforeSend: function () {

                $("#card_liste_article").block({
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
            url: base + "delete_article",
            type: "POST",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            complete: function () {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            data: { id_article: id },
            success: function (res) {
                $("#card_liste_article").unblock();
                id_article = "";

                if (res.data > 0) {

                    alertCustom("success", 'ft-check', "Suppression effectué avec succée");

                } else {

                    alertCustom("danger", 'ft-x', "Suppression non effectué");

                }

                liste_article();

            },
        });

    }

     window.close_overlay_liste_article = function() {
        $("#card_liste_article").unblock();
    }


}
