var number = 1;

/**
 * Initialise nos bouttons.
 */
$(document).ready(function() {

    // By default, all buttons aren't clicked
    $(".btnType, .btnPrice, .btnStar, .btnStyle, .btnRemove").each(function() {
        uncolorButton($(this));
    });
    // If the screen is too small, add Br
    if(window.matchMedia("(max-width: 600px)").matches) {
        addBr(number);
        number++;
    }
});

/**
 * Empeche la fenetre (filtrer) de se refermer apres un clique
 */
$(".dropdown-item, #textSearch, #searchButton").on('click', function (e) {
    e.stopPropagation();
});

/**
 * bouton cliqué devient vert
 */
function colorButton(button) {
    button.css("background-color", "#28A745");
    button.css("color", "white");
    button.data('clicked', true);
}

/**
 * enleve la couleur verte si on re-clique.
 */
function uncolorButton(button) {
    button.css("background-color", "white");
    button.css("color", "black");
    button.data('clicked', false);
}


/**
 * colorie les bouttons type et prix
 */
$(".btnType, .btnPrice").on('click', function() {
    // vert -> gris
    if($(this).data('clicked')) {
        uncolorButton($(this));
    }

    // gris -> vert
    else {
        colorButton($(this));
    }
});


/**
 * Colorie les boutons etoiles
 */
$(".btnStar").on('click', function() {
    var id = $(this).attr('id');
    var max = id.substring(10, 11); // Get the number

    // We color the buttons between 1 and max and uncolor between max+1 and 5
    for(var i = 1 ; i <= max ; i++) {
        colorButton($("#starButton"+i));
    }

    // We must use +max+1 to convert max as an integer
    for(var j = +max+1 ; j <= 5 ; j++) {
        uncolorButton($("#starButton"+j));
    }
});

/**
 * la croix rouge pour suppr les selections
 */
$(".btnRemove").on('mouseover', function() {
    $(this).css("background-color", "#DC3545");
});

/**
 * bouton remove gris par defaut
 */
$(".btnRemove").on('mouseleave', function() {

    $(this).css("background-color", "white");

});

/**
 * supprime les selections
 */
$(".btnRemove").on('click', function() {

    $(this).css("background-color", "#DC3545");

    $(this).parent().children().each(function() {

        uncolorButton($(this));

    });

});


/**
 * Reset les filtres
 */
$("#resetFilters").on('click', function() {

    // Reset the type buttons to grey
    $(".btnType, .btnPrice, .btnStar").each(function() {

        uncolorButton($(this));

    });

    // Uncheck the checkboxes
    // .attr() is deprecated for properties, use the new .prop() function instead
    if($("input").prop('checked', true)) {

        $("input").prop('checked', false);

    }

});

////////// redimensionnement de la fenetre //////////////
number = 1;
/**
 * le filtre s'adapte a la taille d'affichage.
 */
$(window).resize(function() {

    // When the window is too small, we add Br to buttons in the menu
    if(window.matchMedia("(max-width: 600px)").matches) {
        addBr(number);
        number++;
    }

    // When the window become larger, remove the Br
    else {
        removeBr();
    }
});


/**
 * Add br in the menu.
 */
function addBr(number) {
    if (number === 1) {

        var containerType = document.getElementById("typeContainer");
        var containerPrice = document.getElementById("currencyContainer");
        var containerStar = document.getElementById("starContainer");


        var i = 1;

        // While we get a button, we add a breakline before its
        while(containerType.getElementsByTagName("button")[i] && i < 9) {
            var newBrType = document.createElement("br"); // We create a new breakline
            newBrType.setAttribute("id", "brType"+i);
            containerType.insertBefore(newBrType, containerType.getElementsByTagName("button")[i]);
            i++;
        }
        i = 1;

        while(containerPrice.getElementsByTagName("button")[i] && i < 4) {
            var newBrPrice = document.createElement("br");
            newBrPrice.setAttribute("id", "brPrice"+i);
            containerPrice.insertBefore(newBrPrice, containerPrice.getElementsByTagName("button")[i]);
            i++;
        }

        i = 1;
        while(containerStar.getElementsByTagName("button")[i] && i < 5) {
            var newBrStar= document.createElement("br");
            newBrStar.setAttribute("id", "brStar"+i);
            containerStar.insertBefore(newBrStar, containerStar.getElementsByTagName("button")[i]);
            i++;
        }

        // Shrink the drop-down menu
        document.getElementsByClassName("dropdown-menu").item(0).style.width = "300px";

        // Resize the search bar
        document.getElementById("textSearch").style.width = "250px";
    }
}
/**
 * Remove br in the menu.
 */
function removeBr() {

    // For loops
    var i;

    // We remove the breaklines if they exist
    for (i = 1 ; i < 9 ; i++) {
        if(document.getElementById("brType"+i) !== undefined && document.getElementById("brType"+i) !== null) {
            document.getElementById("brType"+i).remove();
        }
    }

    for (i = 1 ; i < 4 ; i++) {
        if(document.getElementById("brPrice"+i) !== undefined && document.getElementById("brPrice"+i) !== null) {
            document.getElementById("brPrice"+i).remove();
        }
    }

    for (i = 1 ; i < 5 ; i++) {
        if(document.getElementById("brStar"+i) !== undefined && document.getElementById("brStar"+i) !== null) {
            document.getElementById("brStar"+i).remove();
        }
    }

    // Expand the dropdown menu
    document.getElementsByClassName("dropdown-menu").item(0).style.width = "460px";
}











