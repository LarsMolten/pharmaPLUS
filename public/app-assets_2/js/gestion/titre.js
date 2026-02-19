// Initialisation du DataTable

$(document).ready(function () {
  liste_titre();
  
});

var idtitre ;

function liste_titre() {

  $("#libelletitre").val("");
  $("#abbreviation").val("");
  idtitre = ""; 

  $("#ajoutertitre").text("Ajouter");
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
    url: base + "liste_titre",
    type: "POST",
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      $("#table_titre ").empty();
      $("#table_titre").append(response);
     
      // Convertissez la chaîne JSON en objet JavaScript
        $("#table_titre").DataTable({
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
              liste_titre();
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
function edittitre(ids) {


    var nom = $("#titre_" + ids).data("libelle");
    var abbreviation = $("#titre_" + ids).data("abbreviation");

    $('#libelletitre').val(nom);
    $('#abbreviation').val(abbreviation);
    $("#ajoutertitre").text("Modifier");


    idtitre = ids ;
}

// Fonction ajout et Modification  ************************************
$("#ajout_titre").off("submit").on("submit",function (e) {
  e.preventDefault();
  var formData = new FormData(this);

  formData.append("id",idtitre);

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
      url: base + "ajout_titre",
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

          if (idtitre == "") {
            
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
          Annulertitre();
          liste_titre();
        }
        else if (res.id == 0) {
          alertCustom(
            "warning",
            "ft-x",
            "Administration existe déja"
          );
        } 
        else {
          alertCustom("danger", "ft-x", "Erreur ");
        }
      },
    });
 
});



function close_overlay_liste_titre() {
  $(".all-contacts").unblock();
}

// Fonction pour dialogue une catégorie  ************************************************
function supprimertitre(id) {
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

                <button type="button" onclick="delete_titre_from_dialog(` +
      id +
      `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                <button type="button" onclick="close_overlay_liste_titre()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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

function delete_titre_from_dialog(id) {
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
    url: base + "supprimer_titre",
    type: "POST",
    data: { id: id },
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
       $(".all-contacts").unblock();
    } ,success: function (response) {
      $(".all-contacts").unblock();
      alertCustom("success", "ft-check", "Suppression effectué avec succée");
      liste_titre();
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

//Gerer le boutton Annuler
$("#annuler").on("click", function () {
  Annulertitre();
});

// Fonction pour vider les champs du formulaire **************************************************
function Annulertitre() {
  $("#libelletitre").val("");
  $("#abbreviation").val("");
  idtitre = "";
  $("#ajoutertitre").text("Ajouter");
}
