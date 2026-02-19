

$(document).ready(function () {
  history.pushState({}, '', base + "fournisseur");
  liste_fournisseur();
  vider_champ();
});


function liste_fournisseur() {
  //generation_dropdown_categorie_ouvrage_Dynamique();
  $.ajax({
    beforeSend: function () {

      $("#card_fournisseur").block({
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
    url: base + "afficher_fournisseur",
    type: "POST",
    success: function (res) {




      if ($.fn.DataTable.isDataTable("#tb_fournisseur")) {
        $("#tb_fournisseur").DataTable().destroy();
      } else {
      }

      $('#tb_fournisseur').empty();
      $("#tb_fournisseur").append(res);
      let hide_btn_art = "";
     

      $('#tb_fournisseur').DataTable({
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
          "zeroRecords": "Aucun fournisseur",
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
              liste_fournisseur();
            },
          },
          {
            className: "btn btn-sm mr-1 btn-warning btn-min-width ",
            text: '<i class="ft-plus"> Ajouter</i>',
            action: function () {
              formatPrixImput();
              $('.entete_modal').text("Ajout");
              $('#btn_add_fournisseur').text("Ajouter");
              //generation_dropdown_categorie_ouvrage_Dynamique();
              $("#AddContactModal").modal(
                { backdrop: "static", keyboard: false },
                "show"
              );
              $('#ajout_fournisseur')[0].reset();


            },
          },
        ],
      });
      $("#card_fournisseur").unblock();

    },
  });

}




function generation_dropdown_categorie_ouvrage_Dynamique() {

  $.ajax({
    beforeSend: function () { },
    url: base + "generation_categorie_dynamique",
    type: "POST",
    success: function (res) {
      $("#select_categorie").empty();
      $("#select_categorie").append(res);
      $(".selectpicker").selectpicker("refresh");
    },
  });

  

}


$("#ajout_fournisseur").off("submit").on("submit",function (e) {
  e.preventDefault();

  let data = new FormData(this);

  


  $.ajax({
    beforeSend: function () { },
    url: base + "ajout_fournisseur",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    dataType: "JSON",
    data: data,
    success: function (res) {

      if ($('#btn_add_fournisseur').text() === "Modifier") {
        if (res.status == "success") {
          alertCustom("success", "ft-check", "Modification effectué avec succès");
          vider_champ();
          liste_fournisseur();
        } else {
          alertCustom("danger", "ft-x", "modification non effectué");
        }
        $("#AddContactModal").modal("hide");
      } else {

        if (res.status == "success") {
          alertCustom("success", "ft-check", "Ajout effectué avec succès");
          vider_champ();
          liste_fournisseur();
        } else {
          alertCustom("danger", "ft-x", "Ajout non effectué");
        }
      }
      $("#id_article_men_modif").val("");
      liste_fournisseur();




    },
  });
});

function delete_fournisseur_from_dialog(id) {

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
    url: base + "delete_fournisseur",
    type: "POST",
    data: { id_article: id },
    success: function (res) {

      $("#card_article_menuiserie").unblock();

      if (res.id > 0) {

        alertCustom("success", 'ft-check', "Suppression effectué avec succée");

      } else {

        alertCustom("danger", 'ft-x', "Suppression non effectué");

      }

      liste_fournisseur();

    },
  });

}

function close_overlay_liste_fournisseur() {
  $("#card_fournisseur").unblock();
}



function delete_fournisseur_from_dialog(id) {



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
    url: base + "delete_fournisseur",
    type: "POST",
    dataType: "JSON",
    data: { id_fournisseur: id },
    success: function (res) {

      $("#card_article_menuiserie").unblock();

      if (res.id > 0) {

        alertCustom("success", 'ft-check', "Suppression effectué avec succée");

      } else {

        alertCustom("danger", 'ft-x', "Suppression non effectué");

      }

      liste_fournisseur();

    },
  });

}

function edit_fournisseur(id) {
  formatPrixImput();
  $('.entete_modal').text("Modification");
  $('#btn_add_fournisseur').text("Modifier");
  $("#AddContactModal").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );

  var designation = $('#art_' + id).data('designation');
  var email = $('#art_' + id).data('email');
  var telephone = $('#art_' + id).data('telephone');
  var adresse = $('#art_' + id).data('adresse');


  $('input[name="designation"]').val(designation);
  $('input[name="email"]').val(email);
  $('input[name="telephone"]').val(telephone);
  $('input[name="adresse"]').val(adresse);
  
  $('input[name="id_fournisseur"]').val(id);
  

}

function delete_fournisseur(id) {


  $("#card_fournisseur").block({
    message: `
        
        
        <div class="card" style="max-width:400px ; ">
        <div class="card-header" style="max-width:400px ;">
                 <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
        </div>
        <div class="card-content">
            <div class="card-body">
                <p>Voulez-vous supprimer ce fournisseur ?</p>

                    <button type="button" onclick="delete_fournisseur_from_dialog(`+ id + `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                    <button type="button" onclick="close_overlay_liste_fournisseur()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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


function vider_champ(){
  $('input[name="designation"]').val("");
  $('input[name="email"]').val("");
  $('input[name="telephone"]').val("");
  $('input[name="adresse"]').val("");
  
  $('input[name="id_fournisseur"]').val("");
}
