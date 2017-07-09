const verify_token = 'supersecrecttoken'
// const token = 'your secret token'

export function webhookGet(ctx) {
	const challenge = ctx.request.query['hub.challenge']
	if (challenge === verify_token) {
		ctx.status = 200
		ctx.body = challenge || 'jdsfklf'
	}
}

export function webhookPost(ctx) {

	const messagingEvents = ctx.request.body.entry[0].messaging

	messagingEvents.map(event => {
		// const sender = event.sender.id
		if (event.message && event.message.text) {
			console.log(event.message.text) //eslint-disable-line
		}
	})

	ctx.status = 200
	ctx.body = 'ok'
}