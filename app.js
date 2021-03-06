var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var ioHandler = require('./public/javascripts/io');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var storeInstance = new MongoStore({
	url: 'mongodb://localhost:27017/Sessions'
});
var childSpawner = require('./public/javascripts/childSpawner');


var index = require('./routes/index');
var chat = require('./routes/chat');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signin = require('./routes/signin');
var touch = require('./routes/touch');


// handle websocket server
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// and start listening for websocket traffic
server.listen(4000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	name: 'kolacicSesije',
	secret: 'KolkoSiDobar',
	cookie: {maxAge: 3600000},
	resave: false,
	rolling: true,
	saveUninitialized: false,
	unset: 'destroy',
	store: storeInstance
}));


// handle routes
app.use('/', index);
app.use('/login', login);
app.use('/chat', chat);
app.use('/logout', logout);
app.use('/signin', signin);
app.use('/touch', touch);


// pass io object to imported ./io.js module
ioHandler(io, storeInstance);
// set handlers for child processes
childSpawner.forkActiveSessionsGetter('./public/javascripts/checkActiveSessions.js');
childSpawner.forkChatHistorySetter('./public/javascripts/saveChatHistory.js');
childSpawner.forkChatHistoryGetter('./public/javascripts/openChatHistory.js');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {

	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
