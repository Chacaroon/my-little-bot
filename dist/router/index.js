'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _home = require('./home');

var _home2 = _interopRequireDefault(_home);

var _webhook = require('./webhook');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default();

router.get('/', _home2.default).get('/webhook/', _webhook.webhookGet).post('/webhook/', _webhook.webhookPost);

exports.default = router;