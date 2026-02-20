

$(document).ready(function () {
    $('select').selectpicker('refresh');
    $("#date_debut").val(dateDebutISO30);
    $("#date_fin").val(dateFinISO);
    charge_membre1();
    liste_pf();
    charge_membre();
    charge_methode_contraceptive()
    $("#deleteConsultation").insertAfter("#modal_consultationcpn");


});


$(document).on("click", "#patientetrangerPF", function () {
    if ($(this).is(":checked")) {
        $("#afficheInputpatientetrangerPF").show();
        $("#nomPF").attr("required", "required");
        $("#genrePF").val("Femme");

        $('#afficheInputpatientPF [required], #toujoursAffiher [required]').removeAttr('required');
        $("#afficheInputpatientPF").css("display", "none");
    } else {
        $("#afficheInputpatientetrangerPF").hide();
        $("#nomPF").removeAttr("required");

        $("#afficheInputpatientPF").show();
        $('#afficheInputpatientPF [required], #toujoursAffiher [required]').attr('required');
    }
});


var membre_select ;
var titulaire_select ;
var idmethodepf ;
var personne_selectpf ;
var idPf ;


function charge_membre() {
    $.ajax({
        url: base + 'charge_membre1',
        type: "POST",
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
            $("#membre_select").empty();
            $("#membre_select").append(data);
            $('select').selectpicker('refresh');
            if (membre_select != "") {
                $('#membre_select').val(membre_select).selectpicker('refresh');
                charge_titulaire_coix()
            }
        }
    });
  }

function charge_titulaire_coix() {
    $("#AddVisites").block({
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
    $.ajax({
        url: base + 'charge_titulaire',
        type: "POST",
        data:{
            id_membre : $("#membre_select").val()
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
            $("#titulaire_select").empty();
            $("#titulaire_select").append(data);
            $('select').selectpicker('refresh');
            if (titulaire_select != "") {
                $('#titulaire_select').val(titulaire_select).selectpicker('refresh');
                charge_personne_malade();
            }
            $("#AddVisites").unblock();
  
        }
    });
}

function charge_personne_malade() {

    $.ajax({
        url: base + 'charge_personne_malade',
        type: "POST",
        data:{
            id : $("#titulaire_select").val()
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
            $("#personne_selectpf").empty();
            $("#personne_selectpf").append(data);
            $('select').selectpicker('refresh');
            if (personne_selectpf != "") {
                $('#personne_selectpf').val(personne_selectpf).selectpicker('refresh');
            }
  
        }
    });
}




$("#membre_select").on('change', function name(params) {
    
    charge_titulaire_coix();
})
$("#titulaire_select").on('change', function name(params) {

    charge_personne_malade();
})



// ***********************************liste consultation

function liste_pf() {


    $.ajax({
        beforeSend: function () {

            $("#card_pf").block({
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
        url: base + "liste_pf",
        type: "POST",
        data:{
            id_membre :  $('#membre_choix').val() ,
            date_debut :  $('#date_debut').val() ,
            date_fin :  $('#date_fin').val()
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if ($.fn.DataTable.isDataTable("table_pf")) {
                $("#table_pf").DataTable().destroy();
            } else {
            }
            $('#table_pf').empty();
            $("#table_pf").append(res);


            $('#table_pf').DataTable({
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
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_pf();

                        },
                    },

                 
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {
                            $("#AddVisites").unblock();

                            $('#id_cpnfirt').val('');

                            $('#add_pf').find(':input:not([type="submit"], [type="hidden"] , [type="radio"])').each(function() {
                                if ($(this).is('select.selectpicker')) {
                                    // Réinitialiser le selectpicker en vidant les sélections
                                    $(this).selectpicker('val', []);
                                } else {
                                    // Réinitialiser les autres champs en vidant leur valeur
                                    $(this).val('');
                                }
                            });

                            $("#patientetrangerPF").prop('checked', false);
                            $("#afficheInputpatientetrangerPF").hide();
                            $("#nomPF").removeAttr("required");
                            $("#nomPF").val("");
                            $("#prenomPF").val("");
                            $("#genrePF").val("Femme");
                            $('#genrePF').selectpicker('refresh'); 
                            $("#adressePF").val("");
                            $("#checkTitulairePf").val('');

                            $("#afficheInputpatientPF").show();
                            $('#afficheInputpatientPF [required], #toujoursAffiher [required]').attr('required');
                            
                            $('.entete_modalVIS').text("Ajout PF");
                            $('#btn_add_cpn_first').text("Ajouter");

                            $("#AddVisites").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                            );
                            
                            formatPrixImput();

                        },
                    },
                    


                ],
            });
            $("#card_pf").unblock();

        },
    });

}




