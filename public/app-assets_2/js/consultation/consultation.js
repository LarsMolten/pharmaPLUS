// Récupère l'URL de base dynamiquement
var baseUrl = window.location.origin;

// Vérifie si l'URL contient un segment qui commence par "lien"
if (window.location.href.includes(baseUrl + "/lien")) {
    // Extrait le segment après "lien" pour générer la nouvelle URL
    const newUrl = window.location.href.replace("/lien", "/");

    // Redirige vers la nouvelle URL sans le préfixe "lien"
    window.location.href = newUrl;
}

$(document).ready(function () {
    
    //$('select').selectpicker('refresh');
    
    if (idtypeconsult == 19 || idtypeconsult == 20) {
        
        $("#date_debut").val(dateDebutISO30);
        
    } else {
        $("#date_debut").val(dateDebutISO);
        $('#message_ui').text('Bonjour Docteur');
    }
    $("#date_fin").val(dateFinISO);

    //$('select').find('.dropdown-toggle').blur();

   
    

    liste_consultation_all();
    charge_membre();
    charge_membre1();
    
    $("#deletepatient").insertAfter("#AddConsultation");
    $("#choixParametreVisite").css('display', 'none');

});

var membre_select;
var titulaire_select;
var specialite_docteur;
var parametreIdVisite;
var choix_docteur;
var personne_select;
var detailConsultationId;
var enCours = false;



function charge_membre() {
    $.ajax({
        url: base + 'charge_membre1',
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#membre_select").empty();
            $("#membre_select").append(data);
            $("#membre_select").selectpicker('refresh');
            if (membre_select != "" && membre_select != null) {
                $('#membre_select').val(membre_select).selectpicker('refresh');
                charge_titulaire_coix()
            }

            
        }
    });
}


function charge_type() {
    $.ajax({
        url: base + 'getSpecialiteMedecin',
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        }
        ,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            enCours = false;
            $("#specialite_docteur").empty();
            $("#specialite_docteur").append(data);
            $("#specialite_docteur").selectpicker('refresh');
            if (specialite_docteur != "" && specialite_docteur != null)  {
                $('#specialite_docteur').val(specialite_docteur).selectpicker('refresh');
                getDocteurSelonType();
            }
        }
    });
}

//-------- charge parametre ---------
function charge_parametre() {
    $.ajax({
        url: base + 'chargerParametre',
        type: "POST",
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#parametreIdVisite").empty();
            $("#parametreIdVisite").append(data);
            $("#parametreIdVisite").selectpicker('refresh');
            if (parametreIdVisite != "" && parametreIdVisite != null) {
                $('#parametreIdVisite').val(parametreIdVisite).selectpicker('refresh');
            }
            $("#AddVisites").unblock();
        }
    });
}
//______---------------_______________________

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
        data: {
            id_membre: $("#membre_select").val()
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#titulaire_select").empty();
            $("#titulaire_select").append(data);
            $("#titulaire_select").selectpicker('refresh');
            if (titulaire_select != "" && titulaire_select != null) {
                $('#titulaire_select').val(titulaire_select).selectpicker('refresh');
                charge_personne_malade();
            }
            $("#AddVisites").unblock();
        }
    });
}

function getDocteurSelonType() {
    $.ajax({
        url: base + 'getDocteurSelonType',
        type: "POST",
        data: {
            id: $("#specialite_docteur").val()
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {

            var res = JSON.parse(data);

            $("#choix_docteur").empty();
            $("#choix_docteur").append(res.listedocteur);
            $("#choix_docteur").selectpicker('refresh');
            if (choix_docteur != "" && choix_docteur != null) {
                $('#choix_docteur').val(choix_docteur).selectpicker('refresh');
            }

            if (res.directdentiste == 0) {
                $("#dispalyDirectAuDocteur").show();
                $("#directAuDocteur").prop('checked', false);
                $("#choixParametreVisite").show();
                $("#parametreIdVisite").attr("required" , "required");
            } else {
                $("#choixParametreVisite").hide();
                $("#dispalyDirectAuDocteur").hide();
                $("#parametreIdVisite").removeAttr("required");
            }

        }
    });
}

function charge_personne_malade() {
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
        url: base + 'charge_personne_malade',
        type: "POST",
        data: {
            id: $("#titulaire_select").val()
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#personne_select").empty();
            $("#personne_select").append(data);
            $("#personne_select").selectpicker('refresh');
            if (personne_select != "" && personne_select != null) {
                $('#personne_select').val(personne_select).selectpicker('refresh');
            }
            $("#AddVisites").unblock();
        }
    });
}


