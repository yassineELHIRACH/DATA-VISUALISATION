//programme principale
{
    init();
}

var userCoordinates  = {
    userLatitude: 45.75,
    userLongitude: 4.85
};

var latVariance = 0.001764;
var lngVariance = 0.002560;
var userPositionMarker;
var legend = document.getElementById("legend");
var smallLegend = document.getElementById("smallLegend");

/* Control panel to display map layers */
var map;
var popups = [];
var tabmarker = new Array();
var markers = new L.MarkerClusterGroup();


//######################################################################################################################
//########## Fonction init() qui gere l'affichage des markers en fonction du filtre ####################################
//######################################################################################################################

function init() {

    //getUserLocation(); ou getCurrentPosition
    map = mapInitialisation(userCoordinates);

    //le bouton go du filtre
    var goButton = document.getElementById("go");
    goButton.addEventListener("click", filterMap);

    //le bouton reset du filtre
    var resetButton = document.getElementById("resetFilters");
    resetButton.addEventListener("click", resetFilter);


    //barre de recherche
    var searchTextField = document.getElementById("textSearch");
    searchTextField.addEventListener("input", function () {
        if (searchTextField.value.length === 0) {
            resetFilter();
        }
    });
    //boutton de recherche
    var searchTextButton = document.getElementById("searchButton");
    searchTextButton.addEventListener("click", function () {
        filterSearch(searchTextField.value);
    });

 //touche echap
    window.addEventListener("keyup", function (key) {
        if (key.keyCode === 27) {
            searchTextField.value = "";
            resetFilter();
        }
    });
//touche entree
    window.addEventListener("keypress", function (key) {
        if (key.keyCode === 13) {
            filterSearch(searchTextField.value);
        }
    });
    //boutton filtre
    var navFilterButton = document.getElementById("navFilterButton");
    navFilterButton.addEventListener("click", function () {
        for (var i = 0 ; i < popups.length ; i++) {
            popups[i].remove();
        }
        popups.splice(0, popups.length);
    });
    let str = "";
    let etoile = 0;
    readCsv(str,etoile);

}

function mapInitialisation(userCoordinates){
    // Set up initial map center and zoom level
     map = L.map('map', {
        center: [45.75, 4.85], // EDIT latitude, longitude to re-center map
        zoom: 13,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    });

    L.control.zoom({
        position:'bottomright'
    }).addTo(map);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic2Ficm9ueCIsImEiOiJja2cyY3p2enoyenVkMnRzOHZ0MW5pNHowIn0.M239jw5kr6YSwZ1oDDYjhg'
    }).addTo(map);
    return map;
}


//position de l'utilisateur
function locationUpdate(position){
    console.log(position);
    userCoordinates.userLongitude = position.coords.longitude;
    userCoordinates.userLatitude = position.coords.latitude;
    getUserLocation();
}

//place l'utilisateur au centre de la map
function getUserLocation(){
    userPositionMarker = L.marker([userCoordinates.userLongitude,userCoordinates.userLatitude]).addLayer(map);
    userPositionMarker.bindPopup("<h3 id='youAreHere' >Vous etes ici!</h3>");

    map.setView(new L.LatLng(userCoordinates.userLongitude, userCoordinates.userLatitude), 10);
    if(navigator.geolocation){
        navigator.geolocation.watchPosition(setUserCoordinates, function (error) {

            window.alert("Please activate your geolocalization for a better experience ! :) ");

        });
    }
}

function setUserCoordinates(position){
    console.log("Position update : " + position);
    userCoordinates.userLatitude = position.coords.latitude;
    userCoordinates.userLongitude = position.coords.longitude;
    userPositionMarker.setLngLat([userCoordinates.userLongitude, userCoordinates.userLatitude]);
}

