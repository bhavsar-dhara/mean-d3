/**
 * Created by Dhara on 6/19/2016.
 */
(function () {
    angular
        .module("meanD3")
        .factory("EventService", EventService);

    function EventService($http) {
        var api = {
            createEvent: createEvent,
            findEventById: findEventById,
            updateEvent: updateEvent,
            deleteEvent: deleteEvent
        };
        return api;
        
        function createEvent(event) {
            // console.log("in client");
            return $http.post("/api/project/event", event);
        }

        function findEventById(eventId) {
            var url = "/api/project/event/" + eventId;
            return $http.get(url);
        }
        
        function updateEvent(eventId, event) {
            var url = "/api/project/event/" + eventId;
            return $http.put(url, event);
        }

        function deleteEvent(eventId) {
            var url = "/api/project/event/" + eventId;
            return $http.delete(url);
        }
    }
})();