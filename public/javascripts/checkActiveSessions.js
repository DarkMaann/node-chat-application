var {MongoClient} = require('mongodb');
var url = 'mongodb://localhost:27017';
var dbName = 'Sessions';

console.log('child initialised...');

process.on('message', data => {

	MongoClient.connect(url, function(err, client) {

		if (err) console.log('Error. Unuccessfully connected to database Sessions...');
		else console.log('Successfully connected to database Sessions...');

		let db = client.db(dbName);
		let collection = db.collection('sessions');

		// get all sessions (session objects) from database and send to parent
		collection.find({}).toArray(function(err, docs){
			console.log(docs);
			process.send({msg: 'koOoOolko sam?!?!'});
		});

	});

});