//fonction qui creer le code des popups
function createMarkerPopupHTML(row){
    var html ="";
    var nomResto = accent_fold(row.Title);
    html += "<p id='popupTitle'>" + row.Title + "</p>";
    html += "<p id='popupType'>" + row.specialite +"</p>";
    if (row.overallRating != null) {
        html += "<p id='popupRating'>";
        var star;
        for (star = 0; star < Math.floor(row.overallRating); star++) {
            // Adding full stars
            html += "<i class=\"fa fa-star\"></i>";
        }
        for (var j = star; j< 5; j++) {
            // Adding empty stars
            html += "<i class=\"fa fa-star-o\"></i>";
        }
        html += "</p>";
    }
    if(row.prix !== "no informations" && row.prix !== "no information"){
        html += "<p id='popupPrice'>" + row.prix + "</p>";
    }

    html += "<a id='popupWebsite' href='' ";
    html += 'onclick="itineraire('+ "' "+ nomResto+" '" + ')"';
    html += '>Itineraire</a>';

    return html;
}


function readCsv(specialite,etoile) {
// Read markers data from data.csv
    $.get('./restaurant_data_kaggles.csv', function (csvString) {

        // Use PapaParse to convert string to array of objects
        var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

        for (let i = 1; i <= 3000; i++) {
            //for ( i in data) {
            var row = data[i]

            if (typeof row.Latitude === "string") {
                row = data[i + 1];
                //i++;
            }
            markerFilterSpe(row,specialite,etoile);
        }
    })
}

function readCsvTitre(str){
    $.get('./restaurant_data_kaggles.csv', function (csvString) {
        var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

        for (let i = 1; i <= 3000; i++) {
            var row = data[i]

            if (typeof row.Latitude === "string") {
                row = data[i + 1];
            }
            markerFilterTitre(row,str);
        }
    })
}

function markerFilterTitre(row,str) { //on filtre avec juste une chaine de caractere qu'on compare avec les attributs de row
    var titleRow = accent_fold(row.Title).toLowerCase();
    var speRow = accent_fold(row.specialite).toLowerCase();
    var cityRow = accent_fold(row.district).toLowerCase();
    var newStr = accent_fold(str).toLowerCase();

    if (compareStr(titleRow, newStr)) {
        var marker = L.marker([row.Latitude, row.Longitude], {
            opacity: 1
        }).bindPopup(createMarkerPopupHTML(row));
        tabmarker.push(marker);
        markers.addLayer(marker);
        map.addLayer(markers);
    } else if (compareStr(speRow, newStr)) {
        var marker = L.marker([row.Latitude, row.Longitude], {
            opacity: 1
        }).bindPopup(createMarkerPopupHTML(row));
        tabmarker.push(marker);
        markers.addLayer(marker);
        map.addLayer(markers);
    } else if (compareStr(cityRow, newStr)) {
        var marker = L.marker([row.Latitude, row.Longitude], {
            opacity: 1
        }).bindPopup(createMarkerPopupHTML(row));
        tabmarker.push(marker);
        markers.addLayer(marker);
        map.addLayer(markers);
    } else {
        return false;
    }
}


function markerFilterSpe(row,specialite,etoile){ // creer des markers en fonctions des specialités
    var str = row.specialite.toLowerCase();
    var note = Math.round(row.overallRating);
    if(etoile > 0){
        if(compareStr(str,specialite) && (etoile == note)){
            var marker = L.marker([row.Latitude,row.Longitude],{
                opacity: 1
            }).bindPopup(createMarkerPopupHTML(row));
            tabmarker.push(marker);
            markers.addLayer(marker);
            map.addLayer(markers);
        }else {
            return false;
        }
    }else{
        if(compareStr(str,specialite)){
            var marker = L.marker([row.Latitude,row.Longitude],{
                opacity: 1
            }).bindPopup(createMarkerPopupHTML(row));
            tabmarker.push(marker);
            markers.addLayer(marker);
            map.addLayer(markers);
        }else {
            return false;
        }
    }
}

function compareStr(mot1,mot2){ //voit si mot2 est contenue dans mot1
    var arr2 = mot2.split(' ');
    for(let i=0;i<arr2.length;i++){
        if(mot1.includes(arr2[i])){
            return true;
        }
    }
    return false;
}

