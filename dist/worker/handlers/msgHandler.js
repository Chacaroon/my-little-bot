'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _userModel = require('../../db/models/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var access_token = _config2.default.get('webhook.access_token');

var MessageHandler = function () {
	function MessageHandler() {
		_classCallCheck(this, MessageHandler);

		this.type = 'messenger-messages'; // Pipe type
		this.senderId = '';
	}

	// Send reply to user


	_createClass(MessageHandler, [{
		key: 'sendMessage',
		value: function sendMessage(message) {
			_superagent2.default.post('https://graph.facebook.com/v2.9/me/messages').query({ access_token: access_token }).send({
				recipient: {
					id: this.senderId
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

			// Send a GET request to Facebook Graph to get information about the user
			_superagent2.default.get('https://graph.facebook.com/v2.9/' + id).query({
				fields: 'first_name,last_name', // Get first_name and last_name
				access_token: access_token }).end(function (err, res) {
				// Response handler
				if (err) {
					console.error(err);
				} else {
					var text = JSON.parse(res.text); // Get user fields from res string
					var first_name = text.first_name;
					var last_name = text.last_name;

					_mongoose.connection.collection('users').findOne({ id: id }, function (err, user) {
						if (err) {
							console.error(err);
						} else if (!user) {
							// If the user is not found, add a new one
							var _user = new _userModel2.default({ // Create new user
								id: id,
								first_name: first_name,
								last_name: last_name
							});

							// Push user in collection 'users'
							_mongoose.connection.collection('users').save(_user, function (err) {
								if (err) {
									console.error(err);
								} else {
									_this.sendMessage({
										text: first_name + ' ' + last_name + ' added to DB'
									});
								}
							});
						} else {
							// In case the user is found to report this
							_this.sendMessage({
								text: first_name + ' ' + last_name + ' already added'
							});
						}
					});
				}
			});
		}
	}, {
		key: 'usersList',
		value: function usersList() {
			var _this2 = this;

			// Find all users in collection 'users'
			_mongoose.connection.collection('users').find({}, function (err, users) {

				if (err) {
					console.log(err);
				} else {
					var list = 'Find users:\n';
					// Create users list
					users.map(function (user) {
						list += user.first_name + ' ' + user.last_name + ' with ID ' + user.id + '\n';
					});

					_this2.sendMessage({
						text: list
					});
				}
			});
		}

		// Queue in pipe handler

	}, {
		key: 'work',
		value: function work(payload, cb) {
			var _this3 = this;

			// Passing through multiple events and processing each event
			payload.messagingEvents.map(function (event) {
				_this3.senderId = event.sender.id; // ID of the user who sent the message
				var text = event.message.text; // Message text

				// Commands handler
				if (/\/add \d+/.test(text)) {
					// /add 132579823 - Add user in DB
					var id = +text.split(' ')[1];
					_this3.pushUserToDB(id);
				} else if (/\/list/.test(text)) {
					// /list - Display of all users in the database
					_this3.usersList();
				} else {
					// Default handler
					_this3.sendMessage({
						text: 'You can add a user to DB using the command /add or get the list of users with the command /list'
					});
				}
			});

			cb('success');
		}
	}]);

	return MessageHandler;
}();

exports.default = new MessageHandler();