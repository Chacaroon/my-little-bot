'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaViews = require('koa-views');

var _koaViews2 = _interopRequireDefault(_koaViews);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

var middleware = [(0, _koaBodyparser2.default)(), (0, _koaViews2.default)('./dist/views/pages')];

if (process.env.NODE_ENV !== 'production') {
	middleware.push(require('koa-logger')());
}

app.use((0, _koaCompose2.default)(middleware)).use(_router2.default.routes()).use(_router2.default.allowedMethods());

app.listen(process.env.PORT || 3000);