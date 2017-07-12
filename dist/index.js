'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create app
var app = new _koa2.default();

// middleware for dev end prod
var middleware = [(0, _koaBodyparser2.default)()];
// Separation of middlewares
if (process.env.NODE_ENV !== 'production') {
	middleware.push(require('koa-logger')());
}

// use middlewares and router
app.use((0, _koaCompose2.default)(middleware)).use(_router2.default.routes()).use(_router2.default.allowedMethods());

// app started
app.listen(process.env.PORT || _config2.default.get('listenPort'));