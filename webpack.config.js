/* eslint-disable @typescript-eslint/no-var-requires */
const webpackNodeExternals = require('webpack-node-externals')
const baseWebpackFile = require('./.dotfiles/webpack.config')

module.exports = async (webpackEnv) => {
	const baseConfig = baseWebpackFile(webpackEnv)

	const config = {
		...baseConfig,
		externals: [
			webpackNodeExternals(),
			'react',
			'react-dom',
			'styled-components',
			'@xstyled/core',
			'@xstyled/styled-components',
		],
	}

	return config
}
