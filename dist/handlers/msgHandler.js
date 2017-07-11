'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _constants = require('../constants');

var _mongoose = require('mongoose');

var _userModel = require('../db/models/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageHandler = function () {
	function MessageHandler() {
		_classCallCheck(this, MessageHandler);

		this.type = 'messenger-messages';
	}

	_createClass(MessageHandler, [{
		key: 'sendMessage',
		value: function sendMessage(sender, message) {
			_superagent2.default.post('https://graph.facebook.com/v2.9/me/messages').query({ access_token: _constants.access_token }).send({
				recipient: {
					id: sender
				},
				message: message
			}).end(function (err) {
				if (err) {
					console.error(err);
				}
			});
		}
	}, {
		key: 'pushUserToDB',
		value: function pushUserToDB(id, first_name, last_name) {
			_mongoose.connection.collection('users').findOne({ id: id }, function (err, user) {
				if (err) {
					console.error(err);
				} else if (!user) {
					var _user = new _userModel2.default({
						id: id,
						first_name: first_name,
						last_name: last_name
					});

					_mongoose.connection.collection('user').save(_user, function (err) {
						console.error(err);
					});
				}
			});
		}
	}, {
		key: 'work',
		value: function work(payload, cb) {
			var _this = this;

			payload.messagingEvents.map(function (event) {
				var sender = event.sender.id;
				var text = event.message.text.trim().substring(0, 200);
				_this.sendMessage(sender, {
					text: 'Text received: ' + text
				});
			});

			_superagent2.default.get('https://graph.facebook.com/v2.9/me').query({ fields: 'first_name,last_name,id' }).end(function (err, req) {
				if (err) {
					console.error(err);
				} else {
					var id = req.id,
					    first_name = req.first_name,
					    last_name = req.last_name;


					_this.pushUserToDB(id, first_name, last_name);
				}
			});

			cb('success');
		}
	}]);

	return MessageHandler;
}();

exports.default = new MessageHandler();