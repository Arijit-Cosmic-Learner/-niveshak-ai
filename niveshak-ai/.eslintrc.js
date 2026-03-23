module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react', 'react-hooks'],
	rules: {
		'react/react-in-jsx-scope':           'off',
		'@typescript-eslint/no-unused-vars':  'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'react-hooks/exhaustive-deps':        'warn',
		'react-hooks/rules-of-hooks':         'error',
	},
	settings: {
		react: { version: 'detect' },
	},
};