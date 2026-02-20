var membre_select;
var titulaire_select;
var personne_selectM;
var detailMembreId;
var detailTitulaireId;
var Patient;
var dateMaternite;
var idMat;
var idDtetailMat;

$(document).ready(function () {
  $("select").selectpicker("refresh");
  $("#date_debut").val(dateDebutISO30);
  $("#date_fin").val(dateFinISO);

  liste_maternite();

  if ([19, 20, 4].includes(idtypeconsult)) {
    // tous etape
  } else {
    charge_membre1();
    charge_membre();
  }
});

function charge_membre() {
  $.ajax({
    url: base + "charge_membre1",
    type: "POST",
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (data) {
      $("#membre_select").empty();
      $("#membre_select").append(data);
      $("select").selectpicker("refresh");
      if (membre_select != "" && membre_select != null) {
        $("#membre_select").val(membre_select).selectpicker("refresh");
        charge_titulaire_coix();
      }
    },
  });
}

function charge_titulaire_coix() {
  $("#modal_visites").block({
    message:
      '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

    overlayCSS: {
      backgroundColor: "black",
      opacity: 0.1,
      cursor: "wait",
    },
    css: {
      border: 0,
      padding: 0,
      backgroundColor: "transparent",
    },
  });
  $.ajax({
    url: base + "charge_titulaire",
    type: "POST",
    data: {
      id_membre: $("#membre_select").val(),
    },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (data) {
      $("#titulaire_select").empty();
      $("#titulaire_select").append(data);
      $("select").selectpicker("refresh");
      if (titulaire_select != "" && titulaire_select != null) {
        $("#titulaire_select").val(titulaire_select).selectpicker("refresh");
        charge_personne_malade();
      }
      $("#modal_visites").unblock();
    },
  });
}

function charge_personne_malade() {
  $.ajax({
    url: base + "charge_personne_malade",
    type: "POST",
    data: {
      id: $("#titulaire_select").val(),
    },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (data) {
      $("#personne_selectM").empty();
      $("#personne_selectM").append(data);
      $("select").selectpicker("refresh");
      if (personne_selectM != "" && personne_selectM != null) {
        $("#personne_selectM").val(personne_selectM).selectpicker("refresh");
      }
      $("#modal_visites").unblock();
    },
  });
}

$("#membre_select").on("change", function name(params) {
  charge_titulaire_coix();
});
$("#titulaire_select").on("change", function name(params) {
  $("#modal_visites").block({
    message:
      '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

    overlayCSS: {
      backgroundColor: "black",
      opacity: 0.1,
      cursor: "wait",
    },
    css: {
      border: 0,
      padding: 0,
      backgroundColor: "transparent",
    },
  });
  charge_personne_malade();
});

// ******************** liste consultation *********************************

