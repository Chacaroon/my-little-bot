'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.webhookGet = webhookGet;

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Webhook verification
function webhookGet(ctx) {
	if (ctx.request.query['hub.verify_token'] === _config2.default.get('webhook.verify_token')) {
		ctx.body = ctx.request.query['hub.challenge'];
	} else {
		ctx.body = 'Error, wrong validation token';
	}
}