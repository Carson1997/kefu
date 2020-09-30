/**
 * 配置测试环境
 */

module.exports = {
	publicPath: './', // 打包的相对地址
	devServer: {
		proxy: {
			'/TEST_API_SERVER': {// 测试api地址
				target: "http://183.239.34.128:808", // 测试服务器api地址    183.239.34.128:808  192.168.1.20
				changeOrigin: true, // 是否跨域
				pathRewrite: { // 重写路径
					"^/TEST_API_SERVER": ''
				}
			}
		}
	}
}