// Initialisation du DataTable

$(document).ready(function () {
  liste_categoriediagnostique();
  
});

var idcateg ;

function liste_categoriediagnostique() {

  $("#libellecategoriediagnostique").val("");
  idcateg = ""; 

  $("#ajoutercategoriediagnostique").text("Ajouter");
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
    url: base + "liste_categoriediagnostique",
    type: "POST",
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      $("#table_categoriediagnostique ").empty();
      $("#table_categoriediagnostique").append(response);
     
      // Convertissez la chaîne JSON en objet JavaScript
        $("#table_categoriediagnostique").DataTable({
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
              liste_categoriediagnostique();
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
function editcategoriediagnostique(ids) {


    var nom = $("#categoriediagnostique_" + ids).data("libelle");

    $('#libellecategoriediagnostique').val(nom);
    $("#ajoutercategoriediagnostique").text("Modifier");


    idcateg = ids ;
}

// Fonction ajout et Modification  ************************************
$("#ajout_categoriediagnostique").off("submit").on("submit",function (e) {
  e.preventDefault();
  var formData = new FormData(this);

  formData.append("id",idcateg);

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
      url: base + "ajout_categoriediagnostique",
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

          if (idcateg == "") {
            
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
          Annulercategoriediagnostique();
          liste_categoriediagnostique();
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



function close_overlay_liste_categoriediagnostique() {
  $(".all-contacts").unblock();
}

// Fonction pour dialogue une catégorie  ************************************************
function supprimercategoriediagnostique(id) {
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

                <button type="button" onclick="delete_categoriediagnostique_from_dialog(` +
      id +
      `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                <button type="button" onclick="close_overlay_liste_categoriediagnostique()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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

function delete_categoriediagnostique_from_dialog(id) {
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
    url: base + "supprimer_categoriediagnostique",
    type: "POST",
    data: { id: id },
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
       $(".all-contacts").unblock();
    } ,success: function (response) {
      $(".all-contacts").unblock();
      alertCustom("success", "ft-check", "Suppression effectué avec succée");
      liste_categoriediagnostique();
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
  Annulercategoriediagnostique();
});

// Fonction pour vider les champs du formulaire **************************************************
function Annulercategoriediagnostique() {
  $("#libellecategoriediagnostique").val("");
  idcateg = "";
  $("#ajoutercategoriediagnostique").text("Ajouter");
}
