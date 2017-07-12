'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {

	var connection = _mongoose2.default.createConnection(_constants.db);

	connection.on('error', function (err) {
		console.error('connection error:', err.message);
	});

	connection.once('open', function callback() {
		console.log('Connected to DB!');
	});
}();