$("#membre_select").on('change', function name(params) {
    charge_titulaire_coix();
})
$("#specialite_docteur").on('change', function name(params) {

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

    getDocteurSelonType();
    charge_parametre();
    
})
$("#titulaire_select").on('change', function name(params) {
    charge_personne_malade()
})

$(document).on("click", "#directAuDocteur", function () {
    if ($(this).is(":checked")) {
        $("#choixParametreVisite").hide();
        $("#parametreIdVisite").removeAttr("required");
    } else {
        $("#choixParametreVisite").show();
        $("#parametreIdVisite").attr("required" , "required");
    }
});

// ***********************************liste consultation

function liste_consultation_all() {


    $.ajax({
        beforeSend: function () {

            $("#card_consultation").block({
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
        url: base + "listes_consultation_all",
        type: "POST",
        data: {
            id_membre: $('#membre_choix').val(),
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val(),
            idtypeconsult : idtypeconsult
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {


            var res = JSON.parse(res);

            //var hide = ["5", "1", "2"].includes(res.roleId) ? "" : 'hidden';

            if ($.fn.DataTable.isDataTable("table_consultation")) {
                $("#table_consultation").DataTable().destroy();
            } else {
            }
            $('#table_consultation').empty();
            
            $("#table_consultation").append(res.table);

            var filter = [[5, "asc"]];
            
            if ([1,14].includes(idtypeconsult)) { // tous etape
                filter = [[5, "desc"]];
            }

            $('#table_consultation').DataTable({
                destroy: true,
                ordering: true,
                order: filter,
                responsive: true,
                autoWidth: true,
                
                processing: true,
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

                dom: res.dom,
                buttons: [

                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {

                            $('#ajout_patient').find(':input:not([type="submit"], [type="hidden"])').each(function () {
                                if ($(this).is('select.selectpicker')) {
                                    $(this).selectpicker('val', []); // Réinitialiser le selectpicker
                                }else if ($(this).is(':checkbox')) {
                                    $(this).prop('checked', false);
                                }  
                                else {
                                    $(this).val('');
                                }
                            });
                            addPatientModal();
                            $("#choixParametreVisite").css('display', 'none');
                            $("#dispalyDirectAuDocteur").css('display', 'none');
                        },
                    },



                ],
            });
            $("#card_consultation").unblock();

        },
    });

}

function listes_detail_consultation() {

    $.ajax({
        beforeSend: function () {

            $("#card_detail_consultation").block({
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
        url: base + "listes_detail_consultation",
        type: "POST",
        data: {
            id : detailConsultationId,
            idtypeconsult : idtypeconsult
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {


            var res = JSON.parse(res);

            if ($.fn.DataTable.isDataTable("#detail_consultation")) {
                $("#detail_consultation").DataTable().destroy();
            } else {
            }
            $('#detail_consultation').empty();
            $("#detail_consultation").append(res.table);

            var filter = [[5, "desc"]];
        

            $('#detail_consultation').DataTable({
                destroy: true,
                ordering: false,
                order: filter,
                responsive: true,
                info: false,
                autoWidth: true,
                paging: true,
                deferRender: true,
                searching : false,
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



                dom: "frtip",
               
            });
            $("#card_detail_consultation").unblock();

        },
    });

}

// affiche modal patient  ajout
function addPatientModal() {


    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    detailConsultationId = "";

    $('#ajout_patient').find(':input:not([type="submit"], [type="hidden"])').each(function () {
        if ($(this).is('select.selectpicker')) {

        } else {
            $(this).val('');
        }
    });
    $('.entete_modal_pat').text("Ajout patient");
    $('#btn_add_patient').text("ajouter");

    $("#AddVisites").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    charge_type();
}

function fill_paramettre(id) {

    $.ajax({
        beforeSend: function () {

            $(".parametragepatient").block({
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
        url: base + "affiche_parametre",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".parametragepatient").unblock();

        },
        data: { id: id , idtypeconsult : idtypeconsult },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);
            $("#card_parametre").empty();
            $("#card_parametre").append(res.table);

            $('#table_parametre_vrai1').DataTable({
                destroy: true,
                ordering: false,
                responsive: true,
                info: false,
                paging: false,
                autoWidth: true,
                searching: false,
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
                },




                dom: "frtip",

            });
            $('#table_parametre_vrai2').DataTable({
                destroy: true,
                ordering: false,
                responsive: true,
                info: false,
                paging: false,
                autoWidth:true,
                deferRender: true,
                searching: false,
                pageLength: 7,
                complete: function() {
                    enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
                },
                "initComplete": function (settings, json) {
                    $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");

                    add_parametre();
                },
                language: {
                    "search": "",
                    "zeroRecords": "Aucun enregistrement",
                    paginate: {
                        previous: "Précédent",
                        next: "Suivant",
                    },
                },




                dom: "frtip",

            });



            // Appel de la fonction quand le poids ou la taille change
            $('#poids, #taille').on('input', function () {
                calculerPoidsTaille();
            });

            formatPrixImput();
        },
    });

}

function fill_conclusion(id) {

    $.ajax({
        beforeSend: function () {

            $("#card_conclusion").block({
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
        url: base + "affiche_conclusion",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { id: id ,
            idtypeconsult : idtypeconsult},
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);


            $("#card_conclusion").empty();
            $("#card_conclusion").html(res.table);

            formatPrixImput();

            submitConclusion();
        },
    });

    $("#card_conclusion").unblock();
}

function calculerPoidsTaille() {
    var poids = parseFloat($('#poids').val()) || 0;
    var taille = parseFloat($('#taille').val()) || 0;

    if (poids > 0 && taille > 0) {
        var poidsTaille = poids / taille;
        $('#poidstaille').val(poidsTaille.toFixed(2));  // Met à jour la valeur visible
        $('#poidstaille').attr('value', poidsTaille.toFixed(2));  // Met à jour l'attribut 'value'
    } else {
        $('#poidstaille').val('');  // Vide la valeur visible
        $('#poidstaille').attr('value', '');  // Vide l'attribut 'value'
    }
}


function fill_clinique(id) {

    $.ajax({
        beforeSend: function () {
            $(".cliniquepatient").block({
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
        url: base + "affiche_clinique",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".cliniquepatient").unblock();

        },
        data: { id: id ,
            idtypeconsult : idtypeconsult},
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);
            if ($.fn.DataTable.isDataTable("#table_clinique_vrai")) {
                $("#table_clinique_vrai").DataTable().destroy();
            } else {
            }
            
            $("#card_clinique").html(res.table);

            $('#table_clinique_vrai').DataTable({
                destroy: true,
                ordering: false,
                responsive: true,
                info: false,
                paging: false,
                deferRender: true,
                autoWidth: true,
                searching: false,
                pageLength: 7,
                "initComplete": function (settings, json) {
                    $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
                    add_clinique();
                },
                language: {
                    "search": "",
                    "zeroRecords": "Aucun enregistrement",
                    paginate: {
                        previous: "Précédent",
                        next: "Suivant",
                    },
                },




                dom: "frtip",

            });


            formatPrixImput();
        },
    });
}
function fill_autre_acte(id) {
    $.ajax({
        beforeSend: function () {

            $(".autreactepatient").block({
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
        url: base + "affiche_autreacte",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".autreactepatient").unblock();

        },
        data: { id: id ,
            idtypeconsult : idtypeconsult},
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);
            $("#card_autreacte").html(res.table);

            $("select").selectpicker("refresh")
            add_autreacte() ;

        },
    });
}

function fill_soinextraction(id) {
    $.ajax({
        beforeSend: function () {

            $("#card_soinextraction").block({
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
        url: base + "affiche_soinextraction",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { id: id ,
            idtypeconsult : idtypeconsult},
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#card_soinextraction").unblock();
        }, success: function (res) {
            var res = JSON.parse(res);
            $("#table_soinextraction").empty();
            $("#table_soinextraction").append(res.table);
            
            submitsoinextraction();
            $("#card_soinextraction").unblock();


            $("select").selectpicker("refresh")

            formatPrixImput();


        },
    });
}

function fill_diagnostique(id) {
    $.ajax({
        beforeSend: function () {

            $(".diagnostiquepatient").block({
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
        url: base + "affiche_diagnostique",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".diagnostiquepatient").unblock();

        },
        data: { id: id ,
            idtypeconsult : idtypeconsult},
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $(".diagnostiquepatient").unblock();
        }, success: function (res) {
            var res = JSON.parse(res);

            $("#card_diagnostique").empty();
            $("#card_diagnostique").append(res.table);
            $("select").selectpicker("refresh")
            add_diagnostique();
        },
    });
}

function fill_antecedent(id) {

    $.ajax({
        beforeSend: function () {

            $(".antecedentpatient").block({
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
        url: base + "affiche_antecedent",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".antecedentpatient").unblock();

        },
        data: { id: id ,
            idtypeconsult : idtypeconsult},
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);

            if ($.fn.DataTable.isDataTable("#table_antecedent_vrai")) {
                $("#table_antecedent_vrai").DataTable().destroy();
            } else {
            }

            $("#card_antecedent").empty();
            $("#card_antecedent").append(res.table);

            $('#table_antecedent_vrai').DataTable({
                destroy: true,
                ordering: false,
                responsive: true,
                info: false,
                paging: false,
                deferRender: true,
                
                searching: false,
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
                },




                dom: "frtip",

            });

            submit_antecedent();
            formatPrixImput();
        },
    });
}


function view_allsick(id) {
    
    typeEnvoie = "visite";

    detailConsultationId = id ;
    $("#modal_detail_consultation").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


    listes_detail_consultation();

}



// **************************ajout consultation 

$("#ajout_patient").off("submit").on("submit", function (e) {
    e.preventDefault();

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    let data = new FormData(this);
    let isDirectToDoctor = $("#directAuDocteur").is(":checked");
    data.append("isDirectToDoctor", isDirectToDoctor);
    data.append("detailConsultationId", detailConsultationId);
    $.ajax({
        beforeSend: function () {
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
        },
        url: base + "ajout_patient",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $("#AddVisites").unblock();

        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            enCours = false;
            $("#AddVisites").unblock();

            if ($('#btn_add_patient').text() === "Modifier") {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                    $("#AddVisites").modal("hide");
                    listes_detail_consultation();
                    liste_consultation_all();

                } else {
                    alertCustom("danger", "ft-x", "Modification non effectué");
                }

            } else {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    addPatientModal();
                    liste_consultation_all();

                } else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");
                }
            }
        },
    });
});

