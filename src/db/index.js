import mongoose from 'mongoose'

import {db} from '../constants'

export default (function () {

	const connection = mongoose.createConnection(db)

	connection.on('error', function (err) {
		console.error('connection error:', err.message)
	})

	connection.once('open', function callback() {
		console.log('Connected to DB!')
	})
})()