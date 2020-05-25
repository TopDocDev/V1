  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
console.log("hi from the js file!");
  var map;

  function initMap() {
    // Create the map.
    var lat = parseInt(document.getElementById("lat").value);
    var lng = parseInt(document.getElementById("lng").value);
    var liestal = {lat: 47.4895838, lng: 7.732632};
    var ort = {
      lat: lat,
      lng: lng
    };
    var map = new google.maps.Map(document.getElementById('map'), {
            center: ort,
            zoom: 13,
            mapTypeId: 'roadmap'
        });
                                            

    console.log(lat, lng);
    map = new google.maps.Map(document.getElementById('map'), {
      center: ort,
      zoom: 14
    });

    // Create the places service.
    var service = new google.maps.places.PlacesService(map);
    var getNextPage = null;


    // Perform a nearby search.
    service.nearbySearch(
        {location: ort, radius: 5000, type: ['doctor']},
        function(results, status) {
          if (status !== 'OK') return;

          createMarkers(results);

        });
  }

  function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');

    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: "https://www.kindpng.com/picc/m/164-1648612_hospital-map-marker-pin-doctor-medical-plus-logo.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });


      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  }



var map, places, infoWindow;
var autocomplete;
var countryRestrict = {"country" : "ch"}

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
center: {lat: 47, lng: 8}
});

// Create the autocomplete object and associate it with the UI input control.
// Restrict the search to the default country, and to place type "cities".
autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */ (
        document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
    });
places = new google.maps.places.PlacesService(map);

autocomplete.addListener('place_changed', onPlaceChanged);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
var place = autocomplete.getPlace();
if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
} else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
}
}

