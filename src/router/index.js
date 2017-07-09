import Router from 'koa-router'
import routes from './home'

const router = new Router()

function loadRoutes(obj, routes){
	routes.forEach((val) => {
		return (obj[val.method.toLowerCase()] || obj.get).call(obj, val.name, val.url, val.middleware)
	})
}

loadRoutes(router, routes)

export default router