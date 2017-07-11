import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	}
})

export default mongoose.model('UserModel', UserSchema)