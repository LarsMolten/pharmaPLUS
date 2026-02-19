

$(document).ready(function () {


    $('select').selectpicker('refresh');
    $("#date_debut").val(dateDebutISO);
    $("#date_fin").val(dateFinISO);
    liste_consultation();

});

var membre_select;
var titulaire_select;
var specialite_docteur;
var parametreIdVisite;
var choix_docteur;
var analyse_select;
var medicament_select;
var personne_select;
var idAdministration;
var docteurEchographie;
var typeechographie;
var detailConsultationId;



// ***********************************liste consultation

function liste_consultation() {


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
        url: base + "listes_consultationhisto",
        type: "POST",
        data: {
            id_membre: $('#membre_choix').val(),
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val()
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {


            var res = JSON.parse(res);


            if ($.fn.DataTable.isDataTable("table_consultation")) {
                $("#table_consultation").DataTable().destroy();
            } else {
            }
            $('#table_consultation').empty();
            $("#table_consultation").append(res.table);


            $('#table_consultation').DataTable({
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

                            liste_consultation();

                        },
                    },




                ],
            });
            $("#card_consultation").unblock();

        },
    });

}


function fill_paramettre(id) {

    $.ajax({
        beforeSend: function () {

            $("#tabIcon21").block({
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
        url: base + "affiche_parametrehisto",
        type: "POST",

        data: { id: id },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);


            if ($.fn.DataTable.isDataTable("#table_parametre_vrai1")) {
                $("#table_parametre_vrai1").DataTable().destroy();
            } else {
            }
            if ($.fn.DataTable.isDataTable("#table_parametre_vrai2")) {
                $("#table_parametre_vrai2").DataTable().destroy();
            } else {
            }


            $("#table_parametre_vrai").empty();
            $("#table_parametre_vrai").append(res.table);
            $('#table_parametre_vrai1').DataTable({
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
            $('#table_parametre_vrai2').DataTable({
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

            if (["6" , "10"].includes(res.roleId)) {
                $('#add_parametre').find(':input').each(function () {
                    $(this).prop('disabled', true);
                });

            } else {
                $('#add_parametre').find(':input').each(function () {
                    $(this).prop('disabled', false);
                });
            }



            // Appel de la fonction quand le poids ou la taille change
            $('#poids, #taille').on('input', function () {
                calculerPoidsTaille();
            });

            formatPrixImput();
        },
    });

    $("#tabIcon21").unblock();
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
        url: base + "affiche_conclusionhisto",
        type: "POST",

        data: { id: id },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);


            $("#table_conclusion_vrai").empty();
            $("#table_conclusion_vrai").append(res.table);

            formatPrixImput();

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
        url: base + "affiche_cliniquehisto",
        type: "POST",

        data: { id: id },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);

            if ($.fn.DataTable.isDataTable("#table_clinique_vrai")) {
                $("#table_clinique_vrai").DataTable().destroy();
            } else {
            }


            $("#table_clinique_vrai").empty();
            $("#table_clinique_vrai").append(res.table);
            $('#table_clinique_vrai').DataTable({
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


            formatPrixImput();
        },
    });
}
function fill_autre_acte(id) {

    $.ajax({
        url: base + "affiche_autreactehisto",
        type: "POST",

        data: { id: id },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);
            
            $("#table_autreacte_vrai").empty();
            $("#table_autreacte_vrai").append(res.table);

            $("select").selectpicker("refresh")

        
        },
    });
}

function fill_antecedent(id) {

    $.ajax({
        url: base + "affiche_antecedenthisto",
        type: "POST",

        data: { id: id },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);

            if ($.fn.DataTable.isDataTable("#table_antecedent_vrai")) {
                $("#table_antecedent_vrai").DataTable().destroy();
            } else {
            }


            $("#table_antecedent_vrai").empty();
            $("#table_antecedent_vrai").append(res.table);
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


            formatPrixImput();
        },
    });
}


var id_labo ;


var ancienQte;

var iddetailmedicament;



