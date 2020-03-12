// 用户接口
import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
// 这里由于此接口中我们更关注配置中的smtp，所以这里取名为email
import Email from '../dbs/config'
import axios from './utils/axios'

let router = new Router({ prefix: '/users' })
let Store = new Redis().client

router.post('/signup', async (ctx) => {
	const { username, password, email, code } = ctx.request.body
	// 这里是对比与发邮件时存入的验证码，所以这里是取值
	if (code) {
		const saveCode = await Store.hget(`nodemail:${username}`, 'code')
		const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
		if (code === saveCode) {
			if (new Date().getTime() - saveExpire > 0) {
				ctx.body = {
					code: -1,
					msg: '验证码已过期，请重新尝试'
				}
				return false
			}
		} else {
			ctx.body = {
				code: -1,
				msg: '请填写正确的验证码'
			}
		}
	} else {
		ctx.body = {
			code: -1,
			msg: '请填写验证码'
		}
	}
	// 根据输入的username来查找
	let user = await User.find({ username })
	if (user.length) {
		ctx.body = {
			code: -1,
			msg: '该用户名已注册'
		}
		return
	}
	// 存
	let newUser = await User.create({ username, password, email })
	if (newUser) {
		// 跳转登录接口
		let res = await axios.post('/users/signin', { username, password })
		if (res.data && res.data.code === 0) {
			ctx.body = {
				code: 0,
				msg: '注册成功',
				user: res.data.user
			}
		} else {
			ctx.body = {
				code: -1,
				msg: 'error'
			}
		}
	} else {
		ctx.body = {
			code: -1,
			msg: '注册失败'
		}
	}
})

router.post('/signin', async (ctx, next) => {
	return Passport.authenticate('local', function(err, user, info, status) {
		if (err) {
			ctx.body = {
				code: -1,
				msg: err
			}
		} else {
			if (user) {
				ctx.body = {
					code: 0,
					msg: '登录成功',
					user
				}
				// passport 暴露的方法
				// 用于建立session
				return ctx.login(user)
			} else {
				ctx.body = {
					code: 1,
					msg: info
				}
			}
		}
	})(ctx, next)
})

router.post('/verify', async (ctx, next) => {
	let username = ctx.request.body.username
	const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
	// console.log(saveExpire)
	if (saveExpire && new Date().getTime() - saveExpire < 0) {
		ctx.body = {
			code: -1,
			msg: '验证请求过于频繁，1分钟内1次'
		}
		return false
	}
	let transporter = nodeMailer.createTransport({
		service: 'qq',
		auth: {
			user: Email.smtp.user,
			pass: Email.smtp.pass
		}
	})
	let ko = {
		code: Email.smtp.code(),
		expire: Email.smtp.expire(),
		email: ctx.request.body.email,
		user: ctx.request.body.username
	}
	let mailOptions = {
		from: `"认证邮件" <${Email.smtp.user}>`,
		to: ko.email,
		subject: '注册码',
		html: `您的邀请码是${ko.code}`
	}
	await transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error)
		} else {
			// 前面读取的数据是在这存储的
			Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
		}
	})
	ctx.body = {
		code: 0,
		msg: '验证码已发送，可能会有延时，有效期1分钟'
	}
})

router.get('/exit', async (ctx, next) => {
	await ctx.logout()
	if (!ctx.isAuthenticated()) {
		ctx.body = {
			code: 0
		}
	} else {
		ctx.body = {
			code: -1
		}
	}
})

router.get('/getUser', async (ctx) => {
	if (ctx.isAuthenticated()) {
		// passport 的效果
		const { username, email } = ctx.session.passport.user
		ctx.body = {
			user: username,
			email
		}
	} else {
		ctx.body = {
			user: '',
			email: ''
		}
	}
})

export default router
