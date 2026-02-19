
var type;

function delete_medic(id) {

    iddetailmedicament = id;

    $("#deletemedicament").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}

function edit_medic(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $("#AddMedicament").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    var idMedic = $("#medicedit" + id).data('medicamentid');
    
    if (type == "Sortie manuelle") {
        
        var idAdmin = $("#medicedit" + id).data('typesortiedetailid');
        typesortiedetailid = idAdmin;
    } else {
        
        var idAdmin = $("#medicedit" + id).data('idadministration');
        idAdministration = idAdmin;
    }

   
    medicament_select = idMedic;
    var qte = $("#medicedit" + id).data('qte');

    ancienQte = qte;

    charge_medicament();

    if (type == "Sortie manuelle") {
        
        charge_typesortie();
        var note = $("#medicedit" + id).data('note');
        $('#note').val(note);
    } else {
        
        charge_administration();
        var durrejours = $("#medicedit" + id).data('durrejours');
        var modeprise = $("#medicedit" + id).data('modeprise');


        $('#durrejours').val(durrejours);
        $('#modeprise').val(modeprise);
    }

    iddetailmedicament = id;



    $('#qte').val(qte);


    $('#btn_add_med').text("Modifier");
    $('.entete_modal_med').text("MODIFICATION");

}



function addMedicModal() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $("#AddMedicament").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    resetmodalmedica();
}


function resetmodalmedica() {
    iddetailmedicament = "";

    $('#add_medicament').find(':input:not([type="submit"], [type="hidden"])').each(function () {
        if ($(this).is('select.selectpicker')) {
            $(this).selectpicker('val', []); // Réinitialiser le selectpicker
        } else {
            $(this).val('');
        }
    });

    $('#btn_add_med').text("Ajouter");
    $('.entete_modal_med').text("AJOUT");
    $('#p_u').text("0");

    medicament_select = "";
    ancienQte = "";

    charge_medicament();
    formatPrixImput();
}


