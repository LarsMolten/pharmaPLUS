var typeEnvoie;
var id_labo;

function sendparam(id) {

    switch (idtypeconsult) {
        case 2: // parametre
            $("#textParamDoc").text("Voulez-vous envoyer ce patient au docteur ?");
            break;
        case 3: // docteur
            $("#textParamDoc").text("Voulez-vous cloturer cette consultation ?");
            break;
        case 4: // prescription
            $("#textParamDoc").text("Voulez-vous cloturer cette prescription ?");
            break;
        case 19: // labo
            $("#textParamDoc").text("Voulez-vous envoyer le resultat au docteur ?");
            break;

        default: // echo
            $("#textParamDoc").text("Voulez-vous envoyer le resultat au docteur ?");
            break;
    }

    envoyer_doc(id);

}

function Reouvrir(id) {

    switch (typeEnvoie) {
        case 'Soin dentaire': // soindentaire
            $("#textReouvrir").text("Voulez-vous Re-consulter cette soin dentaire ?");
            break;
        default: // cpn et consultation
            $("#textReouvrir").text("Voulez-vous Re-consulter cette consultation ?");
            break;
    }

    affiche_reconsulter(id);

}


function envoyer_doc(id) {

    $("#valideParametre").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    switch (idtypeconsult) {
        case 3: // docteur ou cpn pour cloture

            if (typeEnvoie == "visite") {
                detailConsultationId = id;
            }
            else if (typeEnvoie == "cpn") {

                iddetail = id;
            }
            else {
                idsoindentairedetail = id;
            }

            break;
        case 4: // prescription
            if (typeEnvoie == "visite") {
                detailConsultationId = id;
            } else if (typeEnvoie == "cpn") {

                iddetail = id;
            }
            else {
                idsoindentairedetail = id;
            }
            break;
        case 19: // labo
            id_labo = id;
            break;
        default: // echo
            id_labo = id;
            break;
    }

}

function affiche_reconsulter(id) {

    $("#Reouvrir").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    if (typeEnvoie == "visite") {
        detailConsultationId = id;
    }
    else if (typeEnvoie == "cpn") {

        iddetail = id;
    }
    else {
        idsoindentairedetail = id;
    }



}


function confirmer_anvoie_doc() {

    var data;


    if (typeEnvoie == "visite") {

        data = { idDetailConsultation: detailConsultationId, idtypeconsult: idtypeconsult, typeEnvoie: typeEnvoie, id_labo: id_labo }

    }
    else if (typeEnvoie == "cpn") {
        data = { idDetailConsultation: iddetail, idtypeconsult: idtypeconsult, typeEnvoie: typeEnvoie, idcpn: idCpn, id_labo: id_labo }

    }
    else if (typeEnvoie == "maternite") {
        data = { idDetailConsultation: idMat, idtypeconsult: idtypeconsult, typeEnvoie: typeEnvoie }

    }
    else {

        data = { idDetailConsultation: idsoindentairedetail, idtypeconsult: idtypeconsult, typeEnvoie: typeEnvoie, idsoinDentaireIndex: idsoinDentaireIndex, id_labo: id_labo }

    }

    $.ajax({
        beforeSend: function () {

            $("#modalenvoyeparam").block({
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
        url: base + "envoyer_docteur",
        type: "POST",
        dataType: "JSON",
        data: data,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {

            $("#valideParametre").modal(
                "hide"
            );

            $("#modalenvoyeparam").unblock();

            if ((idtypeconsult == 2 || idtypeconsult == 19 || idtypeconsult == 20) && res.id == 1) {

                alertCustom("success", 'ft-check', "Envoie effectué avec succée");

            }
            else if (idtypeconsult == 3 && res.id == 2) {

                alertCustom("danger", 'ft-x', "Une prescription a été prescrite pour ce patient. Veuillez d'abord l'envoyer à la pharmacie avant de clôturer.");

            }
            else { // pharmacie ou docteur

                alertCustom("success", 'ft-check', "Cloture effectué avec succée");

            }

            if (typeEnvoie == "visite") {

                fill_labo(detailConsultationId, typeEnvoie);
                listes_detail_consultation();
                liste_consultation_all();

            } else if (typeEnvoie == "cpn") {

                fill_labo(iddetail, typeEnvoie);
                fill_consult(idCpn);
                liste_cpn();

            } else if (typeEnvoie == "maternite") {

                // fill_consult(idMat);
                afficher_list_detail_maternite(idMat);


            } else {
                fill_prescription(idsoindentairedetail, typeEnvoie);
                liste_detailsoinDentaire();
                liste_soinDentaire();
            }

        },
    });


}


function confirmer_reouvrir() {

    var data;


    if (typeEnvoie == "visite") {

        data = { idDetailConsultation: detailConsultationId, idtypeconsult: idtypeconsult, typeEnvoie: typeEnvoie, id_labo: id_labo }

    }
    else if (typeEnvoie == "cpn") {
        data = { idDetailConsultation: iddetail, idtypeconsult: idtypeconsult, typeEnvoie: typeEnvoie, idcpn: idCpn, id_labo: id_labo }

    }
    else {

        data = { idDetailConsultation: idsoindentairedetail, idtypeconsult: idtypeconsult, typeEnvoie: typeEnvoie, idsoinDentaireIndex: idsoinDentaireIndex, id_labo: id_labo }

    }

    $.ajax({
        beforeSend: function () {

            $("#modalenvoyeReouvrir").block({
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
        url: base + "reconsulter",
        type: "POST",
        dataType: "JSON",
        data: data,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#modalenvoyeReouvrir").unblock();

        }, success: function (res) {

            $("#Reouvrir").modal(
                "hide"
            );

            $("#modalenvoyeReouvrir").unblock();

            alertCustom("success", 'ft-check', "Reconsultation effectué avec succée");

            if (typeEnvoie == "visite") {
                listes_detail_consultation();
                liste_consultation_all();
            } else if (typeEnvoie == "cpn") {
                fill_consult(idCpn);
                liste_cpn();
            } else {
                liste_detailsoinDentaire();
                liste_soinDentaire();
            }

        },
    });


}

