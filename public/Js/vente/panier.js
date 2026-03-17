window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.panier = function () {
    // ************************************************ initialisation de la page ******************************
    liste_panier();



    // ************************************************** declaration *******************************************

    let id_panier = "";


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

                // formatage des nombres
                $("#table_panier td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).text(formatNumberDisplay(val));
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
                        search : "",
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



}