function liste_maternite() {
  $.ajax({
    beforeSend: function () {
      $("#card_maternite").block({
        message:
          '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

        overlayCSS: {
          backgroundColor: "black",
          opacity: 0.1,
          cursor: "wait",
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: "transparent",
        },
      });
    },
    url: base + "liste_maternite",
    type: "POST",
    data: {
      id_membre: $("#membre_choix").val(),
      date_debut: $("#date_debut").val(),
      date_fin: $("#date_fin").val(),
      idtypeconsult: idtypeconsult,
    },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      var res = JSON.parse(res);

      if ($.fn.DataTable.isDataTable("#table_maternite")) {
        $("#table_maternite").DataTable().destroy();
      } else {
      }
      $("#table_maternite").empty();
      $("#table_maternite").append(res.table);

      $("#table_maternite").DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        responsive: true,
        info: false,
        paging: true,
        autoWidth: true,

        deferRender: true,
        pageLength: 7,
        initComplete: function (settings, json) {
          $("div.dataTables_wrapper div.dataTables_filter input")
            .attr("placeholder", "Recherche")
            .css("font-size", "7px");
        },
        language: {
          search: "",
          zeroRecords: "Aucun enregistrement",
          paginate: {
            previous: "Précédent",
            next: "Suivant",
          },
        },
        dom: res.dom,
        buttons: [
          {
            className: "btn btn-sm mr-1 btn-secondary",
            text: '<i class="ft-rotate-cw"> </i>',
            action: function () {
              liste_maternite();
            },
          },

          {
            className: "btn btn-sm mr-1 btn-warning btn-min-width ",
            text: '<i class="ft-plus"> Ajouter</i>',
            action: function () {
              $("#AddVisitesMate").unblock();

              $("#id_matefirt").val("");

              $("#add_consultation_Mate")
                .find(
                  ':input:not([type="submit"], [type="hidden"]):not([type="radio"])'
                )
                .each(function () {
                  if ($(this).is("select.selectpicker")) {
                    // Réinitialiser le selectpicker en vidant les sélections
                    $(this).selectpicker("val", []);
                  } else {
                    // Réinitialiser les autres champs en vidant leur valeur
                    $(this).val("");
                  }
                });

              $("#afficheInputpatient").show();
              $("#membre_select").attr("required", "required");
              $("#titulaire_select").attr("required", "required");
              $("#personne_selectcpn").attr("required", "required");

              $(".entete_modalVIS").text("Ajout Patient");
              $("#btn_add_mate_first").text("Ajouter");

              $("#AddVisitesMate").modal(
                { backdrop: "static", keyboard: false },
                "show"
              );
            },
          },
        ],
      });
      $("#card_maternite").unblock();
    },
  });
}
// ******************** ajout consultation au maternité**********************

$("#add_consultation_maternite")
  .off("submit")
  .on("submit", function (e) {
    e.preventDefault();
    let data = new FormData(this);

    $.ajax({
      beforeSend: function () {
        $("#modal_visites").block({
          message:
            '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

          overlayCSS: {
            backgroundColor: "black",
            opacity: 0.1,
            cursor: "wait",
          },
          css: {
            border: 0,
            padding: 0,
            backgroundColor: "transparent",
          },
        });
      },
      url: base + "ajout_maternite",
      type: "POST",
      processData: false,
      contentType: false,
      cache: false,
      dataType: "JSON",
      data: data,
      error: function (xhr, status, error) {
        alertCustom("danger", "ft-x", "Une erreur s'est produite");
      },
      success: function (res) {
        $("#modal_visites").unblock();
        if ($("#btn_add_cpn_first").text() === "Modifier") {
          if (res.id == 1) {
            alertCustom(
              "success",
              "ft-check",
              "Modification effectué avec succée"
            );
            $("#AddVisitesMate").modal("hide");
            liste_maternite();
          } else {
            alertCustom("danger", "ft-x", "Ajout non effectué");
          }
        } else {
          if (res.id == 1) {
            alertCustom("success", "ft-check", "Ajout effectué avec succée");
            liste_maternite();
            $("#AddVisitesMate").modal("hide");
          } else {
            alertCustom("danger", "ft-x", "Ajout non effectué");
          }
        }
      },
    });
  });

// ******************** modifier consultation ****************************

function edit_maternite(id, membre_select1, titulaire_select1) {
  membre_select = membre_select1;
  titulaire_select = titulaire_select1;
  $("#id_Matfirt").val(id);
  personne_selectM = $("#mater" + id).data("personne");
  $(".entete_modalVIS").text("Modification Patient");
  $("#btn_add_mate_first").text("Modifier");

  $("#afficheInputpatient").show();
  $("#membre_select").attr("required", "required");
  $("#titulaire_select").attr("required", "required");
  $("#personne_selectcpn").attr("required", "required");

  $("#AddVisitesMate").modal({ backdrop: "static", keyboard: false }, "show");
  charge_membre();
}



// ****************** afficher details CPN ******************************

