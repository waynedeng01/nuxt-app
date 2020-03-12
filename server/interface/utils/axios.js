import axios from 'axios'

// 创建自定义axios实例
const instance = axios.create({
	baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
	timeout: 1000,
	headers: {}
})

export default instance
