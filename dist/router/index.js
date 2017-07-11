'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _fivebeans = require('fivebeans');

var _webhook = require('./webhook');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default();
var client = new _fivebeans.client('91.92.136.201', 11300);

client.on('connect', function () {
	client.use('messenger-messages', function (err, tubeName) {

		if (err) console.error(err);

		console.log('Used ' + tubeName);
	});
}).on('error', function (err) {
	console.log(err);
}).on('close', function () {
	console.log('...Closing the tube...');
}).connect();

router.get('/webhook/', _webhook.webhookGet).post('/webhook/', function (ctx) {

	var job = {
		type: 'messenger-messages',
		payload: {
			ctx: ctx
		}
	};

	client.put(0, 0, 60, JSON.stringify(['messenger-messages', job]), function (err) {
		if (err) console.error(err);
		ctx.status = 200;
	});
});

exports.default = router;