
$(document).ready(function () {

});


var docteurEchographie;
var typeechographie;
var analyse_select;
var id_labo;
var typeDestinataire;
var  enCours = false;
var typeEnvoie;
var idType;

function fill_labo(id,type) {

    typeEnvoie = type ;
    
    $.ajax({
        beforeSend: function () {

            $(".card_demande").block({
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
        url: base + "listes_envoie_labo",
        type: "POST",
        data: {
            idType: id,
            type: typeEnvoie,
            idtypeconsult : idtypeconsult
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {
            var res = JSON.parse(res);



            if ($.fn.DataTable.isDataTable(".table_demande")) {
                $(".table_demande").DataTable().destroy();
            } else {
            }
            $('.table_demande').empty();
            $(".table_demande").html(res.table);


            var tr = $('.table_demande').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                autoWidth: true,
                paging: true,
                deferRender: false,
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
                            id_labo = "";
                            laboratoire();

                        },
                    },
                ],
            });
            $(".card_demande").unblock();

        },
    });
}

function diplayDocLabo(id) {
    $.ajax({
        url: base+"viewDocumentLabo",
        method: 'POST',
        data:{id: id},
        xhrFields: {
            responseType: 'blob' // Ensure the response is treated as a binary file
        },
        success: function(response, status, xhr) {
            // Extract filename from the response headers
            const contentDisposition = xhr.getResponseHeader('Content-Disposition');
            let fileName = "document"; // Default filename
            if (contentDisposition && contentDisposition.includes('filename=')) {
                fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '');
            }

            // Create a temporary <a> element to trigger the download
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Set the filename
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Show success message
            alertCustom("success", 'ft-check', "Téléchargement effectué avec succès");
            
        },
        error: function() {
            alert('Pas de fichier !!.');
            alertCustom("danger", 'ft-x', "Erreur de Téléchargement");
        }
    });
}

function diplayDocLabo_____(id) {
    $("#docModal").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $.ajax({
        url: base+"viewDocumentLabo/" + id,
        method: 'GET',
        success: function(response) {
            // Assuming the response is the document content
            var blob = new Blob([response], { type: 'application/pdf' });
            var url = URL.createObjectURL(blob);
            $('#documentViewer').attr('src', url);
        },
        error: function() {
            alert('Failed to load document.');
        }
    });
}

