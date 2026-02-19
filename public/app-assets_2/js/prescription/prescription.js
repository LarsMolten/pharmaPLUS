
$(document).ready(function () {


    charge_administration();

});

var enCours = false;

var medicament_select;
var idAdministration;
var ancienQte;

var iddetailmedicament;
var isImprimerTout;


function fill_prescription(iddetails, types) {

    type = types;
    var datasend;
    if (type == "visite") {
        datasend = {
            id: iddetails,
            type: type,
            idtypeconsult: idtypeconsult,

        };
    } else if (type == "cpn") {
        datasend = {
            id: iddetails,
            type: type,
            idtypeconsult: idtypeconsult,
            idCpn: idCpn
        };

    } else if (type == "maternite"){
         datasend = {
            id: iddetails,
            type: type,
            idtypeconsult: idtypeconsult,
            idMat: idMat
        };
    }else {

        datasend = {
            id: iddetails,
            type: type,
            idtypeconsult: idtypeconsult,
            idsoinDentaireIndex : idsoinDentaireIndex
        };
    }

    $.ajax({
        beforeSend: function () {

            $(".prescriptiontous").block({
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
        url: base + "listes_medicament",
        type: "POST",
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: datasend,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);
            enCours = false;
            $(".table_prescription").empty();
            if ($.fn.DataTable.isDataTable(".table_prescription")) {
                $(".table_prescription").DataTable().destroy();
            } else {
            }
            $(".card_prescription").empty();
            $(".card_prescription").append(res.table);

            $(".prescriptiontous").unblock();

            $(".hideImprimeMedic").empty();
            $(".hideImprimeMedic").append(res.btnsend);
            $(".hideImprimeMedic").append(res.btnprint);

            if ($("#btnEnvoyerPharmacie").length > 0) {  
                $("#btnEnvoyerPharmacie").attr("onclick", `modal_sendpharmacie()`);
            }
            if ($("#btnAnnukerPharmacie").length > 0) {
                $("#btnAnnukerPharmacie").attr("onclick", `modal_annulepharmacie()`);
            }

            if ($(".btnImprimerMedicament").length > 0) {
                $(".btnImprimerMedicament").attr("onclick", `confirmImprimer()`);
            }

            $('.table_prescription').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                deferRender: true, // Active le rendu différé
                processing: true,
                autoWidth: true,
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

                dom: res.dom,
                buttons: [
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {

                            addMedicModal();

                        },
                    },
                ],
            });

        },
    });
}

function asiaalert(){
    alert("tonkn hivoha eto");
}

function confirmImprimer() {

    $("#confirmImprimerTout").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
}
function imprimerTout(isImprimerT) {
    isImprimerTout = isImprimerT;

    if (type == "visite") {
        imprimerMedicament(detailConsultationId);
    } else if (type == "cpn") {
        imprimerMedicament(iddetail);

    } else {
        imprimerMedicament(idsoindentairedetail);

    }


    $("#confirmImprimerTout").modal("hide");
}


