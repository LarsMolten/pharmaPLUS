


$(document).ready(function () {
    $('select').selectpicker('refresh');
    history.pushState({}, '', base + "examen");
    $("#date_debut").val(dateDebutISO);
    $("#date_fin").val(dateFinISO);

    listeExamen();
    charge_docteur();

    //set date to flitre date
    const today = new Date().toISOString().split('T')[0];
    $('.dateExamen').val(today);

});


// *** affichage examen ----------------
function listeExamen() {
    $.ajax({
        beforeSend: function () {

            $("#card-examen").block({
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
        url: base + "listes_examen",
        type: "POST",
        data: {
            date_debut: $('#date_debut').val(),
            date_fin: $('#date_fin').val()
          },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            let hide_btn_art = "";
            if (sessionData && sessionData.roleId != "3") {
                hide_btn_art = "";
            } else {
                hide_btn_art = "hidden";
            }

            if ($.fn.DataTable.isDataTable("#table-examen")) {
                $("#table-examen").DataTable().destroy();
            }
            $('#table-examen').empty();
            $("#table-examen").append(res);
            $('#table-examen').DataTable({
                destroy: true,
                ordering: true,
                order: [[3, "desc"], [6, "asc"]],
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
                dom: "Bfrtip",
                buttons: [
                    // {
                    //     extend: "excelHtml5",
                    //     title: "Listes des Examen",
                    //     className: "btn btn-sm mr-1 btn-success",
                    //     text: 'Excel',
                    //     exportOptions: {
                    //         columns: ':not(:last-child)'
                    //     }

                    // },
                    {
                        className: "btn btn-sm mr-1 btn-secondary btn-min-width ",
                        text: '<i class="ft-refresh"> Actualiser</i>',
                        action: function () {
                            listeExamen();
                        },
                    },
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width " + hide_btn_art,
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {
                            $('#btn_add_examen').text("Envoyer Au Docteur");
                            if ($("#getRoleConncted").val() == "3") {
                                $('#btn_add_examen').text("Valider");                                
                            }

                            $("#createExamenModel").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                            );                           
                            $('#createExamenForm')[0].reset();
                            const today = new Date().toISOString().split('T')[0];
                            $('.dateExamen').val(today);

                            $("#id_examen_men_modif").val("");
                        },
                    },
                ],

                //trasferer les date en francais
                // columnDefs: [
                //     {
                //         targets: 3, // Cible la quatrième colonne (index 3)
                //         render: function(data, type, row) {
                //             if (type === 'display' || type === 'filter') {
                //                 var date = new Date(data);
                //                 var day = ("0" + date.getDate()).slice(-2);
                //                 var month = ("0" + (date.getMonth() + 1)).slice(-2);
                //                 var year = date.getFullYear();
                //                 return day + "-" + month + "-" + year;
                //             }
                //             return data;
                //         }
                //     }
                // ]
            });
            $("#card-examen").unblock();

        },
    });
}
//--------------------------------------------------------


$("#form_examen").off("submit").on("submit", function (e) {

    e.preventDefault();

    var fileInput = $('#fichierdemande')[0]; // Assurez-vous que l'élément de fichier est dans le DOM
    var fileInput1 = $('#fichierrapport')[0]; // Assurez-vous que l'élément de fichier est dans le DOM

    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];

        // Vérification de la taille du fichier (3 Mo max)
        if (file.size > 3 * 1024 * 1024) {
            alert('Le fichier demande ne doit pas dépasser 3 Mo.');
            return;
        }

        // Vérification du type de fichier
        var allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('Le fichier demande doit être un PDF, un document Word, une présentation PowerPoint ou un fichier Excel.');
            return;
        }
    }

    if (fileInput1.files.length > 0) {
        var file = fileInput1.files[0];

        // Vérification du type de fichier
        var allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('Le fichier rapport doit être un PDF, un document Word, une présentation PowerPoint ou un fichier Excel.');
            return;
        }
    }

    let data = new FormData(this);

    $.ajax({
        beforeSend: function () {

            $("#validelabothead").block({
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
        url: base + "valider_examenmedicale",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            alertCustom("success", 'ft-check', "Validation effectué avec succée");
            $("#validelabothead").unblock();
            $('#valideLabo').modal('hide');
            fill_labo(iddetail);
            liste_consultation();
        },
    });
});


