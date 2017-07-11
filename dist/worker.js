'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fivebeans = require('fivebeans');

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var access_token = 'EAAGZB1XwCVe4BAGZAjRVOSwhb5lfZCcMZC2RuzZAu9RMkcZAcFDIu83VcOVsyi6Ajq3yBZC5aqDTIZCzDGYnTeR8LtncJ35nqZCmLCKfrKZBiMMJZAgj96SHsfaMKvVT0sOjp2ZATKP1NHWWFgAsz8jZCWPUW359Lc1NAvaHHTZBcEYnvLbAZDZD';

var MessageHandler = function () {
	function MessageHandler() {
		_classCallCheck(this, MessageHandler);

		this.type = 'messenger-messages';
	}

	_createClass(MessageHandler, [{
		key: 'webhookPost',
		value: function webhookPost(ctx) {
			var _this = this;

			var messagingEvents = ctx.request.body.entry[0].messaging;

			messagingEvents.map(function (event) {
				var sender = event.sender.id;
				var text = event.message.text.trim().substring(0, 200);
				_this.sendMessage(sender, {
					text: 'Text received, echo: ' + text
				});
			});
		}
	}, {
		key: 'sendMessage',
		value: function sendMessage(sender, message) {
			_superagent2.default.post('https://graph.facebook.com/v2.9/me/messages').query({ access_token: access_token }).send({
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
		key: 'work',
		value: function work(payload, cb) {
			this.webhookPost(payload.ctx);
			cb('success');
		}
	}]);

	return MessageHandler;
}();

var msgHandler = new MessageHandler();

var worker = new _fivebeans.worker({
	id: 'worker_1', // The ID of the worker for debugging and tacking
	host: '91.92.136.201', // The host to listen on
	port: 11300, // the port to listen on
	handlers: {
		'messenger-messages': msgHandler // setting handlers for types
	},
	ignoreDefault: true
});

worker.start(['messenger-messages']);