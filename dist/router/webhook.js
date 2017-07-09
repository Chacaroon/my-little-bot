'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.webhookGet = webhookGet;
exports.webhookPost = webhookPost;
var verify_token = 'supersecrecttoken';
// const token = 'your secret token'

function webhookGet(ctx) {
	var challenge = ctx.request.query['hub.challenge'];
	if (challenge === verify_token) {
		ctx.status = 200;
		ctx.body = challenge || 'jdsfklf';
	}
}

function webhookPost(ctx) {

	var messagingEvents = ctx.request.body.entry[0].messaging;

	messagingEvents.map(function (event) {
		// const sender = event.sender.id
		if (event.message && event.message.text) {
			console.log(event.message.text); //eslint-disable-line
		}
	});

	ctx.status = 200;
	ctx.body = 'ok';
}