function details_cpn_M(id) {
  idCpn = id;

  typeEnvoie = "cpn";

  formatPrixImput();

  $("#ListesLabocpn").modal({ backdrop: "static", keyboard: false }, "show");
  $("#ListesLabocpn").css("overflow-y", "auto");

  fill_consult_M(id);
  liste_descendant_M(id);

  $(".table_parametre").each(function () {
    $(this).DataTable({
      destroy: true,
      ordering: false,
      responsive: true,
      info: false,
      paging: false,
      deferRender: true,
      searching: false,
      pageLength: 7,
      initComplete: function (settings, json) {
        $("div.dataTables_wrapper div.dataTables_filter input")
          .attr("placeholder", "Recherche")
          .css("font-size", "7px");
      },
      language: {
        search: "",
        zeroRecords: "Aucun enregistrement",
        paginate: {
          previous: "Précédent",
          next: "Suivant",
        },
      },

      dom: "frtip",
    });
  });
}

function fill_consult_M(idcpn) {
  $.ajax({
    beforeSend: function () {
      $("#consultationcpn_modal").block({
        message:
          '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

        overlayCSS: {
          backgroundColor: "black",
          opacity: 0.1,
          cursor: "wait",
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: "transparent",
        },
      });
    },
    url: base + "listes_details_consult",
    type: "POST",
    data: {
      idcpn: idcpn,
      idtypeconsult: idtypeconsult,
    },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      var res = JSON.parse(res);
      $(".entete_modal2").text(res.num_cpn);

      nums = res.nums;
      if ($.fn.DataTable.isDataTable("#table_consultation_cpn")) {
        $("#table_consultation_cpn").DataTable().destroy();
      } else {
      }

      $(".add_param_cpn").empty();
      $(".add_param_cpn").append(res.parambtn);

      $("#table_consultation_cpn").empty();
      $("#table_consultation_cpn").append(res.table);

      $("#table_consultation_cpn").DataTable({
        destroy: true,
        ordering: false,
        responsive: true,
        info: false,
        paging: false,
        deferRender: true,
        pageLength: 15,
        initComplete: function (settings, json) {
          $("div.dataTables_wrapper div.dataTables_filter input")
            .attr("placeholder", "Recherche")
            .css("font-size", "7px");
        },
        language: {
          search: "",
          zeroRecords: "Aucun enregistrement",
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

              $("#btn_add_detail_cpn").text("Ajouter");

              $("#add_consultcpn")
                .find(':input:not([type="submit"], [type="hidden"])')
                .each(function () {
                  if ($(this).is("select.selectpicker")) {
                    $(this).selectpicker("val", []); // Réinitialiser le selectpicker
                  } else {
                    $(this).val("");
                  }
                });

              $("#AddConsultCpn").modal(
                { backdrop: "static", keyboard: false },
                "show"
              );
              $("#ListesLabo").css("overflow-y", "auto");
              $("#AddConsultCpn").css("overflow-y", "auto");

              $(".entete_modal_patpo").text("Ajout consultation");
            },
          },
        ],
      });
      $("#consultationcpn_modal").unblock();
    },
  });
}

function liste_descendant_M(id) {
  idCpn = id;
  $("#idcpn1").val(id);

  $("#descendant_modal").modal({ backdrop: "static", keyboard: false }, "show");

  var element = $("#cpnpere" + id);

  // Attribuer les valeurs des data-* aux champs correspondants dans le formulaire
  $('input[name="idcpn"]').val(element.data("idcpn"));
  $('input[name="dateAccouchement"]').val(element.data("dateaccouchement"));

  // Fonction pour gérer les boutons radio (Oui/Non)

  // Attribuer les valeurs pour les radios (AGE < 16 ans, AGE > 35 ans, etc.)
  $('input[name="ageCpn"]').val(element.data("agecpn"));
  $('input[name="taille"]').val(element.data("taille"));
  $('input[name="tension"]').val(element.data("tension"));
  $('input[name="parite"]').val(element.data("parite"));
  $('input[name="cesarienne"]').val(element.data("cesarienne"));
  $('input[name="mortne"]').val(element.data("mortne"));
  $('input[name="drepanocytose"]').val(element.data("drepanocytose"));

  // Attribuer les dates des vaccinations
  $('input[name="vat1"]').val(element.data("vat1"));
  $('input[name="vat2"]').val(element.data("vat2"));
  $('input[name="vat3"]').val(element.data("vat3"));
  $('input[name="vat4"]').val(element.data("vat4"));
  $('input[name="vat5"]').val(element.data("vat5"));
}

