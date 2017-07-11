import {worker as Worker} from 'fivebeans'
import request from 'superagent'

const access_token = 'EAAGZB1XwCVe4BAGZAjRVOSwhb5lfZCcMZC2RuzZAu9RMkcZAcFDIu83VcOVsyi6Ajq3yBZC5aqDTIZCzDGYnTeR8LtncJ35nqZCmLCKfrKZBiMMJZAgj96SHsfaMKvVT0sOjp2ZATKP1NHWWFgAsz8jZCWPUW359Lc1NAvaHHTZBcEYnvLbAZDZD'

class MessageHandler {
	constructor() {
		this.type = 'messenger-messages'
	}

	webhookPost(ctx) {
		const messagingEvents = ctx.request.body.entry[0].messaging

		messagingEvents.map((event) => {
			const sender = event.sender.id
			const text   = event.message.text.trim().substring(0, 200)
			this.sendMessage(sender, {
				text: 'Text received, echo: ' + text
			})
		})
		ctx.status = 200
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

	work(payload, cb) {
		this.webhookPost(payload.ctx)
		cb('success')
	}
}

const msgHandler = new MessageHandler()

const worker = new Worker({
	id: 'worker_1', // The ID of the worker for debugging and tacking
	host: 'localhost', // The host to listen on
	port: 11300, // the port to listen on
	handlers: {
		'messenger-messages': msgHandler // setting handlers for types
	},
	ignoreDefault: true
})

worker.start(['messenger-messages'])