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
    // ID du conteneur du filtre
    const filtreContainer = document.getElementById("filtre-vente-container");

    // Fonction pour afficher/cacher selon la route
    function toggleFiltreVente() {
        // récupère la route actuelle (chemin après le domaine)
        const currentRoute = window.location.pathname;

        // n'afficher le filtre que sur la page historique vente
        if (currentRoute === "/afficher_liste_vente") {
            filtreContainer.style.display = "flex"; // ou 'block' selon ton style
        } else {
            filtreContainer.style.display = "none";
        }
    }

    // Exécuter au chargement initial
    document.addEventListener("DOMContentLoaded", toggleFiltreVente);

    // Exécuter après chaque navigation AJAX
    $(document).ajaxComplete(function () {
        toggleFiltreVente();
    });

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
        liste_vente();
    };

    function liste_vente() {
        let date_debut = $("#date_debut").val();
        let date_fin = $("#date_fin").val();

        console.log(date_debut);

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

                // $("#affichage_montant_panier .format-prix ").each(function () {
                //     let val = $(this).text().trim();
                //     if (val !== "" && !isNaN(parseFloat(val))) {
                //         $(this).html(formatNumberDisplay(val));
                //     }
                // });

                $("#card_listeVente").DataTable({
                    destroy: true,
                    ordering: true,
                    order: [[6, "desc"]],
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
};
