var mongoose = require('mongoose');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/remind');

var Word = require('./models/word');

//delete previous db
Word.remove().exec();

const fs = require('fs');

fs.readFile('./db/words.json', (err, data) => {  
    if (err) throw err;
    let wordjson = JSON.parse(data);
    console.log(wordjson);
    Word.insertMany(wordjson);
});




console.log(Word.find());

