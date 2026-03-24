export enum GoalType {
	CHILD_EDUCATION  = 'CHILD_EDUCATION',
	CHILD_MARRIAGE   = 'CHILD_MARRIAGE',
	BUY_HOME         = 'BUY_HOME',
	RETIREMENT       = 'RETIREMENT',
	EMERGENCY_FUND   = 'EMERGENCY_FUND',
	GROW_WEALTH      = 'GROW_WEALTH',
	START_BUSINESS   = 'START_BUSINESS',
	BIG_PURCHASE     = 'BIG_PURCHASE',
}

export enum TimelineType {
	UNDER_1_YEAR   = 'UNDER_1_YEAR',
	ONE_TO_3_YEARS = 'ONE_TO_3_YEARS',
	THREE_TO_7     = 'THREE_TO_7',
	SEVEN_TO_15    = 'SEVEN_TO_15',
	ABOVE_15       = 'ABOVE_15',
	NOT_SURE       = 'NOT_SURE',
}

export enum OccupationType {
	SALARIED_PRIVATE   = 'SALARIED_PRIVATE',
	SALARIED_GOVT      = 'SALARIED_GOVT',
	SELF_EMPLOYED      = 'SELF_EMPLOYED',
	DAILY_WAGE         = 'DAILY_WAGE',
	FARMER             = 'FARMER',
	STUDENT            = 'STUDENT',
	HOMEMAKER          = 'HOMEMAKER',
	RETIRED            = 'RETIRED',
}

export enum ExperienceType {
	NEVER             = 'NEVER',
	ONLY_FD_SAVINGS   = 'ONLY_FD_SAVINGS',
	GOLD_REAL_ESTATE  = 'GOLD_REAL_ESTATE',
	MF_STOCKS_OCCASIONAL = 'MF_STOCKS_OCCASIONAL',
	REGULAR_INVESTOR  = 'REGULAR_INVESTOR',
}

export enum RiskToleranceType {
	WITHDRAW_IMMEDIATELY = 'WITHDRAW_IMMEDIATELY',
	WORRY_AND_WAIT       = 'WORRY_AND_WAIT',
	STAY_CALM            = 'STAY_CALM',
	BUY_MORE             = 'BUY_MORE',
}

export enum RiskProfile {
	CONSERVATIVE = 'CONSERVATIVE',
	BALANCED     = 'BALANCED',
	GROWTH       = 'GROWTH',
}

export enum Language {
	EN = 'en',
	HI = 'hi',
}

export interface OnboardingAnswers {
	// Identity
	name?:               string;
	state?:              string;
	occupation?:         OccupationType;

	// Income — TWO separate questions
	inHandIncome?:       number;   // total monthly take-home
	monthlySurplus?:     number;   // left after all expenses

	// Goal
	goal?:               GoalType;
	goalAmount?:         number;   // in today's rupee value
	timeline?:           TimelineType;

	// Investment capacity
	monthlyInvestment?:  number;

	// Behaviour
	experience?:         ExperienceType;
	riskTolerance?:      RiskToleranceType;
}

export type StepInputType =
	| 'text'
	| 'slider'
	| 'goal_grid'
	| 'option_list'
	| 'state_select';

export interface SliderConfig {
	min:      number;
	max:      number;
	step:     number;
	default:  number;
	prefix?:  string;
	suffix?:  string;
}

export interface OptionItem {
	value:    string;
	labelEn:  string;
	labelHi:  string;
	subEn?:   string;
	subHi?:   string;
	icon?:    string;
}

export interface OnboardingStep {
	id:           keyof OnboardingAnswers;
	inputType:    StepInputType;
	questionEn:   string;
	questionHi:   string;
	subEn:        string;
	subHi:        string;
	options?:     OptionItem[];
	sliderConfig?: SliderConfig;
	isRequired:   boolean;
	showIf?:      (answers: OnboardingAnswers) => boolean;
}

export interface InflationProjection {
	todayAmount:      number;
	targetYear:       number;
	yearsToGoal:      number;
	inflationRate:    number;
	adjustedCorpus:   number;
	inflationMultiplier: number;
}
// placeholder — onboarding.ts — implementation coming