function diplayDocLabo____________(id) {
    $("#docModal").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    let docUrl = base+"viewDocumentLabo/" + id;  // Direct URL to the document
    let encodedUrl = encodeURIComponent(docUrl);
    let googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(encodedUrl)}&embedded=true`;
    console.log(googleViewerUrl);    

    let iframe = `<iframe src="${docUrl}" width="100%" height="500px" style="border: none;"></iframe>`;
    $("#docModalBody").html(iframe);
    $("#docModal").modal("show");
}

function diplayDocLabo__(idenvoie_labo) {
    $("#docModal").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    $.ajax({
        url: base+'viewDocumentLabo', // URL to the controller method
        type: 'POST',
        dataType: 'json',
        data: {idenvoie_labo: idenvoie_labo},
        success: function(response) {
            if (response.status === 'success') {
                // Populate the modal body with the fetched content
                let content = '';
                if (response.document_type === 'application/pdf') {
                    // Display PDF (assuming the content is a base64-encoded PDF)
                    content = `<embed src="data:application/pdf;base64,${response.document_content}" width="100%" height="600px" type="application/pdf">`;
                } else  {
                    // Use Microsoft Office Online Viewer to display Word, PowerPoint, and Excel files
                    // var officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=data:${response.document_type};base64,${response.document_content}`;
                    // content = `<a href="data:${response.document_type};base64,${response.document_content}" download="${response.document_name}">Download Document</a>`;
                    // content = `<iframe src="${officeViewerUrl}" width="100%" height="600px" frameborder="0"></iframe>`;
                    let blobUrl = createBlobUrl(response.document_content, response.document_type);
                    let googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(blobUrl)}&embedded=true`;

                    let content = `<iframe src="${googleViewerUrl}" width="100%" height="500px" style="border: none;"></iframe>`;
                    console.log();
                    
                    $("#docModalBody").html(content);
                }

                // $('#docModalBody').html(content);
            } 
        },
        error: function(xhr, status, error) {
            // Handle AJAX errors
            $('#docModalBody').html('<p>Error loading document.</p>');
        }
    });
}
function createBlobUrl(base64, mimeType) {
    let binary = atob(base64);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    let blob = new Blob([new Uint8Array(array)], { type: mimeType });
    return URL.createObjectURL(blob);
}


$("#form_analyse").off("submit").on("submit", function (e) {

    e.preventDefault();
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    var fileInput = $('#fichierAnalyse')[0]; // Assurez-vous que l'élément de fichier est dans le DOM

    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];

        // Vérification de la taille du fichier (3 Mo max)
        // if (file.size > 3 * 1024 * 1024) {
        //     alert('Le fichier ne doit pas dépasser 3 Mo.');
        //     return;
        // }

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
            alert('Le fichier doit être un PDF, un document Word, une présentation PowerPoint ou un fichier Excel.');
            return;
        }
    }

    let data = new FormData(this);

    if (typeEnvoie == "visite") {
        data.append('idType', detailConsultationId);
    } else {
        data.append('idType', iddetail);
        
    }

    data.append('idenvoie_labo', id_labo);
 
    data.append('typeDestinataire', typeDestinataire);
    data.append('type', "visite");



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
        url: base + "valider_envoie_labo",
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
        }, success: function (res) {
            alertCustom("success", 'ft-check', "Validation effectué avec succée");
            $("#validelabothead").unblock();
            $('#valideLabo').modal('hide');

            if (typeEnvoie == "visite") {

                fill_labo(detailConsultationId , typeEnvoie);
                listes_detail_consultation();
                liste_consultation_all();

             } else {
         
                 fill_labo(iddetail , typeEnvoie);
                 fill_consult(idCpn);
                 liste_cpn();
                 
             }
        },
    });
});

function downloadFile(id) {
    // Sélectionnez l'élément de fichier pour vérifier ses propriétés

    $.ajax({
        // url: base + "downloadFile",
        url: base + "viewDocumentLabo",
        data: {
            fileName: $("#idlabed" + id).data("file"),
            id : id
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


function valider_demande(id, idType1) {

    id_labo = id;

    $('#fichierAnalyse').val("");

    $("#valideLabo").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}


function charge_laboratoire_echographie() {
    $.ajax({
        beforeSend: function () {

            $("#modal_laboratoire").block({
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
        url: base + 'charge_laboratoire_echographie',
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        data: { type: $("#type_destinataire").val() },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#placeEchoLabo").empty();
            $("#placeEchoLabo").html(data);

            if ($("#type_destinataire").val() == "Echographie") {

                $("#submitEchoLabo").text("Envoyer à l'échographie");
                $('#typeEchographie').selectpicker('refresh');

                charge_doc_echographie();
                if (typeechographie != "" && typeechographie != null) {
                    $('#typeEchographie').val(typeechographie).selectpicker('refresh');
                }
                $("#hideValidLabo").show();

            }
            else if ($("#type_destinataire").val() == "Laboratoire") {

                $("#submitEchoLabo").text("Envoyer au laboratoire");
                charge_analyse();
                $("#hideValidLabo").show();

            } else {
                $("#modal_laboratoire").unblock();
                $("#hideValidLabo").hide();

            }




        }
    });
}

function charge_analyse() {
    $.ajax({
        url: base + 'charge_analyse',
        type: "POST",
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#analyse_select").empty();
            $("#analyse_select").append(data);
            $("#analyse_select").selectpicker('refresh');
            if (analyse_select != "" && analyse_select != null) {
                $('#analyse_select').val(analyse_select).selectpicker('refresh');
            }
            $("#modal_laboratoire").unblock();

        }
    });

}

function charge_doc_echographie() {
    $.ajax({
        url: base + 'charge_doc_echographie',
        type: "POST",
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            $("#docteurEchographie").empty();
            $("#docteurEchographie").html(data);
            $('#docteurEchographie').selectpicker('refresh');
            if (docteurEchographie != "" && docteurEchographie != null) {
                $('#docteurEchographie').val(docteurEchographie).selectpicker('refresh');
            }

            $("#modal_laboratoire").unblock();

        }
    });

}



$('#type_destinataire').on('change', function () {

    charge_laboratoire_echographie();


});




function edit_laboratoire(id) {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $("#AddLaboratoire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    var nature = $("#labedit" + id).data('nature');
    typeDestinataire = $("#labedit" + id).data("typedestinataire");
    var typeecho = $("#labedit" + id).data("typeechographie");
    var doc = $("#labedit" + id).data("docteurechographie");

    analyse_select = nature;
    docteurEchographie = doc;
    typeechographie = typeecho;

    $("#type_destinataire").val(typeDestinataire).selectpicker("refresh");


    charge_laboratoire_echographie();
    id_labo = id;
    var rc = $("#labedit" + id).data('rc');
    //var resultats = $("#labedit" + id).data('resultats');

    $('#rc').val(rc);
    //$('#resultats').val(resultats);

}


function laboratoire() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $("#AddLaboratoire").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    $('#add_examen').find(':input:not([type="submit"], [type="hidden"])').each(function () {
        if ($(this).is('select.selectpicker')) {
            $(this).selectpicker('val', []); // Réinitialiser le selectpicker
        } else {
            $(this).val('');
        }
    });
    charge_laboratoire_echographie();
    id_labo = "";

}


$("#add_examen").off("submit").on("submit", function (e) {
    e.preventDefault();

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    let data = new FormData(this);
    data.append('idenvoie_labo', id_labo);
    data.append('typeEnvoie', typeEnvoie);

    if (typeEnvoie == "visite") {

       data.append('idDetails', detailConsultationId);

    } else {
        data.append('idDetails', iddetail);
        data.append('idCpn', idCpn);

        
    }

    $.ajax({
        beforeSend: function () {
            $("#modal_laboratoire").block({
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
        url: base + "add_Examen",
        type: "POST",
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#modal_laboratoire").unblock();

        }, success: function (res) {

            $("#modal_laboratoire").unblock();
            $("#AddLaboratoire").modal("hide"
            );
            alertCustom("success", "ft-check", "Demande d'examen envoyé");

            if (typeEnvoie == "visite") {

                fill_labo(detailConsultationId , typeEnvoie);
                listes_detail_consultation();
                liste_consultation_all();

             } else {
         
                 fill_labo(iddetail , typeEnvoie);
                 fill_consult(idCpn);
                 liste_cpn();
                 
             }

            

        },
    });
});



function delete_labo(id) {

    id_labo = id;
    typeDestinataire = $("#labedit" + id).data("typedestinataire");
    $("#deletelabo").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}


function renvoyer_labo(id) {

    id_labo = id;
    typeDestinataire = $("#labedit" + id).data("typedestinataire");

    $("#renvoyelabo").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}



function renvoye_laboExam() {

    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;

    $("#deleenv").block({
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

    var idall ;
    var idcpnparent ;

    if (typeEnvoie == "visite") {

         idall  = detailConsultationId;

     } else {
 
         idall = iddetail ;
         idcpnparent = idCpn;
         
     }

    $.ajax({
 complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
        },
        url: base + "renvoye_labo",
        type: "POST",
        dataType: "JSON",
        data: { id_labo: id_labo, iddetail: idall, idCpn : idcpnparent ,  type: typeEnvoie, typeDestinataire: typeDestinataire },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {

            $("#deleenv").unblock();
            $("#renvoyelabo").modal(
                "hide"
            );

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Renvoie effectué avec succée");

                if (typeEnvoie == "visite") {

                    fill_labo(detailConsultationId , typeEnvoie);
                    listes_detail_consultation();
                    liste_consultation_all();
    
                 } else {
             
                     fill_labo(iddetail , typeEnvoie);
                     fill_consult(idCpn);
                     liste_cpn();
                     
                 }

            } else {

                alertCustom("danger", 'ft-x', "Renvoie non effectué");

            }



        },
    });

}

function delete_laboExam() {
    if (enCours) return; // Empêche un deuxième clic si une requête est en cours
    enCours = true;
    $("#dellab").block({
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

    var idall ;

    if (typeEnvoie == "visite") {

         idall  = { id_labo: id_labo, iddetail: detailConsultationId, type: typeEnvoie, typeDestinataire: typeDestinataire };
         
    } else {
            
        idall  = { id_labo: id_labo, iddetail: iddetail, type: typeEnvoie, typeDestinataire: typeDestinataire , idcpn : idCpn };
         
     }

    $.ajax({
        complete: function() {
            enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
            $("#dellab").unblock();

        },
        url: base + "delete_labo",
        type: "POST",
        dataType: "JSON",
        data: idall,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {

            $("#dellab").unblock();

            $("#deletelabo").modal(
                "hide"
            );

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");

                if (typeEnvoie == "visite") {

                    fill_labo(detailConsultationId , typeEnvoie);
                    listes_detail_consultation();
                    liste_consultation_all();
    
                 } else {
             
                     fill_labo(iddetail , typeEnvoie);
                     fill_consult(idCpn);
                     liste_cpn();
                     
                 }

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }



        },
    });

}



