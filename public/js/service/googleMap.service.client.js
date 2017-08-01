/**
 * Created by Dhara on 6/19/2016.
 */
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

(function () {
    angular
        .module("meanD3")
        .factory("GoogleMapService", GoogleMapService);

    var key = "AIzaSyBhAlegiXdn26UqbUzM-Qq9XtkK5if9Ri8";
    var urlBase = "//maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places";

    function GoogleMapService($http) {
        var api = {
            loadGMap: loadGMap
        };
        return api;

        function loadGMap() {

            var url = urlBase
                .replace("API_KEY", key);

            // console.log("gmap url = " + url);
            return $http.jsonp(url, {jsonpCallbackParam: 'callback'});
        }
    }

})();
