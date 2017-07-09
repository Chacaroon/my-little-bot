import Router from 'koa-router'

import home from './home'
import {webhookGet, webhookPost} from './webhook'

const router = new Router()

router
	.get('/', home)
	.get('/webhook/', webhookGet)
	.post('/webhook/', webhookPost)

export default router