import Koa from 'koa'
import compose from 'koa-compose'
import bodyParser from 'koa-bodyparser'
import views from 'koa-views'

import router from './router'

const app = new Koa()

let middleware = [
	bodyParser(),
	views('./dist/views/pages')
]

if (process.env.NODE_ENV !== 'production') {
	middleware.push(require('koa-logger')())
}

app
	.use(compose(middleware))
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(process.env.PORT || 3000)