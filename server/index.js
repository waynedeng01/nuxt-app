// 测试babel是否配置成功
import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import dbConfig from './dbs/config'
import passport from './interface/utils/passport'
import users from './interface/users'

const app = new Koa()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

app.keys = [ 'mt', 'keyskeys' ]
app.proxy = true
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))
app.use(
	bodyParser({
		extendTypes: [ 'json', 'form', 'text' ]
	})
)
app.use(json())

// 数据库连接
mongoose.connect(dbConfig.dbs, {
	useNewUrlParser: true
})

// 验证相关配置
app.use(passport.initialize())
app.use(passport.session())
// 使用路由
app.use(users.routes()).use(users.allowedMethods())

async function start() {
	const nuxt = new Nuxt(config)

	const { host = process.env.HOST || '127.0.0.1', port = process.env.PORT || 3000 } = nuxt.options.server

	await nuxt.ready()
	// Build in development
	if (config.dev) {
		const builder = new Builder(nuxt)
		await builder.build()
	}

	app.use((ctx) => {
		ctx.status = 200
		ctx.respond = false // Bypass Koa's built-in response handling
		ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
		nuxt.render(ctx.req, ctx.res)
	})

	app.listen(port, host)
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	})
}

start()
