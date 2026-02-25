


var ignorePopstate = false;
var  enCoursparent = false;
// $(document).ready(function () {

//   /*
//     document.addEventListener('contextmenu', (e) => e.preventDefault()); hjkhjkhk
  
//   function ctrlShiftKey(e, keyCode) {
//     return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
//   }
  
//   document.onkeydown = (e) => {
//     // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
//     if (
//       event.keyCode === 123 ||
//       ctrlShiftKey(e, 'I') ||
//       ctrlShiftKey(e, 'J') ||
//       ctrlShiftKey(e, 'C') ||
//       (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
//     )
//       return false;
//   };*/

//   /*Right-click -> Inspect
//   Ctrl + Shift + I (DevTools shortcut)
//   F12 (DevTools shortcut)
//   Ctrl + Shift + J (Open the Console panel)
//   Ctrl + Shift + C (Open the Elements panel)
//   Ctrl + U (View Source-code)*/


//   function activerMenuEnFonctionDeRoute() {
//     var cheminURL = window.location.pathname;


//     // Retirer la classe 'active' de tous les éléments du menu
//     // Parcourir tous les liens du menu
//     $('.menu-item').each(function () {
//       var lienMenu = $(this).attr('href'); // Retirer le préfixe 'lien'

//       if (base+cheminURL.replace('/', '') == lienMenu) {
//         var clickedMenuItem = $(this);
//         $('.menu-item').parent().removeClass('menu-collapsed-open');
//         // Retirer la classe 'active' de tous les éléments du menu
//         $('.menu-item').parent().removeClass('active');
//         $('.navigation .nav-item').removeClass('active');

//         clickedMenuItem.parent().addClass('active');
//         return false; // Sortir de la boucle each après avoir trouvé le correspondant
//       }
//     });
//   }

//   // Appeler la fonction au chargement initial de la page
//   activerMenuEnFonctionDeRoute();



//   $(window).on('popstate', function (event) {
//     if (event.originalEvent && !ignorePopstate) {
//       var currentPath = window.location.pathname;
//       window.location.href = currentPath;

//     }
//   });

//   // $('#commander_article_').on('click', function (e) {
//   //   e.preventDefault();

//   //   $('#content').load(base + "lienview_detail_commande", function () {

//   //   });

//   // });

//   $('.menu-item').on('click', function (e) {
//     e.preventDefault(); // Empêcher le lien de changer de page
//     if (enCoursparent) return; // Empêche un deuxième clic si une requête est en cours
//     enCoursparent = true;
//     var id = $(this).data('id'); // Récupérer l'URL du lien
//     var pageToLoad = $(this).data('contenu'); // Récupérer l'URL du lien
//     console.log(pageToLoad);
    
//     $('#content').load(pageToLoad, function () {
//       history.pushState({}, '', base + id);
//       setTimeout(function () {
//           enCoursparent = false;
//     }, 1000); 
//     });


//     var clickedMenuItem = $(this);
//     $('.menu-item').parent().removeClass('menu-collapsed-open');
//     // Retirer la classe 'active' de tous les éléments du menu
//     $('.menu-item').parent().removeClass('active');
//     $('.navigation .nav-item').removeClass('active');

//     clickedMenuItem.parent().addClass('active');
//   });


// });


//*************************************************************************** */

$(document).ready(function () {

    function activerMenuEnFonctionDeRoute() {
      console.log("premier entrer");

        var currentUrl = window.location.href;

        $('.menu-item').each(function () {

            var lienMenu = $(this).attr('href');

            if (lienMenu && currentUrl.includes(lienMenu)) {

                $('.navigation .nav-item').removeClass('active');
                $(this).closest('.nav-item').addClass('active');

                // Si sous-menu → ouvrir parent
                $(this).closest('.menu-content').parent().addClass('open active');

                return false;
            }
        });
    }

    activerMenuEnFonctionDeRoute();

   $('.menu-item').on('click', function (e) {

        var url = $(this).attr('href');

        // Ignore liens #
        if (!url || url === '#') return;

        e.preventDefault();

        if (enCoursparent) return;
        enCoursparent = true;

        console.log("Chargement :", url);

        // Loader
        $('#main-content').html('<div style="padding:20px;text-align:center;">Chargement...</div>');

        $.ajax({
            url: url,
            type: "GET",
            success: function (response) {

                          
              var newContent = $(response).find('#main-content');

              if (newContent.length) {

                  $('#main-content').html(newContent.html());

                  var pageName = newContent.data('page');

                  if (pageName && window.pageInitializers && window.pageInitializers[pageName]) {
                      window.pageInitializers[pageName]();
                  }

                  history.pushState(null, '', url);
                  activerMenuEnFonctionDeRoute();
              }

                enCoursparent = false;
            },
            error: function () {
                window.location.href = url;
            }
        });

    });

    // Gestion bouton retour navigateur
    $(window).on('popstate', function () {
        location.reload();
    });

});


function charge_methode_contraceptive() {
  $.ajax({
    url: base + 'charge_methode_contraceptive',
    type: "POST",
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    }, success: function (data) {
      $("#pourmethode").empty();
      $("#pourmethode").append(data);
      $('select').selectpicker('refresh');
      if (idmethodepf != "") {
        $('#idmethodepf').val(idmethodepf).selectpicker('refresh');
      }
    }
  });
}

