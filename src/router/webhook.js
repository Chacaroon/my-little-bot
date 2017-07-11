const verify_token = 'MY_SECRET_TOKEN'

export function webhookGet(ctx) {

	if (ctx.request.query['hub.verify_token'] === verify_token) {
		ctx.body = ctx.request.query['hub.challenge']
	} else {
		ctx.body = 'Error, wrong validation token'
	}

}