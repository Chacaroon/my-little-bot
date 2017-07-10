import Koa from 'koa'
import compose from 'koa-compose'
import bodyParser from 'koa-bodyparser'

import router from './router'

const app = new Koa()

let middleware = [
	bodyParser()
]

if (process.env.NODE_ENV !== 'production') {
	middleware.push(require('koa-logger')())
}

app
	.use(compose(middleware))
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