function deconnecter() {

  /*
    ignorePopstate = true;
  
    // Ajouter le code ici pour effectuer l'action spécifique
  
    // Réactiver la détection de l'événement popstate après un délai (ajustez selon vos besoins)
    setTimeout(function () {
      ignorePopstate = false;
    }, 1000);
  */
  $.ajax({
    beforeSend: function () { },
    url: base + "deconnecter",
    type: "POST",
    dataType: "JSON",
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    }, success: function (res) {
      var currentPath = window.location.pathname;
      //window.location.href = currentPath;
      location.reload();
    },
  });

}


function hide_categ_form() {
  if (sessionData && sessionData.is_connected && sessionData.role_user === "admin") {
    $("#hide_categ_form").removeClass("hidden");
  } else {
    $("#hide_categ_form").addClass('hidden');
  }
}

function isInteger(value) {
  return Number.isInteger(parseFloat(value));
}

// Fonction pour formater le prix
// function formatPrix(data) {
//   // Supprime toutes les virgules existantes et tous les caractères non numériques
//   var valeur = data.toString().replace(/[^0-9]/g, '');

//   // Ajoute une virgule après chaque groupe de trois chiffres
//   valeur = valeur.replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="prix-en-gras">.</span>');

//   // Ajoute le symbole de la devise, par exemple
//   return valeur + ' ar';
// }
function formatPrixjs(data) {




  var nombre = data.toString().replace(/[^\d.-]/g, '');

  // Divise la partie entière et la partie décimale
  var parties = nombre.split('.');
  var partieEntiere = parties[0];

  // Ajoute un point tous les trois chiffres dans la partie entière
  partieEntiere = partieEntiere.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Tronque la partie décimale à deux chiffres
  var partieDecimale = parties[1] ? ',' + parties[1].slice(0, 2) : '';

  // Recrée le nombre en concaténant la partie entière et la partie décimale
  var formattedValue = partieEntiere + partieDecimale;


  // Ajoute le symbole de la devise, par exemple
  return '<span class="prix-en-gras">' + formattedValue + '</span>';
}





function formatPrix(data) {


  var nombre = data.replace(/[^\d.-]/g, '');

  // Divise la partie entière et la partie décimale
  var parties = nombre.split('.');
  var partieEntiere = parties[0];

  // Ajoute un point tous les trois chiffres dans la partie entière
  partieEntiere = partieEntiere.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Tronque la partie décimale à deux chiffres
  var partieDecimale = parties[1] ? ',' + parties[1].slice(0, 2) : '';

  // Recrée le nombre en concaténant la partie entière et la partie décimale
  var formattedValue = partieEntiere + partieDecimale;


  // Ajoute le symbole de la devise, par exemple
  return formattedValue;
}

function formatPrixChart(data) {


  var nombre = data.toString().replace(/[^\d.-]/g, '');

  // Divise la partie entière et la partie décimale
  var parties = nombre.split('.');
  var partieEntiere = parties[0];

  // Ajoute un point tous les trois chiffres dans la partie entière
  partieEntiere = partieEntiere.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Tronque la partie décimale à deux chiffres
  var partieDecimale = parties[1] ? ',' + parties[1].slice(0, 2) : '';

  // Recrée le nombre en concaténant la partie entière et la partie décimale
  var formattedValue = partieEntiere + partieDecimale;


  // Ajoute le symbole de la devise, par exemple
  return formattedValue;
}

/*


  Formatte le nombre avec deux chiffres après la virgule et un point tous les trois chiffres
    var formattedValue = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: (Number.isInteger(parseFloat(nombre)) ? 0 : 2),
        maximumFractionDigits: 2
    }).format(parseFloat(nombre));


*/





function alertCustom(type_message, ft_icon, message) {
  var id = "alertdialog";
  var alert =
    `
                    <div style="z-index: 999999999" class="alert bg-` +
    type_message +
    ` alert-icon-left alert-arrow-left alert-dismissible mb-2" role="alert">
                        <span class="alert-icon"><i class="` +
    ft_icon +
    `"></i></span>
                        <button type="button" class="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>` +
    message +
    `</strong>
                    </div>
                `;

  var $alertElement = $(alert);

  $alertElement.find(".close").on("click", function () {
    $alertElement.hide(); // Masque l'élément
  });

  // Ajoute l'alerte au DOM
  $("#alert_place").append($alertElement);

  // Cache l'élément après un délai
  setTimeout(function () {
    $alertElement.hide();
  }, 6000); // 2000 ms = 2 secondes
}

function nouveau_commande() {

  $('#content').load(base + "lienview_detail_commande", function () {
  });

}

function editer_commande(id_devis, type) {



  ignorePopstate = true;

  // Ajouter le code ici pour effectuer l'action spécifique

  // Réactiver la détection de l'événement popstate après un délai (ajustez selon vos besoins)
  setTimeout(function () {
    ignorePopstate = false;
  }, 1000);


  if (type == 0) {
    var donnéesGet = {
      id_devis: id_devis
    };

    $('#content').load(base + "editer_devis", donnéesGet, function () {

    });
  } else {
    var donnéesGet = {
      id_devis: id_devis
    };

    $('#content').load(base + "editer_devis_meuble", donnéesGet, function () {


    });
  }

}
// function editer_commande_meuble(id_devis) {

