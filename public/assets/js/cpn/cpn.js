
var membre_select ;
var titulaire_select ;
var specialite_docteur ;
var choix_docteur ;
var personne_selectcpn ;

$(document).ready(function () {
    $('select').selectpicker('refresh');
    
    if (idtypeconsult == 19 || idtypeconsult == 20) {
        
        $("#date_debut").val(dateDebutISO30);
        
    } else {
        $("#date_debut").val(dateDebutISO);
        
    }
        
    
    $("#date_fin").val(dateFinISO);
    liste_cpn();

    if ([19,20 , 4].includes(idtypeconsult)) { // tous etape
       
    }else{

        charge_membre1();
        charge_membre();
    }   

});

$(document).on("click", "#patientetranger", function () {
    if ($(this).is(":checked")) {
        $("#afficheInputpatientetranger").show();
        $("#nom").attr("required", "required");

        $("#afficheInputpatient").css("display", "none");
        $("#membre_select").removeAttr("required");
        $("#titulaire_select").removeAttr("required");
        $("#personne_selectcpn").removeAttr("required");
    } else {
        $("#afficheInputpatientetranger").hide();
        $("#nom").removeAttr("required");

        $("#afficheInputpatient").show();
        $("#membre_select").attr("required", "required");
        $("#titulaire_select").attr("required", "required");
        $("#personne_selectcpn").attr("required", "required");
    }
});

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
            if (membre_select != "" && membre_select != null) {
                $('#membre_select').val(membre_select).selectpicker('refresh');
                charge_titulaire_coix()
            }
        }
    });
  }

function charge_titulaire_coix() {
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
            if ( titulaire_select != "" && titulaire_select != null) {
                $('#titulaire_select').val(titulaire_select).selectpicker('refresh');
                charge_personne_malade();
            }
            $("#modal_visites").unblock();
  
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
            $("#personne_selectcpn").empty();
            $("#personne_selectcpn").append(data);
            $('select').selectpicker('refresh');
            if ( personne_selectcpn != "" && personne_selectcpn != null) {
                $('#personne_selectcpn').val(personne_selectcpn).selectpicker('refresh');
            }
            $("#modal_visites").unblock();
  
        }
    });
}





$("#membre_select").on('change', function name(params) {
    
    charge_titulaire_coix();
})
$("#titulaire_select").on('change', function name(params) {
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
    charge_personne_malade();
})





// ***********************************liste consultation

function liste_cpn() {


    $.ajax({
        beforeSend: function () {

            $("#card_cpn").block({
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
        url: base + "liste_cpn",
        type: "POST",
        data:{
            id_membre :  $('#membre_choix').val() ,
            date_debut :  $('#date_debut').val() ,
            date_fin :  $('#date_fin').val(),
            idtypeconsult : idtypeconsult
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            
            var res = JSON.parse(res);


            if ($.fn.DataTable.isDataTable("#table_cpn")) {
                $("#table_cpn").DataTable().destroy();
            } else {
            }
            $('#table_cpn').empty();
            $("#table_cpn").append(res.table);


            $('#table_cpn').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "desc"]],
                responsive: true,
                info: false,
                paging: true,
                autoWidth: true,

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
                        className: "btn btn-sm mr-1 btn-secondary",
                        text: '<i class="ft-rotate-cw"> </i>',
                        action: function () {

                            liste_cpn();

                        },
                    },

                 
                    {
                        className: "btn btn-sm mr-1 btn-warning btn-min-width ",
                        text: '<i class="ft-plus"> Ajouter</i>',
                        action: function () {
                            $("#modal_visites").unblock();

                            $('#id_cpnfirt').val('');

                            $('#add_consultation').find(':input:not([type="submit"], [type="hidden"]):not([type="radio"])').each(function() {
                                if ($(this).is('select.selectpicker')) {
                                    // Réinitialiser le selectpicker en vidant les sélections
                                    $(this).selectpicker('val', []);
                                } else {
                                    // Réinitialiser les autres champs en vidant leur valeur
                                    $(this).val('');
                                }
                            });
                            $("#patientetranger").prop('checked', false);
                            $("input[name='mariee']").prop('checked', false);
                            $("#afficheInputpatientetranger").hide();
                            $("#nom").removeAttr("required");
                            $("#nom").val("");
                            $("#prenom").val("");
                            $("#genre").val("Femme");
                            $('#genre').selectpicker('refresh'); 
                            $("#adresse").val("");
                            $("#checkTitulaire").val('');

                            $("#afficheInputpatient").show();
                            $("#membre_select").attr("required", "required");
                            $("#titulaire_select").attr("required", "required");
                            $("#personne_selectcpn").attr("required", "required");

                            $('.entete_modalVIS').text("Ajout CPN");
                            $('#btn_add_cpn_first').text("Ajouter");

                            $("#AddVisites").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                            );
                            


                        },
                    },
                    


                ],
            });
            $("#card_cpn").unblock();

        },
    });

}


