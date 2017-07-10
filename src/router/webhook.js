import request from 'request'

const verifyToken = 'MY_SECRET_TOKEN'
const pageToken = '79f2fea44c74260c853632a5b6e414ca'

export function webhookGet(ctx) {

    console.dir(ctx.request) //eslint-disable-line

	if (ctx.request.query['hub.challenge'] === verifyToken) {
		ctx.body = ctx.request.query['hub.challenge']
	}

	ctx.body = 'Error, wrong validation token'
}

export function webhookPost(ctx) {

	const messagingEvents = ctx.request.body.entry[0].messaging

	messagingEvents.map(event => {
		const sender = event.sender.id

		if (event.postback) {
			const text = JSON.stringify(event.postback).substring(0, 200)
			sendTextMessage(sender, 'Postback received: ' + text)
		} else if (event.message && event.message.text){
			const text = event.message.text.trim().substring(0, 200)

			if (text.toLowerCase() === 'generic') {
				sendGenericMessage(sender)
			} else {
				sendTextMessage(sender, 'Text received, echo: ' + text)
			}
		}
	})

	ctx.status = 200
}

function sendMessage (sender, message) {
	request
		.post('https://graph.facebook.com/v2.6/me/messages')
		.query({access_token: pageToken})
		.send({
			recipient: {
				id: sender
			},
			message: message
		})
		.end(function (err, res) {
			if (err) {
				console.log('Error sending message: ', err) //eslint-disable-line
			} else if (res.body.error) {
				console.log('Error: ', res.body.error) //eslint-disable-line
			}
		})
}

function sendTextMessage (sender, text) {
	sendMessage(sender, {
		text: text
	})
}

function sendGenericMessage (sender) {
	sendMessage(sender, {
		attachment: {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [{
					title: 'First card',
					subtitle: 'Element #1 of an hscroll',
					image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
					buttons: [{
						type: 'web_url',
						url: 'https://www.messenger.com/',
						title: 'Web url'
					}, {
						type: 'postback',
						title: 'Postback',
						payload: 'Payload for first element in a generic bubble'
					}]
				}, {
					title: 'Second card',
					subtitle: 'Element #2 of an hscroll',
					image_url: 'http://messengerdemo.parseapp.com/img/gearvr.png',
					buttons: [{
						type: 'postback',
						title: 'Postback',
						payload: 'Payload for second element in a generic bubble'
					}]
				}]
			}
		}
	})
}