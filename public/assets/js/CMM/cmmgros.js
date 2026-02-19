
// Récupère l'URL de base dynamiquement
var baseUrl = window.location.origin;

// Vérifie si l'URL contient un segment qui commence par "lien"
if (window.location.href.includes(baseUrl + "/lien")) {
  // Extrait le segment après "lien" pour générer la nouvelle URL
  const newUrl = window.location.href.replace("/lien", "/");

  // Redirige vers la nouvelle URL sans le préfixe "lien"
  window.location.href = newUrl;
}
$(document).ready(function () {
  $("#date_debut").val(dateDebutISO);
  $("#date_fin").val(dateFinISO);
  $("#AddProposition").insertAfter("#detailcmmgros");
  liste_cmmgrosindex();

});

var idcmmgrosindex;
var iddetailcmmgros;
var id_article_cmd;
var afficheModalCmd;


function liste_cmmgrosindex() {

  $.ajax({
    beforeSend: function () {

      $("#card_detailcmmgros").block({
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
    url: base + "liste_cmmgrosindex",
    type: "POST",
    dataType: "json",
    data: {
      date_debut: $('#date_debut').val(),
      date_fin: $('#date_fin').val()
    },
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    },
    success: function (res) {
      if ($.fn.DataTable.isDataTable("#table_detailcmmgros")) {
        $("#table_detailcmmgros").DataTable().destroy();
      }
      else {
      }
      $('#table_detailcmmgros').empty();
      $("#table_detailcmmgros").append(res.table);

      $('#table_detailcmmgros').DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        responsive: true,
        info: false,
        paging: true,
        deferRender: true,
        pageLength: 15,
        "initComplete": function (settings, json) {
          $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
        },
        language: {
          "search": "",
          "zeroRecords": "Aucun article",
          paginate: {
            previous: "Précédent",
            next: "Suivant",
          },
        }
        ,



        dom: "Bfrtip",
        buttons: [
          {
            className: "btn btn-sm mr-1 btn-secondary",
            text: '<i class="ft-rotate-cw"> </i>',
            action: function () {
              liste_cmmgrosindex();

            },
          },
          {
            extend: "excelHtml5",
            title: "CMM",
            className: "btn btn-sm mr-1 btn-success",
            text: 'Excel',


          },
          {
            className: "btn btn-sm mr-1 btn-warning btn-min-width ",
            text: '<i class="ft-plus"> Ajouter</i>',
            action: function () {

              $('#ajoutCMM').find(':input:not([type="submit"], [type="hidden"])').each(function () {
                if ($(this).is('select.selectpicker')) {
                  $(this).selectpicker('val', []); // Réinitialiser le selectpicker
                } else {
                  $(this).val('');
                }
              });
              ajoutCMMModal();


            },
          },

        ],
      });
      $("#card_detailcmmgros").unblock();

    },
  });

}

function ajoutCMMModal() {

  $("#ajoutCMM").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  idcmmgrosindex = "";

}

function edit_proposition(id) {

  iddetailcmmgros = id;
  afficheModalCmd = false;

  $("#AddProposition").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  
  check_medicament_propositiongros();
  formatPrixImput();

}



function edit_cmmgrosindex(id , debut , fin) {

  idcmmgrosindex = id;

  $("#debut").val(debut);
  $("#fin").val(fin);


  $("#ajoutCMM").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );


}
function delete_cmmgrosindex(id) {

  idcmmgrosindex = id;

  $("#deletecmmgrosindex").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  $("#deletecmmgrosindex").unblock();


}