//   var donnéesGet = {
//     id_devis: id_devis
//   };

//   $('#content').load(base + "editer_devis_m" ,donnéesGet, function() {

//     let scriptsToLoad = [];

//        scriptsToLoad = [
//         base +"/assets/js/meuble/commande/detail_commande_meuble.js",
//         base +"/assets/js/meuble/devis/devis.js",
//       ];
//     loadMultipleScripts(scriptsToLoad,0);

//   });

// }

var clave;

function setRadioValue(name, value) {
  if (value === 1) {
    $('input[name="' + name + '"][value="1"]').prop('checked', true); // Oui
  } else if (value === 0) {
    $('input[name="' + name + '"][value="0"]').prop('checked', true); // Non
  } else {
    $('input[name="' + name + '"]').prop('checked', false); // Aucun checked
  }
}

function formatPrixImput() {
  // Appliquer la validation à chaque champ de saisie spécifié
  $(' #qte , #poids, #taille , #presentation , #prix_boite, #poidstaille , #nbrrepos, #sf , #ageextraction , #agesoin ,#ageCpn').on('input', function () {
    validateNumber($(this));
  });
  $('#durreJours, #poids, #taille , #presentation , #prix_boite, #poidstaille , #nbrrepos').on('keydown', function (e) {

    var valer = $(this).val()
    if (valer != '') {
      var value = parseFloat($(this).val());

      if (e.key === 'ArrowUp') {
        e.preventDefault(); // Empêcher le comportement par défaut
        $(this).val(value + 1); // Incrémenter la valeur
        validateNumber($(this)); // Valider la nouvelle valeur
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); // Empêcher le comportement par défaut
        $(this).val(value - 1); // Décrémenter la valeur
        validateNumber($(this)); // Valider la nouvelle valeur
      }
    }
  });
}

function charge_membre1() {
  $.ajax({
    url: base + 'charge_membre',
    type: "POST",
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    }, success: function (data) {
      $("#membre_choix").empty();
      $("#membre_choix").append(data);
      $('select').selectpicker('refresh');

    }
  });
}

function validateNumber(input) {
  var value = input.val();

  // Supprimer tous les caractères non numériques, non '-' et non '.'
  value = value.replace(/[^0-9.]/g, '');

  // Ne pas permettre que le point soit le premier caractère
  if (value.startsWith('.')) {
    value = value.substring(1); // Retirer le premier caractère si c'est un point
  }

  // Autoriser seulement un seul signe '-' au début
  const minusCount = (value.match(/-/g) || []).length;
  if (minusCount > 1) {
    value = value.replace(/-/g, ''); // Supprimer tous les '-' en trop
  }

  // Gérer les virgules (un seul point décimal)
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join(''); // Supprimer les points supplémentaires
  }

  // Limiter à deux chiffres après la virgule
  if (parts.length === 2) {
    value = parts[0] + '.' + parts[1].slice(0, 2);
  }

  // Mettre à jour la valeur de l'input
  input.val(value);
}



// function formatPrixImputpo() {
//   var inputPrix1 = $("#somme_paye");

//   inputPrix1.on("input blur change", function () {
//     let valeurMax = parseFloat($("#somme_reste").val()) || 0;

//     var valeur = $(this).val();

//     // Supprime toutes les virgules existantes et tous les caractères non numériques
//     valeur = valeur.replace(/[^0-9]/g, '');

//     // Si la valeur est vide, mettez à jour le champ avec une seule zéro
//     // if (valeur === '') {
//     //     $(this).val('0').css('font-weight', '500');
//     //     return;
//     // }

//     // Supprime les zéros non significatifs au début (ex: "00123" devient "123")
//     valeur = valeur.replace(/^0+/, '');

//     // Assurez-vous que la valeur est un nombre
//     var parsedValue = parseFloat(valeur);
//     if (isNaN(parsedValue)) {
//       parsedValue = 0;
//     }

//     // Imposer une valeur maximale
//     if (parsedValue > valeurMax) {
//       valeur = valeur.substring(0, valeur.length - 1); // Retire le dernier caractère ajouté
//     }

//     // Ajoute une virgule après chaque groupe de trois chiffres
//     valeur = valeur.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//     // Met à jour la valeur du champ
//     $(this).val(valeur).css('font-weight', '500');
//   });
//   // Ajoute un gestionnaire d'événements pour empêcher la saisie de caractères non numériques
//   inputPrix1.on("keypress", function (event) {
//     var charCode = (event.which) ? event.which : event.keyCode;

//     // Autorise les chiffres et le point décimal, mais pas plus d'un point
//     if (charCode === 46 && $(this).val().indexOf('.') !== -1) {
//       return false;
//     }

//     // Autorise uniquement les chiffres
//     return !(charCode > 31 && (charCode < 48 || charCode > 57));
//   });
// }