function affichage_demande_cpn(id, role) {
  $("#ListesDemande").modal({ backdrop: "static", keyboard: false }, "show");

  iddetail = id;
  $(".tabsnav1 .nav-link").removeClass("active").first().addClass("active");
  $(".tabcontent1 .tab-pane").removeClass("active").first().addClass("active");

  fill_labo(id, typeEnvoie);
  fill_prescription(id, typeEnvoie);
}

// ******************* affichage liste detail consultation cpn effectué par un patien au cours de sa grossesse **********
function view_list_cpn(id_membre, id_titu, enfantId, dateMat) {
  // typeEnvoie = "visite"; tokn ho maternité
  typeEnvoie = "visite";

  detailMembreId = id_membre;
  detailTitulaireId = id_titu;
  Patient = enfantId;
  dateMaternite = dateMat;
  idtypeconsult = idtypeconsult;

  $("#modal_cpn_patient_maternite").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );

  listes_all_cpn_maternite();
}

function listes_all_cpn_maternite() {
  $.ajax({
    beforeSend: function () {
      $("#card_list_cpn_maternite").block({
        message:
          '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

        overlayCSS: {
          backgroundColor: "black",
          opacity: 0.1,
          cursor: "wait",
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: "transparent",
        },
      });
    },
    url: base + "afficher_liste_cpn_maternite",
    type: "POST",
    data: {
      id_Membre: detailMembreId,
      id_Titulaire: detailTitulaireId,
      patient: Patient,
      dateMat: dateMaternite,
      idtypeconsult: idtypeconsult,
    },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      var res = JSON.parse(res);

      if ($.fn.DataTable.isDataTable("#liste_cpn_maternite")) {
        $("#liste_cpn_maternite").DataTable().destroy();
      } else {
      }
      $("#liste_cpn_maternite").empty();
      $("#liste_cpn_maternite").append(res.table);

      var filter = [[5, "desc"]];

      $("#liste_cpn_maternite").DataTable({
        destroy: true,
        ordering: false,
        order: filter,
        responsive: true,
        info: false,
        autoWidth: true,
        paging: false,
        deferRender: true,
        searching: false,
        pageLength: 7,
        initComplete: function (settings, json) {
          $("div.dataTables_wrapper div.dataTables_filter input")
            .attr("placeholder", "Recherche")
            .css("font-size", "7px");
        },
        language: {
          search: "",
          zeroRecords: "Aucun enregistrement",
          paginate: {
            previous: "Précédent",
            next: "Suivant",
          },
        },
        dom: "frtip",
      });
      $("#card_list_cpn_maternite").unblock();
    },
  });
}

