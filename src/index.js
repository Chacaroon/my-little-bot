import Koa from 'koa'
import compose from 'koa-compose'

const app = new Koa()

const middlewareStack = [
	require('koa-logger')
]

app.use(compose(middlewareStack))

