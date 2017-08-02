module.exports = function () {

    var mi = require('mongoimport');

    mi(config);

    var config = {
        fields: [],                     // {array} data to import
        db: 'name',                     // {string} name of db
        collection: 'collection'        // {string|function} name of collection, or use a function to
                                        //  return a name, accept one param - [fields] the fields to import

    // they're options
    //    host: 'localhost:27017',        // {string} [optional] by default is 27017
    //    username: 'sofish',             // {string} [optional]
    //    password: '***'                 // {string} [optional]
    //    callback: (err, db) => {}       // {function} [optional]
    };
};