function delete_cmmgros() {

  $.ajax({
    beforeSend: function () {
      $("#deletecmmgrosindex").block({
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
    url: base + "deletecmmgros",
    type: "POST",
    dataType: "json",
    data: { idcmmgrosindex: idcmmgrosindex },
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      $("#deletecmmgrosindex").modal("hide");
      $("#deletecmmgrosindex").unblock();
    }, success: function (res) {


      $("#deletecmmgrosindex").modal("hide");
      $("#deletecmmgrosindex").unblock();

      if (res.id > 0) {

        alertCustom("success", 'ft-check', "Suppression effectué avec succée");
        liste_cmmgrosindex();

      } else {

        alertCustom("danger", 'ft-x', "Suppression non effectué");

      }



    }
  });

}


function affiche_cmmgrosdetail(id) {

  idcmmgrosindex = id;

  $("#detailcmmgros").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  liste_cmmgrosdetail();
  $("#detailcmmgros").css({ "overflow": "auto"});
}



function liste_cmmgrosdetail() {


  $.ajax({
    beforeSend: function () {

      $("#modal_detailcmmgros").block({
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
    url: base + "detail_cmmgrosindex",
    type: "POST",
    dataType: "JSON",
    data: {
      idcmmgrosindex: idcmmgrosindex
    },
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      $("#table_cmmgrosdetail").unblock();
    }, success: function (res) {
      if ($.fn.DataTable.isDataTable("#table_cmmgrosdetail")) {
        $("#table_cmmgrosdetail").DataTable().destroy();
      } else {
      }
      $('#table_cmmgrosdetail').empty();
      $("#table_cmmgrosdetail").append(res.table);


      $('#table_cmmgrosdetail').DataTable({
        destroy: true,
        ordering: true,
        order: [[1, "asc"]],
        responsive: true,
        info: false,
        paging: false,
        scrollY: 500,
        deferRender: true,
        //pageLength: 20,
        "initComplete": function (settings, json) {
          $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
        },
        language: {
          "search": "",
          "zeroRecords": "Aucun enregistrement",
          paginate: {
            previous: "Précédent",
            next: "Suivant",
          },
        }
        ,



        dom: "Bfrtip",
        buttons: [



          {
            className: "btn btn-sm mr-1 btn-secondary",
            text: '<i class="ft-rotate-cw"> </i>',
            action: function () {

              liste_cmmgrosdetail();

            },
          },
          {
            extend: "excelHtml5",
            title: "Sortie Detail",
            className: "btn btn-sm mr-1 btn-success",
            text: 'Excel',
            exportOptions: {
              columns: ':not(:last-child)'
            }

          },

          // {
          //   className: "btn btn-sm mr-1 btn-warning btn-min-width ",
          //   text: '<i class="ft-plus"> Ajouter</i>',
          //   action: function () {

          //     // $('#id_detail_consultattion').val('');
          //     addMedicModal();

          //   }
          // },




        ],
      });


      $("#diviserpar_mois").on("change", function () {

        const colIndex = $(this).closest("th").index();
        const selectedValue = parseFloat($(this).val());
        
        $("#table_cmmgrosdetail tbody tr").each(function () {
          const cell = $(this).find("td").eq(colIndex-1);
          const cell1 = $(this).find("td").eq(colIndex);
          const cellText = cell.text();
          if (cellText.includes("/")) {
            // Diviser la chaîne par "/"
            const parts = cellText.split("/");
            const numerator = parseFloat(parts[0].trim()); // 25
            const denominator = parseFloat(parts[1].trim()); // 22500
  
            // Calculer les nouvelles valeurs
            const newNumerator = formatNumber(numerator / selectedValue);
            const newDenominator = formatNumber(denominator / selectedValue);
  
            // Mettre à jour la cellule avec le nouveau format
            cell1.text(`${newNumerator} / ${newDenominator}`);
          }
        });
      });
      

      $("#modal_detailcmmgros").unblock();
      $("#ajoutCMM").modal("hide");

    },
  });

}

function formatNumber(value) {
  return value % 1 === 0 ? value : value.toFixed(2);
}


$("#ajout_cmmgros").off("submit").on("submit", function (e) {
  e.preventDefault();

  let data = new FormData(this);
  data.append("idcmmgrosindex", idcmmgrosindex);



  $.ajax({
    beforeSend: function () {
      $("#ajoutcmmgrosrefresh").block({
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
    url: base + "ajout_cmmgros",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    dataType: "JSON",
    data: data,
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      $("#ajoutcmmgrosrefresh").unblock();

    }, success: function (res) {

      alertCustom("success", "ft-check", "CMM effectué avec succée");
      $("#ajoutcmmgrosrefresh").unblock();
      affiche_cmmgrosdetail(res.id);
      liste_cmmgrosindex();



    },
  });
});

$("#ajout_proposition").off("submit").on("submit", function (e) {
  e.preventDefault();

  let data = new FormData(this);
  data.append("iddetailcmmgros", iddetailcmmgros);



  $.ajax({
    beforeSend: function () {
      $("#modal_medicament").block({
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
    url: base + "ajout_propositiongros",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    dataType: "JSON",
    data: data,
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      $("#modal_medicament").unblock();

    }, success: function (res) {

      alertCustom("success", "ft-check", "CMM effectué avec succée");
      $("#modal_medicament").unblock();
      $("#AddProposition").modal("hide");
      affiche_cmmgrosdetail(idcmmgrosindex);




    },
  });
});



function check_medicament_propositiongros() {
  $.ajax({
      beforeSend: function () {

          $("#modal_medicament").block({
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
      url: base + 'check_medicament_propositiongros',
      type: "POST",
      dataType: "JSON",
      data: {
          iddetailcmmgros : iddetailcmmgros
      },
      error: function (xhr, status, error) {
          alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      }, success: function (data) {
          
          $("#detailartmedicament").empty();
          $("#detailartmedicament").append(data.type);
          $('#istypeqte').selectpicker('refresh');

          $("#modal_medicament").unblock();

      }
  });
}





function filtrercmmgrosdetail() {
  liste_cmmgrosindex();
}


