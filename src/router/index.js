import Router from 'koa-router'
import {client as Client} from 'fivebeans'
import {webhookGet} from './webhook'

const router = new Router()
const client = new Client('91.92.136.201', 11300)

client
	.on('connect', function(){
		client.use('messenger-messages', (err, tubeName) => {

			if (err) console.error(err)

			console.log(`Used ${tubeName}`)
		})
	}).on('error', (err) => {
		console.log(err)
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

		client.put(0, 0, 60, JSON.stringify(['messenger-messages', job]), (err) => {
			if (err) console.error(err)
			ctx.status = 200
		})
	})

export default router