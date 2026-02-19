$(document).ready(function () {

        $.ajax({
        url: base + 'message_utilisateur',
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
         
          $("#messageFooter").text(res);

            
        }
    });
});