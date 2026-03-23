module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			['babel-preset-expo', { jsxImportSource: 'nativewind' }],
		],
		plugins: [
			'nativewind/babel',
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						'@screens':    './src/screens',
						'@components': './src/components',
						'@store':      './src/store',
						'@i18n':       './src/i18n',
						'@engine':     './src/engine',
						'@data':       './src/data',
						'@lib':        './src/lib',
						'@constants':  './src/constants',
						'@hooks':      './src/hooks',
						'@types':      './src/types',
					},
				},
			],
		],
	};
};