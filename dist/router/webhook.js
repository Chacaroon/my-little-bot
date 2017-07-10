'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.webhookGet = webhookGet;
exports.webhookPost = webhookPost;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var verify_token = 'MY_SECRET_TOKEN';
var access_token = 'EAAGZB1XwCVe4BAGZAjRVOSwhb5lfZCcMZC2RuzZAu9RMkcZAcFDIu83VcOVsyi6Ajq3yBZC5aqDTIZCzDGYnTeR8LtncJ35nqZCmLCKfrKZBiMMJZAgj96SHsfaMKvVT0sOjp2ZATKP1NHWWFgAsz8jZCWPUW359Lc1NAvaHHTZBcEYnvLbAZDZD';

function webhookGet(ctx) {

	if (ctx.request.query['hub.verify_token'] === verify_token) {
		ctx.body = ctx.request.query['hub.challenge'];
	} else {
		ctx.body = 'Error, wrong validation token';
	}
}

function webhookPost(ctx) {

	var messagingEvents = ctx.request.body.entry[0].messaging;

	messagingEvents.map(function (event) {
		var sender = event.sender.id;
		var text = event.message.text.trim().substring(0, 200);
		sendMessage(sender, {
			text: 'Text received, echo: ' + text
		});
	});

	ctx.status = 200;
}

function sendMessage(sender, message) {
	_superagent2.default.post('https://graph.facebook.com/v2.9/me/messages').query({ access_token: access_token }).send({
		recipient: {
			id: sender
		},
		message: message
	}).end(function (err) {
		if (err) {
			console.error(err); //eslint-disable-line
		}
	});
}