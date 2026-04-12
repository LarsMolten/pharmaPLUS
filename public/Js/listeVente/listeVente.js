window.pageInitializers = window.pageInitializers || {};

window.pageInitializers.listeVente = function () {
    // *********************************************** decalration ***********************
    let today = new Date();

    let debut = "";
    let fin = "";

    // *********************************************** initialisation *********************
    setDateToday(today);
    liste_vente();

    // ####################################################################################

    function setLabel(text) {
        $("#filtreDate").html('<i class="ft-calendar mr-1"></i> ' + text);
    }
    function formatDate(date) {
        return date.toISOString().slice(0, 10);
    }

    function setDateToday() {
        let now = new Date();
        debut = formatDate(now);
        fin = formatDate(now);

        $("#date_debut").val(debut);
        $("#date_fin").val(fin);
        setLabel("Aujourd'hui");
    }

    $(document).on("click", ".filtre-date", function (e) {
        e.preventDefault();
        let action = $(this).data("type");
        console.log(action);

        function formatDate(date) {
            return date.toISOString().slice(0, 10);
        }

        if (action === "today") {
            setDateToday();
        }

        if (action === "yesterday") {
            today.setDate(today.getDate() - 1);

            debut = formatDate(today);
            fin = formatDate(today);
            setLabel("Hier");
        }

        if (action === "month") {
            let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

            debut = formatDate(firstDay);
            fin = formatDate(today);
            setLabel("Ce mois");
        }

        $("#date_debut").val(debut);
        $("#date_fin").val(fin);

        liste_vente();
    });

    window.filtrer_vente = function () {
        setLabel("- - -");
        liste_vente();
    };

    function liste_vente() {
        let date_debut = $("#date_debut").val();
        let date_fin = $("#date_fin").val();

        $.ajax({
            beforeSend: function () {
                $("#card_liste_vente").block({
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
            url: base + "liste_vente",
            type: "POST", // on utilise GET pour récupérer les données sans csrf
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: {
                date_debut: date_debut,
                date_fin: date_fin,
            },
            complete: function () {
                enCours = false;
            },
            success: function (res) {
                //Detruire la table avant de la reconstruire
                if ($.fn.DataTable.isDataTable("#card_listeVente")) {
                    $("#card_listeVente").DataTable().destroy();
                }

                $("#card_listeVente").empty();
                $("#card_listeVente").append(res.data);

                // formatage des nombres
                $("#card_listeVente td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).html(formatNumberDisplay(val));
                    }
                });

                $("#nb_totalVente").text(res.nbTotalVente);
                $("#nb_totalDetail").text(res.nbTotalDetail);
                $("#montant_total_vente").text(
                    res.totalMontant.toLocaleString() + " Ar",
                );

                $("#nb_consultation").text(res.consultation.count);
                $("#montant_consultation").text(
                    res.consultation.montant.toLocaleString() + " Ar",
                );
                $("#bar_consultation").css(
                    "width",
                    res.consultation.percent + "%",
                );

                $("#nb_service").text(res.service.count);
                $("#montant_service").text(
                    res.service.montant.toLocaleString() + " Ar",
                );
                $("#bar_service").css("width", res.service.percent + "%");

                $("#nb_article").text(res.article.count);
                $("#montant_article").text(
                    res.article.montant.toLocaleString() + " Ar",
                );
                $("#bar_article").css("width", res.article.percent + "%");

                $("#nb_analyse").text(res.analyse.count);
                $("#montant_analyse").text(
                    res.analyse.montant.toLocaleString() + " Ar",
                );
                $("#bar_analyse").css("width", res.analyse.percent + "%");

                $("#nb_kit").text(res.kit.count);
                $("#montant_kit").text(
                    res.kit.montant.toLocaleString() + " Ar",
                );
                $("#bar_kit").css("width", res.kit.percent + "%");

                $("#card_listeVente").DataTable({
                    destroy: true,
                    ordering: true,
                    order: [[6, "desc"]],
                    responsive: true,
                    info: false,
                    paging: true,
                    deferRender: true,
                    pageLength: 8,
                    initComplete: function (settings, json) {
                        $("div.dataTables_wrapper div.dataTables_filter input")
                            .attr("placeholder", "Recherche")
                            .css("font-size", "11px");
                    },
                    language: {
                        search: "",
                        zeroRecords: "Aucune vente",
                        paginate: {
                            previous: "Précédent",
                            next: "Suivant",
                        },
                    },
                    dom: "frtip",
                });

                $("#card_liste_vente").unblock();
            },
            error: function (xhr) {
                console.error("Erreur:", xhr);
                $("#card_liste_vente").unblock();
            },
        });
    }

    window.afficher_modal_liste_detail_vente = function (id) {
        const parts = String(id).split("|");

        let Id = parts[0];
        let ref = parts[1];
        let client = parts[2];
        let caissier = parts[3];
        let date = parts[4];
        let total = parts[5];
        let paye = parts[6];
        let monnaie = parts[7];

        $("#listeVenteDetailModal").modal(
            { backdrop: "static", keyboard: false },
            "show",
        );

        $.ajax({
            beforeSend: function () {
                $("#card_liste_venteDetail").block({
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
            url: base + "liste_vente_detail",
            type: "POST", // on utilise GET pour récupérer les données sans csrf
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: { vente_id: Id },

            success: function (res) {
                if ($.fn.DataTable.isDataTable("#table_venteDetail")) {
                    $("#table_venteDetail").DataTable().destroy();
                }

                $("#table_venteDetail").empty();
                $("#table_venteDetail").append(res.data);

                $("#ref_vente_to_detail").text(ref);
                $("#client_vente_to_detail").text(client);
                $("#caissier_vente_to_detail").text(caissier);
                $("#date_vente_to_detail").text(date.toLocaleString());
                $("#total_vente_to_detail").text(
                    total.toLocaleString(),
                );
                $("#paye_vente_to_detail").text(paye.toLocaleString());
                $("#monnaie_vente_to_detail").text(
                    monnaie.toLocaleString(),
                );

                // formatage des nombres
                $("#table_venteDetail td.format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).html(formatNumberDisplay(val));
                    }
                });

                $("#somme_m .format-prix").each(function () {
                    let val = $(this).text().trim();
                    if (val !== "" && !isNaN(parseFloat(val))) {
                        $(this).html(formatNumberDisplay(val) + " Ar");
                    }
                });

                $("#table_venteDetail").DataTable({
                    destroy: true,
                    ordering: true,
                    order: [[0, "asc"]],
                    responsive: true,
                    info: false,
                    paging: false,
                    deferRender: true,
                    pageLength: 10,
                    initComplete: function (settings, json) {
                        $("div.dataTables_wrapper div.dataTables_filter input")
                            .attr("placeholder", "Recherche")
                            .css("font-size", "11px");
                    },
                    language: {
                        search: "",
                        zeroRecords: "Aucune vente",
                    },
                    dom: "Bfrtip",
                    buttons: [
                        {
                            className:
                                "btn btn-sm mr-1 btn-info btn-min-width ",
                            text: '<i class="la la-print">Imprimer</i>',
                            action: function () {
                                let urlPrintPdf =
                                    BASE_URL + "/print_recu_consultation/" + Id;

                                setTimeout(function () {
                                    window.open(urlPrintPdf, "_blank");
                                }, 500);
                            },
                        },
                    ],
                });

                $("#card_liste_venteDetail").unblock();
            },
            error: function (xhr) {
                console.error("Erreur:", xhr);
                $("#card_liste_venteDetail").unblock();
            },
        });
    };
};
