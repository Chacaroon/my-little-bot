'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _home = require('./home');

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default();

function loadRoutes(obj, routes) {
	routes.forEach(function (val) {
		return (obj[val.method.toLowerCase()] || obj.get).call(obj, val.name, val.url, val.middleware);
	});
}

loadRoutes(router, _home2.default);

exports.default = router;