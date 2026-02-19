
$(document).ready(function () {
    $('select').selectpicker('refresh');
    liste_patient();
    charge_membre();

});




function charge_membre() {
    $.ajax({
        url: base + 'charge_membre',
        type: "POST",
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
            $("#membre_choix").empty();
            $("#membre_choix").append(data);
            $('select').selectpicker('refresh');
  
        }
    });
  }



  $("#membre_choix").on('change', function name(params) {
    liste_patient();
})

// ***********************************liste patient

function liste_patient() {


    $.ajax({
        beforeSend: function () {

            $("#card_patient").block({
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
        url: base + "listes_patient",
        type: "POST",
        data:{
            id_membre :  $('#membre_choix').val()
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if ($.fn.DataTable.isDataTable("table_patient")) {
                $("#table_patient").DataTable().destroy();
            } else {
            }
            $('#table_patient').empty();
            $("#table_patient").append(res);


            $('#table_patient').DataTable({
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
                    "zeroRecords": "Aucun enregistrement",
                    paginate: {
                        previous: "Précédent",
                        next: "Suivant",
                    },
                }
                ,



                dom: "Bfrtip",
                buttons: [
                    

                    {
                        extend: "excelHtml5",
                        title: "Liste délégués",
                        className: "btn btn-sm mr-1 btn-success",
                        text: 'Excel',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }

                    },
                    {
                        className: "btn btn-sm mr-1 btn-secondary btn-min-width ",
                        text: '<i class="ft-refresh"> Actualiser</i>',
                        action: function () {

                            liste_patient();

                        },
                    },


                ],
            });
            $("#card_patient").unblock();

        },
    });

}


// **************************ajout patient 
$("#ajout_patient").off("submit").on("submit", function (e) {
    e.preventDefault();

    let data = new FormData(this);

    $.ajax({
        beforeSend: function () {
            $("#modal_content_add_patient").block({
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
        url: base + "ajout_patient",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            if ($('#btn_add_patient').text() === "Modifier") {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                    liste_patient();
                    annulerAjoutpatient();
                    $("#AddContactModal").modal("hide");

                } else if (res.id == 2) {
                    alertCustom("danger", "ft-x", "Bureau de vote existe déjà");
                } else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");

                }
                
            } else {

                if (res.id == 1) {
                   
                    annulerAjoutpatient();
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    liste_patient();
                } else if (res.id == 2) {
                    alertCustom("danger", "ft-x", "Bureau de vote existe déjà");
                } else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");

                }
            }
           

            

            $("#modal_content_add_patient").unblock();


        },
    });
});

function close_del_patient() {
    $("#card_patient").unblock();
}

// *************************dialogue suppression deleate
function delete_patient(id) {


    $("#card_patient").block({
        message: `
          
          
          <div class="card" style="max-width:400px ; ">
          <div class="card-header" style="max-width:400px ;">
                   <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
          </div>
          <div class="card-content">
              <div class="card-body">
                  <p>Voulez-vous supprimer ce patient  ?</p>
  
                      <button type="button" onclick="delete_patient_from_dialog(`+ id + `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                      <button type="button" onclick="close_del_patient()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>
  
  
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


// **************************suppression apres boite dialogue de suppression
function delete_patient_from_dialog(id) {



    $("#card_patient").unblock();

    $.ajax({
        beforeSend: function () {

            $("#card_patient").block({
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
        url: base + "delete_patient",
        type: "POST",
        dataType: "JSON",
        data: { id_patient: id },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            $("#card_patient").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }

            liste_patient();

        },
    });

}

// *****************modification patient

var id_faritany = 0;
var id_region = 0;
var id_district = 0;
var id_bv = 0;

function edit_patient(id) {
    

    $('.entete_modal').text("Modification patient");
    $('#btn_add_patient').text("Modifier");
    $("#AddContactModal").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    var nom = $('#mem_' + id).data('nom_patient');
    var contact = $('#mem_' + id).data('contact_patient');
    var email = $('#mem_' + id).data('email_patient');

    $('input[name="contact_patient"]').val(contact);
    $('input[name="nom_patient"]').val(nom);
    $('input[name="email_patient"]').val(nom);

    $('input[name="id_patient"]').val(id);

}

//*******************ANNULATION BUTTTON */

function annulerAjoutpatient() {
    $('#ajout_patient')[0].reset();
    $("#id_patient_men_modif").val("");
}



// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************




// **************************evenement changemenet de filtre
$("#district_choix").on('change', function name(params) {
    chargeCommuneTous();
    chargeQuartierVider();
});


///******************filtre patientr ******* */

function filtrerpatient() {

    liste_patient()

}