import request from 'superagent'
import {access_token} from '../../constants'
import {connection} from 'mongoose'
import UserModel from '../../db/models/userModel'

class MessageHandler {
	constructor() {
		this.type = 'messenger-messages'
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

	pushUserToDB(id, first_name, last_name) {
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
					console.error(err)
				})
			}
		})
	}

	work(payload, cb) {

		let senderId

		payload.messagingEvents.map((event) => {
			senderId = event.sender.id
			const text   = event.message.text.trim().substring(0, 200)
			this.sendMessage(senderId, {
				text: `Text received: ${text}`
			})
		})

		request
			.get(`https://graph.facebook.com/v2.9/${senderId}`)
			.query({fields: 'first_name,last_name'})
			.end((err) => {
				if (err) {
					console.error(err)
				} else {
					// const {first_name, last_name} = req
					//
					// this.pushUserToDB(senderId, first_name, last_name)

					console.log('test')
				}
			})

		cb('success')
	}
}

export default new MessageHandler()