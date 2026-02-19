

$(document).ready(function () {
  liste_article();
  
});
function filtrerarticle() {
  
  liste_article();
}


function liste_article() {
  
  $.ajax({
    beforeSend: function () {

      $("#card_article_menuiserie").block({
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
    url: base + "listes_article",
    type: "POST",
    data: {
      date: $('#date').val(),
    },
    complete: function() {
      enCours = false; // Remet la variable à false, que la requête ait réussi ou échoué
  },
    success: function (res) {
      if ($.fn.DataTable.isDataTable("#users-contacts")) {
        $("#users-contacts").DataTable().destroy();
    }
     else {
      }
      $('#users-contacts').empty();
      $("#users-contacts").append(res);
      
      $('#users-contacts').DataTable({
        destroy: true,
        ordering: true,
        order: [[0, "desc"]],
        responsive: true,
        info: false,
        paging: true,
        deferRender: true,
        pageLength: 7,
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
              liste_article();

            },
          },

          
        ],
      });
      $("#card_article_menuiserie").unblock();

    },
  });

}