// ****************** affichage du liste de detail consultation pour un patient  au maternité **********************
function afficher_list_detail_maternite(id) {
  idMat = id;
  typeEnvoie = "maternite";

  $("#modal_list_detail_maternite").modal(
    { backdrop: "static", keyboard: false },
    "show"
  );

  $.ajax({
    beforeSend: function () {
      $("#card_list_consultation_maternite").block({
        message:
          '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

        overlayCSS: {
          backgroundColor: "black",
          opacity: 0.1,
          cursor: "wait",
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: "transparent",
        },
      });
    },
    url: base + "afficher_liste_detail_consult_maternite",
    type: "POST",
    data: {
      idMat: id,
      typeEnvoie: typeEnvoie,
      idtypeconsult: idtypeconsult,
    },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      var res = JSON.parse(res);

      if ($.fn.DataTable.isDataTable("#table_detail_maternite")) {
        $("#table_detail_maternite").DataTable().destroy();
      } else { 
      }
      $("#table_detail_maternite").empty();
      $("#table_detail_maternite").append(res.table);

      $("#table_detail_maternite").DataTable({
        destroy: true,
        ordering: false,
        responsive: true,
        info: false,
        paging: true,
        deferRender: true,
        pageLength: 7,
        searching: false,

        language: {
          search: "",
          zeroRecords: "Aucun enregistrement",
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
              
                // pour ouvrir le modal afin d'ajouter une Observation ou parametre dans le detail
                $("#modalAjoutDetailConsultation").modal(
                  { backdrop: "static", keyboard: false },
                  "show"
                );
                
            },
          },
        ],
  
      });

      $("#card_list_consultation_maternite").unblock();
    },
  });
}

//  ****************************** ajout detail consultation pour un patien au maternité ******************************** 
function ajouterDetaiConsultationMaternite(){
  $.ajax({
  
    url: base + "ajout_detail_consultation_maternite",
    type: "POST",
    dataType: "JSON",
    data: { id_maternite: idMat },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      $("#modalAjoutDetailConsultation").modal("hide");

      if (res.id > 0) {
        alertCustom("success", "ft-check", "Ajout effectué avec succée");
      } else {
        alertCustom("danger", "ft-x", "Ajout non effectué");
      }

      afficher_list_detail_maternite(idMat);
    },
  });
}

//  ************************** affichage modale avec onglet prescription pour un detail consultation ***********************
function affiche_demane_maternite(id){
  
  idDtetailMat = id;  
  typeEnvoie = "maternite";

    $("#ListesDemandeMaternite").modal(
      { backdrop: "static", keyboard: false },
      "show"
    );

    $('.tabsnav1 .nav-link').removeClass('active').first().addClass('active'); 
    $('.tabcontent1 .tab-pane').removeClass('active').first().addClass('active');
    
    fill_prescription(idDtetailMat , typeEnvoie);


}

function fill_observetion(iddetails, types) {

    type = types;
 
    var datasend = {
        id: iddetails,
        type: type,
        idtypeconsult: idtypeconsult,
        idMat: idMat
    };


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

function listes_detail_consultation_maternite() {
  $.ajax({
    beforeSend: function () {
      $("#card_list_cpn_maternite").block({
        message:
          '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto , font-size : 80px !important"></div>',

        overlayCSS: {
          backgroundColor: "black",
          opacity: 0.1,
          cursor: "wait",
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: "transparent",
        },
      });
    },
    url: base + "listes_detail_consultation_maternite",
    type: "POST",
    data: {
      id_Membre: detailMembreId,
      id_Titulaire: detailTitulaireId,
      patient: Patient,
      idtypeconsult: idtypeconsult,
    },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      var res = JSON.parse(res);

      if ($.fn.DataTable.isDataTable("#detail_consultation_M")) {
        $("#detail_consultation_M").DataTable().destroy();
      } else {
      }
      $("#detail_consultation_M").empty();
      $("#detail_consultation_M").append(res.table);

      var filter = [[5, "desc"]];

      $("#detail_consultation_M").DataTable({
        destroy: true,
        ordering: false,
        order: filter,
        responsive: true,
        info: false,
        autoWidth: true,
        paging: false,
        deferRender: true,
        searching: false,
        pageLength: 7,
        initComplete: function (settings, json) {
          $("div.dataTables_wrapper div.dataTables_filter input")
            .attr("placeholder", "Recherche")
            .css("font-size", "7px");
        },
        language: {
          search: "",
          zeroRecords: "Aucun enregistrement",
          paginate: {
            previous: "Précédent",
            next: "Suivant",
          },
        },
        dom: "frtip",
      });
      $("#card_list_cpn_maternite").unblock();
    },
  });
  liste_maternite();
}

