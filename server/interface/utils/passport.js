// 用户权限认证
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

// 这里对passport的配置将在登录注册中被使用，其他地方只是调用passport
passport.use(
	new LocalStrategy(async function(username, password, done) {
		// username:username
		let where = { username }
		// 数据库查询
		let ret = await UserModel.findOne(where)
		// 验证
		if (ret !== null) {
			// 数据库中存储的密码与用户输入的密码做比较
			if (ret.password === password) {
				return done(null, ret)
			} else {
				return done(null, false, '密码错误')
			}
		} else {
			return done(null, false, '用户不存在')
		}
	})
)

// 为了使session生效
// 序列化了user就反序列化user
passport.serializeUser(function(user, done) {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})

export default passport
