module.exports = function(app, models) {

    var dataModel = models.barDataModel;

    app.post("/api/data/", createData);
    app.get("/api/data/", findAllData);
    app.get("/api/data/:dataId", findDataById);
    app.put("/api/data/:dataId", updateData);
    app.delete("/api/data/:dataId", deleteData);

    function createData(req, res) {
        console.log("in server add");
        var data = req.body;
        console.log("DATA = " + JSON.stringify(data));
        dataModel
            .createData(data)
            .then(
                function (data) {
                    res.json(data);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function findAllData(req, res) {
        dataModel
            .findAllData()
            .then(
                function (datas) {
                    res.json(datas);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function findDataById(req, res) {
        var dataId = req.params.dataId;
        dataModel
            .findDataById(dataId)
            .then(
                function (data) {
                    res.json(data);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function updateData(req, res) {
        var dataId = req.params.dataId;
        dataModel
            .updateData(dataId)
            .then(
                function (data) {
                    res.json(data);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function deleteData(req, res) {
        var dataId = req.params.dataId;
        dataModel
            .deleteData(dataId)
            .then(
                function (data) {
                    res.json(data);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }
};