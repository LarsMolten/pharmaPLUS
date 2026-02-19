

$(document).ready(function () {
    $('select').selectpicker('refresh');
    charge_membre();
    $("#detailGlobal").insertAfter("#createTitulaireModel");
});

function charge_membre() {
    $.ajax({
        url: base + 'charge_membreTitulaire',
        type: "POST",
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (data) {
            $(data).find('option').addClass('option-membre');
            $("#membre_choix").empty();
            $("#membre_choix").append(data);
            $("#membreId").append(data);
            $('select').selectpicker('refresh');  

            var firstOptionValue = $("#membre_choix option:eq(2)").val();
            $("#membre_choix").selectpicker('val', firstOptionValue);
            listeTitulaire();

        }
    });
}

$("#membre_choix").on('change', function name(params) {
    listeTitulaire();
})

// *** affichage titulaire ----------------
function listeTitulaire() {
    var membreId = $("#membre_choix").val();
    $.ajax({
        beforeSend: function () {

            $("#card-titulaire").block({
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
        url: base + "listesTitulaire",
        type: "POST",
        data: {membreId:membreId},
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if ($.fn.DataTable.isDataTable("table-titulaire")) {
                $("#table-titulaire").DataTable().destroy();
            }
            $('#table-titulaire').empty();
            $("#table-titulaire").append(res);
            $('#table-titulaire').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "asc"]],
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
                    {
                        className: "btn btn-sm mr-1 btn-secondary btn-min-width ",
                        text: '<i class="ft-refresh"> Actualiser</i>',
                        action: function () {
                            listeTitulaire();
                        },
                    },
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {
                            $('.entete_modal').text("Nouveau Titulaire");
                            $('#btn_add_titualire').text("Ajouter");
                            $("#createTitulaireModel").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                            );                           
                            $('#createTitulaireForm')[0].reset();
                            $("#id_titualire_men_modif").val("");
                            $("#affichePhotoTitulaire").text("Photo AFFILIE(E)");
                            $("#affichePhotoConjoint").text("Photo CONJOINT(E)");
                            $("#removeImageTitulaire").attr("disabled", true);
                            $("#removeImageConjoint").attr("disabled", true);
                        },
                    },
                ],
            });
            $("#card-titulaire").unblock();

        },
    });
}
//----- Fin liste Titulaire -------------------------------