// ------ ajout Examen ----------------------
$("#createExamenForm").off("submit").on("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);

    var url = "ajout_examen";
    if ($('#btn_add_examen').text() === "Modifier" || $('#btn_add_examen').text() === "Terminer"){
        url = "update_examen";
    }
    // else if ($('#btn_add_examen').text() === "Valider") {
    //     url = "update_examen_by_docteur";        
    // }
    $.ajax({
        beforeSend: function () {
            $("#modal_content_add_examen").block({
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
        url: base + url,
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: formData,
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if (res.status) {
                if ($('#btn_add_examen').text() === "Modifier") {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                    listeExamen();
                    annulerAjoutExamen();
                    $("#createExamenModel").modal("hide");               
                }
                else {         
                    annulerAjoutExamen();
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    listeExamen();
                    $("#createExamenModel").modal("hide");
                }                
            }
            else{   
                alert("flse")             
                alertCustom("danger", "ft-check", res.message);                
            }
            $("#modal_content_add_examen").unblock();
        },
        error: function (res) {
            alert("Erreur Serveur, veuillez contacter le responsable !!")
        }
    });
});
//--------------------------------------------------------------

function close_del_examen() {
    $("#card-examen").unblock();
}

// *************************dialogue suppression deleate
function delete_examen(id) {

    $("#card-examen").block({
        message: `          
          
          <div class="card" style="max-width:400px ; ">
          <div class="card-header" style="max-width:400px ;">
                   <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
          </div>
          <div class="card-content">
              <div class="card-body">
                  <p>Voulez-vous supprimer cet Rapport d'examen Médicale ?</p> 
                      <button type="button" onclick="delete_examen_from_dialog(`+ id + `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                      <button type="button" onclick="close_del_examen()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>  
              </div>
          </div>
          </div>
          `,

        overlayCSS: {
            backgroundColor: 'black',
            opacity: 0.1,            cursor: "wait",

        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: "transparent"
        }
    });


}


// **************************suppression apres boite dialogue de suppression
function delete_examen_from_dialog(id) {

    $("#card-examen").unblock();

    $.ajax({
        beforeSend: function () {

            $("#card-examen").block({
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
        url: base + "delete_examen",
        type: "POST",
        dataType: "JSON",
        data: { examenId: id },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            $("#card-examen").unblock();
            if (res.id > 0) {
                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
            } else {
                alertCustom("danger", 'ft-x', "Suppression non effectué");
            }
            listeExamen();
        },
    });

}

// *****************modification examen
function edit_examen(id, verifRole) {      
    $.ajax({
        url: base + "getExamenById",
        type: "POST",
        dataType: "JSON",
        data: { ExamenId : id },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if (res) {
                // $('.entete_modal').text("Modification examen");
                if (verifRole == 3) {
                    $('#btn_add_examen').text("Terminer");
                }else{
                    $('#btn_add_examen').text("Modifier");
                }
                $('#examenId').val(res.data[0].ExamenId);

                //completer le les champs ici
                $('#etablissement').val(res.data[0].etablissement);
                $('input[name="genre"][value="' + res.data[0].genre + '"]').prop('checked', true);
                $('#nomPrenom').val(res.data[0].nomPrenom);
                $('#dateNaiss').val(res.data[0].dateNaiss);
                $('#profession').val(res.data[0].profession);
                $('#adresse').val(res.data[0].adresse);
                $('#dateExamen').val(res.data[0].dateExamen);
                $('#docteurExamen').val(res.data[0].docteurExamen);
                $('#poids').val(res.data[0].poids);
                $('#taille').val(res.data[0].taille);
                $('#TAG').val(res.data[0].TAG);
                $('#IMC').val(res.data[0].IMC);
                $('#TAD').val(res.data[0].TAD);
                $('#avantCorrectionOD').val(res.data[0].avantCorrectionOD);
                $('#avantCorrectionOG').val(res.data[0].avantCorrectionOG);
                $('#apresCorrectionOD').val(res.data[0].apresCorrectionOD);
                $('#apresCorrectionOG').val(res.data[0].apresCorrectionOG);
                $('input[name="acuiteAuditive"][value="' + res.data[0].acuiteAuditive + '"]').prop('checked', true);
                $('#antecedentMedicauxPersonnels').val(res.data[0].antecedentMedicauxPersonnels);
                $('#antecedentMedicauxFamiliaux').val(res.data[0].antecedentMedicauxFamiliaux);
                $('#antecedentChirurgicaux').val(res.data[0].antecedentChirurgicaux);
                $('#antecedentGynecoObsetrique').val(res.data[0].antecedentGynecoObsetrique);
                $('input[name="aspectSainAgeIndique"][value="' + res.data[0].aspectSainAgeIndique + '"]').prop('checked', true);
                $('input[name="malformationMutilations"][value="' + res.data[0].malformationMutilations + '"]').prop('checked', true);
                $('#commentairesAspectGeneral').val(res.data[0].commentairesAspectGeneral);

                $("input[name='goitre'][value='" + res.data[0].goitre + "']").prop('checked', true);
                $("input[name='languePharynxAmygdalesAnormale'][value='" + res.data[0].languePharynxAmygdalesAnormale + "']").prop('checked', true);
                $("input[name='affectionYeux'][value='" + res.data[0].affectionYeux + "']").prop('checked', true);
                $("input[name='affectionAuditif'][value='" + res.data[0].affectionAuditif + "']").prop('checked', true);
                $('#commentaireORL_OPHTALMOLOGIE').val(res.data[0].commentaireORL_OPHTALMOLOGIE);
                $("input[name='affectionBuccoDentaire'][value='" + res.data[0].affectionBuccoDentaire + "']").prop('checked', true);
                $('#commentaireStomatologieque').val(res.data[0].commentaireStomatologieque);
                $("input[name='respiratoireLimite'][value='" + res.data[0].respiratoireLimite + "']").prop('checked', true);
                $("input[name='percussionAnormales'][value='" + res.data[0].percussionAnormales + "']").prop('checked', true);
                $("input[name='ausculationAnormaux'][value='" + res.data[0].ausculationAnormaux + "']").prop('checked', true);
                $("input[name='voixVoilee'][value='" + res.data[0].voixVoilee + "']").prop('checked', true);
                $('#commentairesRespiratoire').val(res.data[0].commentairesRespiratoire);
                $("input[name='bruitsCoeuModifie'][value='" + res.data[0].bruitsCoeuModifie + "']").prop('checked', true);
                $("input[name='souffleCardiaque'][value='" + res.data[0].souffleCardiaque + "']").prop('checked', true);
                $("input[name='poulesInferieursPercus'][value='" + res.data[0].poulesInferieursPercus + "']").prop('checked', true);
                $("input[name='souffleArteresCervicales'][value='" + res.data[0].souffleArteresCervicales + "']").prop('checked', true);
                $('#commentairesCardioVasculaire').val(res.data[0].commentairesCardioVasculaire);

                // Section VII-APPAREIL DIGESTIF
                $("input[name='palpationPathologique'][value='" + res.data[0].palpationPathologique + "']").prop('checked', true);
                $("input[name='hepatomegalie'][value='" + res.data[0].hepatomegalie + "']").prop('checked', true);
                $("input[name='splenomegalie'][value='" + res.data[0].splenomegalie + "']").prop('checked', true);
                $("input[name='hernie'][value='" + res.data[0].hernie + "']").prop('checked', true);
                $("input[name='hemorroide'][value='" + res.data[0].hemorroide + "']").prop('checked', true);
                $("input[name='alcoolismeTabagisme'][value='" + res.data[0].alcoolismeTabagisme + "']").prop('checked', true);
                $('#commentairesDigestif').val(res.data[0].commentairesDigestif);

                // Section VIII-APPAREIL GENITO-URINAIRE
                $("input[name='antecedentsOrganesGenito'][value='" + res.data[0].antecedentsOrganesGenito + "']").prop('checked', true);
                $("input[name='indicesAffectionOrganesGenitauxM'][value='" + res.data[0].indicesAffectionOrganesGenitauxM + "']").prop('checked', true);
                $("input[name='indicesAffectionOrganesGenitauxF'][value='" + res.data[0].indicesAffectionOrganesGenitauxF + "']").prop('checked', true);
                $("input[name='gynecomastie'][value='" + res.data[0].gynecomastie + "']").prop('checked', true);
                $("input[name='modificationAnormalSeins'][value='" + res.data[0].modificationAnormalSeins + "']").prop('checked', true);
                $('#commentairesGenitoUrinaire').val(res.data[0].commentairesGenitoUrinaire);
                $('#urineAspect').val(res.data[0].urineAspect);
                $('#urineAlbumine').val(res.data[0].urineAlbumine);
                $('#urineGlucose').val(res.data[0].urineGlucose);
                $('#urineLEU').val(res.data[0].urineLEU);
                $('#urineNIT').val(res.data[0].urineNIT);
                $('#urineSG').val(res.data[0].urineSG);
                $('#urinePH').val(res.data[0].urinePH);
                $('#urinePRO').val(res.data[0].urinePRO);
                $('#urineKET').val(res.data[0].urineKET);
                $('#urineURO').val(res.data[0].urineURO);

                // Section IX-SYSTEME NERVEUX
                $("input[name='reflexePupillaires'][value='" + res.data[0].reflexePupillaires + "']").prop('checked', true);
                $("input[name='signesDystonie'][value='" + res.data[0].signesDystonie + "']").prop('checked', true);
                $("input[name='troublesPsychique'][value='" + res.data[0].troublesPsychique + "']").prop('checked', true);
                $('#commentairesSystemeNerveux').val(res.data[0].commentairesSystemeNerveux);

                // Pour X-PEAU
                $("input[name='ictereCyanose'][value='" + res.data[0].ictereCyanose + "']").prop('checked', true);
                $("input[name='eruptionUlcerationKyste'][value='" + res.data[0].eruptionUlcerationKyste + "']").prop('checked', true);
                $("input[name='ganglionsLymphatiques'][value='" + res.data[0].ganglionsLymphatiques + "']").prop('checked', true);
                $("input[name='cicatricesTatouages'][value='" + res.data[0].cicatricesTatouages + "']").prop('checked', true);
                $("input[name='tophusXanthome'][value='" + res.data[0].tophusXanthome + "']").prop('checked', true);
                $('#commentairespeau').val(res.data[0].commentairespeau);

                // Pour XI-SQUELETTE
                $("input[name='affectionOs'][value='" + res.data[0].affectionOs + "']").prop('checked', true);
                $('#commentairesSquelette').val(res.data[0].commentairesSquelette);
                $("input[name='repercussionProffessionelles'][value='" + res.data[0].repercussionProffessionelles + "']").prop('checked', true);
                $('#commentairesRepercussionProfessionnelles').val(res.data[0].commentairesRepercussionProfessionnelles);
                $("input[name='etatSanteConsidere'][value='" + res.data[0].etatSanteConsidere + "']").prop('checked', true);
                $('#remarquesSpeciales').val(res.data[0].remarquesSpeciales);

                // Remplir les champs d'entrée restants
                $("input[name='villeExamen']").val(res.data[0].villeExamen);
                $("input[name='dateExamen']").val(res.data[0].dateExamen);


                $("#createExamenModel").modal(
                    { backdrop: "static", keyboard: false },
                    "show"
                );
            }
        },
    });
}

//*******************ANNULATION BUTTTON */
function annulerAjoutExamen() {
    $('#createExamenForm')[0].reset();
    $("#examenId").val("");
}
//-------------------------------------------------


// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************




// **************************evenement changemenet de filtre
$("#district_choix").on('change', function name(params) {
    chargeCommuneTous();
    chargeQuartierVider();
});


///******************filtre examenr ******* */

function filtrerexamen() {
    liste_examen()

}

//********* IMPRIMER ***************/
function imprimerExamen(idExamen) {
    $.ajax({
        beforeSend: function () {
            $("card-examen").block({
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
        url: base + 'imprimerExamen',
        dataType: 'json',
    
        type: 'POST',
        data: { idExamen: idExamen},
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (file) {
            $("#card-examen").unblock();
            window.open(file.file);
            alertCustom("success", 'ft-check', "Bien imprimé");
        },
        error: function (data) {
            $("#card-examen").unblock();
            alertCustom("danger", 'ft-check', "Non imprimer");
        }
    });
  }

  /* **** *** Charger liste docteur **** */
  function charge_docteur() {
    $.ajax({
        url: base + 'getDocteurExamen',
        type: "POST",
        
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
            $("#docteurExamen").empty();
            $("#docteurExamen").append(data);
            $('select').selectpicker('refresh');
        }
    });
  }

  function filtrerexamen() {
    listeExamen();
  }
