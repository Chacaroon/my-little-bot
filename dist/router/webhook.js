'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.webhookGet = webhookGet;
exports.webhookPost = webhookPost;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var verifyToken = 'MY_SECRET_TOKEN';
var pageToken = '79f2fea44c74260c853632a5b6e414ca';

function webhookGet(ctx) {
	if (ctx.request.query['hub.challenge'] === verifyToken) {
		ctx.body = ctx.request.query['hub.challenge'];
	}

	ctx.body = 'Error, wrong validation token';
}

function webhookPost(ctx) {

	var messagingEvents = ctx.request.body.entry[0].messaging;

	messagingEvents.map(function (event) {
		var sender = event.sender.id;

		if (event.postback) {
			var text = JSON.stringify(event.postback).substring(0, 200);
			sendTextMessage(sender, 'Postback received: ' + text);
		} else if (event.message && event.message.text) {
			var _text = event.message.text.trim().substring(0, 200);

			if (_text.toLowerCase() === 'generic') {
				sendGenericMessage(sender);
			} else {
				sendTextMessage(sender, 'Text received, echo: ' + _text);
			}
		}
	});

	ctx.status = 200;
}

function sendMessage(sender, message) {
	_request2.default.post('https://graph.facebook.com/v2.6/me/messages').query({ access_token: pageToken }).send({
		recipient: {
			id: sender
		},
		message: message
	}).end(function (err, res) {
		if (err) {
			console.log('Error sending message: ', err); //eslint-disable-line
		} else if (res.body.error) {
			console.log('Error: ', res.body.error); //eslint-disable-line
		}
	});
}

function sendTextMessage(sender, text) {
	sendMessage(sender, {
		text: text
	});
}

function sendGenericMessage(sender) {
	sendMessage(sender, {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [{
					title: 'First card',
					subtitle: 'Element #1 of an hscroll',
					image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
					buttons: [{
						type: 'web_url',
						url: 'https://www.messenger.com/',
						title: 'Web url'
					}, {
						type: 'postback',
						title: 'Postback',
						payload: 'Payload for first element in a generic bubble'
					}]
				}, {
					title: 'Second card',
					subtitle: 'Element #2 of an hscroll',
					image_url: 'http://messengerdemo.parseapp.com/img/gearvr.png',
					buttons: [{
						type: 'postback',
						title: 'Postback',
						payload: 'Payload for second element in a generic bubble'
					}]
				}]
			}
		}
	});
}