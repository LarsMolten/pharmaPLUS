var enCoursparent = false;
var enCours = false;


$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Gestionnaire global pour toutes les actions dynamiques
    $(document).on('click', '[data-action]', function (e) {

        e.preventDefault();

        var action = $(this).data('action');
        var id = $(this).data('id');

        if (action && typeof window[action] === 'function') {
            window[action](id, $(this));
        } else {
            console.warn('Fonction non trouvée:', action);
        }
    });


    $(window).on('popstate', function (event) {
        if (event.originalEvent && !ignorePopstate) {
            var currentPath = window.location.pathname;
            window.location.href = currentPath;

        }
        activerMenuEnFonctionDeRoute();
    });



    // Appeler la fonction au chargement initial de la page
    activerMenuEnFonctionDeRoute();


    function initCurrentPage() {

        var pageName = $('#main-content').find('[data-page]').data('page');

        if (pageName && window.pageInitializers && window.pageInitializers[pageName]) {
            window.pageInitializers[pageName]();
        }
    }

    // Initial load
    initCurrentPage();

    // Après AJAX injection
    window.initCurrentPage = initCurrentPage;



    $('.menu-item').on('click', function (e) {

        // console.log("Menu item clicked: " + $(this).attr('href'));

        var url = $(this).attr('href');

        // Ignore liens #
        if (!url || url === '#') return;

        e.preventDefault();

        if (enCoursparent) return;
        enCoursparent = true;

        // Loader
        $('#main-content').html('<div style="padding:20px;text-align:center;">Chargement...</div>');

        $.ajax({
            url: url,
            type: "GET",
            success: function (response) {

                // console.log("Contenu chargé avec succès depuis : " + url);

                var newContent = $(response).find('#main-content');

                if (newContent.length) {

                    $('#main-content').html(newContent.html());

                    // Détection automatique de la page
                    initCurrentPage();

                    history.pushState(null, '', url);
                    activerMenuEnFonctionDeRoute();

                } else {
                    window.location.href = url;
                }

                enCoursparent = false;
            },
            error: function () {
                window.location.href = url;
            }
        });

    });



});

function activerMenuEnFonctionDeRoute() {

    var currentPath = window.location.pathname.replace(/\/$/, '');

    // Nettoyage COMPLET
    $('#main-menu-navigation li').removeClass('active open');

    $('#main-menu-navigation a.menu-item').each(function () {

        var href = $(this).attr('href');

        // Ignorer les #
        if (!href || href === '#') return;

        var linkPath = $('<a>', { href: href })[0].pathname.replace(/\/$/, '');

        if (currentPath === linkPath) {

            var currentLi = $(this).closest('li.nav-item');

            // Activer le lien courant
            currentLi.addClass('active');

            // Activer le parent (Pharmacie)
            currentLi.parents('li.nav-item').addClass('active open');
        }

    });
}


function show_delete_dialog_modal(id, warning, id_table, data_action_delete, data_action_close) {


    $(id_table).block({

        message: `


            <div class="card" style="max-width:400px ; ">
            <div class="card-header" style="max-width:400px ;">
                    <i class="ft-trash-2" style='color:rgb(233, 46, 46);font-size:50px'></i>
            </div>
            <div class="card-content">
                <div class="card-body">
                    <p>`+ warning + `</p>

                        <button type="button" data-id="`+ id + `"  data-action="` + data_action_delete + `" class="mr-1 mb-1 btn btn-sm btn-warning btn-min-width"><i class="ft-check"></i> Oui</button>
                        <button type="button" data-action="`+ data_action_close + `" class="mr-1 mb-1 btn btn-sm btn-outline-light btn-min-width"><i class="ft-x"></i> Annuler</button>


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

function alertCustom(type_message, ft_icon, message) {
    var id = "alertdialog";
    var alert =
        `
                    <div style="z-index: 9999999999999" class="alert bg-` +
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


// function formatPrixImput() {
//     // Appliquer la validation à chaque champ de saisie spécifié
//     $(' #qte , #presentation , #prix_boite, #prix_unitaire').on('input', function () {
//         validateNumber($(this));
//     });
//     $('#durreJours, #poids, #taille , #presentation , #prix_boite, #prix_unitaire').on('keydown', function (e) {

//         var valer = $(this).val()
//         if (valer != '') {
//             var value = parseFloat($(this).val());

//             if (e.key === 'ArrowUp') {
//                 e.preventDefault(); // Empêcher le comportement par défaut
//                 $(this).val(value + 1); // Incrémenter la valeur
//                 validateNumber($(this)); // Valider la nouvelle valeur
//             } else if (e.key === 'ArrowDown') {
//                 e.preventDefault(); // Empêcher le comportement par défaut
//                 $(this).val(value - 1); // Décrémenter la valeur
//                 validateNumber($(this)); // Valider la nouvelle valeur
//             }
//         }
//     });
// }

// function formatPrix(data) {


//     var nombre = data.replace(/[^\d.-]/g, '');

//     // Divise la partie entière et la partie décimale
//     var parties = nombre.split('.');
//     var partieEntiere = parties[0];

//     // Ajoute un point tous les trois chiffres dans la partie entière
//     partieEntiere = partieEntiere.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//     // Tronque la partie décimale à deux chiffres
//     var partieDecimale = parties[1] ? ',' + parties[1].slice(0, 2) : '';

//     // Recrée le nombre en concaténant la partie entière et la partie décimale
//     var formattedValue = partieEntiere + partieDecimale;


//     // Ajoute le symbole de la devise, par exemple
//     return formattedValue;
// }

// function formatPrixChart(data) {


//     var nombre = data.toString().replace(/[^\d.-]/g, '');

//     // Divise la partie entière et la partie décimale
//     var parties = nombre.split('.');
//     var partieEntiere = parties[0];

//     // Ajoute un point tous les trois chiffres dans la partie entière
//     partieEntiere = partieEntiere.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//     // Tronque la partie décimale à deux chiffres
//     var partieDecimale = parties[1] ? ',' + parties[1].slice(0, 2) : '';

//     // Recrée le nombre en concaténant la partie entière et la partie décimale
//     var formattedValue = partieEntiere + partieDecimale;


//     // Ajoute le symbole de la devise, par exemple
//     return formattedValue;
// }




// formatage automatique des prix dans les inputs
$(document).on("input", ".format-number", function () {

    let value = $(this).val();

    // Autoriser chiffres + un point
    value = value.replace(/[^\d.]/g, "");

    // Empêcher plusieurs points
    let parts = value.split(".");
    if (parts.length > 2) {
        value = parts[0] + "." + parts[1];
    }

    parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    value = parts.join(".");

    $(this).val(value);
});

// Nettoyer les espaces avant la soumission du formulaire
$(document).on("submit", "form", function () {

    $(this).find(".format-number").each(function () {

        let cleanValue = $(this).val().replace(/\s/g, "");

        $(this).val(cleanValue);
    });
});

// Formate un nombre avec espaces comme séparateurs de milliers dans l'affichage
function formatNumberDisplay(value) {
    if (value == null) return "";

    // Convertit en string si nécessaire
    value = value.toString();

    // Sépare partie entière et décimale
    let parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    let formated = parts.join(",");

    return "<strong>"+ formated + "</strong>";
}



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
