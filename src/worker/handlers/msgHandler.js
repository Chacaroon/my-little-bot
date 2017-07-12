import request from 'superagent'
import config from 'config'
import UserModel from '../../db/models/userModel'
import {connection as db} from 'mongoose'
// import $ from 'jquery'

const access_token = config.get('webhook.access_token')

class MessageHandler {
	constructor() {
		this.type = 'messenger-messages' // Pipe type
		this.senderId = ''
	}

	// Send reply to user
	sendMessage(message) {
		request
			.post('https://graph.facebook.com/v2.9/me/messages')
			.query({access_token: access_token})
			.send({
				recipient: {
					id: this.senderId
				},
				message: message
			})
			.end((err) => {
				if (err) {
					console.error(err)
				}
			})
	}

	pushUserToDB(id) {

		let first_name, last_name

		// Send a GET request to Facebook Graph to get information about the user
		request
			.get(`https://graph.facebook.com/v2.9/${id}`)
			.query({
				fields: 'first_name,last_name', // Get first_name and last_name
				access_token: access_token})
			.end((err, res) => { // Response handler
				if (err) {
					this.sendMessage(`User with id ${id} not found`)
				} else {

					const text = JSON.parse(res.text)
					console.log(res.text)
					first_name = text.first_name
					last_name = text.last_name
				}
			})
		/*$.ajax(`https://graph.facebook.com/v2.9/${id}?fields=first_name,last_name&access_token=${access_token}`)
			.done((data) => {
				first_name = data.first_name
				last_name = data.last_name
			})
			.fail((err) => {
				console.error(err)
			})*/

		db.collection('users').findOne({id: id}, (err, user) => {
			if (err) {
				console.error(err)
			} else if (!user) { // If the user is not found, add a new one
				const user = new UserModel({
					id: id,
					first_name: first_name,
					last_name: last_name
				})

				// Push user in collection 'users'
				db.collection('users').save(user, (err) => {
					if (err) {
						console.error(err)
					} else {
						this.sendMessage({
							text: `${first_name} ${last_name} added to DB`
						})
					}
				})
			} else { // In case the user is found to report this
				this.sendMessage({
					text: `${first_name} ${last_name} already added`
				})
			}
		})
	}

	usersList() {
		// Find all users in collection 'users'
		db.collection('users').find({}, (err, users) => {

			let list = 'Find users: \n'

			if (err) {
				console.log(err)
			} else {
				// Create users list
				users.map((user) => {
					list += `${user.first_name} ${user.last_name} with ID ${user.id}\n`
				})

				this.sendMessage({
					text: list
				})
			}
		})
	}

	// Queue in pipe handler
	work(payload, cb) {
		// Passing through multiple events and processing each event
		payload.messagingEvents.map((event) => {
			this.senderId = event.sender.id // ID of the user who sent the message
			const text    = event.message.text // Message text

			// Commands handler
			if (/\/add \d+/.test(text)) { // /add 132579823 - Add user in DB
				const id = +text.split(' ')[1]
				this.pushUserToDB(id)
			} else if (/\/list/.test(text)) { // /list - Display of all users in the database
				this.usersList()
			} else { // Default handler
				this.sendMessage({
					text: 'You can add a user to DB using the command /add or get the list of users with the command /list'
				})
			}
		})

		cb('success')
	}
}

export default new MessageHandler()