function add_parametre() {
    
$("#add_parametre").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    let data = new FormData(this);
    data.append("idDetailsCons", detailConsultationId);

    $.ajax({
        beforeSend: function () {
            $(".parametragepatient").block({
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
        url: base + "add_parametre",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".parametragepatient").unblock();

        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");

        }, success: function (res) {
            alertCustom("success", "ft-check", "Parametrage effectué avec succée");
            listes_detail_consultation();




        },
    });
});
}


function add_clinique() {
    
$("#add_clinique").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $(".cliniquepatient").block({
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
    let data = new FormData(this);
    data.append("idDetailsCons", detailConsultationId);

    $.ajax({
        beforeSend: function () {
           

        },
        url: base + "add_clinique",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: data,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $(".cliniquepatient").unblock();

        }, success: function (res) {
            alertCustom("success", "ft-check", "Examen clinique enregistré avec succée");
            $(".cliniquepatient").unblock();
            listes_detail_consultation();





        },
    });
});

}

function add_autreacte() {
    
$("#add_autreacte").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    let data = new FormData(this);
    data.append("idDetailsCons", detailConsultationId);

    $.ajax({
        beforeSend: function () {

            $(".autreactepatient").block({
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
        url: base + "add_autreacte",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".autreactepatient").unblock();

        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            
        }, success: function (res) {
            $(".autreactepatient").unblock();
            alertCustom("success", "ft-check", "Autre acte envoyé avec succée");
            listes_detail_consultation();




        },
    });
});
}

