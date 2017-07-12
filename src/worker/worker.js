import {worker as Worker} from 'fivebeans'
import mongoose from 'mongoose'
import {dbhost} from '../constants'

import msgHandler from './handlers/msgHandler'

const worker = new Worker({
	id: 'worker_1', // The ID of the worker for debugging and tacking
	host: '91.92.136.201', // The host to listen on
	port: 11300, // the port to listen on
	handlers: {
		'messenger-messages': msgHandler // setting handlers for types
	},
	ignoreDefault: true
})

mongoose.connect(dbhost, {
	useMongoClient: true
})

const db = mongoose.connection

db.on('error', (err) => {
	console.error(err)
})

db.once('open', () => {
	console.log('DB connected!')

	worker.start(['messenger-messages'])
})