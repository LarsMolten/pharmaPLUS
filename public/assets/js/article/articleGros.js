

$(document).ready(function () {
  hide_categ_form();
  liste_article();
  charge_unite();
  charge_administration_article();
  $("#dateperemption").datepicker( {
    format: "mm-yyyy",
    viewMode: "months", 
    minViewMode: "months",
    forceParse: true,
    clearBtn: true
});

$("#dateperemption-icon").on("click", function() {
  $("#dateperemption").focus(); // Déclenche le calendrier
});
  
});

var id_unite ;
var id_article ;
var idadminMedicament;
var enCours = false;
function filtrerarticle() {
  
  liste_article();
}

function liste_article() {
  
  $.ajax({
    beforeSend: function () {

      $("#card_article_menuiserie").block({
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
    url: base + "listes_article_gros",
    type: "POST",
    data: {
      date: $('#date').val(),
    },
    complete: function() {
      enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
  },
    success: function (res) {
      if ($.fn.DataTable.isDataTable("#users-contacts")) {
        $("#users-contacts").DataTable().destroy();
    }
     else {
      }
      $('#users-contacts').empty();
      $("#users-contacts").append(res);
      
      $('#users-contacts').DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        responsive: true,
        info: false,
        paging: true,
        deferRender: true,
        pageLength: 7,
        "initComplete": function(settings, json) {
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
              liste_article();

            },
          },

          {
            className: "btn btn-sm mr-1 btn-warning btn-min-width ",
            text: '<i class="ft-plus"> Ajouter</i>',
            action: function () {
              
              id_article = "";
              $('.entete_modal').text("Ajout");
              $('#btn_add_article').text("Ajouter");
              $("#AddContactModal").modal(
                { backdrop: "static", keyboard: false },
                "show"
              );
              $('#ajout_article').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function() {
                if ($(this).is('select.selectpicker')) {
                    // Réinitialiser le selectpicker en vidant les sélections
                    $(this).selectpicker('val', []);
                } else {
                    // Réinitialiser les autres champs en vidant leur valeur
                    $(this).val('');
                }
            });
            formatPrixImput();

            },
          },
        ],
      });
      $("#card_article_menuiserie").unblock();

    },
  });

}







$("#ajout_article").off("submit").on("submit",function (e) {
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
    data: data,complete: function() {
      enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
  },
    success: function (res) {
      if (id_article != "") {
        if (res.status == "success") {
          alertCustom("success", "ft-check", "Modification effectué avec succée");
          $('#ajout_article').find(':input:not([type="radio"])').each(function() {
            if ($(this).is('select.selectpicker')) {
                // Réinitialiser le selectpicker en vidant les sélections
                $(this).selectpicker('val', []);
            } else {
                // Réinitialiser les autres champs en vidant leur valeur
                $(this).val('');
            }
            $("#AddContactModal").modal("hide");
        });
        } else {
          alertCustom("danger", "ft-x", "Modification non effectué");
        }
        
      } else {

        $("#card_article_menuiserie").unblock();
        if (res.status == "success") {
          alertCustom("success", "ft-check", "Ajout effectué avec succée");
          $('#ajout_article').find(':input:not([type="radio"])').each(function() {
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
      $("#id_article_men_modif").val("");
      
      liste_article();


    },
  });
});



function charge_unite() {
  $.ajax({

      beforeSend: function () {

          $("#AddContactModal").block({
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
      type: "POST",complete: function() {
        enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
    },
      error: function (xhr, status, error) {
          alertCustom("danger", 'ft-x', "Une erreur s'est produite");
      }, success: function (data) {
          $("#unite").empty();
          $("#unite").append(data);
          $("#unite").selectpicker('refresh');
          if (id_unite != "") {
              $('#unite').val(id_unite).selectpicker('refresh');
            changeunite();

          }

          $('#unite').on('change', function () {

            changeunite();
        
        
        });

          $("#AddContactModal").unblock();

      }
  });



}

function changeunite() {
  var maxQuantity = $('#unite').find('option:selected').data('supun');
  // Si maxQuantity est 0, vider le champ et sortir
  if (maxQuantity === 0) {
    $('#presentation').attr("readonly", true);
    $('#presentation').val(1);
  }
  else {
    $('#presentation').attr("readonly", false);
  }
}


function charge_administration_article() {
    $.ajax({
        url: base + 'charge_administration',
        type: "POST",
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#idadminMedicament").empty();
            $("#idadminMedicament").append(data);
            $("#idadminMedicament").selectpicker('refresh');
            if (idadminMedicament != "") {
                $('#idadminMedicament').val(idadminMedicament).selectpicker('refresh');
            }
        }
    });
}


function delete_article_from_dialog(id) {
  if (enCours) return; // Empêche un deuxième clic si une requête est en cours
  enCours = true;
  $("#card_article_menuiserie").unblock();

  $.ajax({
    beforeSend: function () {

      $("#card_article_menuiserie").block({
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
    type: "POST",complete: function() {
      enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
  },
    data: { id_article: id },
    success: function (res) {
      $("#card_article_menuiserie").unblock();

      if (res.id > 0) {

        alertCustom("success", 'ft-check', "Suppression effectué avec succée");

      } else {

        alertCustom("danger", 'ft-x', "Suppression non effectué");

      }

      liste_article();

    },
  });

}

function close_overlay_liste_article() {
  $("#card_article_menuiserie").unblock();
}




function edit_article(id) {
  if (enCours) return; // Empêche un deuxième clic si une requête est en cours
  enCours = true;
  id_article = id;
  formatPrixImput();
  $('.entete_modal').text("Modification");
  $('#btn_add_article').text("Modifier");
  $("#AddContactModal").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );

 

  var designation = $('#art_' + id).data('designation');
  var presentation = $('#art_' + id).data('presentation');
  id_unite = $('#art_' + id).data('unite');
  var prix_unitaire = $('#art_' + id).data('prix_boite');
  var quantite = $('#art_' + id).data('quantite');
  var datePeremption = $('#art_' + id).data('dateperemption');

  charge_unite();


  $('input[name="designation"]').val(designation);
  $('input[name="prix_boite"]').val(prix_unitaire);
  $('input[name="quantite"]').val(quantite);
  $('input[name="presentation"]').val(presentation);
  $('#unite').val(unite).selectpicker('refresh');
  $('#dateperemption').val(datePeremption);
  $("#dateperemption").datepicker('update');
  
}

function delete_article(id) {


  $("#card_article_menuiserie").block({
    message: `
        
        
        <div class="card" style="max-width:400px ; ">
        <div class="card-header" style="max-width:400px ;">
                 <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
        </div>
        <div class="card-content">
            <div class="card-body">
                <p>Voulez-vous supprimer cet article ?</p>

                    <button type="button" onclick="delete_article_from_dialog(`+ id + `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                    <button type="button" onclick="close_overlay_liste_article()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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
