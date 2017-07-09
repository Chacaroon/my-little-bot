'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

var middlewareStack = [_koaLogger2.default];

app.use((0, _koaCompose2.default)(middlewareStack));
app.use(_router2.default.middleware());