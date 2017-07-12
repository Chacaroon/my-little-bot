'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _constants = require('../../constants');

var _index = require('../../db/index');

var _index2 = _interopRequireDefault(_index);

var _userModel = require('../../db/models/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageHandler = function () {
	function MessageHandler() {
		_classCallCheck(this, MessageHandler);

		this.type = 'messenger-messages';
		this.senderId = '';
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
		value: function pushUserToDB(id) {
			var _this = this;

			var first_name = void 0,
			    last_name = void 0;

			_superagent2.default.get('https://graph.facebook.com/v2.9/' + id).query({
				fields: 'first_name,last_name',
				access_token: _constants.access_token }).end(function (err, req) {
				if (err) {
					console.error(err);
				} else {
					first_name = req.first_name;
					last_name = req.last_name;
				}
			});

			_index2.default.collection('users').findOne({ id: id }, function (err, user) {
				if (err) {
					console.error(err);
				} else if (!user) {
					var _user = new _userModel2.default({
						id: id,
						first_name: first_name,
						last_name: last_name
					});

					_index2.default.collection('user').save(_user, function (err) {
						if (err) {
							console.error(err);
						} else {
							_this.sendMessage(_this.senderId, {
								text: first_name + ' ' + last_name + ' added to DB'
							});
						}
					});
				}
			});
		}
	}, {
		key: 'work',
		value: function work(payload, cb) {
			var _this2 = this;

			payload.messagingEvents.map(function (event) {
				_this2.senderId = event.sender.id;
				var text = event.message.text;

				if (/\/add \d+/.test(text)) {

					var id = +text.split(' ')[1];

					_this2.pushUserToDB(id);
				} else {
					_this2.sendMessage(_this2.senderId, {
						text: 'You can add a user to DB using the command /add'
					});
				}
			});

			cb('success');
		}
	}]);

	return MessageHandler;
}();

exports.default = new MessageHandler();