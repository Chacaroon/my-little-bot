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
					_context.next = 2;
					return console.log('index');

				case 2:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

exports.default = [{ method: 'get', name: 'index', url: '/', middleware: index }];