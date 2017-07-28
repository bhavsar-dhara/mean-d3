module.exports = function (app) {

    var mongoose = require('mongoose');

    // mongoose.connect('mongodb://localhost/meanD3Demo', { useMongoClient: true });

    // // connect to local database
    // var promise = mongoose.connect('mongodb://localhost/meanD3Demo', {
    //     useMongoClient: true,
    //     server: {socketOptions: {keepAlive: 1}}
    // });
    //
    // promise.then(function (db) {
    //     /* Use `db`, for instance `db.model()` */
    // });

    mongoose.connection.openUri('mongodb://localhost/meanD3Demo', { });

    // Use native promises
    mongoose.Promise = global.Promise;

    // Create a schema
    var TodoSchema = new mongoose.Schema({
        name: String,
        completed: Boolean,
        note: String,
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date, default: ''},
    });

    // Create a model based on the schema
    var Todo = mongoose.model('Todo', TodoSchema);

    // Create a todo in memory
    var todo = new Todo({name: 'Master NodeJS', completed: false, note: 'Getting there...'});

    // Save it to database
    todo.save(function (err) {
        if (err)
            console.log(err);
        else
            console.log(todo);
    });

    Todo.create({name: 'Create something with Mongoose', completed: true, note: 'this is one'}, function (err, todo) {
        if (err) console.log(err);
        else console.log(todo);
    });

    // Find all data in the Todo collection
    Todo.find(function (err, todos) {
        if (err) return console.error(err);
        console.log(todos)
    });
};