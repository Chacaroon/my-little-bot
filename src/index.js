import Koa from 'koa'
import compose from 'koa-compose'
import bodyParser from 'koa-bodyparser'
import config from 'config'

import router from './router'

// create app
const app = new Koa()

// middleware for dev end prod
let middleware = [
	bodyParser()
]
// Separation of middlewares
if (process.env.NODE_ENV !== 'production') {
	middleware.push(require('koa-logger')())
}

// use middlewares and router
app
	.use(compose(middleware))
	.use(router.routes())
	.use(router.allowedMethods())

// app started
app.listen(process.env.PORT || config.get('listenPort'))