(function (window, document, $) {
  'use strict';
  var $html = $('html');
  var $body = $('body');


  $(window).on('load', function () {
    var rtl;
    var compactMenu = false; // Set it to true, if you want default menu to be compact

    if ($body.hasClass("menu-collapsed")) {
      compactMenu = true;
    }

    if ($('html').data('textdirection') == 'rtl') {
      rtl = true;
    }

    setTimeout(function () {
      $html.removeClass('loading').addClass('loaded');
    }, 1200);

    $.app.menu.init(compactMenu);

    // Navigation configurations
    var config = {
      speed: 200 // set speed to expand / collpase menu
    };
    if ($.app.nav.initialized === false) {
      $.app.nav.init(config);
    }

    Unison.on('change', function (bp) {
      $.app.menu.change();
    });

    // Tooltip Initialization
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body'
    });

    // Top Navbars - Hide on Scroll
    if ($(".navbar-hide-on-scroll").length > 0) {
      $(".navbar-hide-on-scroll.fixed-top").headroom({
        "offset": 205,
        "tolerance": 5,
        "classes": {
          // when element is initialised
          initial: "headroom",
          // when scrolling up
          pinned: "headroom--pinned-top",
          // when scrolling down
          unpinned: "headroom--unpinned-top",
        }
      });
      // Bottom Navbars - Hide on Scroll
      $(".navbar-hide-on-scroll.fixed-bottom").headroom({
        "offset": 205,
        "tolerance": 5,
        "classes": {
          // when element is initialised
          initial: "headroom",
          // when scrolling up
          pinned: "headroom--pinned-bottom",
          // when scrolling down
          unpinned: "headroom--unpinned-bottom",
        }
      });
    }

    //Match content & menu height for content menu
    setTimeout(function () {
      if ($('body').hasClass('vertical-content-menu')) {
        setContentMenuHeight();
      }
    }, 500);

    function setContentMenuHeight() {
      var menuHeight = $('.main-menu').height();
      var bodyHeight = $('.content-body').height();
      if (bodyHeight < menuHeight) {
        $('.content-body').css('height', menuHeight);
      }
    }

    // Collapsible Card
    $('a[data-action="collapse"]').on('click', function (e) {
      e.preventDefault();
      $(this).closest('.card').children('.card-content').collapse('toggle');
      $(this).closest('.card').find('[data-action="collapse"] i').toggleClass('ft-plus ft-minus');

    });

    // Toggle fullscreen
    $('a[data-action="expand"]').on('click', function (e) {
      e.preventDefault();
      $(this).closest('.card').find('[data-action="expand"] i').toggleClass('ft-maximize ft-minimize');
      $(this).closest('.card').toggleClass('card-fullscreen');
    });

    //  Notifications & messages scrollable
    if ($('.scrollable-container').length > 0) {
      $('.scrollable-container').each(function () {
        var scrollable_container = new PerfectScrollbar($(this)[0], {
          wheelPropagation: false
        });

      });
    }

    // Reload Card
    $('a[data-action="reload"]').on('click', function () {
      var block_ele = $(this).closest('.card');

      // Block Element
      block_ele.block({
        message: '<div class="ft-refresh-cw icon-spin font-medium-2"></div>',
        timeout: 2000, //unblock after 2 seconds
        overlayCSS: {
          backgroundColor: '#FFF',
          cursor: 'wait',
        },
        css: {
          border: 0,
          padding: 0,
          backgroundColor: 'none'
        }
      });
    });

    // Close Card
    $('a[data-action="close"]').on('click', function () {
      $(this).closest('.card').removeClass().slideUp('fast');
    });

    // Match the height of each card in a row
    setTimeout(function () {
      $('.row.match-height').each(function () {
        $(this).find('.card').not('.card .card').matchHeight(); // Not .card .card prevents collapsible cards from taking height
      });
    }, 500);


    $('.card .heading-elements a[data-action="collapse"]').on('click', function () {
      var $this = $(this),
        card = $this.closest('.card');
      var cardHeight;

      if (parseInt(card[0].style.height, 10) > 0) {
        cardHeight = card.css('height');
        card.css('height', '').attr('data-height', cardHeight);
      } else {
        if (card.data('height')) {
          cardHeight = card.data('height');
          card.css('height', cardHeight).attr('data-height', '');
        }
      }
    });

    // Add Menu Collapsed Open class to the parents of active menu item
    $(".main-menu-content")
      .find("li.active")
      .parents("li")
      .addClass("menu-collapsed-open")

    // Add open class to parent list item if subitem is active except compact menu
    var menuType = $body.data('menu');
    if (menuType != 'vertical-compact-menu' && menuType != 'horizontal-menu' && compactMenu === false) {
      $(".main-menu-content").find('li.active').parents('li').addClass('open');
    }
    if (menuType == 'vertical-compact-menu' || menuType == 'horizontal-menu') {
      $(".main-menu-content").find('li.active').parents('li:not(.nav-item)').addClass('open');
      $(".main-menu-content").find('li.active').parents('li').addClass('active');
    }

    //card heading actions buttons small screen support
    $(".heading-elements-toggle").on("click", function () {
      $(this).parent().children(".heading-elements").toggleClass("visible");
    });

    //  Dynamic height for the chartjs div for the chart animations to work
    var chartjsDiv = $('.chartjs'),
      canvasHeight = chartjsDiv.children('canvas').attr('height');
    chartjsDiv.css('height', canvasHeight);


    /************** search *******************/
    var $filename = $(".search-input input").data("search")
    // Navigation Search area Open
    $(".nav-link-search").on("click", function () {
      var $this = $(this)
      var searchInput = $(this)
        .parent(".nav-search")
        .find(".search-input")
      searchInput.addClass("open");
      setTimeout(function () {
        $(".search-input.open .input").focus()
      }, 50)
      $(".search-input .search-list li").remove()
      $(".search-input .search-list").addClass("show")
    })

    // Navigation Search area Close
    $(".search-input-close i").on("click", function () {
      var $this = $(this),
        searchInput = $(this).closest(".search-input")
      if (searchInput.hasClass("open")) {
        searchInput.removeClass("open")
        $(".search-input input").val("")
        $(".search-input input").blur()
        $(".search-input .search-list").removeClass("show")
        if ($(".app-content").hasClass("show-overlay")) {
          $(".app-content").removeClass("show-overlay")
        }
      }
    })

    // Navigation Search area Close on click of app-content
    $(".app-content").on("click", function () {
      var $this = $(".search-input-close"),
        searchInput = $($this).parent(".search-input"),
        searchList = $(".search-list")
      if (searchInput.hasClass("open")) {
        searchInput.removeClass("open")
      }
      if (searchList.hasClass("show")) {
        searchList.removeClass("show")
      }
      if ($(".app-content").hasClass("show-overlay")) {
        $(".app-content").removeClass("show-overlay")
      }
    })

    // Filter
    $(".search-input .input").on("keyup", function (e) {

      if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
        if (e.keyCode == 27) {
          // $(".app-content").removeClass("show-overlay")

          $(".search-input input").val("")
          $(".search-input input").blur()
          $(".search-input").removeClass("open")
          if ($(".search-list").hasClass("show")) {
            $(this).removeClass("show")
            $(".search-input").removeClass("show")
          }
        }

        // Define variables
        var value = $(this)
          .val()
          .toLowerCase(), //get values of inout on keyup
          activeClass = "",
          liList = $("ul.search-list li") // get all the list items of the search
        liList.remove()

        // If input value is blank
        // if (value != "") {
        //   $(".app-content").addClass("show-overlay")


        //   var $startList = "",
        //     $otherList = "",
        //     $htmlList = "",
        //     $activeItemClass = "",
        //     a = 0

        //   // getting json data from file for search results
        //   $.getJSON("<?php echo base_url() ?>/app-assets/data/" + $filename + ".json", function (
        //     data
        //   ) {
        //     for (var i = 0; i < data.listItems.length; i++) {

        //       // Search list item start with entered letters and create list
        //       if (
        //         data.listItems[i].name.toLowerCase().indexOf(value) == 0 &&
        //         a < 10 || !(data.listItems[i].name.toLowerCase().indexOf(value) == 0) &&
        //         data.listItems[i].name.toLowerCase().indexOf(value) > -1 &&
        //         a < 10
        //       ) {
        //         if (a === 0) {
        //           $activeItemClass = "current_item"
        //         } else {
        //           $activeItemClass = ""
        //         }
        //         $startList +=
        //           '<li class="auto-suggestion d-flex align-items-center justify-content-between cursor-pointer ' +
        //           $activeItemClass +
        //           '">' +
        //           '<a class="d-flex align-items-center justify-content-between w-100" href=' +
        //           data.listItems[i].url +
        //           ">" +
        //           '<div class="d-flex justify-content-start">' +
        //           '<span class="mr-75 ' +
        //           data.listItems[i].icon +
        //           '"></span>' +
        //           "<span>" +
        //           data.listItems[i].name +
        //           "</span>" +
        //           "</div>"
        //         a++
        //       }
        //     }
        //     if ($startList == "" && $otherList == "") {
        //       $otherList =
        //         '<li class="auto-suggestion d-flex align-items-center justify-content-between cursor-pointer">' +
        //         '<a class="d-flex align-items-center justify-content-between w-100">' +
        //         '<div class="d-flex justify-content-start">' +
        //         '<span class="mr-75"></span>' +
        //         "<span>No results found.</span>" +
        //         "</div>" +
        //         "</a>" +
        //         "</li>"
        //     }

        //     $htmlList = $startList.concat($otherList) // merging start with and other list
        //     $("ul.search-list").html($htmlList) // Appending list to <ul>
        //   })
        // } else {
        //   // if search input blank, hide overlay
        //   if ($(".app-content").hasClass("show-overlay")) {
        //     $(".app-content").removeClass("show-overlay")
        //   }
        // }
      }
    })

    // If we use up key(38) Down key (40) or Enter key(13)
    $(window).on("keydown", function (e) {
      var $current = $(".search-list li.current_item"),
        $next,
        $prev
      if (e.keyCode === 40) {
        $next = $current.next()
        $current.removeClass("current_item")
        $current = $next.addClass("current_item")
      } else if (e.keyCode === 38) {
        $prev = $current.prev()
        $current.removeClass("current_item")
        $current = $prev.addClass("current_item")
      }

      if (e.keyCode === 13 && $(".search-list li.current_item").length > 0) {
        var selected_item = $(".search-list li.current_item a")
        window.location = selected_item.attr("href")
        $(selected_item).trigger("click")
      }
    })

    // Add class on hover of the list
    $(document).on("mouseenter", ".search-list li", function (e) {
      $(this)
        .siblings()
        .removeClass("current_item")
      $(this).addClass("current_item")
    })
    $(document).on("click", ".search-list li", function (e) {
      e.stopPropagation()
    })
  });

  // Hide overlay menu on content overlay click on small screens
  $(document).on('click', '.sidenav-overlay', function (e) {
    // Hide menu
    $.app.menu.hide();
    return false;
  });

  // Execute below code only if we find hammer js for touch swipe feature on small screen
  if (typeof Hammer !== 'undefined') {

    var rtl;
    if ($('html').data('textdirection') == 'rtl') {
      rtl = true;
    }

    // Swipe menu gesture
    var swipeInElement = document.querySelector('.drag-target'),
      swipeInAction = 'panright',
      swipeOutAction = 'panleft';

    if (rtl === true) {
      swipeInAction = 'panleft';
      swipeOutAction = 'panright';
    }

    if ($(swipeInElement).length > 0) {
      var swipeInMenu = new Hammer(swipeInElement);

      swipeInMenu.on(swipeInAction, function (ev) {
        if ($body.hasClass('vertical-overlay-menu')) {
          $.app.menu.open();
          return false;
        }
      });
    }

    // menu swipe out gesture
    setTimeout(function () {
      var swipeOutElement = document.querySelector('.main-menu');
      var swipeOutMenu;

      if ($(swipeOutElement).length > 0) {
        swipeOutMenu = new Hammer(swipeOutElement);

        swipeOutMenu.get('pan').set({
          direction: Hammer.DIRECTION_ALL,
          threshold: 100
        });

        swipeOutMenu.on(swipeOutAction, function (ev) {
          if ($body.hasClass('vertical-overlay-menu')) {
            $.app.menu.hide();
            return false;
          }
        });
      }
    }, 300);

    // menu overlay swipe out gestrue
    var swipeOutOverlayElement = document.querySelector('.sidenav-overlay');

    if ($(swipeOutOverlayElement).length > 0) {

      var swipeOutOverlayMenu = new Hammer(swipeOutOverlayElement);

      swipeOutOverlayMenu.on(swipeOutAction, function (ev) {
        if ($body.hasClass('vertical-overlay-menu')) {
          $.app.menu.hide();
          return false;
        }
      });
    }
  }

  $(document).on('click', '.menu-toggle, .modern-nav-toggle', function (e) {
    e.preventDefault();

    // Hide dropdown of user profile section for material templates
    if ($('.user-profile .user-info .dropdown').hasClass('show')) {
      $('.user-profile .user-info .dropdown').removeClass('show');
      $('.user-profile .user-info .dropdown .dropdown-menu').removeClass('show');
    }

    // Toggle menu
    $.app.menu.toggle();

    setTimeout(function () {
      $(window).trigger("resize");
    }, 200);

    if ($('#collapsed-sidebar').length > 0) {
      setTimeout(function () {
        if ($body.hasClass('menu-expanded') || $body.hasClass('menu-open')) {
          $('#collapsed-sidebar').prop('checked', false);
        } else {
          $('#collapsed-sidebar').prop('checked', true);
        }
      }, 1000);
    }

    // Hides dropdown on click of menu toggle
    // $('[data-toggle="dropdown"]').dropdown('hide');

    // Hides collapse dropdown on click of menu toggle
    if ($('.vertical-overlay-menu .navbar-with-menu .navbar-container .navbar-collapse').hasClass('show')) {
      $('.vertical-overlay-menu .navbar-with-menu .navbar-container .navbar-collapse').removeClass('show');
    }

    return false;
  });

  $(document).on('click', '.open-navbar-container', function (e) {

    var currentBreakpoint = Unison.fetch.now();
  });

  // Add Children Class
  $('.navigation').find('li').has('ul').addClass('has-sub');

  $('.carousel').carousel({
    interval: 2000
  });

  // Page full screen
  $('.nav-link-expand').on('click', function (e) {

    ignorePopstate = true;

    // Ajouter le code ici pour effectuer l'action spécifique

    // Réactiver la détection de l'événement popstate après un délai (ajustez selon vos besoins)
    setTimeout(function () {
      ignorePopstate = false;
    }, 1000);

    if (typeof screenfull != 'undefined') {
      if (screenfull.isEnabled) {
        screenfull.toggle();
      }
    }
  });
  if (typeof screenfull != 'undefined') {
    if (screenfull.isEnabled) {
      $(document).on(screenfull.raw.fullscreenchange, function () {
        if (screenfull.isFullscreen) {
          $('.nav-link-expand').find('i').toggleClass('ft-minimize ft-maximize');
        } else {
          $('.nav-link-expand').find('i').toggleClass('ft-maximize ft-minimize');
        }
      });
    }
  }

  $(document).on('click', '.mega-dropdown-menu', function (e) {
    e.stopPropagation();
  });

  $(document).ready(function () {

    /**********************************
     *   Form Wizard Step Icon
     **********************************/
    $('.step-icon').each(function () {
      var $this = $(this);
      if ($this.siblings('span.step').length > 0) {
        $this.siblings('span.step').empty();
        $(this).appendTo($(this).siblings('span.step'));
      }
    });
  });

  // Update manual scroller when window is resized
  $(window).resize(function () {
    $.app.menu.manualScroller.updateHeight();
    // clear search if width is greater than 768
    if ($(window).width() > 768) {
      $(".search-input input").val("")
      $(".search-input input").blur()
      $(".search-input").removeClass("open")
      if ($(".header-navbar").find(".search-list.show")) {
        $(".header-navbar").find(".search-list.show").removeClass("show")
      }
      $(".app-content").removeClass("show-overlay")
    }
  });

  $('#sidebar-page-navigation').on('click', 'a.nav-link', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $this = $(this),
      href = $this.attr('href');
    var offset = $(href).offset();
    var scrollto = offset.top - 80; // minus fixed header height
    $('html, body').animate({
      scrollTop: scrollto
    }, 0);
    setTimeout(function () {
      $this.parent('.nav-item').siblings('.nav-item').children('.nav-link').removeClass('active');
      $this.addClass('active');
    }, 100);
  });
  // main menu internationalization

  // init i18n and load language file
  // i18next
  //   .use(window.i18nextXHRBackend)
  //   .init({
  //     debug: false,
  //     fallbackLng: "en",
  //     backend: {
  //       loadPath: "<?php ec/app-assets/data/locales/{{lng}}.json",
  //     },
  //     returnObjects: true
  //   },
  //     function (err, t) {
  //       // resources have been loaded
  //       jqueryI18next.init(i18next, $);
  //     });

  // change language according to data-language of dropdown item
  $(".dropdown-language .dropdown-item").on("click", function () {
    var $this = $(this);
    $this.siblings(".selected").removeClass("selected")
    $this.addClass("selected");
    var selectedLang = $this.text()
    var selectedFlag = $this.find(".flag-icon").attr("class");
    $("#dropdown-flag .selected-language").text(selectedLang);
    $("#dropdown-flag .flag-icon").removeClass().addClass(selectedFlag);
    var currentLanguage = $this.data("language");
    i18next.changeLanguage(currentLanguage, function (err, t) {
      $(".main-menu , .navbar-horizontal").localize();
    });
  })
})(window, document, jQuery);