function liste_descendant(id) {
    idCpn = id ;
    $("#idcpn1").val(id);

    $("#descendant_modal").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    

    var element = $('#cpnpere'+ id );

    // Attribuer les valeurs des data-* aux champs correspondants dans le formulaire
    $('input[name="idcpn"]').val(element.data('idcpn'));
    $('input[name="dateAccouchement"]').val(element.data('dateaccouchement'));

    // Fonction pour gérer les boutons radio (Oui/Non)
    

    // Attribuer les valeurs pour les radios (AGE < 16 ans, AGE > 35 ans, etc.)
    $('input[name="ageCpn"]').val(element.data('agecpn'));
    $('input[name="taille"]').val(element.data('taille'));
    $('input[name="tension"]').val(element.data('tension'));
    $('input[name="parite"]').val(element.data('parite'));
    $('input[name="cesarienne"]').val(element.data('cesarienne'));
    $('input[name="mortne"]').val(element.data('mortne'));
    $('input[name="drepanocytose"]').val(element.data('drepanocytose'));

    // Attribuer les dates des vaccinations
    $('input[name="vat1"]').val(element.data('vat1'));
    $('input[name="vat2"]').val(element.data('vat2'));
    $('input[name="vat3"]').val(element.data('vat3'));
    $('input[name="vat4"]').val(element.data('vat4'));
    $('input[name="vat5"]').val(element.data('vat5'));

    


}



var idCpn ;


function consult_cpn(id) {
    idCpn = id ;
    fill_consult(id);
    $("#modal_consultationcpn").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}

var iddetail ;

function delete_detailcpn(id) {

    iddetail = id ;

    $("#deleteConsultation").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

}
function delete_detail() {

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
        url: base + "delete_detailcpn",
        type: "POST",
        dataType: "JSON",
        data: { id : iddetail },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            $("#deleteConsultation").modal(
                "hide"
            );

            $("#delcontentpatient").unblock();

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }

            fill_consult(idCpn);
            liste_cpn();

        },
    });

}


$("#add_cpnParam").off("submit").on("submit", function (e) {
    e.preventDefault();

    let data = new FormData(this);

    $.ajax({
        beforeSend: function () {
            $("#modal_Consultation").block({
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
        url: base + "add_cpnParam",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function(xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        },
        success: function (res) {
            //fill_paramettre( $("#idDetailsCons").val());            
            alertCustom("success", "ft-check", "Parametrage effectué avec succée");
            liste_cpn();
            $("#modal_Consultation").unblock();
        },
    });
});

$("#add_consultcpn").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (nums.includes($("#numCons").val()) ) {
        if (iddetail == '') {            
            alertCustom("warning", "ft-check", "N° de consultation existe deja");
            return ;
        } else{          
            if ( numedit != $("#numCons").val()) {            
                alertCustom("warning", "ft-check", "N° de consultation existe deja");
                return ;
            }        
        }
    } 

    let data = new FormData(this);

    data.append("idcpn",idCpn);
    data.append("idconsultationcpn",iddetail)
    
    $.ajax({
        beforeSend: function () {            
        },
        url: base + "add_detailcpn",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            if ($('#btn_add_detail_cpn').text() === "Modifier") {
                if (res.id == 1) {
                    alertCustom("success", "ft-check", "Modification effectué avec succée");
                    $("#AddConsultCpn").modal("hide");
                    fill_consult(idCpn);
                    liste_cpn();       
                }  else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");
                }                
            } else {
                if (res.id == 1) {                    
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    fill_consult(idCpn);
                    $("#AddConsultCpn").modal("hide");
                    liste_cpn();
                }else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");
                }
            }
        },
    });
});

