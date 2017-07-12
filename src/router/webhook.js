import config from 'config'

// Webhook verification
export function webhookGet(ctx) {
	if (ctx.request.query['hub.verify_token'] === config.get('webhook.verify_token')) {
		ctx.body = ctx.request.query['hub.challenge']
	} else {
		ctx.body = 'Error, wrong validation token'
	}

}