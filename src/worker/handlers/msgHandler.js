import request from 'superagent'
import config from 'config'
import UserModel from '../../db/models/userModel'
import {connection as db} from 'mongoose'

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

		// Send a GET request to Facebook Graph to get information about the user
		request
			.get(`https://graph.facebook.com/v2.9/${id}`)
			.query({
				fields: 'first_name,last_name', // Get first_name and last_name
				access_token: access_token})
			.end((err, res) => { // Response handler
				if (err) {
					console.error(err)
				} else {
					const text = JSON.parse(res.text) // Get user fields from res string
					const first_name = text.first_name
					const last_name = text.last_name

					db.collection('users').findOne({id: id}, (err, user) => {
						if (err) {
							console.error(err)
						} else if (!user) { // If the user is not found, add a new one
							const user = new UserModel({ // Create new user
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
			} else { // Default handler
				this.sendMessage({
					text: 'You can add a user to DB using the command /add'
				})
			}
		})

		cb('success')
	}
}

export default new MessageHandler()