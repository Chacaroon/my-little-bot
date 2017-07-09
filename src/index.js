import Koa from 'koa'
import compose from 'koa-compose'
import logger from 'koa-logger'

import router from './router'

const app = new Koa()

const middlewareStack = [
	logger
]

app.use(compose(middlewareStack))
app.use(router.middleware())