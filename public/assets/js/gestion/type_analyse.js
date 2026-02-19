// Initialisation du DataTable

$(document).ready(function () {
  liste_type_analyse();
  
});

function liste_type_analyse() {
  $("#nom_type_analyse").val("");
  $("#id_type_analyse").val("");
  
  $("#ajoutertype_analyse").text("Ajouter");
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
    url: base + "liste_type_analyse",
    type: "POST",
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      $("#table_type_analyse ").empty();
      $("#table_type_analyse").append(response);
     
      // Convertissez la chaîne JSON en objet JavaScript
        $("#table_type_analyse").DataTable({
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
              liste_type_analyse();
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
function edittype_analyse(id) {


    var nom = $('#cab_' + id).data('nom_type_analyse');

    $('#nom_type_analyse').val(nom);
    $("#ajoutertype_analyse").text("Modifier");


    $('input[name="id_type_analyse"]').val(id);
}

// Fonction ajout et Modification  ************************************
$("#ajout_type_analyse").off("submit").on("submit",function (e) {
  e.preventDefault();
  var formData = new FormData(this);

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
      url: base + "ajout_type_analyse",
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
      
      $(".all-contacts")
        //appler le Toast pour afficher le message
        if (res.id == 1) {

          if ($("#id_type_analyse").val() == "") {
            
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
          Annuler_analyse();
          liste_type_analyse();
        } else {
          alertCustom("danger", "ft-x", "Erreur ");
        }
      },
    });
 
});



function close_overlay_liste_type_analyse() {
  $(".all-contacts").unblock();
}

// Fonction pour dialogue une catégorie  ************************************************
function supprimertype_analyse(id) {
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

                <button type="button" onclick="delete_type_analyse_from_dialog(` +
      id +
      `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                <button type="button" onclick="close_overlay_liste_type_analyse()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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

function delete_type_analyse_from_dialog(id) {
  $.ajax({
    url: base + "supprimer_type_analyse",
    type: "POST",
    data: { id: id },
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      alertCustom("success", "ft-check", "Suppression effectué avec succée");
      liste_type_analyse();
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
function Annuler_analyse() {
  $("#nom_type_analyse").val("");
  $("#id_type_analyse").val("");
  //   isEditing = false;
  $("#ajoutertype_analyse").text("Ajouter");
}
