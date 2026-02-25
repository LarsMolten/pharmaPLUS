var enCoursparent = false;

$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('.menu-item').on('click', function (e) {
        e.preventDefault(); // Empêcher le lien de changer de page
        if (enCoursparent) return; // Empêche un deuxième clic si une requête est en cours
        enCoursparent = true;
        var id = $(this).data('id'); // Récupérer l'URL du lien
        var pageToLoad = $(this).data('contenu'); // Récupérer l'URL du lien

        $('#content').load(pageToLoad, function () {
        history.pushState({}, '', base + id);
        setTimeout(function () {
            enCoursparent = false;
        }, 1000);
        });


        var clickedMenuItem = $(this);
        $('.menu-item').parent().removeClass('menu-collapsed-open');
        // Retirer la classe 'active' de tous les éléments du menu
        $('.menu-item').parent().removeClass('active');
        $('.navigation .nav-item').removeClass('active');

        clickedMenuItem.parent().addClass('active');
    });


    $(window).on('popstate', function (event) {
        if (event.originalEvent && !ignorePopstate) {
        var currentPath = window.location.pathname;
        window.location.href = currentPath;

        }
    });

});

    function activerMenuEnFonctionDeRoute() {
        var cheminURL = window.location.pathname;

        // Retirer la classe 'active' de tous les éléments du menu
        // Parcourir tous les liens du menu
        $('.menu-item').each(function () {
        var lienMenu = $(this).attr('href'); // Retirer le préfixe 'lien'

        if (base+cheminURL.replace('/', '') == lienMenu) {
            var clickedMenuItem = $(this);
            $('.menu-item').parent().removeClass('menu-collapsed-open');
            // Retirer la classe 'active' de tous les éléments du menu
            $('.menu-item').parent().removeClass('active');
            $('.navigation .nav-item').removeClass('active');

            clickedMenuItem.parent().addClass('active');
            return false; // Sortir de la boucle each après avoir trouvé le correspondant
        }
        });
    }



      // Appeler la fonction au chargement initial de la page
      activerMenuEnFonctionDeRoute();




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