$("#add_consultation").off("submit").on("submit", function (e) {
    e.preventDefault();
    let data = new FormData(this);
    let isPatientetranger = $("#patientetranger").is(":checked");
    data.append("isPatientetranger", isPatientetranger);
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
        url: base + "ajout_cpn",
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
                    liste_cpn();
                }  else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");
                }                
            } else {
                if (res.id == 1) {                   
                    alertCustom("success", "ft-check", "Ajout effectué avec succée");
                    liste_cpn();
                    $("#AddVisites").modal("hide");
                }else {
                    alertCustom("danger", "ft-x", "Ajout non effectué");
                }
            }
        },
    });
});

var nums = new Array();

function fill_consult(idcpn) {
    
    $.ajax({
        beforeSend: function () {

            $("#consultationcpn_modal").block({
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
        url: base + "listes_details_consult",
        type: "POST",
        data: {
            idcpn: idcpn,
            idtypeconsult : idtypeconsult
        },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {
            var res = JSON.parse(res);
            $(".entete_modal2").text(res.num_cpn);
            
            nums = res.nums;
            if ($.fn.DataTable.isDataTable("#table_consultation_cpn")) {
                $("#table_consultation_cpn").DataTable().destroy();
            } else {
            }

            $('.add_param_cpn').empty();
            $('.add_param_cpn').append(res.parambtn);


            $('#table_consultation_cpn').empty();
            $("#table_consultation_cpn").append(res.table);


            $('#table_consultation_cpn').DataTable({
                destroy: true,
                ordering: false,
                responsive: true,
                info: false,
                paging: false,
                deferRender: true,
                pageLength: 15,
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

                            iddetail = "";

                            $("#btn_add_detail_cpn").text('Ajouter');

                            

                              $('#add_consultcpn').find(':input:not([type="submit"], [type="hidden"])').each(function() {
                                if ($(this).is('select.selectpicker')) {
                                    $(this).selectpicker('val', []); // Réinitialiser le selectpicker
                                } else {
                                    $(this).val('');
                                }
                            });

                            $("#AddConsultCpn").modal(
                                { backdrop: "static", keyboard: false },
                                "show"
                                );
                                $("#ListesLabo").css("overflow-y" , "auto") ;
                                $("#AddConsultCpn").css("overflow-y" , "auto") ;
                                
                                $('.entete_modal_patpo').text("Ajout consultation");
                                

                        },
                    },
                ],
            });
            $("#consultationcpn_modal").unblock();
        },
    });
}

function close_del_consultation() {
    $("#card_cpn").unblock();
}


// *************************dialogue suppression deleate
function supprimercpn(id) {


    idCpn = id ;
    
    $("#deleteCpn").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}

var numedit ;
function edit_detailcpn(id) {

    var element = $("#detailcpn" + id);
    
    // Utiliser jQuery pour sélectionner les inputs par leur 'name' et assigner les valeurs des attributs 'data-*'
    const dataFields = [
        'tagd',
        'poids',
        'taille',
        'alboedemes',
        'vedese',
        'cpnconjonctive',
        'saignement',
        'hauteuruterine',
        'largue',
        'ddr',
        'dpa',
        'hu',
        'maf',
        'omi',
        'vat',
        'spi',
        'bdcf',
        'rechercheactive',
        'presentation',
        'refeaccouche',
        'serologierdr',
        'serologievidal',
        'asaurine',
        'groupage',
        'hiv',
        'fcv',
        'bw',
        'toxoplasmose',
        'rubuole',
        'tpha',
        'nfs',
        'feracfolique',
        'daterendevous',
        'createdAt'
    ];
    
    dataFields.forEach(field => {
        $('input[name="' + field + '"]').val(element.data(field));
    });

    numedit = element.data('num') ;
    $('#numCons').val(element.data('num')).selectpicker('refresh');

    $("#btn_add_detail_cpn").text('Modifier');
    $(".entete_modal_patpo").text('Modification consultation');



    iddetail = id ;
    
    $("#AddConsultCpn").modal(
        { backdrop: "static", keyboard: false },
        "show"
        );
        
        
        $("#ListesLabo").css("overflow-y" , "auto") ;
}


