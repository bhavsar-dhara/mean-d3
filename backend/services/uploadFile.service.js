module.exports = function (app, models) {

    var uploadFileModel = models.uploadFileModel;
    var jsonImportModel = models.jsonImportModel;

    var fs = require('fs');
    var multer = require('multer');
    var upload = multer({dest: __dirname + '/../../public/uploads'});

    var  mongodb = require('mongodb'),
        Grid = mongodb.Grid; //use Grid via the native mongodb driver

    // var grid = new Grid(db, 'fs'); //db being a handle to your database

    app.post("/api/upload", upload.single('file'), saveFile);
    app.get("/api/upload/", getFile);
    app.get("/api/upload/:uploadId", getFileById);

    function saveFile(req, res) {
        console.log("in server saveFile");
        console.log(req.body);
        console.log(req.file);
        console.log(req.body.fileName);
        var newUpload = {
            name: req.body.fileName,
            created: Date.now(),
            file: req.file
        };
        var obj;
        fs.readFile(req.file.path, 'utf8', function (err, data) {
            if (err) console.error(err);
            obj = JSON.parse(tsvToJSON(data));
            // console.log(obj);
        });
        console.log("DATA = " + JSON.stringify(newUpload));
        uploadFileModel
            .saveFile(newUpload)
            .then(
                function (file) {
                    // TODO
                    // res.redirect("/fileUploadDemo/"+file._id);
                    jsonImportModel
                        .insertData(obj);
                    // console.log(file);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            )
            .then(
                function (objData) {
                    console.log("Success in table json.data");
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

    //var tsv is the TSV file with headers
    function tsvToJSON(tsv) {

        var lines = tsv.split("\r\n");

        var result = [];

        // "TOA5","CR800Series","CR800","40055","CR800.Std.30.01","CPU:US300_170121_Enc.CR8","36685","US300_DATA"
        var headers0 = lines[0].split(",");
        // "TIMESTAMP","RECORD","US300","US300_Volt"
        var headers1 = lines[1].split(",");
        // "TS","RN","Bar","mV" -> will use this one as the header
        var headers2 = lines[2].split(",");
        // "","","Smp","Smp"
        var headers3 = lines[3].split(",");

        for (var i = 4; i < lines.length; i++) {

            var obj = {};
            var currentLine = lines[i].split(",");

            for (var j = 0; j < headers2.length; j++) {
                // obj[headers2[j]] = parseFloat(currentLine[j]) || currentLine[j] || Date(currentLine[j]);
                obj[headers2[j]] = currentLine[j];
            }

            result.push(obj);
        }

        // var json_result = JSON.stringify(result);
        //
        // console.log(json_result);

        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
    }
};