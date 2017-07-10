import request from 'superagent'

const verify_token = 'MY_SECRET_TOKEN'
const access_token = 'EAACEdEose0cBAIE0QpMSXOQyd8REzlaOH9VwDQWLKURUjtc4gOvKl3ziZAjfCePemOH9WKqNv3wULJQeA1Q6XwaUddjcTVmkRTqTGTyJZBg2ZB8Cqv6WkbwBcGqzHZCLSHkUvmZBJGoBHFHyZAoZBGtCAF6sHOI46MQvumlZAgtM37uOLQKO9ZBnNtleRsR9BS31wHBLUXZBFflAZDZD'

export function webhookGet(ctx) {

	if (ctx.request.query['hub.verify_token'] === verify_token) {
		ctx.body = ctx.request.query['hub.challenge']
	} else {
		ctx.body = 'Error, wrong validation token'
	}

}

export function webhookPost(ctx) {

	const messagingEvents = ctx.request.body.entry[0].messaging

	messagingEvents.map((event) => {
		const sender = event.sender.id
		const text   = event.message.text.trim().substring(0, 200)
		sendMessage(sender, {
			text: 'Text received, echo: ' + text
		})

	})

	ctx.status = 200
}

function sendMessage(sender, message) {
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
                console.error(err) //eslint-disable-line
			}
		})
}