$("#add_pf").off("submit").on("submit", function (e) {

    e.preventDefault();

    let data = new FormData(this);
    let isPatientetranger = $("#patientetrangerPF").is(":checked");
    data.append("isPatientetrange", isPatientetranger);
    $.ajax({
        beforeSend: function () {
            $("#modal_visites").block({
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
        url: base + "ajout_pf",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            $("#modal_visites").unblock();
            if ($('#btn_add_cpn_first').text() === "Modifier") {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");

                    $("#AddVisites").modal("hide");
                    liste_pf();

                    
                    

                }  else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");

                }
                
            } else {

                if (res.id == 1) {
                   
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    liste_pf();

                    $("#AddVisites").modal("hide");
                    


                }else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");

                }
            }

        },
    });
});


function close_del_consultation() {
    $("#card_pf").unblock();
}


// *************************dialogue suppression deleate
function supprimercpn(id) {


    idPf = id ;
    
    $("#deletePf").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}


// **************************suppression apres boite dialogue de suppression
function delete_pf() {


    $.ajax({
        beforeSend: function () {

            $("#card_pf").block({
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
        url: base + "delete_pf",
        type: "POST",
        dataType: "JSON",
        data: { id_pf : idPf },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            $("#deletePf").modal(
                "hide"
            );

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }

            liste_pf(idPf);

        },
    });

}

// *****************modification consultation

function edit_cpn(id , membre_select1 , titulaire_select1 , idmethodepf1) {
    membre_select = membre_select1;
    titulaire_select =  titulaire_select1;
    idmethodepf =  idmethodepf1;
    personne_selectpf = $("#pfF" + id).data('personne');

    $('#id_cpnfirt').val(id);

    $('.entete_modalVIS').text("Modification PF");
    $('#btn_add_cpn_first').text("Modifier");
    
    var element = $("#pfF" + id);
    if(membre_select1==0){
        $("#patientetrangerPF").prop('checked', true);
        $("#afficheInputpatientetrangerPF").show();
        $("#nomPF").attr("required", "required");
        $("#nomPF").val(element.data('nom'));
        $("#prenomPF").val(element.data('prenom'));
        $("#adressePF").val(element.data('adresse'));
        $("#genrePF").val(element.data('genre'));
        $("#checkTitulairePF").val(titulaire_select);

        $("#afficheInputpatientPF").css("display", "none");
        $('#afficheInputpatientPF [required], #toujoursAffiher [required]').removeAttr('required').val("");
    }else{
        $("#patientetrangerPF").prop('checked', false);
        $("#afficheInputpatientetrangerPF").hide();
        $("#nomPF").removeAttr("required");
        $("#nomPF").val("");
        $("#prenomPF").val("");
        $("#adressePF").val("");
        $("#checkTitulairePF").val('');

        $("#afficheInputpatientPF").show();
        $('#afficheInputpatientPF [required], #toujoursAffiher [required]').attr('required');
    }
    // Utiliser jQuery pour sélectionner les inputs par leur 'name' et assigner les valeurs des attributs 'data-*'
    $('input[name="personne"]').val(element.data('personne'));
    $('input[name="taille"]').val(element.data('taille'));
    $('input[name="poids"]').val(element.data('poids'));
    $('input[name="tension"]').val(element.data('tension'));
    $('input[name="dateRendezVous"]').val(element.data("daterendezvous"));

    $("#AddVisites").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    charge_membre();
    formatPrixImput();
    $('#idmethodepf').val(idmethodepf).selectpicker('refresh');


}


var num = "";

//*******************ANNULATION BUTTTON */

function annulerAjoutconsultation() {

    // $('#patient_select').selectpicker('val', []);
    // $('#medecin_select').selectpicker('val', []);
    // $("#id_consultation_men_modif").val("");
    // $("#motif").val("");
    // num = "";
}



// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerVisite() {

    liste_pf();

}