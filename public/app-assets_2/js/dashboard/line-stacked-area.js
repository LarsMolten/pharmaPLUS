$(document).ready(function () {
  $(".selectpicker").selectpicker("refresh");
  var dateDebut = $("#recherche_date_debut").val(dateDebutISO);
  var dateFin = $("#recherche_date_fin").val(dateFinISO);

  affichage_dashboard();

  // chart_challenge_user();
  // chalenge();
});
var chart;
var chart_user;
// Variable pour stocker l'instance du graphique

function affichage_dashboard() {
  var dateDebut = $("#recherche_date_debut").val();
  var dateFin = $("#recherche_date_fin").val();

  chalenge();

  if ($("#line-logarithmic").length) {
    chart_challenge_user();
  }

  $("#id_dash_reload").block({
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

  var requestData = {
    date_debut: dateDebut,
    date_fin: dateFin,
  };

  // Détruire le graphique précédent s'il existe
  chart_admin(requestData);
}

function chart_admin(requestData) {
  if (chart) {
    chart.destroy();
  }

  $.ajax({
    url: base + "afficher_dashboard",
    type: "POST",
    dataType: "JSON",
    data: requestData,
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
      console.log(res);
      $("#revenu_total").text(
        String(res.solde ? res.solde + " Ar" : 0 + " Ar")
      );
      $("#Nb_devis_total").text(
        String(res.Nb_devis_total ? res.Nb_devis_total : 0)
      );

      $("#Nb_devis_alu").text(String(res.Nb_devis_alu ? res.Nb_devis_alu : 0));

      $("#Nb_devis_melam").text(
        String(res.Nb_devis_melam ? res.Nb_devis_melam : 0)
      );

      $("#Nb_devis_comander").text(
        String(res.Nb_devis_comander ? res.Nb_devis_comander : 0)
      );
      $("#Pourcentage_devis_confirme").text(
        String(
          res.Pourcentage_devis_confirme
            ? res.Pourcentage_devis_confirme + "%"
            : 0 + "%"
        )
      );

      $("#Nb_fact_reste").text(
        String(res.Nb_fact_reste ? res.Nb_fact_reste : 0)
      );
      $("#Montant_reste_paye").text(
        String(
          res.Montant_reste_paye ? res.Montant_reste_paye + " Ar" : 0 + " Ar"
        )
      );

      $("#Nb_fact_total_paye").text(
        String(res.Nb_fact_total_paye ? res.Nb_fact_total_paye : 0)
      );

      // *********
      // *
      // * **
      // * *
      // * * chart JP
      // * *
      // * *
      // * *
      // * *
      var labels;
      var granularite = res.granularite;
      var labelMerged = res.label_merged;
      // var labelsAluminium = res.labels_aluminium;
      var revenuAluminium = res.revenu_aluminium;
      // var labelsMelamine = res.labels_melamine;
      var revenuMelamine = res.revenu_melamine;

      if ($("#line-stacked-area").length) {
        var o = $("#line-stacked-area");
        chart = new Chart(o, {
          type: "line",
          options: {
            responsive: !0,
            maintainAspectRatio: !1,
            legend: { position: "bottom" },
            hover: { mode: "label" },
            scales: {
              xAxes: [
                {
                  display: !0,
                  gridLines: { color: "#f3f3f3", drawTicks: !1 },
                  scaleLabel: { display: !0, labelString: granularite },
                  ticks: {},
                  maxTicksLimit: 10,
                },
              ],
              yAxes: [
                {
                  display: !0,
                  gridLines: { color: "#f3f3f3", drawTicks: !1 },
                  scaleLabel: { display: !0, labelString: "Montant en Ariary" },
                  ticks: {
                    callback: function (value) {
                      // Formater l'axe Y avec Numeral.js (séparateur de milliers)
                      return formatPrixChart(value);
                    },
                  },
                },
              ],
            },
            title: { display: !0, text: "REVENU" },
            tooltips: {
              mode: "single", // Assurez-vous que le mode est configuré correctement
              callbacks: {
                label: function (tooltipItem, data) {
                  var value = tooltipItem.yLabel;
                  // Formater la valeur avec Numeral.js (séparateur de milliers)
                  var formattedValue = formatPrixChart(value);

                  // Retourner le texte en gras avec la balise strong
                  return formattedValue + " Ar";
                },
              },
            },
          },
          data: {
            labels: labelMerged, // Assurez-vous que labels contient les valeurs correctes après la conversion
            datasets: [
              {
                label: "Aluminium",
                data: revenuAluminium,
                backgroundColor: "rgba(22,211,154,.5)",
                borderColor: "transparent",
                pointBorderColor: "#28D094",
                pointBackgroundColor: "#FFF",
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointRadius: 4,
              },
              {
                label: "Mélamine",
                data: revenuMelamine,
                backgroundColor: "#FFB73E",
                borderColor: "transparent",
                pointBorderColor: "#ffb07c",
                pointBackgroundColor: "#FFF",
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointRadius: 4,
              },
            ],
          },
        });
      }

      //------------------------------------------------------------------------------------
      $("#id_dash_reload").unblock();
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//--------- affichage chart ---------
function chart_challenge_user() {
  var dateDebut = $("#recherche_date_debut").val();
  var dateFin = $("#recherche_date_fin").val();

  var requestData = {
    date_debut: dateDebut,
    date_fin: dateFin,
  };

  // Détruire le graphique précédent s'il existe
  if (chart_user) {
    chart_user.destroy();
  }
  $.ajax({
    url: base + "afficher_chart_challenge_user",
    type: "POST",
    dataType: "JSON",
    data: requestData,
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
      console.log(res);
      var granularite = res.granularite;
      var scores = res.scores;
      var labels = res.labels;
      var prenom = res.prenom;

      var x = $("#line-logarithmic");
      chart_user = new Chart(x, {
        type: "line",
        options: {
          responsive: !0,
          maintainAspectRatio: !1,
          legend: { position: "bottom" },
          hover: { mode: "label" },
          scales: {
            xAxes: [
              {
                display: !0,
                gridLines: { color: "#f3f3f3", drawTicks: !1 },
                scaleLabel: { display: !0, labelString: granularite },
                ticks: {},
                maxTicksLimit: 10,
              },
            ],
            yAxes: [
              {
                display: !0,
                gridLines: { color: "#f3f3f3", drawTicks: !1 },
                scaleLabel: { display: !0, labelString: "Scores" },
              },
            ],
          },
          title: { display: !0, text: "Challenge" },
        },
        data: {
          labels: labels, // Mois res.mois
          datasets: [
            {
              label: prenom,
              data: scores, // Donnée revenu mentiel de l'aluminium  res.revenu_aluminium
              backgroundColor: "rgba(22,211,154,.5)",
              borderColor: "transparent",
              pointBorderColor: "#28D094",
              pointBackgroundColor: "#FFF",
              pointBorderWidth: 2,
              pointHoverBorderWidth: 2,
              pointRadius: 4,
            },
          ],
        },
      });
    },

    error: function (error) {
      // console.error("Erreur lors de la récupération nombre de commande", error);
    },
  });
}
//------------------------------------

function chalenge() {
  var dateDebut = $("#recherche_date_debut").val();
  var dateFin = $("#recherche_date_fin").val();

  var requestData = {
    date_debut: dateDebut,
    date_fin: dateFin,
  };

  $.ajax({
    url: base + "afficher_chalenge",
    type: "POST",
    data: requestData,
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
      $("#challenge_user").empty();
      $("#challenge_user").append(res);
    },
    error: function (error) {
      // console.error("Erreur lors de la récupération nombre de commande", error);
    },
  });
}

function afficher_liste_reste_paye_modal() {
  var dateDebut = $("#recherche_date_debut").val();
  var dateFin = $("#recherche_date_fin").val();

  var requestData = {
    date_debut: dateDebut,
    date_fin: dateFin,
  };

  $.ajax({
    url: base + "afficher_liste_reste_paye",
    type: "POST",
    data: requestData,
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
      $("#table_liste_reste_modal ").empty();
      $("#table_liste_reste_modal").append(res);
      $("#Modal_devis_reste_paye").modal(
        { backdrop: "static", keyboard: false },
        "show"
      );

      // Convertissez la chaîne JSON en objet JavaScript
      $("#table_liste_reste_modal").DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        info: false,
        paging: true,
        searching: false,
        preDrawCallback: function (settings) {},
        pageLength: 5,
        language: {
          zeroRecords: "Aucun article",
          paginate: {
            previous: "Précédent",
            next: "Suivant",
          },
        },
        dom: "Bfrtip",
        buttons: [],
      });
    },
  });
}