function charge_medicament() {
    $.ajax({

        beforeSend: function () {

            $("#modal_medicament").block({
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
        url: base + 'charge_medicament',
        type: "POST",
        data: {
            qte: ancienQte,
            medicament_select: medicament_select,
            type: type
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#medicament_select").empty();
            $("#medicament_select").append(data);
            $("#medicament_select").selectpicker('refresh'); 

            if (medicament_select != "") {
                $('#medicament_select').val(medicament_select).selectpicker('refresh');
            }


            $("#modal_medicament").unblock();

        },
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        }

    });

}

$('#medicament_select').on('change', function () {

    $('#qte').val("");  // Stocker la quantité max dans le champ qte
    var maxQuantity = $('#medicament_select').find('option:selected').data('qte-max');
    // Si maxQuantity est 0, vider le champ et sortir
    if (maxQuantity <= 0) {
        alertCustom("warning", 'ft-x', "Stock epuisé");
    }

    var prix_unitaire = $('#medicament_select').find('option:selected').data('prix-unitaire');
    $('#p_u').text(prix_unitaire);


});




$("#add_medicament").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    let data = new FormData(this);

    data.append('ancienQte', ancienQte);

    data.append('detailMedicamentId', iddetailmedicament);
    data.append('type', type);

    if (type == "visite") {
        data.append('detailconsultationId', detailConsultationId);
    } else if(type == "cpn") {
        data.append('detailconsultationId', iddetail);

        data.append('idCpn', idCpn);
               
    } else if(type == "maternite") {  // plusieurs prescriptions pour un patient au maternité
        data.append('detailconsultationId', idDtetailMat); 

        data.append('idmaternite', idMat); 

    }else if(type == "Sortie manuelle") {

    }
    else{
        data.append('detailconsultationId', idsoindentairedetail);

        data.append('idsoinDentaireIndex', idsoinDentaireIndex);
    }


    $.ajax({
        beforeSend: function () {
            $("#modal_medicament").block({
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
        url: base + "add_medicament",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {

            $("#modal_medicament").unblock();

            if (res.id == 1 && iddetailmedicament == "") {

                alertCustom("success", "ft-check", "Ajout effectué avec succée");
                resetmodalmedica();
// ######################################################################################### condition pour maternité ##############################
                if (type == "visite") {
                    fill_prescription(detailConsultationId, type);
                    listes_detail_consultation();
                    liste_consultation_all();
                } else if (type == "cpn") {
                    fill_prescription(iddetail, type);
                    fill_consult(idCpn);
                    liste_cpn();
                } else if (type == "maternite") {
                    fill_prescription(idDtetailMat, type);
                    afficher_list_detail_maternite(idMat) 


                }else if(type == "Sortie manuelle") {
                    liste_sortiedetail();
                } else {
                    fill_prescription(idsoindentairedetail, type);
                    liste_detailsoinDentaire();
                    liste_soinDentaire();
                }

            }
            else if (res.id == 1 && iddetailmedicament != "") {
                alertCustom("success", "ft-check", "Modification effectué avec succée");
                $("#AddMedicament").modal("hide");
                if (type == "visite") {
                    fill_prescription(detailConsultationId, type);
                    listes_detail_consultation();
                    liste_consultation_all();
                } else if (type == "cpn") {
                    fill_prescription(iddetail, type);
                    fill_consult(idCpn);
                    liste_cpn();
                } else if (type == "maternite") {
                    fill_prescription(idDtetailMat, type);
                    afficher_list_detail_maternite(idMat) 

                }else if(type == "Sortie manuelle") {
                    liste_sortiedetail();
                }  else {
                    fill_prescription(idsoindentairedetail, type);
                    liste_detailsoinDentaire();
                    liste_soinDentaire();
                }
            }
            else {

                alertCustom("warning", "ft-check", res.message);

            }


        },
    });
});



function delete_medicament() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    var data;

    if (type == "visite") {
        data = { id: iddetailmedicament, iddetail: detailConsultationId, type: type };
    } else if(type == "cpn") {
        data = { id: iddetailmedicament, iddetail: iddetail, type: type, idCpn: idCpn };
    
    } else if(type == "maternite") {
        data = { id: iddetailmedicament, iddetail: idDtetailMat, type: type, idMat: idMat };
    
    }else if(type == "Sortie manuelle") {
        data = { id: iddetailmedicament, type: type };
    } else {
        data = { id: iddetailmedicament, iddetail: idsoindentairedetail, type: type , idsoinDentaireIndex : idsoinDentaireIndex};
    }

    $.ajax({
        beforeSend: function () {

            $("#deletemediccontent").block({
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
        url: base + "delete_detail_medicament",
        type: "POST",
        dataType: "JSON",
        data: data,
        complete: function () {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {


            $("#deletemedicament").modal(
                "hide"
            );
            $("#deletemediccontent").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                if (type == "visite") {
                    fill_prescription(detailConsultationId, type);
                    listes_detail_consultation();
                    liste_consultation_all();
                } else if (type == "cpn") {
                    fill_prescription(iddetail, type);
                    fill_consult(idCpn);
                    liste_cpn();
                } else if (type == "maternite") {
                    fill_prescription(idDtetailMat, type);
                    afficher_list_detail_maternite(idMat) 

                }else if(type == "Sortie manuelle") {
                    liste_sortiedetail();
                }else {
                    fill_prescription(idsoindentairedetail, type);
                    liste_detailsoinDentaire();
                    liste_soinDentaire();
                }

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }


        },
    });

}

function noteDetailMedicament(detailMedicamentId, noteDetailmedicament) {
    if (detailMedicamentId == '') {
        $("#viewNoteDetailMedicamentText").val(noteDetailmedicament)
        $("#viewNoteDetailMedicament").modal(
            { backdrop: "static", keyboard: false },
            "show"
        );
    } else {
        iddetailmedicament = detailMedicamentId;
        $("#noteDetailMedicamentText").val(noteDetailmedicament)
        $("#noteDetailMedicament").modal(
            { backdrop: "static", keyboard: false },
            "show"
        );
    }
}

$('#qte').on('keydown', function (e) {

    var maxQuantity = $('#medicament_select').find('option:selected').data('qte-max');

    if (maxQuantity === 0) {
        $(this).val('');
        //alertCustom("warning", 'ft-x', "Stock epuisé");
        return;
    }

    if ($(this).val() == "") {
        return;
    }


    let value = parseInt($(this).val());

    if (e.key === 'ArrowUp') {
        e.preventDefault(); // Empêcher le comportement par défaut

        if (value == maxQuantity) {
            $(this).val(maxQuantity);
        }
        else {

            $(this).val(value + 1); // Incrémenter la valeur
        }

    } else if (e.key === 'ArrowDown') {
        e.preventDefault(); // Empêcher le comportement par défaut
        if (value == 1) {
            $(this).val(1);
        }
        else {
            $(this).val(value - 1); // Décrémenter la valeur
        }
    }
});


$('#qte').on('input', function () {
    var enteredQuantity = $(this).val();  // Obtenir la valeur actuelle
    var maxQuantity = $('#medicament_select').find('option:selected').data('qte-max');

    // Si le champ est vide, ne rien faire
    if (enteredQuantity === '') {
        return;
    }

    // Si maxQuantity est 0, vider le champ et sortir
    if (maxQuantity <= 0) {
        $(this).val('');
        alertCustom("warning", 'ft-x', "Stock epuisé");
        return;
    }

    // Convertir en nombre à virgule flottante pour la vérification
    enteredQuantity = parseFloat(enteredQuantity);

    // Empêcher la saisie de valeurs inférieures à 1 ou supérieures à la quantité maximale
    if (enteredQuantity > maxQuantity) {
        $(this).val(maxQuantity);  // Fixer la valeur au maximum si elle dépasse
    } else if (enteredQuantity < 1) {
        $(this).val(1);  // Fixer la valeur à 1 si elle est inférieure
    }
});