// notification_header();

// notification sur le header (devis => etat=3)
function notification_header() {
  $.ajax({
    url: base + "afficher_notification",
    type: "POST",
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    }, success: function (res) {
      $("#liste_notification").empty();
      $("#liste_notification").append(res);
    },
  });
}


function exportDatabase() {

  ignorePopstate = true;

  setTimeout(function () {
    ignorePopstate = false;
  }, 1000);

  $.ajax({
    beforeSend: function () {
      $("body").block({
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
    url: base + "exportDatabase",
    type: "POST",
    dataType: 'json',
    error: function (xhr, status, error) {
      alertCustom("danger", 'ft-x', "Une erreur s'est produite");
    }, success: function (file) {
      $("body").unblock();
      window.open(file.file);
      alertCustom("success", 'ft-check', "Database exporter avec succès");
    },
    error: function (data) {
      $(".body").unblock();
    }
  });
}





function Unite(nombre) {
  var unite;
  switch (nombre) {
    case 0: unite = "zéro"; break;
    case 1: unite = "un"; break;
    case 2: unite = "deux"; break;
    case 3: unite = "trois"; break;
    case 4: unite = "quatre"; break;
    case 5: unite = "cinq"; break;
    case 6: unite = "six"; break;
    case 7: unite = "sept"; break;
    case 8: unite = "huit"; break;
    case 9: unite = "neuf"; break;
  }//fin switch
  return unite;
}//-----------------------------------------------------------------------

function Dizaine(nombre) {
  switch (nombre) {
    case 10: dizaine = "dix"; break;
    case 11: dizaine = "onze"; break;
    case 12: dizaine = "douze"; break;
    case 13: dizaine = "treize"; break;
    case 14: dizaine = "quatorze"; break;
    case 15: dizaine = "quinze"; break;
    case 16: dizaine = "seize"; break;
    case 17: dizaine = "dix-sept"; break;
    case 18: dizaine = "dix-huit"; break;
    case 19: dizaine = "dix-neuf"; break;
    case 20: dizaine = "vingt"; break;
    case 30: dizaine = "trente"; break;
    case 40: dizaine = "quarante"; break;
    case 50: dizaine = "cinquante"; break;
    case 60: dizaine = "soixante"; break;
    case 70: dizaine = "soixante-dix"; break;
    case 80: dizaine = "quatre-vingt"; break;
    case 90: dizaine = "quatre-vingt-dix"; break;
  }//fin switch
  return dizaine;
}//-----------------------------------------------------------------------


function nombreEnLettres(nombre) {
  var i, j, n, quotient, reste, nb;
  var ch
  var numberToLetter = '';
  //__________________________________

  if (nombre.toString().replace(/ /gi, "").length > 15) return "dépassement de capacité";
  if (isNaN(nombre.toString().replace(/ /gi, ""))) return "Nombre non valide";

  nb = parseFloat(nombre.toString().replace(/ /gi, ""));
  if (Math.ceil(nb) != nb) return "Nombre avec virgule non géré.";

  n = nb.toString().length;
  switch (n) {
    case 1: numberToLetter = Unite(nb); break;
    case 2: if (nb > 19) {
      quotient = Math.floor(nb / 10);
      reste = nb % 10;
      if (nb < 71 || (nb > 79 && nb < 91)) {
        if (reste == 0) numberToLetter = Dizaine(quotient * 10);
        if (reste == 1) numberToLetter = Dizaine(quotient * 10) + "-et-" + Unite(reste);
        if (reste > 1) numberToLetter = Dizaine(quotient * 10) + "-" + Unite(reste);
      } else numberToLetter = Dizaine((quotient - 1) * 10) + "-" + Dizaine(10 + reste);
    } else numberToLetter = Dizaine(nb);
      break;
    case 3: quotient = Math.floor(nb / 100);
      reste = nb % 100;
      if (quotient == 1 && reste == 0) numberToLetter = "cent";
      if (quotient == 1 && reste != 0) numberToLetter = "cent" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = Unite(quotient) + " cents";
      if (quotient > 1 && reste != 0) numberToLetter = Unite(quotient) + " cents " + nombreEnLettres(reste);
      break;
    case 4: quotient = Math.floor(nb / 1000);
      reste = nb - quotient * 1000;
      if (quotient == 1 && reste == 0) numberToLetter = "mille";
      if (quotient == 1 && reste != 0) numberToLetter = "mille" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " milles";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " milles " + nombreEnLettres(reste);
      break;
    case 5: quotient = Math.floor(nb / 1000);
      reste = nb - quotient * 1000;
      if (quotient == 1 && reste == 0) numberToLetter = "mille";
      if (quotient == 1 && reste != 0) numberToLetter = "mille" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " milles";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " milles " + nombreEnLettres(reste);
      break;
    case 6: quotient = Math.floor(nb / 1000);
      reste = nb - quotient * 1000;
      if (quotient == 1 && reste == 0) numberToLetter = "mille";
      if (quotient == 1 && reste != 0) numberToLetter = "mille" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " milles";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " milles " + nombreEnLettres(reste);
      break;
    case 7: quotient = Math.floor(nb / 1000000);
      reste = nb % 1000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un million";
      if (quotient == 1 && reste != 0) numberToLetter = "un million" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " millions";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " millions " + nombreEnLettres(reste);
      break;
    case 8: quotient = Math.floor(nb / 1000000);
      reste = nb % 1000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un million";
      if (quotient == 1 && reste != 0) numberToLetter = "un million" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " millions";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " millions " + nombreEnLettres(reste);
      break;
    case 9: quotient = Math.floor(nb / 1000000);
      reste = nb % 1000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un million";
      if (quotient == 1 && reste != 0) numberToLetter = "un million" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " millions";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " millions " + nombreEnLettres(reste);
      break;
    case 10: quotient = Math.floor(nb / 1000000000);
      reste = nb - quotient * 1000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
      if (quotient == 1 && reste != 0) numberToLetter = "un milliard" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " milliards";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " milliards " + nombreEnLettres(reste);
      break;
    case 11: quotient = Math.floor(nb / 1000000000);
      reste = nb - quotient * 1000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
      if (quotient == 1 && reste != 0) numberToLetter = "un milliard" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " milliards";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " milliards " + nombreEnLettres(reste);
      break;
    case 12: quotient = Math.floor(nb / 1000000000);
      reste = nb - quotient * 1000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
      if (quotient == 1 && reste != 0) numberToLetter = "un milliard" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " milliards";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " milliards " + nombreEnLettres(reste);
      break;
    case 13: quotient = Math.floor(nb / 1000000000000);
      reste = nb - quotient * 1000000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un billion";
      if (quotient == 1 && reste != 0) numberToLetter = "un billion" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " billions";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " billions " + nombreEnLettres(reste);
      break;
    case 14: quotient = Math.floor(nb / 1000000000000);
      reste = nb - quotient * 1000000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un billion";
      if (quotient == 1 && reste != 0) numberToLetter = "un billion" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " billions";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " billions " + nombreEnLettres(reste);
      break;
    case 15: quotient = Math.floor(nb / 1000000000000);
      reste = nb - quotient * 1000000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un billion";
      if (quotient == 1 && reste != 0) numberToLetter = "un billion" + " " + nombreEnLettres(reste);
      if (quotient > 1 && reste == 0) numberToLetter = nombreEnLettres(quotient) + " billions";
      if (quotient > 1 && reste != 0) numberToLetter = nombreEnLettres(quotient) + " billions " + nombreEnLettres(reste);
      break;
  }//fin switch
  /*respect de l'accord de quatre-vingt*/
  if (numberToLetter.substr(numberToLetter.length - "quatre-vingt".length, "quatre-vingt".length) == "quatre-vingt") numberToLetter = numberToLetter + "s";

  return numberToLetter;
}//-----------------------------------------------------------------------
