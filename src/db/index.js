import mongoose from 'mongoose'

import {dbhost} from '../constants'

let db

(function () {

	mongoose.mongo.MongoClient.connect(dbhost, (err, conn) => {
		if (err) throw err

		db = conn

		console.log('DB connected')
	})
})()

export default db