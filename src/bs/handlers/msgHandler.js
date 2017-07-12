import request from 'superagent'
import {access_token} from '../../constants'
import connection from '../../db/index'
import UserModel from '../../db/models/userModel'

class MessageHandler {
	constructor() {
		this.type = 'messenger-messages'
		this.senderId = ''
	}

	sendMessage(sender, message) {
		request
			.post('https://graph.facebook.com/v2.9/me/messages')
			.query({access_token: access_token})
			.send({
				recipient: {
					id: sender
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

		request
			.get(`https://graph.facebook.com/v2.9/${id}`)
			.query({
				fields: 'first_name,last_name',
				access_token: access_token})
			.end((err, req) => {
				if (err) {
					console.error(err)
				} else {
					first_name = req.first_name
					last_name = req.last_name
				}
			})

		connection.collection('users').findOne({id: id}, (err, user) => {
			if (err) {
				console.error(err)
			} else if (!user) {
				const user = new UserModel({
					id: id,
					first_name: first_name,
					last_name: last_name
				})

				connection.collection('user').save(user, (err) => {
					if (err) {
						console.error(err)
					} else {
						this.sendMessage(this.senderId, {
							text: `${first_name} ${last_name} added to DB`
						})
					}
				})
			}
		})
	}

	work(payload, cb) {

		payload.messagingEvents.map((event) => {
			this.senderId = event.sender.id
			const text = event.message.text

			if (/\/add \d+/.test(text)) {

				const id = +text.split(' ')[1]

				this.pushUserToDB(id)
			} else {
				this.sendMessage(this.senderId, {
					text: 'You can add a user to DB using the command /add'
				})
			}
		})

		cb('success')
	}
}

export default new MessageHandler()