function filterMap(){
    resetFilter();
    var restaurantFr = document.getElementById("restaurantFr");
    var restaurantIta = document.getElementById("restaurantIta");
    var restaurantAs = document.getElementById("restaurantAs");
    var restaurantMa = document.getElementById("restaurantMa");
    var restaurantEu = document.getElementById("restaurantEu");
    var restaurantVeg = document.getElementById("restaurantVeg");
    var restaurantPiz = document.getElementById("restaurantPiz");
    var restaurantBar = document.getElementById("restaurantBar");
    var restaurantInter = document.getElementById("restaurantInter");

    var typeButtons = [restaurantFr,restaurantIta,restaurantAs,restaurantMa,restaurantEu,restaurantVeg,restaurantPiz,restaurantBar,restaurantInter];

    var starButton1 = document.getElementById("starButton1");
    var starButton2 = document.getElementById("starButton2");
    var starButton3 = document.getElementById("starButton3");
    var starButton4 = document.getElementById("starButton4");
    var starButton5 = document.getElementById("starButton5");

    var starButtons = [starButton1, starButton2, starButton3, starButton4, starButton5];

    var filter = {
        filteringTypes : false,
        types: [false, false, false, false, false, false, false, false, false],
        rating: null,
        aroundMe: false,
    };

    for (i = 0 ; i < typeButtons.length; i++) {
        var clicked = $(typeButtons[i]).data().clicked;
        if (clicked) {
            filter.types[i] = clicked;
            filter.filteringTypes = true;
        }
    }

    for (i = 0; i < starButtons.length && $(starButtons[i]).data().clicked; i++) {
        filter.rating = i + 1;
    }

    filterFunction(filter);
}

function filterFunction(filter) {
    markers.clearLayers()
    map.removeLayer(markers)
  var specialite = "";

  if(filter.filteringTypes){ //si une spe est cliqué
      var values = ['française', 'italienne', 'asiatique','moyen-Orient','européenne','végétariens','pizza','bar','internationale'];
      var bool = false;

      for (var i = 0 ; i < filter.types.length; i++) {

          if (filter.types[i] == true) {
              if(filter.rating != null){
                  map.removeLayer(markers);
                  specialite += values[i];
                  readCsv(specialite,filter.rating);
              }else{
                  map.removeLayer(markers);
                  specialite += values[i];
                  readCsv(specialite,0);
              }
          }
      }
  }else {
      if(filter.rating != null){
          markers.clearLayers()
          map.removeLayer(markers);
          readCsv(specialite,filter.rating);
      }else{
          readCsv(specialite,0);
      }
  }
}

function resetFilter(){
    markers.clearLayers()
    map.removeLayer(markers);
}

function filterSearch(searchString){
    resetFilter();
    var optionRegex = new RegExp(/!/);
    if (searchString.search(optionRegex) == -1){
        //var searchName = accent_fold(searchString).toLowerCase();
        readCsvTitre(searchString);
    }else {
        readCsv("",0);
    }
}

function itineraire(motclef){
    console.log(motclef);
    var adresse = 'https://www.google.fr/maps/search/';
    var lien  = adresse.concat('',motclef);
    console.log(motclef);
    window.open(lien, '_blank');
}

var accentMap = {
    'á':'a', 'é':'e', 'í':'i','ó':'o','ú':'u', 'ä' : 'a', 'à' : 'a', 'è' : 'e', 'ï' : 'i', 'ô' : 'o', 'ö' : 'o', '\'' : ' ', '-' : ' ','ç' : 'c'
};

// fonction qui permet d'enlever les caracteres speciaux qu'on voit dans accentMap au dessus
function accent_fold (s) {
    if (!s) {
        return '';
    }
    var ret = '';
    for (var i = 0 ; i < s.length; i++) {
        ret += accentMap[s.charAt(i)] || s.charAt(i);
    }
    return ret;
}

function resetCamera(){
    map.flyTo([userCoordinates.userLatitude, userCoordinates.userLongitude], 13);
}