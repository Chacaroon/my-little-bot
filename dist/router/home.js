'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _marked = [index].map(regeneratorRuntime.mark);

function index() {
	return regeneratorRuntime.wrap(function index$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					console.log('index'); //eslint-disable-line
					_context.next = 3;
					return this.send('asdasd');

				case 3:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

exports.default = [{ method: 'get', name: 'index', url: '/', middleware: index }];