// **************************suppression apres boite dialogue de suppression
function delete_cpn() {


    $.ajax({
        beforeSend: function () {

            $("#card_cpn").block({
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
        url: base + "delete_cpn",
        type: "POST",
        dataType: "JSON",
        data: { id_cpn : idCpn },
        error: function(xhr, status, error) {
       alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    } ,success: function (res) {

            $("#deleteCpn").modal(
                "hide"
            );

            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Suppression effectué avec succée");

            } else {

                alertCustom("danger", 'ft-x', "Suppression non effectué");

            }

            liste_cpn();

        },
    });

}

// *****************modification consultation

function edit_cpn(id , membre_select1 , titulaire_select1) {
    membre_select = membre_select1;
    titulaire_select =  titulaire_select1;
    $('#id_cpnfirt').val(id);
    personne_selectcpn = $("#cpnF" + id).data('personne');
    $('.entete_modalVIS').text("Modification CPN");
    $('#btn_add_cpn_first').text("Modifier");
    setRadioValue('mariee', $("#cpnF" + id).data('mariee'));
    if(membre_select1==0){
        $("#patientetranger").prop('checked', true);
        $("#afficheInputpatientetranger").show();
        $("#nom").attr("required", "required");
        $("#checkTitulaire").val(titulaire_select);
        $("#nom").val($("#cpnF" + id).data('nom'));
        $("#prenom").val($("#cpnF" + id).data('prenom'));
        $("#adresse").val($("#cpnF" + id).data('adresse'));
        $("#genre").val($("#cpnF" + id).data('genre'));

        $("#afficheInputpatient").css("display", "none");
        $("#membre_select").removeAttr("required");
        $("#titulaire_select").removeAttr("required");
        $("#personne_selectcpn").removeAttr("required");

        $("#membre_select").val("");
        $("#titulaire_select").val("");
        $("#personne_selectcpn").val("");
    }else{
        $("#patientetranger").prop('checked', false);
        $("#afficheInputpatientetranger").hide();
        $("#nom").removeAttr("required");
        $("#nom").val("");
        $("#prenom").val("");
        $("#adresse").val("");
        $("#checkTitulaire").val('');

        $("#afficheInputpatient").show();
        $("#membre_select").attr("required", "required");
        $("#titulaire_select").attr("required", "required");
        $("#personne_selectcpn").attr("required", "required");
    }
    $("#AddVisites").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    charge_membre();

}


function details_cpn(id) {

    idCpn = id ;

    typeEnvoie = "cpn";

    formatPrixImput();

    $("#ListesLabocpn").modal(
        { backdrop: "static", keyboard: false },
        "show"
        );
        $("#ListesLabocpn").css("overflow-y" , "auto") ;

    fill_consult(id);
    liste_descendant(id);

    

    $('.table_parametre').each(function() {
        $(this).DataTable({
            destroy: true,
            ordering: false,
            responsive: true,
            info: false,
            paging: false,
            deferRender: true,
            searching : false ,
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
    });

}



function terminer(id) {

    $("#cloturecpn").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    idCpn = id ;

}


function affichage_demande_cpn(id , role) {

    $("#ListesDemande").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );

    iddetail = id ;
    $('.tabsnav1 .nav-link').removeClass('active').first().addClass('active'); //reto mamoha onglet ren
    $('.tabcontent1 .tab-pane').removeClass('active').first().addClass('active');


    fill_labo(id,typeEnvoie);
    fill_prescription(id , typeEnvoie);
   
}

function terminercpn() {

    $.ajax(
        {
            beforeSend: function () {
    
                $("#cloturecpn").block({
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
        url: base + "terminercpn",
        type: "POST",
        dataType: "JSON",
        data: { idCpn: idCpn },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (res) {


            
            $("#cloturecpn").modal(
                "hide"
            );

            $("#cloturecpn").unblock();
            if (res.id > 0) {

                alertCustom("success", 'ft-check', "Cloture effectué avec succée");
                
                liste_cpn();

            } else {

                alertCustom("danger", 'ft-x', "Cloture non effectué");

            }


        },
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

    liste_cpn();

}

