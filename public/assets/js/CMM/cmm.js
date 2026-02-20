
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
  history.pushState({}, '', base + "cmm");
  $("#date_debut").val(dateDebutISO);
  $("#date_fin").val(dateFinISO);
  $("#AddProposition").insertAfter("#detailcmm");
  liste_cmmindex();

});

var idcmmindex;
var iddetailcmm;


function liste_cmmindex() {

  $.ajax({
    beforeSend: function () {

      $("#card_detailcmm").block({
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
    url: base + "liste_cmmindex",
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
      if ($.fn.DataTable.isDataTable("#table_detailcmm")) {
        $("#table_detailcmm").DataTable().destroy();
      }
      else {
      }
      $('#table_detailcmm').empty();
      $("#table_detailcmm").append(res.table);

      

      $('#table_detailcmm').DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        responsive: true,
        info: false,
        paging: true,
        deferRender: true,
        pageLength: 7,
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



        dom: res.dom,
        buttons: [
          {
            className: "btn btn-sm mr-1 btn-secondary",
            text: '<i class="ft-rotate-cw"> </i>',
            action: function () {
              liste_cmmindex();
  
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
      $("#card_detailcmm").unblock();

    },
  });

}

function ajoutCMMModal() {

  $("#ajoutCMM").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  idcmmindex = "";

}

function edit_proposition(id) {

  iddetailcmm = id;

  $("#AddProposition").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  
  check_medicament_proposition();
  formatPrixImput();
  

}



function edit_cmmindex(id , debut , fin) {

  idcmmindex = id;

  $("#debut").val(debut);
  $("#fin").val(fin);


  $("#ajoutCMM").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );


}
function delete_cmmindex(id) {

  idcmmindex = id;

  $("#deletecmmindex").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  $("#deletecmmindex").unblock();


}


function delete_cmm() {

  $.ajax({
    beforeSend: function () {
      $("#deletecmmindex").block({
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
    url: base + "deletecmm",
    type: "POST",
    dataType: "json",
    data: { idcmmindex: idcmmindex },
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      $("#deletecmmindex").modal("hide");
      $("#deletecmmindex").unblock();
    }, success: function (res) {


      $("#deletecmmindex").modal("hide");
      $("#deletecmmindex").unblock();

      if (res.id > 0) {

        alertCustom("success", 'ft-check', "Suppression effectué avec succée");
        liste_cmmindex();

      } else {

        alertCustom("danger", 'ft-x', "Suppression non effectué");

      }



    }
  });

}


function affiche_cmmdetail(id) {

  idcmmindex = id;

  $("#detailcmm").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  liste_cmmdetail();

}



function liste_cmmdetail() {


  $.ajax({
    beforeSend: function () {

      $("#modal_detailcmm").block({
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
    url: base + "detail_cmmindex",
    type: "POST",
    dataType: "JSON",
    data: {
      idcmmindex: idcmmindex
    },
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      $("#table_cmmdetail").unblock();
    }, success: function (res) {
      if ($.fn.DataTable.isDataTable("#table_cmmdetail")) {
        $("#table_cmmdetail").DataTable().destroy();
      } else {
      }
      $('#table_cmmdetail').empty();
      $("#table_cmmdetail").append(res.table);


      var array = [



        {
          className: "btn btn-sm mr-1 btn-secondary",
          text: '<i class="ft-rotate-cw"> </i>',
          action: function () {

            liste_cmmdetail();

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

      ];

      


      $('#table_cmmdetail').DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        paging: false, // Désactiver la pagination si besoin
        scrollY: 500,
        responsive: false,
        info: false,
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
        buttons: array,
      });


      $("#diviserpar_mois").on("change", function () {

        const colIndex = $(this).closest("th").index();
        const selectedValue = parseFloat($(this).val());
        
        $("#table_cmmdetail tbody tr").each(function () {
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
      

      $("#modal_detailcmm").unblock();
      $("#ajoutCMM").modal("hide");

    },
  });

}

function formatNumber(value) {
  return value % 1 === 0 ? value : value.toFixed(2);
}


$("#ajout_cmm").off("submit").on("submit", function (e) {
  e.preventDefault();

  let data = new FormData(this);
  data.append("idcmmindex", idcmmindex);



  $.ajax({
    beforeSend: function () {
      $("#ajoutcmmrefresh").block({
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
    url: base + "ajout_cmm",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    dataType: "JSON",
    data: data,
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      $("#ajoutcmmrefresh").unblock();

    }, success: function (res) {

      alertCustom("success", "ft-check", "CMM effectué avec succée");
      $("#ajoutcmmrefresh").unblock();
      affiche_cmmdetail(res.id);
      liste_cmmindex();



    },
  });
});

$("#ajout_proposition").off("submit").on("submit", function (e) {
  e.preventDefault();

  let data = new FormData(this);
  data.append("iddetailcmm", iddetailcmm);



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
    url: base + "ajout_proposition",
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
      affiche_cmmdetail(idcmmindex);




    },
  });
});



function check_medicament_proposition() {
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
      url: base + 'check_medicament_proposition',
      type: "POST",
      dataType: "JSON",
      data: {
          iddetailcmm : iddetailcmm
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


function filtrercmmdetail() {
  liste_cmmindex();
}


