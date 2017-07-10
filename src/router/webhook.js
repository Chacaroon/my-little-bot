import request from 'superagent'

const verify_token = 'MY_SECRET_TOKEN'
const access_token = 'EAAGZB1XwCVe4BAMtuKDL0EfRJD5zGFHdb1tiAz8lxIk7sFDdIsaCrpZB4J27tyTMjmgNMolC4Ux3ashemuZCGcHd2GyKg6wG1OxnS0sxyxJVpVzuuXHUkRj9LfXPpxiZBv7m0VlVcq8QlVpjaJPa8VBRFDwLf7ABrylXkdunJgZDZD'

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
		.catch((err) => {
			if (err) {
                console.log('Error sending message: ', err) //eslint-disable-line
			}
		})
}