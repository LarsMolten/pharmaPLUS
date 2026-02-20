$(document).ready(function () {
    
});
var id_cmd_cmm;
var id_dt_cmd_cmm;
var saveCmd;

function modalCmdCmm(id_article, iddetailcmm) {
    if (afficheModalCmd==false) {
        afficheModalCmd=true;
        return;
    }
    id_article_cmd = id_article;
    iddetailcmmgros = iddetailcmm;
    $("#AddCommande").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#AddCommande").css({ "overflow": "auto"});
    $.ajax({
        beforeSend: function () {
  
            $("#modal_commande").block({
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
        url: base + 'formCmdCmm',
        type: "POST",
        dataType: "JSON",
        data: {
            iddetailcmmgros : iddetailcmmgros,
            idcmmgrosindex : idcmmgrosindex,
        },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
        }, success: function (data) {
            
            $("#detailcommande").empty();
            $("#detailcommande").append(data.modalSaisiCmd);
            $('#id_cmm_gros_cmd').selectpicker('refresh');
            $("#modal_commande").unblock();

            $("#id_cmm_gros_cmd").on('change', function (params) {
                const selectedCmd = $(this).val();
                checkQuantiteCommande(selectedCmd, iddetailcmmgros)
                if(selectedCmd==0){
                    var inputNouveauCmd = 
                        `<div class="col-md-12">
                            <div class="form-group">
                                <label for="userinput1" class="">Choix Fournisseur :</label>
                                <select class="selectpicker  form-control btn-sm" name="id_fournisseur" required id="id_fournisseur_cmd" data-live-search="true" data-size="6" title="Choix Fournisseur">
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="userinput1" class="">Libellé Commande :</label>
                                <input class="form-control input-sm" name="libelle" required type="text" placeholder="Libellé Commande" id="libelleCmd">
                            </div>
                        </div>`;
                        $("#inputNouveauCmd").append(inputNouveauCmd);
                        generation_dropdown_fournisseur();
                }else{
                    $("#inputNouveauCmd").empty();
                }
            });

            $("#AddCommande").modal(
                { backdrop: "static", keyboard: false },
                "show"
            );
        }
    });
}

function generation_dropdown_fournisseur() {
    $.ajax({
        beforeSend: function () {  
            $("#modal_commande").block({
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
      url: base + "generation_dropdown_fournisseur",
      type: "POST",
      success: function (res) {
        $("#id_fournisseur_cmd").empty();
        $("#id_fournisseur_cmd").append(res);          
        $("#id_fournisseur_cmd").selectpicker("refresh");      
        $("#modal_commande").unblock();
      },
    });  
  }


$("#form_detail_cmd_cmm").off("submit").on("submit", function (e) {
    e.preventDefault();
    let data = new FormData(this);
    data.append("id_article", id_article_cmd);
    data.append("iddetailcmmgros", iddetailcmmgros);
    data.append("id_cmm_gros", idcmmgrosindex);
    data.append("saveCmd", saveCmd);
    if ($("#quantiteCmd").val()<=0) {
        alertCustom("danger", 'ft-x', "Veuillez verifier la quantité à commandé");
        return;
    }
    
    $.ajax({
        beforeSend: function () {  
            $("#modal_commande").block({
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
        url: base + "add_detail_cmd_cmm",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        dataType: "JSON",
        data: data,
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#modal_commande").unblock();
        },
        success: function(res){
            alertCustom("success", "ft-check", "Ajouté dans Commande avec succée");
            $("#dtCmm_"+iddetailcmmgros).css('backgroundColor', 'rgb(228, 186, 186)');
            $("#modal_commande").unblock();
            $("#AddCommande").modal("hide");
        }
    })
});

function affiche_listeCmd(id) {

    idcmmgrosindex = id;
  
    $("#modalListeCmd").modal(
      { backdrop: "static", keyboard: false },
      "show"
    );
    
    $.ajax({
        beforeSend: function () {    
          $("#modal_listeCmd").block({
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
        url: base + "listeCmd",
        type: "POST",
        dataType: "JSON",
        data: {
          idcmmgrosindex: idcmmgrosindex
        },
        error: function (xhr, status, error) {
          alertCustom("danger", 'ft-x', "Une erreur s'est produite");
          $("#table_listeCmd").unblock();
        },
        success: function (res) {
            $('#table_listeCmd').empty();
            $("#table_listeCmd").append(res.table);  
            $('#table_listeCmd').DataTable({
                destroy: true,
                ordering: true,
                order: [[0, "asc"]],
                responsive: true,
                info: false,
                paging: true,
                deferRender: true,
                pageLength: 15,
                lengthChange: false,
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
                buttons: [
                    {
                        
                      },
                ],
            });
            $("#modal_listeCmd").unblock();
        }
    });    
    $("#modalListeCmd").css({ "overflow": "auto"});
  }



  function affiche_detailCmd(idCmd) {
    id_cmd_cmm = idCmd;    

    $.ajax({
        beforeSend: function () {    
          $("#modal_listeDetailCmd").block({
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
        url: base + "listeDetailCmd",
        type: "POST",
        dataType: "JSON",
        data: {
            id_cmd_cmm: idCmd
        },
        error: function (xhr, status, error) {
          alertCustom("danger", 'ft-x', "Une erreur s'est produite");
          $("#table_listeDetailCmd").unblock();
        },
        success: function (res) {
            $('#table_listeDetailCmd').empty();
            $("#table_listeDetailCmd").append(res.table);  
            
            $('#table_listeDetailCmd').DataTable({
                destroy: true,
                ordering: true,
                order: [1, "asc"],
                responsive: true,
                info: false,
                paging: true,
                deferRender: true,
                pageLength: 15,
                lengthChange: false,
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
            });
            $("#modal_listeDetailCmd").unblock();
            if ($(".dataTables_empty").text()=="Aucun enregistrement") {
                $("#btnImprimerCmd").attr('hidden', true)
            }else{
                $("#btnImprimerCmd").attr('hidden', false)
            }
        }
    });
    $("#listeDetailCmd").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );
    $("#listeDetailCmd").css({ "overflow": "auto"});
  }  

  function imprimerCmd(){
    $.ajax({
        beforeSend: function () {
            $("#modal_listeDetailCmd").block({
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
        url: base + "imprimerCmd",
        type: "POST",
        data: {
            id_cmd_cmm: id_cmd_cmm,
        },
        dataType: "JSON",
        success: function (file) {
            $("#modal_listeDetailCmd").unblock();
            console.log(file.file);
            
            window.open(file.file, '_blank');
            alertCustom("success", 'ft-check', "Bien imprimé");
        },
        error: function (data) {
            $("#modal_listeDetailCmd").unblock();
            alertCustom("danger", 'ft-check', "Non imprimer");
        }
    })
  }

  function deleteDtCmd(idDtCmd, iddetailcmm) {
    id_dt_cmd_cmm = idDtCmd;
    iddetailcmmgros = iddetailcmm;
    $("#deleteDtCmdCmm").modal(
        { backdrop: "static", keyboard: false },
        "show"
      );
      $("#deleteDtCmdCmm").unblock();
  }

function annulerCmdCmm(){    
    $.ajax({
        beforeSend: function () {
            $("#deleteDtCmdCmm").block({
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
        url: base + "deleteDtCmdCmm",
        type: "POST",
        dataType: "json",
        data: { id_dt_cmd_cmm: id_dt_cmd_cmm, iddetailcmmgros : iddetailcmmgros },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#deleteDtCmdCmm").modal("hide");
            $("#deleteDtCmdCmm").unblock();
        }, success: function (res) {  
            $("#deleteDtCmdCmm").modal("hide");
            $("#deleteDtCmdCmm").unblock();    
            if (res.id > 0) {    
                alertCustom("success", 'ft-check', "Suppression effectué avec succée");
                affiche_detailCmd(id_cmd_cmm);    
            } else {    
                alertCustom("danger", 'ft-x', "Suppression non effectué");    
            }
        }
    });
}


function checkQuantiteCommande(idCmd, id_dt_cmm){
    $.ajax({
        beforeSend: function () {
            $("#modal_commande").block({
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
        url: base + "checkQuantiteCommande",
        type: "POST",
        dataType: "json",
        data: { id_cmd: idCmd, id_dt_cmm : id_dt_cmm },
        error: function (xhr, status, error) {
            alertCustom("danger", 'ft-x', "Une erreur s'est produite");
            $("#modal_commande").unblock();
        }, success: function (res) {  
            $("#modal_commande").unblock(); 
            $("#quantiteCmd").val(res.quantite);
            if (res.quantite==0) {
                saveCmd = "insertCmd";
            }else{
                saveCmd = "updateCmd";
            }
        }
    })
}