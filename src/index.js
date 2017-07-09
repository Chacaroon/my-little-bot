import Koa from 'koa'
import compose from 'koa-compose'
import logger from 'koa-logger'

import router from './router'

const app = new Koa()

const middleware = [
	logger()
]

app
	.use(compose(middleware))
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(3000)
