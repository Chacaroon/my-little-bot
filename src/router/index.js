import Router from 'koa-router'
import {client as Client} from 'fivebeans'
import {webhookGet} from './webhook'
import config from 'config'

// Creating router
const router = new Router()

// Connecting to beanstalkd server
const client = new Client(config.get('worker.ip'), config.get('worker.port'))

// Events handling
client
	.on('connect', function(){
		client.use('messenger-messages', (err, tubeName) => { // This will allow to send jobs to the pipe 'messenger-messages'
			if (err) {
				console.error(err)
			} else {
				console.log(`Used ${tubeName}`)
			}
		})
	}).on('error', (err) => {
		console.log(err)
	})
	.on('close', () => {
		console.log('...Closing the tube...')
	})
	.connect()

// Routes handling
router
	.get('/webhook', webhookGet) // Verification webhook
	.post('/webhook', (ctx) => { // The 'messages' event handler

		// Job settings
		const job = {
			type: 'messenger-messages', // The job type is equal to the pipe used to process it
			payload: { // In the 'payload' field, the payload of the job is transferred
				messagingEvents: ctx.request.body.entry[0].messaging
			}
		}
		// The 'put' method puts the job in the queue
		client.put(0, 0, 60, JSON.stringify(['messenger-messages', job]), (err) => {
			if (err) console.error(err)
		})

		ctx.status = 200
	})

export default router