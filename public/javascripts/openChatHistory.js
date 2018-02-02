var {MongoClient} = require('mongodb');
var url = 'mongodb://localhost:27017';
var dbName = 'ChatHistory';

console.log('The openChatHistory subprocess initialised...');

let db, collection;

process.on('message', () => {

	MongoClient.connect(url)
		.then(client => {
			db = client.db(dbName);
			collection = db.collection('mainchat');

			collection
				.find({})
				.project({name: 1, msg: 1, _id: 0})
				.toArray()
				.then(data => process.send(data))
				.catch(err => console.log('Error. Failed to read data from ChatHistory database.'));
			
			client.close();
		})
		.catch(err => {
			console.log('Error. Unsuccessfully connected to database ChatHistory...');
		});

});








