


$(document).ready(function () {
  $(".selectpicker").selectpicker("refresh");
    $('#password_confirmation').on('input', function () {
        var password = $('#password').val();
        var confirmPassword = $(this).val();
        if (password === confirmPassword) {
            $('.help-block').text('');
        } else {
            $('.help-block').text('Rétapez le mot de passe correct.');
        }
    });
    $("#label_image").html('');
    refresh_user();
    charge_role();
    
});


function charge_role() {
  $.ajax({
      url: base + 'getRole',
      type: "POST",
      
      error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
          $("#select_role").empty();
          $("#select_role").append(data);
          $('select').selectpicker('refresh');
          
          $("#select_role").on('change', function name(params) {
            var data = $(this).val();

            if (data == 8) {
              
              charge_type(data);
              
            }
            else{
              $("#typeMedecin").empty();
            }
        })
      }
  });
}
function charge_type(data , id) {
  $.ajax({
      url: base + 'getTypeMedecin',
      type: "POST",
      data:{
        id: data
      },
      error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
          $("#typeMedecin").empty();
          $("#typeMedecin").append(data);
          $('select').selectpicker('refresh');
          $("#select_type").val(id);
          $('select').selectpicker('refresh');
          
          
      }
  });
}


function refresh_user() {
  $("#label_imagetxt").html('');

  $("#nom").val("");
  $("#prenom").val("");
  $("#role").val("");
  $("#password").val("");
  $("#password_confirmation").val("");
  $("#image").val("");
  $("#editUserId").val("");
  $("#label_image").val("");
  $("#Simple").prop("checked", true);
  $("#ajouterButton").text("Ajouter");

  $.ajax({
    beforeSend: function () {
      $("#card_utilisateur").block({
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
    url: base + "/afficher_utilisateur",
    type: "POST",
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      
     $("#card_utilisateur").unblock();
     $("#table_user").empty();
      $("#table_user").append(response);
     
      // Convertissez la chaîne JSON en objet JavaScript
        $("#table_user").DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "asc"]],
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
          zeroRecords: "Aucun utilisateur",
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
              refresh_user();
            },
          },
        ],
      
      });
    },

  });
}


// Fonction pour rafraichir le Form et le dataTable


// Fonction pour obtenir les données selectionnés et remplir le Form  **************************
function editUsers(id) {
  //   isEditing = true;
  $.ajax({
    url: base + "get_utilisateur",
    type: "POST",
    data: { id: id },
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      // Convertissez la chaîne JSON en objet JavaScript
      var user = JSON.parse(response);
      console.log(user);
      // Remplissez le formulaire d'édition avec les détails récupérés et changer le texte boutton
      $("#nom").val(user.nom_user);
        $("#editUserId").val(user.id_user);
        $("#nom").val(user.nom_user);
        $("#prenom").val(user.prenom_user);
        $("#label_imagetxt").html(user.image);
        $("#label_image").val(user.image);
        $("#select_role").val(user.roleId);
        $('select').selectpicker('refresh');
        if (user.roleId == "8" || user.roleId == "14") {
          charge_type(8,user.idTypeMedecin);
        } else {
          $("#typeMedecin").empty();
        }
        $("#password").val(user.mdp_user);
        $("#password_confirmation").val(user.mdp_user);
        

        
        // 
        // if (user.image) {
        //   // $("#image").val(user.image);
        //   $("#image").html('<img src="' + user.image + '" alt="User Image" style="max-width: 100px;" id="image">');
        // }
  
    
        $("#ajouterButton").text("Modifier");

        // if (user.image) {
        //   // Assuming #image is the id of the file input field
        //   $("#image").val(user.image);
        // }
        
    },
    error: function (error) {
      console.error(
        "Erreur lors de la récupération des détails d'utlisateur':",
        error
      );
    },
  });
}

function getSelectedRole() {
  if ($("#Admin").prop("checked")) {
      return "admin";
  } else if ($("#Simple").prop("checked")) {
      return "simple";
  }
  // Add additional conditions if there are more roles
}

// Fonction ajout et Modification  ************************************
$("#ajout_utilisateur").off("submit").on("submit",function (e) {
  e.preventDefault();
  
    $.ajax({
      beforeSend: function () {},
      url: base + "ajout_utilisateur",
      type: "POST",
      processData: false,
      contentType: false,
      cache: false,
      dataType: "JSON",
      data: new FormData(this),
      error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
        

        if ($("#ajouterButton").text() ==  "Modifier") {
          if (res.status == "success") {
            refresh_user();
            alertCustom(
              "success",
              "ft-check",
              "Modification effectuée avec succès"
            );
            if(res.deconnecter){
              deconnecter();
            }
          }else{
            alertCustom("danger", "ft-x", res.message);
          }

        }else{

        if (res.status == "failed") {
          alertCustom("warning", "ft-alert-triangle", res.message);
        } else if (res.status == "success") {
          alertCustom("success", "ft-check", "Ajout avec succès");
          refresh_user();
        }else if (res.status == "fail") {
            alertCustom("warning", "ft-check", "Mot de passe doit contenir au moins 8 caractères");
        }
        else if (res.status == "fail_p") {
          alertCustom("warning", "ft-check", "Le mot de passe est différent de celui de la confirmation.");
        }
        
        else {
          alertCustom("danger", "ft-x", "Ajout non effectué");
        }
      }
        // liste_caracteristique();
      },
    });

});

function close_overlay_liste_user() {
  $("#card_utilisateur").unblock();
}

// Fonction pour dialogue une catégorie  ************************************************
function supprimerUser(id) {
  $("#card_utilisateur").block({
    message:
      `
    
    
    <div class="card" style="max-width:400px ;">
    <div class="card-header" style="max-width:400px ;  height:80px ">
             <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
    </div>
    <div class="card-content">
        <div class="card-body">
            <p>Voulez-vous supprimer cette utilisateur ?</p>

                <button type="button" onclick="delete_dialog_user(` +
      id +
      `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                <button type="button" onclick="close_overlay_liste_user()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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

function delete_dialog_user(id) {
  $.ajax({
    url: base + "supprimer_utilisateur",
    type: "POST",
    data: { id: id },
    error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (response) {
      alertCustom("success", "ft-check", "Suppression effectué avec succès");
      refresh_user();
      // liste_caracteristique();
    },
    error: function (error) {
      alertCustom(
        "danger",
        "ft-x",
        "Erreur lors de la suppression d'utilisateur"
      );
    },
  });
}

//Gerer le boutton Annuler
$("#annuler_user").on("click", function () {
  Annuler_users();
});

// Fonction pour vider les champs du formulaire **************************************************
function Annuler_users() {
  $("#label_imagetxt").html('');

  $("#editUserId").val("");
  $("#label_image").val("");
    $("#nom").val("");
    $("#prenom").val("");
    $("#role").val("");
    $("#password").val("");
    $("#password_confirmation").val("");
    $("#ajouterButton").text("Ajouter");
}