// ------ ajout Titualaire ----------------------
$("#createTitulaireForm").off("submit").on("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    var photo = $("#photo")[0].files[0];
    var photoConjoint = $("#photoConjoint")[0].files[0];
    var url = "ajout_titulaire";
    //verifier si c'st modifier
    if ($('#titulaireId').val() != 0) {
        url = "update_titulaire";
        if (!photo) {                   
            var nomPhoto = $('#labelImageTitulaire').html();
            formData.append("photo", nomPhoto);                          
        }
        if (!photoConjoint) {
            var nomPhotoConjoint = $('#labelImageConjoint').html();
            formData.append("photoConjoint", nomPhotoConjoint);   
        }
    }
    if (photo) {
        // Vérifiez le type de fichier et la taille
        if (!photo.type.startsWith('image/') || photo.size > 10485760) {
            alert("Veuillez selectionner une image avec une talle < 10Mo");
            return;
        }else{            
            formData.append("photo", photo);                
        }
    }if (photoConjoint) {
        if (!photoConjoint.type.startsWith('image/') || photoConjoint.size > 10485760) {
            alert("Veuillez selectionner une image avec une talle < 10Mo");
            return;
        }else{
            formData.append("photoConjoint", photoConjoint);                
        }
    }
    
    $.ajax({
        beforeSend: function () {
            $("#modal_content_add_titulaire").block({
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
            if (res.success) {
                if ($('#btn_add_titualire').text() === "Modifier") {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                    listeTitulaire();
                    annulerAjoutTitulaire();
                    $("#createTitulaireModel").modal("hide");               
                }
                else {            
                    annulerAjoutTitulaire();
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    listeTitulaire();
                    $("#createTitulaireModel").modal("hide");
                }                
            }
            else{                
                alertCustom("danger", "ft-check", res.message);                
            }
            $("#modal_content_add_titulaire").unblock();
        }
    });
});
//-----FIn ajout Titulaire-----------------------------------------

/** Ajiuter enfant */
$("#createEnfantForm").off("submit").on("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    var photoEnfant = $("#photoEnfant")[0].files[0];
    var url = "ajout_enfant";
    if ($('#btn_add_enfant').text() == "Modifier") {
        url = "update_enfant";
        if (!photoEnfant) {
            var nomPhotoEnfant = $('#labelImageEnfantIn').html();
            formData.append("photoEnfant", nomPhotoEnfant);   
        }
    }
    if (photoEnfant) {
        if (!photoEnfant.type.startsWith('image/') || photoEnfant.size > 10485760) {
            alert("Veuillez selectionner une image avec une talle inferieur à 10Mo");
            return;
        }else{
            formData.append("photoEnfant", photoEnfant);                
        }
    }  
    $.ajax({
        beforeSend: function () {
            $("#modal_content_add_enfant").block({
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
        url: base+url,
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: formData,
        success: function (res) {
            var titulaireId = $('#titulaireIdEnfant').val();
            if (res.success) {
                if ($('#btn_add_enfant').text() === "Modifier") {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                }
                else {            
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                }                
            }
            listeEnfant(titulaireId);
            annulerAjoutTitulaire();
            $("#createEnfantModel").modal("hide");
            $("#modal_content_add_enfant").unblock();
            $("#detailTitulaireModel").unblock();
            $("#listeEnfantModal").unblock()

        },
        error: function(xhr, status, error) {
            alertCustom("danger", "ft-check", "Non Effectué, Contactez le responsable");
            $("#createEnfantModel").modal("hide");
            $("#modal_content_add_enfant").unblock();
            $("#detailTitulaireModel").unblock();
            $("#listeEnfantModal").unblock()
        }
    });
});
/** Fin Ajout Enfant ***************************** */

/** On Click sur annuler */
function close_del_titulaire() {
    $("#card-titulaire").unblock();
    $("#card-enfant").unblock();
    $("#listeEnfantModal").unblock()
}
/** Fin On click ************************************** */

// *** Affiche dialog suppression delete
function deleteTitulaire(id) {
    $("#card-titulaire").block({
        message: `
            <div class="card" style="max-width:400px ; ">
                <div class="card-header" style="max-width:400px ;">
                    <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
                </div>
                <div class="card-content">
                    <div class="card-body">
                        <p>Voulez-vous supprimer ?</p>  
                        <button type="button" onclick="delete_titulaire_from_dialog(`+ id + `)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                        <button type="button" onclick="close_del_titulaire()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>
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
/****************************************** */

/** Affiche Modal Delete Enfant */
function deleteEnfant(id, titulaireId) {
    $("#card-enfant").block({
        message: `
            <div class="card" style="width:400px ; ">
                <div class="card-header" style="width:400px ;">
                    <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
                </div>
                <div class="card-content">
                    <div class="card-body">
                        <p>Voulez-vous supprimer ?</p>  
                        <button type="button" onclick="delete_enfant_from_dialog(`+id+`,`+titulaireId+`)" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                        <button type="button" onclick="close_del_titulaire()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>
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
/********************************************************** */

/** suppression apres boite dialogue de suppression ****/
function delete_titulaire_from_dialog(id) {
    // $("#card-titulaire").unblock();
    $.ajax({
        beforeSend: function () {
            $("#card-titulaire").block({
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
        url: base + "delete_titulaire",
        type: "POST",
        dataType: "JSON",
        data: { titulaireId: id },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            $("#card-titulaire").unblock();
            if (res.id > 0) {
                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
            } else {
                alertCustom("danger", 'ft-x', "Suppression non effectué");
            }
            listeTitulaire();
        },
    });
}
/*********************************************************************** */

/** Delete Enfant apres Dialogue */
function delete_enfant_from_dialog(id, titulaireId) {
    // $("#card-enfant").unblock();
    $.ajax({
        beforeSend: function () {
            $("#card-enfant").block({
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
        url: base + "delete_enfant",
        type: "POST",
        dataType: "JSON",
        data: { enfantId: id },
        success: function (res) {
            $("#card-enfant").unblock();
            if (res.id > 0) {
                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
            } else {
                alertCustom("danger", 'ft-x', "Suppression non effectué");
            }
            listeEnfant(titulaireId);
        },
    });
}
/*********************************************************************** */

// ***** modification Titulaire *******/
function editTitulaire(id) {

    $.ajax({
        url: base + "getTitulaireById",
        type: 'POST',
        dataType: 'JSON',
        data: { titulaireId: id }, 
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function(res) {
            var titulaire = res.data[0];
            $('#titulaireId').val(titulaire.titulaireId);
            $('#membreId').val(titulaire.membreId);
            $('select').selectpicker('refresh');
            $('#numCnaps').val(titulaire.numCnaps);
            $('#nom').val(titulaire.nom);
            $('#prenom').val(titulaire.prenom);
            $('#genre').val(titulaire.genre);
            $('select').selectpicker('refresh');
            $('#dateNaiss').val(titulaire.dateNaiss);
            $('#telephone').val(titulaire.telephone);
            $('#cin').val(titulaire.cin);
            $('#adresse').val(titulaire.adresse);
            $('#fonction').val(titulaire.fonction);
            $('#dateEmbauche').val(titulaire.dateEmbauche);
            $('#dateDebauche').val(titulaire.dateDebauche);          
            $('#email').val(titulaire.email);
            $('#nomPrenomConjoint').val(titulaire.nomPrenomConjoint);
            $('#dateNaissConjoint').val(titulaire.dateNaissConjoint);
            $('#telephoneConjoint').val(titulaire.telephoneConjoint);
            $('#fonctionConjoint').val(titulaire.fonctionConjoint);
            $('#genreConjoint').val(titulaire.genreConjoint);
            $('select').selectpicker('refresh');
            
            $('#labelImageTitulaireIn').val(res.data.imageTitu);
            $('#labelImageConjointIn').val(res.data.imageCo);
            $("#affichePhotoTitulaire").html(res.data.detailPhotoTitulaire);
            $("#affichePhotoConjoint").html(res.data.detailPhotoConjoint);
            if (res.data.detailPhotoTitulaire == 'Pas de Photo') {
                $("#removeImageTitulaire").attr("disabled", true);
            }else{
                $("#removeImageTitulaire").attr("disabled", false);    
            }
            if (res.data.detailPhotoConjoint == 'Pas de Photo') {
                $("#removeImageConjoint").attr("disabled", true);
            }else{
                $("#removeImageConjoint").attr("disabled", false);
            }
            $('.entete_modal').text("Modification");
            $('#btn_add_titualire').text("Modifier");
            $("#createTitulaireModel").modal(
                { backdrop: "static", keyboard: false },
                "show"
            );
        },
        error: function(xhr, status, error) {
            console.log("Erreur lors de la récupération des données :", error);
        }
    });
}
/******************************************** */

/** Modification Enfant */
function editerEnfant(id, titulaireId) {

    $.ajax({
        url: base + "getEnfantById", // L'URL du contrôleur qui renvoie les données du titulaire
        type: 'POST',
        dataType: 'JSON',
        data: { enfantId: id}, // Passer l'id du titulaire à l'URL
        success: function(res) {
            var enfant = res.data[0];
            
            // Remplir les champs du formulaire avec les données du titulaire
            $('#titulaireIdEnfant').val(enfant.titulaireId);
            $('#enfantId').val(enfant.enfantId);
            $('#nomEnfant').val(enfant.nom);
            $('#prenomEnfant').val(enfant.prenom);
            $('#fonctionEnfant').val(enfant.fonction);
            $('#genreEnfant').val(enfant.genre);
            $('select').selectpicker('refresh');
            $('#dateNaissEnfant').val(enfant.dateNaiss);
            $('#typeEnfant').val(enfant.typeEnfant);          
            $('select').selectpicker('refresh');

            $('#labelImageEnfantIn').val(res.data.imageCo);
            $("#affichePhotoEnfant").html(res.data.detailPhotoEnfant);
            console.log(res.data.imageCo);
            
            if (res.data.detailPhotoEnfant == 'Pas de Photo') {
                $("#removeImageEnfant").attr("disabled", true);
            }else{
                $("#removeImageEnfant").attr("disabled", false);
            }

            $('.entete_modal').text("Modification");
            $('#btn_add_enfant').text("Modifier");
            $("#listeEnfantModal").block();
            $("#createEnfantModel").modal(
                { backdrop: "static", keyboard: false },
                "show"
            );
        },
        error: function(xhr, status, error) {
            // Gestion des erreurs
            console.log("Erreur lors de la récupération des données :", error);
        }
    });
}
/******************************************** */

//*******************ANNULATION BUTTTON */
function annulerAjoutTitulaire() {
    $('#createTitulaireForm')[0].reset();
    $('#createEnfantForm')[0].reset();
    $("#detailTitulaireModel").unblock();
    $("#listeEnfantModal").unblock()
    $("#titulaireId").val("");
    $("#labelImageTitulaire").html("");
    $("#membreId").val("");
    $('select').selectpicker('refresh');
}
//-------------------------------------------------

//** Metrre Non Assuré */
function nomAssure(id) {
    $("#card-titulaire").block({
        message: `
          <div class="card" style="max-width:400px ; ">
            <div class="card-header">
                Veuillez entrer le motif Non Assuré
            </div>
            <div class="card-content">
                <div class="card-body">                  
                    <form id="submitTitulaireToNonAssure">
                        <input type="hidden" id='idTitulaireToNonAssure' value="${id}" />
                        <textarea name="motifNonAssure" required id="motifNonAssure"  class="form-control input-sm" cols="3" rows="3" placeholder="motif de non Assuré"></textarea><br>
                        <button type="submit" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Confirmer</button>
                        <button type="button" onclick="unblockCard()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>
                    </form>  
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

    $("#submitTitulaireToNonAssure").off("submit").on("submit", function (e) {
        e.preventDefault();    
        let id = $("#idTitulaireToNonAssure").val();
        let motif = $("#motifNonAssure").val();    
        $("#card-titulaire").unblock();
        $.ajax({
            beforeSend: function () {    
                $("#card-titulaire").block({
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
            url: base + "toNonAssure",
            type: "POST",
            dataType: "JSON",
            data: { titulaireId: id , motifNonAssure : motif},
            success: function (res) {    
                $("#card-titulaire").unblock();    
                if (res.id > 0) {    
                    alertCustom("success", 'ft-check', "Titulaire devient non Assuré");    
                } else {    
                    alertCustom("danger", 'ft-x', "Non effectué");
                }    
                listeTitulaire();    
            },
            error: function(message) {
                alertCustom("danger", 'ft-x', "Non effectué");
            }
        });
    });
}
//************************************* */

//** Metrre Non Assuré Enfant */
function nomAssureEnfant(id, titulaireId) {
    $("#card-enfant").block({
        message: `
          <div class="card" style="max-width:400px ; ">
            <div class="card-header">
                Veuillez entrer le motif Non Assuré
            </div>
            <div class="card-content">
                <div class="card-body">                  
                    <form id="submitEnfantToNonAssure">
                        <input type="hidden" id='idEnfantToNonAssure' value="${id}" />
                        <textarea name="motifNonAssureEnfant" required id="motifNonAssureEnfant"  class="form-control input-sm" cols="3" rows="3" placeholder="motif de non Assuré"></textarea><br>
                        <button type="submit" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Confirmer</button>
                        <button type="button" onclick="unblockCard()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>
                    </form>  
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

    $("#submitEnfantToNonAssure").off("submit").on("submit", function (e) {
        e.preventDefault();    
        let id = $("#idEnfantToNonAssure").val();
        let motif = $("#motifNonAssureEnfant").val();    
        $("#card-enfant").unblock();
        $.ajax({
            beforeSend: function () {    
                $("#card-enfant").block({
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
            url: base + "toNonAssureEnfant",
            type: "POST",
            dataType: "JSON",
            data: { enfantId: id , motifNonAssureEnfant : motif},
            success: function (res) {    
                $("#card-enfant").unblock();    
                if (res.id > 0) {    
                    alertCustom("success", 'ft-check', "Enfant devient non Assuré");    
                } else {    
                    alertCustom("danger", 'ft-x', "Non effectué, Veuillez Contecter l'administrateur");
                }    
                listeEnfant(titulaireId);    
            },
            error: function(message) {
                alertCustom("danger", 'ft-x', "Non effectué, Veuillez Contecter l'administrateur");
                $("#card-enfant").unblock();    
            }
        });
    });
}
//************************************* */

//** Metrre Assuré */
function assure(id) {
    $("#card-titulaire").block({
        message: `
          <div class="card" style="max-width:400px ; ">
            <div class="card-header">
                Veuillez entrer le motif Asssuré
            </div>
            <div class="card-content">
                <div class="card-body">                  
                    <form id="submitTitulaireToAssure">
                        <input type="hidden" id='idTitulaireToAssure' value="${id}" />
                        <textarea name="motifAssure" required id="motifAssure"  class="form-control input-sm" cols="3" rows="3" placeholder="motif Assuré"></textarea><br>
                        <button type="submit" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Confirmer</button>
                        <button type="button" onclick="unblockCard()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>
                    </form>  
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

    $("#submitTitulaireToAssure").off("submit").on("submit", function (e) {
        e.preventDefault();    
        let id = $("#idTitulaireToAssure").val();
        let motif = $("#motifAssure").val();    
        $("#card-titulaire").unblock();
        $.ajax({
            beforeSend: function () {    
                $("#card-titulaire").block({
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
            url: base + "toAssure",
            type: "POST",
            dataType: "JSON",
            data: { titulaireId: id , motifNonAssure : motif},
            success: function (res) {    
                $("#card-titulaire").unblock();    
                if (res.id > 0) {    
                    alertCustom("success", 'ft-check', "Titulaire devient Assuré");    
                } else {    
                    alertCustom("danger", 'ft-x', "Non effectué");
                }    
                listeTitulaire();    
            },
            error: function(message) {
                alertCustom("danger", 'ft-x', "Non effectué");
            }
        });
    });
}
//************************************* */

//** Metrre Assuré Enfant */
function assureEnfant(id, titulaireId) {
    $("#card-enfant").block({
        message: `
          <div class="card" style="max-width:400px ; ">
            <div class="card-header">
                Veuillez entrer le motif Assuré
            </div>
            <div class="card-content">
                <div class="card-body">                  
                    <form id="submitEnfantToAssure">
                        <input type="hidden" id='idEnfantToAssure' value="${id}" />
                        <textarea name="motifAssureEnfant" required id="motifAssureEnfant"  class="form-control input-sm" cols="3" rows="3" placeholder="motif de Assuré"></textarea><br>
                        <button type="submit" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Confirmer</button>
                        <button type="button" onclick="unblockCard()" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>
                    </form>  
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

    $("#submitEnfantToAssure").off("submit").on("submit", function (e) {
        e.preventDefault();    
        let id = $("#idEnfantToAssure").val();
        let motif = $("#motifAssureEnfant").val();    
        $("#card-enfant").unblock();
        $.ajax({
            beforeSend: function () {    
                $("#card-enfant").block({
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
            url: base + "toAssureEnfant",
            type: "POST",
            dataType: "JSON",
            data: { enfantId: id , motifAssureEnfant : motif},
            success: function (res) {    
                $("#card-enfant").unblock();    
                if (res.id > 0) {    
                    alertCustom("success", 'ft-check', "Enfant devient non Assuré");    
                } else {    
                    alertCustom("danger", 'ft-x', "Non effectué, Veuillez Contecter l'administrateur");
                }    
                listeEnfant(titulaireId);    
            },
            error: function(message) {
                alertCustom("danger", 'ft-x', "Non effectué, Veuillez Contecter l'administrateur");
                $("#card-enfant").unblock();    
            }
        });
    });
}
//************************************* */

//** Unblock card */
function unblockCard() {
    $("#card-titulaire").unblock();
    $("#card-enfant").unblock();
}
//************************************** */

/** Dedtail titulaire*/
function detailTitulaire(id){
    $.ajax({
        beforeSend: function () {
            $("#detailGlobal").block({
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
        url: base + "getTitulaireById", // L'URL du contrôleur qui renvoie les données du titulaire
        type: 'POST',
        dataType: 'JSON',
        data: { titulaireId: id }, // Passer l'id du titulaire à l'URL
        success: function(res) {
            var titulaire = res.data[0];
            // Mettez à jour le contenu du modal avec les données de `res`
            $("#detailTitulaireId").val(titulaire.titulaireId);
            $("#detailNumTitualireGenere").text(res.data.numCartGenere);
            $("#detailNumCnaps").text(titulaire.numCnaps);
            $("#detailNom").text(titulaire.nom);
            $("#detailPrenom").text(titulaire.prenom);
            $("#detailGenre").text(titulaire.genre);
            $("#detailDateNaiss").text(titulaire.dateNaiss);
            $("#detailTelephone").text(titulaire.telephone);
            $("#detailCin").text(titulaire.cin);
            $("#detailFonction").text(titulaire.fonction);
            $("#detailAdresse").text(titulaire.adresse);
            $("#detailEmail").text(titulaire.email);
            $("#detailMembre").text(res.data.nomMembre);
            $("#detailDateEmbauche").text(titulaire.dateEmbauche);
            $("#detailDateDebauche").text(titulaire.dateDebauche);
            $("#detailNomPrenomConjoint").text(titulaire.nomPrenomConjoint);
            $("#detailDateNaissConjoint").text(titulaire.dateNaissConjoint);
            $("#detailTelephoneConjoint").text(titulaire.telephoneConjoint);
            $("#detailGenreConjoint").text(titulaire.genreConjoint);
            $("#detailMotifNonAssure").text(titulaire.motifNonAssure);
            $("#detailFonctionConjoint").text(titulaire.fonctionConjoint);           
            $("#detailPhotoTitulaire").html(res.data.detailPhotoTitulaire);
            $("#detailPhotoConjoint").html(res.data.detailPhotoConjoint);
            $("#detaiNbrEnfant").text(res.data.nbrEnfant);

            $("#detailGlobal").unblock();
        }
    })
}
/************************************************ */


/** Detal titulaire Global */
function detailTitulaireGlobal(id) {

    $('.nav-tabs .nav-link').removeClass('active').first().addClass('active');
    
    $('.tab-content .tab-pane').removeClass('active').first().addClass('active');

    idCpn = id ;

    formatPrixImput();

    $("#detailGlobal").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


    detailTitulaire(id);
    listeEnfant(id);

}
/*************************************** */

/** Listes des enfant */
function listeEnfant(titulaireId){

    $.ajax({
        beforeSend: function () {
            $("#card-enfant").block({
                message: '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin-left:70% ; font-size : 13px !important"></div>',
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
        url: base + "listeEnfant", // L'URL du contrôleur qui renvoie les données du titulaire
        type: 'POST',
        data: { titulaireId: titulaireId }, // Passer l'id du titulaire à l'URL
        success: function(res) {
            
            if ($.fn.DataTable.isDataTable("table-enfant")) {
                $("#table-enfant").DataTable().destroy();
            }
            $('#table-enfant').empty();
            $("#table-enfant").append(res);
            $('#table-enfant').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "asc"]],
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
                    {
                        className: "btn btn-sm mr-1 btn-secondary btn-min-width ",
                        text: '<i class="ft-refresh"> Actualiser</i>',
                        action: function () {
                            listeEnfant(titulaireId);
                        },
                    },
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {
                            $("#listeEnfantModal").block();
                            
                            $('.entete_modal').text("Nouveau Enfant");
                            $('#btn_add_enfant').text("Ajouter");
                            $('#createEnfantForm')[0].reset();
                            $('#enfantId').val("");
                            $('#labelImageEnfantIn').val("");
                            $("#affichePhotoEnfant").text("Photo");
                            $("#createEnfantModel").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                            );                           
                            $('#titulaireIdEnfant').val(titulaireId);
                        },
                    },
                ],
            });

            $("#card-enfant").unblock();
        }
    })
}
/***************************************************** */

/** Imprimer carte 1 */
function imprimerCarte1(){
    var titulaireId = $("#detailTitulaireId").val();
    $.ajax({
        beforeSend: function () {
            $("card-titulaire").block({
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
        url: base + 'imprimerCarte1',
        dataType: 'json',
    
        type: 'POST',
        data: { titulaireId: titulaireId},
        success: function (file) {
            $("#card-titulaire").unblock();
            window.open(file.file);
            alertCustom("success", 'ft-check', "Bien imprimé");
        },
        error: function (data) {
            $("#card-titulaire").unblock();
            alertCustom("danger", 'ft-check', "Non imprimer");
        }
    });
}
/********************************************************** */

/** Imprimer carte 2 (Verso)) */
function imprimerCarte2(){
    var titulaireId = $("#detailTitulaireId").val();
    $.ajax({
        beforeSend: function () {
            $("card-titulaire").block({
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
        url: base + 'imprimerCarte2',
        dataType: 'json',
    
        type: 'POST',
        data: { titulaireId: titulaireId},
        success: function (file) {
            $("#card-titulaire").unblock();
            window.open(file.file);
            alertCustom("success", 'ft-check', "Bien imprimé");
        },
        error: function (data) {
            $("#card-titulaire").unblock();
            alertCustom("danger", 'ft-check', "Non imprimer");
        }
    });
}
/********************************************************** */