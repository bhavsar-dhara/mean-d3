/**
 * Created by Dhara on 6/24/2016.
 */
module.exports = function (app, models) {

    var eventModel = models.eventModel;

    app.post("/api/project/event", createEvent);
    app.get("/api/project/event/:eventId", findEventById);
    app.put("/api/project/event/:eventId", updateEvent);
    app.delete("/api/project/event/:eventId", deleteEvent);

    function createEvent(req, res) {
        // console.log("in server");
        var eventObj = req.body;
        eventModel
            .findEventByEventId(eventObj.eventId)
            .then(
                function (event) {
                    if(event) {
                        console.log("event exists..."+event.eventId);
                        res.json(event);
                    } else {
                        eventModel
                            .createEvent(eventObj)
                            .then(
                                function (event) {
                                    if(event) {
                                        console.log("event created..." + event.eventId);
                                        res.json(event);
                                    } else {
                                        console.log("Error in create Event");
                                    }
                                },
                                function (error) {
                                    // console.log("in server err 400");
                                    res.statusCode(400).send(error);
                                }
                            );
                    }
                },
                function (error) {
                    // console.log("in server err 404");
                    res.statusCode(404).send(error);
                }
            );
    }

    function findEventById(req, res) {
        var id = req.params.eventId;
        eventModel
            .findEventById(id)
            .then(
                function (event) {
                    res.json(event);
                },
                function (error) {
                    res.statusCode(404).send(error);
                }
            );
    }

    function updateEvent(req, res) {
        var id = req.params.eventId;
        var event = req.body;
        eventModel
            .updateEvent(id, event)
            .then(
                function (stats) {
                    res.send(stats);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function deleteEvent(req, res) {
        var id = req.params.eventId;
        eventModel
            .deleteEvent(id)
            .then(
                function (event) {
                    res.json(event);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }
};