/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./App.{js,jsx,ts,tsx}',
		'./src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {

				// Primary blacks
				black: {
					DEFAULT: '#0D0D0D',
					light:   '#1A1A1A',
					mid:     '#2A2A2A',
					soft:    '#3A3A3A',
				},

				// Lime greens
				lime: {
					DEFAULT: '#AAFF00',
					light:   '#C2FF4D',
					pale:    '#EEFFCC',
					dark:    '#7ACC00',
				},

				// Neutrals
				'off-white':   '#F5F5F5',
				'grey-light':  '#F0F0F0',
				'grey-mid':    '#B0B0B0',
				'grey-dark':   '#6B6B6B',
				'border-dark': '#2A2A2A',
				'border-light':'#E0E0E0',

				// Text roles
				text: {
					'on-black':   '#FFFFFF',
					'on-lime':    '#0D0D0D',
					primary:      '#0D0D0D',
					secondary:    '#3A3A3A',
					muted:        '#6B6B6B',
				},

				// Status
				success:     '#22C55E',
				'success-bg':'#DCFCE7',
				warning:     '#F59E0B',
				error:       '#EF4444',

				// Badge backgrounds
				badge: {
					govt: '#EEFFCC',
					mf:   '#E8F0FB',
					gold: '#FEF3D8',
					bank: '#F0EAFA',
					nps:  '#FFF0E6',
				},
			},

			fontFamily: {
				sora:          ['Sora_400Regular'],
				'sora-medium': ['Sora_500Medium'],
				'sora-semi':   ['Sora_600SemiBold'],
				'sora-bold':   ['Sora_700Bold'],
				'sora-extra':  ['Sora_800ExtraBold'],
				hindi:         ['NotoSansDevanagari_400Regular'],
				'hindi-medium':['NotoSansDevanagari_500Medium'],
				'hindi-bold':  ['NotoSansDevanagari_700Bold'],
			},

			borderRadius: {
				sm:   8,
				md:   12,
				lg:   16,
				xl:   20,
				full: 9999,
			},

			spacing: {
				'4.5': 18,
				'13':  52,
				'15':  60,
				'18':  72,
			},
		},
	},
	plugins: [],
};