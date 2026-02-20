// Initialisation du DataTable

$(document).ready(function () {
  liste_analyse();
  charge_type_analyse();
  
});
var idnalyse;

function charge_type_analyse() {
  $.ajax({
      url: base + 'charge_type_analyse',
      type: "POST",
      error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
          $("#id_type_analyse_id").empty();
          $("#id_type_analyse_id").append(data);
          $('select').selectpicker('refresh');

      }
  });
}



function liste_analyse() {
  $("#nom_analyse").val("");
  idnalyse = "";
  
  $("#ajouteranalyse").text("Ajouter");
  $.ajax({
    beforeSend: function () {
      $(".all-contacts").block({
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
    url: base + "liste_analyse",
    type: "POST",
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      $("#table_analyse ").empty();
      $("#table_analyse").append(response);
     
      // Convertissez la chaîne JSON en objet JavaScript
        $("#table_analyse").DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        info: false,
        paging: true, 
        preDrawCallback: function (settings) {
          
        },
        pageLength: 5,
        "initComplete": function(settings, json) {
          $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
        },
        language: {
          "search": "",
          zeroRecords: "Aucun enregistrement",
          paginate: {
            previous: "Précédent",
            next: "Suivant",
          },
        },
        dom: "Bfrtip",
        buttons: [
          {
            className: "btn btn-sm mr-1 btn-secondary btn-min-width",
            text: '<i class="ft-refresh-ccw"> Actualiser</i>',
            action: function () {
              liste_analyse();
            },
          },
        ],
      
      });

     $(".all-contacts").unblock();
    
    },

  });
}


// Fonction pour rafraichir le Form et le dataTable



// Fonction pour obtenir les données selectionnés et remplir le Form  **************************
function editanalyse(id , istype) {


    var nom = $('#med_' + id).data('nom_analyse');
  idnalyse = id ;
    $('#nom_analyse_id').val(nom);

    $('#id_type_analyse_id').val(istype).selectpicker('refresh');

    $("#ajouteranalyse").text("Modifier");
}

// Fonction ajout et Modification  ************************************
$("#ajout_analyse").off("submit").on("submit",function (e) {
  e.preventDefault();
  var formData = new FormData(this);
  formData.append("id_analyse" , idnalyse);
    $.ajax({
      beforeSend: function () {
        $(".all-contacts").block({
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
      url: base + "ajout_analyse",
      type: "POST",
      processData: false,
      contentType: false,
      cache: false,
      dataType: "JSON",
      data: formData,
      error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
       $(".all-contacts").unblock();
    } ,success: function (res) {
      
      $(".all-contacts").unblock();
        //appler le Toast pour afficher le message
        if (res.id == 1) {

          if (idnalyse== "") {
            
            alertCustom(
              "success",
              "ft-check",
              "Ajout effectuée avec succée"
            );

          } else {
            alertCustom(
              "success",
              "ft-check",
              "Modification effectuée avec succée"
            );
            
          }
          Annulertype_analyse();
          liste_analyse();
        } else {
          alertCustom("danger", "ft-x", "Erreur ");
        }
      },
    });
 
});



function close_overlay_liste_analyse() {
  $(".all-contacts").unblock();
}

// Fonction pour dialogue une catégorie  ************************************************
function supprimeranalyse(id) {
  $(".all-contacts").block({
    message:
      `
    <div class="card" style="max-width:400px ;">
    <div class="card-header" style="max-width:400px ;  height:80px ">
             <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
    </div>
    <div class="card-content">
        <div class="card-body">
            <p>Confirmez-vous cette suppression ?</p>

                <button type="button" onclick="delete_analyse_from_dialog(` +
      id +
      `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                <button type="button" onclick="close_overlay_liste_analyse()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


        </div>
    </div>
    </div>
  


    `,

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
}

function delete_analyse_from_dialog(id) {
  $(".all-contacts").block({
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
  $.ajax({
    url: base + "supprimer_analyse",
    type: "POST",
    data: { id: id },
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
       $(".all-contacts").unblock();
    } ,success: function (response) {
      $(".all-contacts").unblock();
      alertCustom("success", "ft-check", "Suppression effectué avec succée");
      liste_analyse();
    },
    error: function (error) {
      alertCustom(
        "danger",
        "ft-x",
        "Erreur lors de la suppression de la catégorie"
      );
    },
  });
}


// Fonction pour vider les champs du formulaire **************************************************
function Annulertype_analyse() {
  $("#nom_analyse_id").val("");
  idnalyse = "";
  $('#id_type_analyse_id').selectpicker('val', []);
  $("#ajouteranalyse").text("Ajouter");
}