function add_diagnostique() {
    
$("#add_diagnostique").off("submit").on("submit", function (e) {
    e.preventDefault();

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    let data = new FormData(this);
    data.append("idDetailsCons", detailConsultationId);
    $.ajax({
        beforeSend: function () {
            $(".diagnostiquepatient").block({
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
        url: base + "add_diagnostique",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function() {

            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".diagnostiquepatient").unblock();

        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $(".diagnostiquepatient").unblock();
        }, success: function (res) {
            $(".diagnostiquepatient").unblock();

            alertCustom("success", "ft-check", "Autre acte envoyé avec succée");
            listes_detail_consultation();
        },
    });
});
}

function submitsoinextraction() {
    
$("#add_extractiondentaire").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    let data = new FormData(this);
    data.append("idDetailsCons", detailConsultationId);

    $.ajax({
        beforeSend: function () {

            $("#card_soinextraction").block({
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
        url: base + "add_extraction",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#card_soinextraction").unblock();
        }, success: function (res) {

            $("#card_soinextraction").unblock();
            alertCustom("success", "ft-check", "Enregistrement effectué avec succée");
            fill_soinextraction(detailConsultationId);
            


        },
    });
});



$("#add_soindentaire").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    let data = new FormData(this);
    data.append("idDetailsCons", detailConsultationId);

    $.ajax({
        beforeSend: function () {

            $("#card_soinextraction").block({
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
        url: base + "add_soindentaire",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#card_soinextraction").unblock();
        }, success: function (res) {
            $("#card_soinextraction").unblock();
            alertCustom("success", "ft-check", "Enregistrement effectué avec succée");
            fill_soinextraction(detailConsultationId);




        },
    });
});

}
function submit_antecedent() {
    
$("#add_antecedent").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    let data = new FormData(this);

    data.append("idDetailsCons" , detailConsultationId);

    $.ajax({
        beforeSend: function () {
            $(".antecedentpatient").block({
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
        url: base + "add_antecedent",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".antecedentpatient").unblock();

        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            alertCustom("success", "ft-check", "Antecedents enregistré avec succée");
            //listes_detail_consultation();




        },
    });
});
}


function annuler_soindentaire() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $("#annuler_soindentaire").modal("hide");

    $.ajax({
        beforeSend: function () {
            $("#card_soinextraction").block({
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
        url: base + "annuler_soindentaire",
        type: "POST",
        data: { iddetail: detailConsultationId },
        dataType: "JSON",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            enCours = false;
            fill_soinextraction(detailConsultationId);
            alertCustom("success", "ft-check", "Annulation effectué avec succée");
            $("#card_soinextraction").unblock();

        },
    });

}

function annuler_extraction(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $.ajax({
        beforeSend: function () {
            $("#card_soinextraction").block({
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
        url: base + "annuler_extraction",
        type: "POST",
        data: { iddetail: detailConsultationId },
        dataType: "JSON",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            fill_soinextraction(detailConsultationId);
            $("#annuler_extraction").modal("hide");
            alertCustom("success", "ft-check", "Annulation effectué avec succée");
            $("#card_soinextraction").unblock();

        },
    });

}


function annulerActe() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $.ajax({
        beforeSend: function () {
            $("#ListesLabocontent").block({
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
        url: base + "annuler_acte",
        type: "POST",
        data: { iddetail: detailConsultationId },
        dataType: "JSON",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            
            fill_autre_acte(detailConsultationId);
            $("#annuler_soin").modal("hide");
            alertCustom("success", "ft-check", "Annulation effectué avec succée");
            $("#ListesLabocontent").unblock();

        },
    });

}

function annulerDiagnostique() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $.ajax({
        beforeSend: function () {
            $(".diagnostiquepatient").block({
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
        url: base + "annuler_diagnostique",
        type: "POST",
        data: { iddetail: detailConsultationId },
        dataType: "JSON",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $(".diagnostiquepatient").unblock();

        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            
            fill_diagnostique(detailConsultationId);
            alertCustom("success", "ft-check", "Annulation effectué avec succée");
        },
    });

}

function submitConclusion() {
    $("#add_ceritificat").off("submit").on("submit", function (e) {

        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;

        let data = new FormData(this);
        data.append("idDetailsCons" , detailConsultationId);
        $.ajax({
            beforeSend: function () {
                $("#ListesLabocontent").block({
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
            url: base + "add_ceritificat",
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            dataType: "JSON",
            data: data,
            complete: function() {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", 'ft-x', "Une erreur s'est produite");
                $("#ListesLabocontent").unblock();

            }, success: function (res) {
                
                alertCustom("success", "ft-check", "Certification enregistré avec succée");
                $("#ListesLabocontent").unblock();





            },
        });
    });

    $("#add_repos").off("submit").on("submit", function (e) {
        e.preventDefault();
        if (enCours) return; // Empêche un deuxième clic si une requête est en cours
        enCours = true;
        let data = new FormData(this);
        data.append("idDetailsCons", detailConsultationId);

        $.ajax({
            beforeSend: function () {
                $("#ListesLabocontent").block({
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
            url: base + "add_repos",
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            dataType: "JSON",
            data: data,
            complete: function() {
                enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            },
            error: function (xhr, status, error) {
                alertCustom("danger", 'ft-x', "Une erreur s'est produite");
                $("#ListesLabocontent").unblock();

            }, success: function (res) {
                
                alertCustom("success", "ft-check", "Repos medical enregistré avec succée");
                $("#ListesLabocontent").unblock();





            },
        });
    });
}

function delete_detailvisite(id) {

    detailConsultationId = id;

    $("#deletepatient").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}
function annulersoindentaire() {

    $("#annuler_soindentaire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}
function annulerextraction() {

    $("#annuler_extraction").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}
function annulersoin() {

    $("#annuler_soin").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}



function delete_detailcons() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $.ajax({
        beforeSend: function () {
    
            $("#delcontentpatient").block({
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
        url: base + "delete_detailconsul",
        type: "POST",
        dataType: "JSON",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { id: detailConsultationId},
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {

            
            $("#deletepatient").modal(
                "hide"
            );

            $("#delcontentpatient").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                listes_detail_consultation();

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}


function affichage_demande(id, role) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    /*$('.nav-tabs .nav-link').removeClass('active').first().addClass('active');

    $('.tab-content .tab-pane').removeClass('active').first().addClass('active');*/

    detailConsultationId = id;
    formatPrixImput();
    
    
    $("#ListesLabo").modal(
        { backdrop: "static", keyboard: false },
        "show"
        );


    if ([1,2,3,4,19,20,14].includes(idtypeconsult)) { // tous etape
        fill_detailVisite(id);
    }
    if ([2,3,19,20,14].includes(idtypeconsult)) { // tous etape sauf enregistrement et prescription
        fill_paramettre(id);
    }
    if ([4,3,14].includes(idtypeconsult)) { // pharmacie ou consultation medecin seulement
        fill_prescription(id,typeEnvoie);
    }

    if ([3,19,20,14].includes(idtypeconsult)) { // laboratoire ou echographie ou consultation medecin seulement
        fill_labo(id,typeEnvoie);
    }

    if ([3,14].includes(idtypeconsult)) { //consultation medecin seulement
        charge_analyse();
        fill_conclusion(id);
        fill_clinique(id);
        fill_autre_acte(id);
        fill_diagnostique(id);
        fill_soinextraction(id);
        fill_antecedent(id);
    }
    

}

//--- get Detail Visite ---
function fill_detailVisite(id) {
    $.ajax({
        beforeSend: function () {
            $("#card_detailVisite").block({
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
        url: base + "detailVisite",
        type: "POST",
        dataType: "JSON",
        data: {
            id: id,
            idtypeconsult : idtypeconsult

        },
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        },
        success: function (res) {
            var val = res.data;
            $("#detailNumCart").text(res.numCarte);
            $("#detailNomMembre").text(val.nom_membre);
            $("#dtNonAffile").text(val.nom_titulaire + ' ' + val.prenom_titulaire);
            $("#dtDateVisite").text(val.dtCreatedAt);
            $("#dtUser").text(val.nom_user + ' ' + val.prenom_user);
            $("#dtTypeMalade").text(val.TypepersonneMalade);
            $("#dtDocteur").text(val.nomDoc + ' ' + val.prenomDoc);
            $("#dtTypeConsultation").text(val.designtypeconsultation);
            $("#dtGenre").text(val.genre_malade);
            $("#dtNomMalade").text(val.nom_malade);
            $("#dtEnvoiePharm").text(val.datePharm);
            $("#dtEnvoieEcho").text(val.dateEcho);
            $("#dtEnvoieLabo").text(val.dateLabo);
            $("#dtParam").text(val.dateParametre);
            var nomClo = val.nomCloture ? val.nomCloture : '';
            var preNomClo = val.prenomCloture ? val.prenomCloture : '';
            $("#dtClotureVisite").text(nomClo + ' ' + preNomClo);
            $("#dtNomParametre").text((val.nomParam == null ? '' : val.nomParam ) + ' ' + (val.prenomParam == null ? "" : val.prenomParam) );
            $("#dtMotif").text(val.dtMotif);
            $("#photoTitul").html(res.photo);
            $("#photoConjoint").html(res.photoConjoint);
            var etat = val.etat;


            $("#dtEtat").html(etat);


            $("#card_detailVisite").unblock();

        },
    });
}
//------------------------------------------------


function close_del_consultation() {
    $("#card_consultation").unblock();
}


function edit_patient(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    var motif = $("#nat" + id).data('motif');
    personne_select = $("#nat" + id).data('personne');
    detailConsultationId = id;
    $.ajax({
        url: base + "getDetailConsultationById",
        data: {
            detailConsultationId: id
        },
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        dataType: 'JSON',
        type: 'POST',
        success: function (response) {
            // console.log(response);   
                   
            $('#motif_persMalade').val(response.motif);
            membre_select = response.membreId;
            titulaire_select = response.titulaireId;
            parametreIdVisite = response.parametreId;
            personne_select = response.idPersonneMalade + '_' + response.TypepersonneMalade;
            charge_membre();
            $('#parametreIdVisite').val(response.parametreId);
            specialite_docteur = response.typeConsultationId;
            choix_docteur = response.docteurId;
            charge_type();
            charge_parametre();
           

            $('.entete_modal_pat').text("Modification patient");
            $('#btn_add_patient').text("Modifier");
            $("#AddVisites").modal(
                { backdrop: "static", keyboard: false },
                "show"
            );
        },
        error: function (xhr, status, error) {
            // Affichez des informations de débogage en cas d'erreur
            alertCustom("danger", 'ft-check', "Une erreur s'est produit. Veuillez contacter l'admnistrateur");
        }
    });


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

    liste_consultation_all();

}
function filtrerVisiteCpn() {

    liste_consultation_all();
    liste_cpn();
}
function filtrerVisitePrescription() {

    liste_consultation_all();
    liste_cpn();
    liste_soinDentaire();

}