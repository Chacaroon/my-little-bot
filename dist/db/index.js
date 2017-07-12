'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = void 0;

(function () {

	_mongoose2.default.mongo.MongoClient.connect(_constants.dbhost, function (err, conn) {
		if (err) throw err;

		db = conn;

		console.log('DB connected');
	});
})();

exports.default = db;