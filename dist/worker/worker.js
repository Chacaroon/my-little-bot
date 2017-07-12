'use strict';

var _fivebeans = require('fivebeans');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _msgHandler = require('./handlers/msgHandler');

var _msgHandler2 = _interopRequireDefault(_msgHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worker = new _fivebeans.worker({
	id: _config2.default.get('worker.id'), // The ID of the worker for debugging and tacking
	host: _config2.default.get('worker.ip'), // The host to listen on
	port: _config2.default.get('worker.port'), // The port to listen on
	handlers: {
		'messenger-messages': _msgHandler2.default // Setting handlers for types
	},
	ignoreDefault: true
});

// Connecting to DB
_mongoose2.default.connect(_config2.default.get('dbHost'), {
	useMongoClient: true
});

// Connection for working with the db
var db = _mongoose2.default.connection;

// Events handling
db.on('error', function (err) {
	throw err;
});

db.once('open', function () {
	console.log('DB connected!');

	// Running an worker and opening a pipe 'messenger-messages'
	worker.start(['messenger-messages']);
});