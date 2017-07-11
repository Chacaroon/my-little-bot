'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.webhookGet = webhookGet;
var verify_token = 'MY_SECRET_TOKEN';

function webhookGet(ctx) {

	if (ctx.request.query['hub.verify_token'] === verify_token) {
		ctx.body = ctx.request.query['hub.challenge'];
	} else {
		ctx.body = 'Error, wrong validation token';
	}
}