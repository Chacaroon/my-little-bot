import Koa from 'koa'
import compose from 'koa-compose'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'

import router from './router'

const app = new Koa()

let middleware

console.log(process.env.NODE_ENV) //eslint-disable-line

if (process.env.NODE_ENV !== 'production') {
	middleware = [
		logger()
	]
} else {
	middleware = [
		bodyParser()
	]
}

app
	.use(compose(middleware))
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
