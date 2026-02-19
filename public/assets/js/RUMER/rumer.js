

$(document).ready(function () {
  $("#date_debut").val(dateDebutISO);
  $("#date_fin").val(dateFinISO);
  liste_rumerdetail();
  
});


function liste_rumerdetail() {
  
  $.ajax({
    beforeSend: function () {

      $("#card_detailrumer").block({
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
    url: base + "listes_rumerdetail",
    type: "POST",
    data: {
      date_debut: $('#date_debut').val(),
      date_fin: $('#date_fin').val()
  },
  error: function (xhr, status, error) {
    alertCustom("danger", 'ft-x', "Une erreur s'est produite");
},
    success: function (res) {
      if ($.fn.DataTable.isDataTable("#table_detailrumer")) {
        $("#table_detailrumer").DataTable().destroy();
    }
     else {
      }
      $('#table_detailrumer').empty();
      $("#table_detailrumer").append(res);
      
      $('#table_detailrumer').DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        responsive: true,
        info: false,
        autoWidth:true,
        paging: true,
        deferRender: true,
        pageLength: 15,
        "initComplete": function(settings, json) {
          $('div.dataTables_wrapper div.dataTables_filter input').attr('placeholder', 'Recherche').css("font-size", "7px");
        },
        language: {
          "search": "",
          "zeroRecords": "Aucun article",
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
              liste_rumerdetail();

            },
          },
          {
            extend: "excelHtml5",
            title: "RUMMER DETAIL",
            className: "btn btn-sm mr-1 btn-success",
            text: 'Excel',
           

        },
          
        ],
      });
      $("#card_detailrumer").unblock();

    },
  });

}
function filtrerrumerdetail() {
  liste_rumerdetail();
}


