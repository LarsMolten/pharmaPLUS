// Initialisation du DataTable

$(document).ready(function () {
  liste_methodePf();
  
});

function liste_methodePf() {
  $("#nom_methodePf").val("");
  $("#id_methodePf").val("");
  
  $("#ajoutermethodePf").text("Ajouter");
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
    url: base + "liste_methodePf",
    type: "POST",
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      $("#table_methodePf ").empty();
      $("#table_methodePf").append(response);
     
      // Convertissez la chaîne JSON en objet JavaScript
        $("#table_methodePf").DataTable({
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
              liste_methodePf();
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
function editmethodePf(id) {


    var nom = $("#methodepf_" + id).data("methodnom");

    $('#nom_methodePf').val(nom);
    $("#ajoutermethodePf").text("Modifier");


    $('input[name="idmethodePf"]').val(id);
}

// Fonction ajout et Modification  ************************************
$("#ajout_methodePf").off("submit").on("submit",function (e) {
  e.preventDefault();
  var formData = new FormData(this);

    $.ajax({
      beforeSend: function () {},
      url: base + "ajout_methodePf",
      type: "POST",
      processData: false,
      contentType: false,
      cache: false,
      dataType: "JSON",
      data: formData,
      error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
      

        //appler le Toast pour afficher le message
        if (res.id == 1) {

          if ($("#id_methodePf").val() == "") {
            
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
          AnnulermethodePf();
          liste_methodePf();
        } else {
          alertCustom("danger", "ft-x", "Erreur ");
        }
      },
    });
 
});



function close_overlay_liste_methodePf() {
  $(".all-contacts").unblock();
}

// Fonction pour dialogue une catégorie  ************************************************
function supprimermethodePf(id) {
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

                <button type="button" onclick="delete_methodePf_from_dialog(` +
      id +
      `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                <button type="button" onclick="close_overlay_liste_methodePf()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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

function delete_methodePf_from_dialog(id) {
  $.ajax({
    url: base + "supprimer_methodePf",
    type: "POST",
    data: { id: id },
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      alertCustom("success", "ft-check", "Suppression effectué avec succée");
      liste_methodePf();
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
  AnnulermethodePf();
});

// Fonction pour vider les champs du formulaire **************************************************
function AnnulermethodePf() {
  $("#nom_methodePf").val("");
  $("#id_methodePf").val("");
  //   isEditing = false;
  $("#ajoutermethodePf").text("Ajouter");
}
