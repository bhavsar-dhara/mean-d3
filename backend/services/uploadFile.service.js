module.exports = function (app, models) {

    var uploadFileModel = models.uploadFileModel;

    var fs = require('fs');
    var multer = require('multer');
    var upload = multer({dest: __dirname + '/../../public/uploads'});
    app.post("/api/upload", upload.single('file'), saveFile);
    app.get("/api/upload/", getFile);
    app.get("/api/upload/:uploadId", getFileById);

    function saveFile(req, res) {
        console.log("in server saveFile");
        console.log(req.body);
        console.log(req.file);
        var newUpload = req.body;
        console.log("DATA = " + JSON.stringify(newUpload));
        uploadFileModel
            .saveFile(newUpload)
            .then(
                function (file) {
                    res.json(file);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function getFile(req, res) {
        // console.log("in server getFile..");
        uploadFileModel
            .getFile()
            .then(
                function (files) {
                    // console.log("success findall" + files.toString());
                    res.json(files);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function getFileById(req, res) {
        var fileId = req.params.fileId;
        uploadFileModel
            .getFileById(fileId)
            .then(
                function (file) {
                    res.json(file);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            );
    }

};