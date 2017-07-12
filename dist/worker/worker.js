'use strict';

var _fivebeans = require('fivebeans');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = require('../constants');

var _msgHandler = require('./handlers/msgHandler');

var _msgHandler2 = _interopRequireDefault(_msgHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worker = new _fivebeans.worker({
	id: 'worker_1', // The ID of the worker for debugging and tacking
	host: '91.92.136.201', // The host to listen on
	port: 11300, // the port to listen on
	handlers: {
		'messenger-messages': _msgHandler2.default // setting handlers for types
	},
	ignoreDefault: true
});

_mongoose2.default.connect(_constants.dbhost, {
	useMongoClient: true
});

var db = _mongoose2.default.connection;

db.on('error', function (err) {
	console.error(err);
});

db.once('open', function () {
	console.log('DB connected!');

	worker.start(['messenger-messages']);
});