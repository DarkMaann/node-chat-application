var {MongoClient} = require('mongodb');
var url = 'mongodb://localhost:27017';
var dbName = 'Sessions';

console.log('Child initialised...');


// when signal from parent arrives, get all active sessions from db and send info back
process.on('message', data => {

	MongoClient.connect(url, function(err, client) {

		if (err) console.log('Error. Unuccessfully connected to database Sessions...');
		else console.log('Successfully connected to database Sessions...');

		let db = client.db(dbName);
		let collection = db.collection('sessions');

		// get all sessions (session objects) from database and send to parent
		collection.find({}).toArray(function(err, docs){
			process.send({sessions: docs});
		});

	});

});
