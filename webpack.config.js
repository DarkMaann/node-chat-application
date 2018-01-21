var path = require('path');

module.exports = {

	entry: './public/javascripts/chatClient.js',

	output: {
		path: path.resolve(__dirname, 'public/javascripts'),
		filename: 'chatClientBundle.js'
	},

	devtool: 'eval-source-map'

};
