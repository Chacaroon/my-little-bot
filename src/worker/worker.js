import {worker as Worker} from 'fivebeans'
import mongoose from 'mongoose'
import config from 'config'

import msgHandler from './handlers/msgHandler'

const worker = new Worker({
	id: config.get('worker.id'), // The ID of the worker for debugging and tacking
	host: config.get('worker.ip'), // The host to listen on
	port: config.get('worker.port'), // The port to listen on
	handlers: {
		'messenger-messages': msgHandler // Setting handlers for types
	},
	ignoreDefault: true
})

// Connecting to DB
mongoose.connect(config.get('dbHost'), {
	useMongoClient: true
})

// Connection for working with the db
const db = mongoose.connection

// Events handling
db.on('error', (err) => {
	throw err
})

db.once('open', () => {
	console.log('DB connected!')

	// Running an worker and opening a pipe 'messenger-messages'
	worker.start(['messenger-messages'])
})