function affichage_demande(id, role) {

    $('.nav-tabs .nav-link').removeClass('active').first().addClass('active');

    $('.tab-content .tab-pane').removeClass('active').first().addClass('active');

    iddetail = id;
    formatPrixImput();


    $("#ListesLabo").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    iddetail = id;

    fill_paramettre(id);
    fill_detailVisite(id);
    if ([8, 5 , 14].includes(role)) {

        fill_labo(id);
        fill_prescription(id);
        fill_conclusion(id);
        fill_clinique(id);
        fill_autre_acte(id);
        fill_antecedent(id);
    }

    if ([6, 10].includes(role)) {
        fill_labo(id);
    }

    if ([9 , 12].includes(role)) {
        fill_prescription(id);
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
        url: base + "detailVisitehisto",
        type: "POST",
        dataType: "JSON",
        data: {
            id: id,
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, 
        success: function (res) {
            console.log(res);
            var val = res.data;
            $("#detailNumCart").text(res.numCarte);
            $("#detailNomMembre").text(val.nom_membre);
            $("#dtNonAffile").text(val.nom_titulaire+' '+val.prenom_titulaire);
            $("#dtDateVisite").text(val.dtCreatedAt);
            $("#dtUser").text(val.nom_user+' '+val.prenom_user);
            $("#dtTypeMalade").text(val.TypepersonneMalade);
            $("#dtDocteur").text(val.nomDoc+' '+val.prenomDoc);
            $("#dtTypeConsultation").text(val.designtypeconsultation); 
            $("#dtGenre").text(val.genre_malade);
            $("#dtNomMalade").text(val.nom_malade);
            $("#dtClotureVisite").text(val.nomCloture+' '+val.prenomCloture);
            $("#dtNomParametre").text(val.nomParam+' '+val.prenomParam);
            $("#dtMotif").text(val.dtMotif);
            var isLabo = val.isLabo;
            var isFinished = val.isFinished;
            var isPharmacie = val.isPharmacie; 
            var isEchographie = val.isEchographie; 
            var dateDocteur = val.dateDocteur; 
            var dateParametre = val.dateParametre; 
            var etat = '';

            
            if (isFinished == '0') {
                etat = 'En attente paramétre';
                if (isLabo == '1') {
                    etat = "En attente d'analyse";
                } else {
                    if (dateParametre != null ) {
                        etat = 'En attente envoie au docteur';
                    }
                }
            } else if (isFinished === '1') {

                if (dateDocteur == "") {
                    etat = 'En attente docteur';
                } else {
                    
                    if (isLabo == 1 && isEchographie == 1 && isPharmacie == 1) {

                        etat = "En attente d'analyse && Echographie && Pharmacie";
                    } else if (isLabo == 1 && isEchographie == 1 && isPharmacie != 1) {

                        etat = "En attente d'analyse && Echographie";
                    } else if (isLabo == 1 && isEchographie != 1 && isPharmacie != 1) {

                        etat = "En attente d'analyse";
                    } else if (isLabo != 1 && isEchographie == 1 && isPharmacie != 1) {

                        etat = "En attente d'echographie";
                    } else if (isLabo != 1 && isEchographie == 1 && isPharmacie == 1) {

                        etat = "En attente d'echographie && Pharmacie";
                    } else if (isLabo == 1 && isEchographie != 1 && isPharmacie == 1) {

                        etat = "En attente d'analyse && Pharmacie";
                    } else if (isLabo != 1 && isEchographie != 1 && isPharmacie == 1) {

                        etat = "En attente de cloture";

                        /*if (in_array(_SESSION['roleId'], ["9" , "12"])) {

                            etat = "En attente de cloture";
                        }*/

                    } else {

                        etat = "En attente de cloture";
                    }
                }
            }else if (isFinished === '3') {
                if (isLabo == 1 && isEchographie == 1 && isPharmacie == 1) {

                    etat = "En attente d'analyse && Echographie && Pharmacie";
                } else if (isLabo == 1 && isEchographie == 1 && isPharmacie != 1) {

                    etat = "En attente d'analyse && Echographie";
                } else if (isLabo == 1 && isEchographie != 1 && isPharmacie != 1) {

                    etat = "En attente d'analyse";
                } else if (isLabo != 1 && isEchographie == 1 && isPharmacie != 1) {

                    etat = "En attente d'echographie";
                } else if (isLabo != 1 && isEchographie == 1 && isPharmacie == 1) {

                    etat = "En attente d'echographie && Pharmacie";
                } else if (isLabo == 1 && isEchographie != 1 && isPharmacie == 1) {

                    etat = "En attente d'analyse && Pharmacie";
                } else if (isLabo != 1 && isEchographie != 1 && isPharmacie == 1) {

                    etat = "En attente de cloture";

                    /*if (in_array(_SESSION['roleId'], ["9" , "12"])) {

                        etat = "Cloturé";
                    }*/

                } else {

                    etat = "Cloturé";
                }
            }
            
            $("#dtEtat").text(etat);


            $("#card_detailVisite").unblock();

        },
    });
}
//------------------------------------------------

