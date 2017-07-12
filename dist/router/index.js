'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _fivebeans = require('fivebeans');

var _webhook = require('./webhook');

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Creating router
var router = new _koaRouter2.default();

// Connecting to beanstalkd server
var client = new _fivebeans.client(_config2.default.get('worker.ip'), _config2.default.get('worker.port'));

// Events handling
client.on('connect', function () {
	client.use('messenger-messages', function (err, tubeName) {
		// This will allow to send jobs to the pipe 'messenger-messages'
		if (err) {
			console.error(err);
		} else {
			console.log('Used ' + tubeName);
		}
	});
}).on('error', function (err) {
	console.log(err);
}).on('close', function () {
	console.log('...Closing the tube...');
}).connect();

// Routes handling
router.get('/webhook', _webhook.webhookGet) // Verification webhook
.post('/webhook', function (ctx) {
	// The 'messages' event handler

	// Job settings
	var job = {
		type: 'messenger-messages', // The job type is equal to the pipe used to process it
		payload: { // In the 'payload' field, the payload of the job is transferred
			messagingEvents: ctx.request.body.entry[0].messaging
		}
		// The 'put' method puts the job in the queue
	};client.put(0, 0, 60, JSON.stringify(['messenger-messages', job]), function (err) {
		if (err) console.error(err);
	});

	ctx.status = 200;
});

exports.default = router;