import Router from 'koa-router'
import {client as Client} from 'fivebeans'
import {webhookGet} from './webhook'

const router = new Router()
const client = new Client('localhost', 11300)

client
	.on('connect', () => {
		client.use('messenger-messages', function(err, tubeName){
			if (err) {
				console.error(err)
			} else {
				console.log(`Used ${tubeName}`)
			}
		})
	})
	.on('error', (err) => {
		console.error(err)
	})
	.on('close', () => {
		console.log('...Closing the tube...')
	})
	.connect()

router
	.get('/webhook/', webhookGet)
	.post('/webhook/', (ctx) => {

		const job = {
			type: 'messenger-messages',
			payload: {
				ctx: ctx
			}
		}

		client.put(0, 0, 60, JSON.stringify(['messenger-messages', job]))
	})

export default router