function fill_labo(id) {
    $.ajax({
        beforeSend: function () {

            $("#card_demande").block({
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
        url: base + "listes_envoie_labohisto",
        type: "POST",
        data: {
            idType: id,
            type: "visite"
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);

          

            if ($.fn.DataTable.isDataTable("#table_demande")) {
                $("#table_demande").DataTable().destroy();
            } else {
            }
            $('#table_demande').empty();
            $("#table_demande").append(res.table);


            $('#table_demande').DataTable({
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
                },




                dom: "frtip",
                buttons: [
                    
                ],
            });
            $("#card_demande").unblock();

        },
    });
}

function fill_prescription(id) {
    $.ajax({
        beforeSend: function () {

            $("#card_prescription").block({
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
        url: base + "listes_medicamenthisto",
        type: "POST",
        data: {
            id: id,
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);

          
           
            if ($("#btnImprimerMedicament")) {
                $("#btnImprimerMedicament").attr("onclick", `imprimerMedicament(${id})`);
            }


            if ($.fn.DataTable.isDataTable("#table_prescription")) {
                $("#table_prescription").DataTable().destroy();
            } else {
            }
            $('#table_prescription').empty();
            $("#table_prescription").append(res.table);


            $('#table_prescription').DataTable({
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
                },




                dom: "frtip",
                buttons: [
                   
                ],
            });
            $("#card_prescription").unblock();

        },
    });
}

function imprimerMedicament(idDetailConsultation) {
    $.ajax({
        beforeSend: function () {

            $("#card_prescription").block({
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
        url: base + "imprimerMedicamentConsultation",
        type: "POST",
        data: {
            idDetailConsultation: idDetailConsultation,
            type : "visite"
        },
        dataType: "JSON",
        success: function (file) {
            $("#card_prescription").unblock();

            window.open(file.file);
            alertCustom("success", 'ft-check', "Bien imprimé");
        },
        error: function (data) {
            $("#card_prescription").unblock();
            alertCustom("danger", 'ft-check', "Non imprimer");
        }
    })
}


function downloadFile(id) {
    // Sélectionnez l'élément de fichier pour vérifier ses propriétés


    $.ajax({
        url: base + "downloadFilehisto",
        data: {
            fileName: $("#idlabed" + id).data("file")
        },
        type: 'POST',
        xhrFields: {
            responseType: 'blob' // Important pour le téléchargement de fichiers
        },
        success: function (response, status, xhr) {
            var contentType = xhr.getResponseHeader('Content-Type');
            var blob = new Blob([response], { type: contentType });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = $("#idlabed" + id).data("file");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            alertCustom("success", 'ft-check', "Téléchargement effectué avec succès");
        },
        error: function (xhr, status, error) {
            // Affichez des informations de débogage en cas d'erreur
            alertCustom("success", 'ft-check', "Téléchargement effectué avec succès");

        }
    });

}




// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerVisite() {

    liste_consultation()

}