function validerNoteDetailMedicament() {
    var note = $("#noteDetailMedicamentText").val();
    $.ajax({
        beforeSend: function () {
            $("#noteDetailMedicamentmodal").block({
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
        url: base + "updateNoteDetailMedicament",
        type: "POST",
        data: {
            detailMedicamentId: iddetailmedicament,
            note: note
        },
        dataType: "JSON",
        success: function (res) {
            if (res.id == 1) {
                $("#noteDetailMedicamentmodal").unblock();
                $("#noteDetailMedicament").modal('hide');
                alertCustom("success", 'ft-check', "C'est Noté");


                if (type == "visite") {
                    fill_prescription(detailConsultationId, type);
                } else if (type == "cpn") {
                    fill_prescription(iddetail, type);

                } else {
                    fill_prescription(idsoindentairedetail, type);
                }
            }
            else {
                alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            }
        },
        error: function (data) {
            $("#noteDetailMedicamentmodal").unblock();
            $("#noteDetailMedicament").modal('hide');
            alertCustom("danger", 'ft-check', "Une erreur s'est produite !");
        }
    })
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
            type: type,
            isImprimerTout: isImprimerTout
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

function modal_sendpharmacie() {
// ====================================================
    alert('tonaga ato koa'); 

    $("#envoye_pharmacie").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}
function modal_annulepharmacie() {


    $("#annuler_pharmacie").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}

function envoye_pharmacie() {

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    if (type == "visite") {
        data = {
            note: $("#note").val(),
            detailconsultationId: detailConsultationId,
            type: type,
            iddetail: "",
            idCpn: ""
        };
    } else if (type == "cpn") {
        data = {
            note: $("#note").val(),
            detailconsultationId: "",
            type: type,
            iddetail: iddetail,
            idCpn: idCpn
        };

    } else {
        data = {
            note: $("#note").val(),
            detailconsultationId: "",
            idsoindentairedetail: idsoindentairedetail,
            type: type,
            iddetail: "",
            idCpn: "",
            idsoinDentaireIndex : idsoinDentaireIndex
        };
    }

    $("#envoye_pharmaciemodal").block({
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
        beforeSend: function () {

        },
        url: base + "envoyer_pharmacie",
        type: "POST",
        dataType: "JSON",
        data: data,
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#envoye_pharmaciemodal").unblock();

        }, success: function (res) {

            $("#envoye_pharmaciemodal").unblock();

            if (res.id == 1) {

                $("#envoye_pharmacie").modal(
                    "hide"
                );
                alertCustom("success", "ft-check", "Envoye effectué avec succée");


                if (type == "visite") {
                    fill_prescription(detailConsultationId, type);
                    listes_detail_consultation();
                    liste_consultation_all();
                } else if (type == "cpn") {
                    fill_prescription(iddetail, type);
                    fill_consult(idCpn);
                    liste_cpn();

                } else {
                    fill_prescription(idsoindentairedetail, type);
                    liste_detailsoinDentaire();
                    liste_soinDentaire();
                }



            }
            else {

                alertCustom("danger", 'ft-x', "Une erreur s'est produite");

            }


        },
    });

}

function annuler_pharmacie() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    if (type == "visite") {
        data = {
            note: $("#note").val(),
            detailconsultationId: detailConsultationId,
            type: type,
            iddetail: "",
            idCpn: ""
        };

    } else if (type == "cpn") {
        data = {
            note: $("#note").val(),
            detailconsultationId: "",
            type: type,
            iddetail: iddetail,
            idCpn: idCpn
        };

    } else {
        data = {
            note: $("#note").val(),
            detailconsultationId: "",
            idsoindentairedetail: idsoindentairedetail,
            type: type,
            iddetail: "",
            idCpn: ""
            ,idsoinDentaireIndex : idsoinDentaireIndex
        };
    }

    $("#annuler_pharmaciemodal").block({
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
        beforeSend: function () {

        },
        url: base + "annuler_pharmacie",
        type: "POST",
        dataType: "JSON",
        data: data,
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#annuler_pharmaciemodal").unblock();

        }, success: function (res) {

            $("#annuler_pharmaciemodal").unblock();

            if (res.id == 1) {

                $("#annuler_pharmacie").modal(
                    "hide"
                );
                alertCustom("success", "ft-check", "Annulation effectué avec succée");

                if (type == "visite") {
                    fill_prescription(detailConsultationId, type);
                    listes_detail_consultation();
                    liste_consultation_all();
                } else if (type == "cpn") {
                    fill_prescription(iddetail, type);
                    fill_consult(idCpn);
                    liste_cpn();

                } else {
                    fill_prescription(idsoindentairedetail, type);
                    liste_detailsoinDentaire();
                    liste_soinDentaire();
                }

            }
            else {

                alertCustom("danger", 'ft-x', "Une erreur s'est produite");

            }


        },
    });

}



// function edit_medic(id) {
//     if (enCours) return; // Empêche un deuxième clic si une requête est en cours
//     enCours = true;

//     $("#AddMedicament").modal(
//         { backdrop: "static", keyboard: false },
//         "show"
//     );

//     var idAdmin = $("#medicedit" + id).data('idadministration');
//     var idMedic = $("#medicedit" + id).data('medicamentid');

//     idAdministration = idAdmin;
//     medicament_select = idMedic;
//     var qte = $("#medicedit" + id).data('qte');

//     ancienQte = qte;

//     charge_medicament();
//     charge_administration();

//     iddetailmedicament = id;

//     var durrejours = $("#medicedit" + id).data('durrejours');
//     var modeprise = $("#medicedit" + id).data('modeprise');

//     $('#qte').val(qte);
//     $('#durrejours').val(durrejours);
//     $('#modeprise').val(modeprise);

//     $('#btn_add_med').text("Modifier");
//     $('.entete_modal_med').text("MODIFICATION");

// }



function charge_administration() {
    $.ajax({
        url: base + 'charge_administration',
        type: "POST",
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#idAdministration").empty();
            $("#idAdministration").append(data);
            $("#idAdministration").selectpicker('refresh');
            if (idAdministration != "") {
                $('#idAdministration').val(idAdministration).selectpicker('refresh');
            }
        }
    });
}

