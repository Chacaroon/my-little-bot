'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

var middleware = void 0;

console.log(process.env.NODE_ENV); //eslint-disable-line

if (process.env.NODE_ENV !== 'production') {
	middleware = [(0, _koaLogger2.default)()];
} else {
	middleware = [(0, _koaBodyparser2.default)()];
}

app.use((0, _koaCompose2.default)(middleware)).use(_router2.default.routes()).use(_router2.default.allowedMethods());

app.listen(3000);