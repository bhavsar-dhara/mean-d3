//var tsv is the TSV file with headers
function tsvToJSON(tsv) {

    var lines = tsv.split("\n");

    var result = [];

    // "TOA5","CR800Series","CR800","40055","CR800.Std.30.01","CPU:US300_170121_Enc.CR8","36685","US300_DATA"
    var headers0 = lines[0].split("\t");
    // "TIMESTAMP","RECORD","US300","US300_Volt"
    var headers1 = lines[1].split("\t");
    // "TS","RN","Bar","mV" -> will use this one as the header
    var headers2 = lines[2].split("\t");
    // "","","Smp","Smp"
    var headers3 = lines[3].split("\t");

    for (var i = 4; i < lines.length; i++) {

        var obj = {};
        var currentLine = lines[i].split("\t");

        for (var j = 0; j < headers2.length; j++) {
            obj[headers2[j]] = currentLine[j];
        }

        result.push(obj);
    }

    var json_result = JSON.stringify(result);

    // console.log(json_result);

    //return result; //JavaScript object
    return json_result; //JSON
}