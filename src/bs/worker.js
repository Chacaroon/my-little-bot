import {worker as Worker} from 'fivebeans'

import msgHandler from './handlers/msgHandler'

import '../db/index'

const worker = new Worker({
	id: 'worker_1', // The ID of the worker for debugging and tacking
	host: '91.92.136.201', // The host to listen on
	port: 11300, // the port to listen on
	handlers: {
		'messenger-messages': msgHandler // setting handlers for types
	},
	ignoreDefault: true
})

worker.start(['messenger-messages'])