function affichage_demande_M(id) {
  // if (enCours) return; // Empêche un deuxième clic si une requête est en cours
  // enCours = true;
  /*$('.nav-tabs .nav-link').removeClass('active').first().addClass('active');

    $('.tab-content .tab-pane').removeClass('active').first().addClass('active');*/

  detailConsultationId = id;
  formatPrixImput();

  $("#ListesLaboM").modal({ backdrop: "static", keyboard: false }, "show");

  // if ([1,2,3,4,19,20,14].includes(idtypeconsult)) { // tous etape
  //     fill_detailVisite(id);
  // }
  // if ([2,3,19,20,14].includes(idtypeconsult)) { // tous etape sauf enregistrement et prescription
  //     fill_paramettre(id);
  // }
  // if ([4,3,14].includes(idtypeconsult)) { // pharmacie ou consultation medecin seulement
  //     fill_prescription(id,typeEnvoie);
  // }

  // if ([3,19,20,14].includes(idtypeconsult)) { // laboratoire ou echographie ou consultation medecin seulement
  //     fill_labo(id,typeEnvoie);
  // }

  // if ([3,14].includes(idtypeconsult)) { //consultation medecin seulement
  //     charge_analyse();
  //     fill_conclusion(id);
  //     fill_clinique(id);
  //     fill_autre_acte(id);
  //     fill_diagnostique(id);
  //     fill_soinextraction(id);
  //     fill_antecedent(id);
  // }
}

function modal_sendpharmacie() {

    $("#envoye_pharmacie").modal(
        { backdrop: "static", keyboard: false },
        "show"
    );


}
// ***************** suppression d'une consultation *****************
var idMaternite;

function supprimerMaternite(id) {
  idMaternite = id;

  $("#deleteMaternite").modal({ backdrop: "static", keyboard: false }, "show");
}

function delete_maternite() {
  $.ajax({
    beforeSend: function () {
      $("#card_maternite").block({
        message:
          '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto"></div>',

        overlayCSS: {
          backgroundColor: "black",
          opacity: 0.1,
          cursor: "wait",
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: "transparent",
        },
      });
    },
    url: base + "delete_maternite",
    type: "POST",
    dataType: "JSON",
    data: { id_maternite: idMaternite },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      $("#deleteMaternite").modal("hide");

      if (res.id > 0) {
        alertCustom("success", "ft-check", "Suppression effectué avec succée");
      } else {
        alertCustom("danger", "ft-x", "Suppression non effectué");
      }

      liste_maternite();
    },
  });
}

// *****************supprimer detail consultation maternité *****************
function delete_detai_consult_mat(id)
{
  idDtetailMat = id;
  $("#deleteDetailMaternite").modal({ backdrop: "static", keyboard: false }, "show");
}

function delete_detail_consult_maternite()
{
  $.ajax({
    beforeSend: function () {
      $("#card_list_consultation_maternite").block({
        message:
          '<div class="ft-refresh-cw icon-spin font-medium-2" style="margin:auto"></div>',

        overlayCSS: {
          backgroundColor: "black",
          opacity: 0.1,
          cursor: "wait",
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: "transparent",
        },
      });
    },
    url: base + "delete_detail_consult_maternite",
    type: "POST",
    dataType: "JSON",
    data: { id_detailconsultmat: idDtetailMat },
    error: function (xhr, status, error) {
      alertCustom("danger", "ft-x", "Une erreur s'est produite");
    },
    success: function (res) {
      
      $("#deleteDetailMaternite").modal("hide");

      if (res.id > 0) {
        alertCustom("success", "ft-check", "Suppression effectué avec succée");
      } else {
        alertCustom("danger", "ft-x", "Suppression non effectué");
      }

        afficher_list_detail_maternite(idMat);

    },
  });
}





// ******************************filtre en tete *****************************************/////***/*/*/*/*/*/************************

function filtrerVisite_Maternite() {
  liste_maternite();
}
