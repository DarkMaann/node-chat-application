var {MongoClient} = require('mongodb');
var url = 'mongodb://localhost:27017';
var dbName = 'ChatHistory';

console.log('The saveChatHistory subprocess initialised...');

let db, collection;

MongoClient.connect(url)
	.then(client => {
		db = client.db(dbName);

		// check if capped collection 'mainchat' exists, and create it if it doesn't
		db.listCollections({name: 'mainchat'}).toArray()
			.then(arr => {
				if (arr[0]) return collection = db.collection('mainchat');
				db.createCollection('mainchat', {capped: true, size: 1024000})
					.then(col => collection = col);
			})
			.catch(err => console.log('Failed while checking if ChatHistory exists. Restart node server.'));

	})
	.catch(err => {
		console.log('Error. Unsuccessfully connected to database ChatHistory...');
	});



process.on('message', data => {
	collection.insertOne(data)
		.catch(err => console.log('Error. Failed to insert new data to ChatHistory database.'));
});




