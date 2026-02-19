
// Récupère l'URL de base dynamiquement
var baseUrl = window.location.origin;

// Vérifie si l'URL contient un segment qui commence par "lien"
if (window.location.href.includes(baseUrl + "/lien")) {
  // Extrait le segment après "lien" pour générer la nouvelle URL
  const newUrl = window.location.href.replace("/lien", "/");

  // Redirige vers la nouvelle URL sans le préfixe "lien"
  window.location.href = newUrl;
}

var enCours = false;

$(document).ready(function () {
  hide_categ_form();
  liste_produit();
  charge_unite();
  $("#dateperemption").datepicker({
    format: "mm-yyyy",
    viewMode: "months",
    minViewMode: "months",
    forceParse: true,
    clearBtn: true
  });

  $("#dateperemption-icon").on("click", function () {
    $("#dateperemption").focus(); // Déclenche le calendrier
  });

});

var id_unite;
var id_produit;
var idmethodepf;
var id_programme;

function filtrerproduit() {

  liste_produit();
}


function charge_programme() {
  $.ajax({
    url: base + 'charge_programme',
    type: "POST",
    data: { idtypemenu: idtypemenu },
    complete: function () {
      $("#AddContactModal").unblock();
      enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
      
    },
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    }, success: function (data) {
      $("#pourprogramme").empty();
      $("#pourprogramme").append(data);
      $('select').selectpicker('refresh');
      if (id_programme != "") {
        $('#id_programme').val(id_programme).selectpicker('refresh');
      }
    }
  });
}

function liste_produit() {

  $.ajax({
    beforeSend: function () {

      $("#card_produit_menuiserie").block({
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
    url: base + "listes_produit_gros",
    type: "POST",
    data: {
      date: $('#date').val(),
      idtypemenu: idtypemenu
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
        "initComplete": function (settings, json) {
          $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
        },
        language: {
          "search": "",
          "zeroRecords": "Aucun produit",
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
              liste_produit();

            },
          },

          {
            className: "btn btn-sm mr-1 btn-warning btn-min-width ",
            text: '<i class="ft-plus"> Ajouter</i>',
            action: function () {

              ajoutproduitmodal();

            },
          },
        ],
      });
      $("#card_produit_menuiserie").unblock();

    },
  });

}







$("#ajout_produit").off("submit").on("submit", function (e) {
  e.preventDefault();
  if (enCours) return; // Empêche un deuxième clic si une requête est en cours
  enCours = true;
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

  let data = new FormData(this);

  data.append("id_produit", id_produit);
  data.append("idtypemenu", idtypemenu);

  $.ajax({
    beforeSend: function () { },
    url: base + "ajout_produit",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    dataType: "JSON",
    data: data,complete: function() {
      enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
  },
    success: function (res) {
      if (id_produit != "") {
        if (res.status == "success") {
          $("#AddContactModal").unblock();
          alertCustom("success", "ft-check", "Modification effectué avec succée");
          $('#ajout_produit').find(':input:not([type="radio"])').each(function () {
            if ($(this).is('select.selectpicker')) {
              // Réinitialiser le selectpicker en vidant les sélections
              $(this).selectpicker('val', []);
            } else {
              // Réinitialiser les autres champs en vidant leur valeur
              $(this).val('');
            }

            $("#AddContactModal").modal("hide");

          });
          liste_produit();
        } else {
          alertCustom("danger", "ft-x", "Modification non effectué");
        }

      } else {

        if (res.status == "success") {
          $("#AddContactModal").unblock();
          enCours = false; 
          alertCustom("success", "ft-check", "Ajout effectué avec succée");
          ajoutproduitmodal();
          liste_produit();

        } else {
          alertCustom("danger", "ft-x", "Ajout non effectué");
        }
      }




    },
  });
});



function ajoutproduitmodal() {
  if (enCours) return; // Empêche un deuxième clic si une requête est en cours
  enCours = true;
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

  id_produit = "";


  charge_programme();

  if (idtypemenu == 2) {

    charge_methode_contraceptive();
  }
  

  $('.entete_modal').text("Ajout");
  $('#btn_add_produit').text("Ajouter");
  $("#AddContactModal").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );
  $('#ajout_produit').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function () {
    if ($(this).is('select.selectpicker')) {
      // Réinitialiser le selectpicker en vidant les sélections
      $(this).selectpicker('val', []);
    } else {
      // Réinitialiser les autres champs en vidant leur valeur
      $(this).val('');
    }
  });
  formatPrixImput();
}

function charge_unite() {
  $.ajax({

    beforeSend: function () {

      /* $("#AddContactModal").block({
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
       });*/

    },
    url: base + 'charge_unite',
    type: "POST",
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

      //$("#AddContactModal").unblock();

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

function delete_produit_from_dialog(id) {
  if (enCours) return; // Empêche un deuxième clic si une requête est en cours
  enCours = true;
  $("#card_produit_menuiserie").unblock();

  $.ajax({
    beforeSend: function () {

      $("#card_produit_menuiserie").block({
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
    url: base + "delete_produit",
    type: "POST",complete: function() {
      enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
  },
    data: { id_produit: id },
    success: function (res) {

      $("#card_produit_menuiserie").unblock();

      if (res.id > 0) {

        alertCustom("success", 'ft-check', "Suppression effectué avec succée");

      } else {

        alertCustom("danger", 'ft-x', "Suppression non effectué");

      }

      liste_produit();

    },
  });

}

function close_overlay_liste_produit() {
  $("#card_produit_menuiserie").unblock();
}


function edit_produit(id) {
  id_produit = id;

  formatPrixImput();
  $('.entete_modal').text("Modification");
  $('#btn_add_produit').text("Modifier");
  $("#AddContactModal").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );



  var designation = $('#art_' + id).data('designation');
  id_programme = $('#art_' + id).data('programme');
  idmethodepf = $('#art_' + id).data('methode');
  var presentation = $('#art_' + id).data('presentation');
  id_unite = $('#art_' + id).data('unite');
  var prix_unitaire = $('#art_' + id).data('prix_boite');
  var quantite = $('#art_' + id).data('quantite');
  var datePeremption = $('#art_' + id).data('dateperemption');

  charge_programme();

  if (idtypemenu == 2) {

    charge_methode_contraceptive();
  }

  charge_unite();


  $('input[name="designation"]').val(designation);
  $('input[name="prix_boite"]').val(prix_unitaire);
  $('input[name="quantite"]').val(quantite);
  $('input[name="presentation"]').val(presentation);
  $('#unite').val(unite).selectpicker('refresh');
  $('#dateperemption').val(datePeremption);
  $("#dateperemption").datepicker('update');

}

function delete_produit(id) {


  $("#card_produit_menuiserie").block({
    message: `
        
        
        <div class="card" style="max-width:400px ; ">
        <div class="card-header" style="max-width:400px ;">
                 <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
        </div>
        <div class="card-content">
            <div class="card-body">
                <p>Voulez-vous confirmer la suppression ?</p>

                    <button type="button" onclick="delete_produit_from_dialog(`+ id + `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                    <button type="button" onclick="close_overlay_liste_produit()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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



