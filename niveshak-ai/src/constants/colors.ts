export const Colors = {
	black:         '#0D0D0D',
	blackLight:    '#1A1A1A',
	blackMid:      '#2A2A2A',
	blackSoft:     '#3A3A3A',
	lime:          '#AAFF00',
	limeLight:     '#C2FF4D',
	limePale:      '#EEFFCC',
	limeDark:      '#7ACC00',
	white:         '#FFFFFF',
	offWhite:      '#F5F5F5',
	greyLight:     '#F0F0F0',
	greyMid:       '#B0B0B0',
	greyDark:      '#6B6B6B',
	borderDark:    '#2A2A2A',
	borderLight:   '#E0E0E0',
	textOnBlack:   '#FFFFFF',
	textOnLime:    '#0D0D0D',
	textPrimary:   '#0D0D0D',
	textSecondary: '#3A3A3A',
	textMuted:     '#6B6B6B',
	success:       '#22C55E',
	successBg:     '#DCFCE7',
	warning:       '#F59E0B',
	error:         '#EF4444',
} as const;

export type ColorKey = keyof typeof Colors;

export const BadgeColors = {
	'Government Scheme': { bg:'#EEFFCC', text:'#3A7000', border:'#AAFF00' },
	'Mutual Fund':       { bg:'#E8F0FB', text:'#1A56A0', border:'#93C5FD' },
	'Gold':              { bg:'#FEF3D8', text:'#9A6C00', border:'#FCD34D' },
	'Bank Scheme':       { bg:'#F0EAFA', text:'#6334A8', border:'#C4B5FD' },
	'NPS':               { bg:'#FFF0E6', text:'#A03000', border:'#FDBA74' },
} as const;