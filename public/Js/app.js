var enCoursparent = false;
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
});


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

