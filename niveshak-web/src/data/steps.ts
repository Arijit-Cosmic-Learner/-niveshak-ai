import {
  OccupationType,
  ExperienceType,
  RiskToleranceType,
  GoalType,
  TimelineType,
  type OnboardingStep,
} from '@t/onboarding';

export const onboardingSteps: OnboardingStep[] = [
  // Step 0 - Name
  {
    id: 'name',
    inputType: 'text',
    questionEn: 'Namaste! What is your name?',
    questionHi: '\u0928\u092E\u0938\u094D\u0924\u0947! \u0906\u092A\u0915\u093E \u0928\u093E\u092E \u0915\u094D\u092F\u093E \u0939\u0948?',
    subEn: 'So we can personalise your plan for you.',
    subHi: '\u0924\u093E\u0915\u093F \u0939\u092E \u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u092F\u094B\u091C\u0928\u093E \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u092C\u0928\u093E \u0938\u0915\u0947\u0902\u0964',
    isRequired: true,
  },
  // Step 1 - State
  {
    id: 'state',
    inputType: 'state_select',
    questionEn: 'Which state do you live in?',
    questionHi: '\u0906\u092A \u0915\u093F\u0938 \u0930\u093E\u091C\u094D\u092F \u092E\u0947\u0902 \u0930\u0939\u0924\u0947 \u0939\u0948\u0902?',
    subEn: 'Some schemes are specific to certain states.',
    subHi: '\u0915\u0941\u091B \u092F\u094B\u091C\u0928\u093E\u090F\u0902 \u0930\u093E\u091C\u094D\u092F-\u0935\u093F\u0936\u0947\u0937 \u0939\u094B\u0924\u0940 \u0939\u0948\u0902\u0964',
    isRequired: false,
  },
  // Step 2 - Occupation
  {
    id: 'occupation',
    inputType: 'option_list',
    questionEn: 'What best describes your work?',
    questionHi: '\u0906\u092A\u0915\u093E \u0915\u093E\u092E \u0915\u094D\u092F\u093E \u0939\u0948?',
    subEn: 'This helps us identify schemes available to you.',
    subHi: '\u0907\u0938\u0938\u0947 \u0939\u092E \u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u0932\u092C\u094D\u0927 \u092F\u094B\u091C\u0928\u093E\u090F\u0902 \u092A\u0939\u091A\u093E\u0928 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964',
    isRequired: true,
    options: [
      { value: OccupationType.SALARIED_PRIVATE, labelEn: 'Salaried \u2014 Private Company',       labelHi: '\u0928\u094C\u0915\u0930\u0940 \u2014 \u092A\u094D\u0930\u093E\u0907\u0935\u0947\u091F \u0915\u0902\u092A\u0928\u0940',      subEn: 'Working in a private firm or startup',   subHi: '\u0928\u093F\u091C\u0940 \u092B\u093C\u0930\u094D\u092E \u092F\u093E \u0938\u094D\u091F\u093E\u0930\u094D\u091F\u0905\u092A \u092E\u0947\u0902 \u0915\u093E\u092E' },
      { value: OccupationType.SALARIED_GOVT,    labelEn: 'Salaried \u2014 Government or PSU',     labelHi: '\u0928\u094C\u0915\u0930\u0940 \u2014 \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u093E PSU',                              subEn: 'Central or state government employee',   subHi: '\u0915\u0947\u0902\u0926\u094D\u0930\u0940\u092F \u092F\u093E \u0930\u093E\u091C\u094D\u092F \u0938\u0930\u0915\u093E\u0930\u0940 \u0915\u0930\u094D\u092E\u091A\u093E\u0930\u0940' },
      { value: OccupationType.SELF_EMPLOYED,    labelEn: 'Self-Employed or Business Owner',       labelHi: '\u0938\u094D\u0935-\u0930\u094B\u091C\u0917\u093E\u0930 \u092F\u093E \u0935\u094D\u092F\u093E\u092A\u093E\u0930\u0940',    subEn: 'Running your own business or practice', subHi: '\u0905\u092A\u0928\u093E \u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u091A\u0932\u093E \u0930\u0939\u0947 \u0939\u0948\u0902' },
      { value: OccupationType.DAILY_WAGE,       labelEn: 'Daily Wage, Gig Worker or Driver',      labelHi: '\u0926\u093F\u0939\u093E\u095C\u0940 \u092E\u091C\u0926\u0942\u0930\u0940 \u092F\u093E \u0917\u093F\u0917 \u0935\u0930\u094D\u0915\u0930', subEn: 'Auto driver, delivery, daily labour',   subHi: '\u0911\u091F\u094B \u091A\u093E\u0932\u0915, \u0921\u093F\u0932\u0940\u0935\u0930\u0940, \u0926\u093F\u0939\u093E\u095C\u0940 \u0915\u093E\u092E' },
      { value: OccupationType.FARMER,           labelEn: 'Farmer',                               labelHi: '\u0915\u093F\u0938\u093E\u0928',                                                                                            subEn: 'Agricultural or allied occupation',     subHi: '\u0916\u0947\u0924\u0940 \u092F\u093E \u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0935\u094D\u092F\u0935\u0938\u093E\u092F' },
      { value: OccupationType.STUDENT,          labelEn: 'Student',                              labelHi: '\u091B\u093E\u0924\u094D\u0930',                                                                                            subEn: 'Currently studying',                    subHi: '\u0905\u092D\u0940 \u092A\u095D\u093E\u0908 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902' },
      { value: OccupationType.HOMEMAKER,        labelEn: 'Homemaker',                            labelHi: '\u0917\u0943\u0939\u093F\u0923\u0940',                                                                                      subEn: 'Managing the household',                subHi: '\u0918\u0930 \u0938\u0902\u092D\u093E\u0932 \u0930\u0939\u0947 \u0939\u0948\u0902' },
      { value: OccupationType.RETIRED,          labelEn: 'Retired',                              labelHi: '\u0938\u0947\u0935\u093E\u0928\u093F\u0935\u0943\u0924\u094D\u0924',                                                       subEn: 'No longer working full time',            subHi: '\u092A\u0942\u0930\u094D\u0923\u0915\u093E\u0932\u093F\u0915 \u0915\u093E\u092E \u0928\u0939\u0940\u0902 \u0915\u0930 \u0930\u0939\u0947' },
    ],
  },
  // Step 3 - In-Hand Income
  {
    id: 'inHandIncome',
    inputType: 'slider',
    questionEn: 'What is your monthly take-home income?',
    questionHi: '\u0906\u092A\u0915\u0940 \u092E\u093E\u0938\u093F\u0915 \u0939\u093E\u0925-\u0906\u092F \u0915\u093F\u0924\u0928\u0940 \u0939\u0948?',
    subEn: 'The amount that actually reaches your hands or bank account every month.',
    subHi: '\u0935\u0939 \u0930\u093E\u0936\u093F \u091C\u094B \u0939\u0930 \u092E\u0939\u0940\u0928\u0947 \u0906\u092A\u0915\u0947 \u0939\u093E\u0925 \u092F\u093E \u0916\u093E\u0924\u0947 \u092E\u0947\u0902 \u0906\u0924\u0940 \u0939\u0948\u0964',
    isRequired: true,
    sliderConfig: { min: 2000, max: 500000, step: 1000, default: 20000, prefix: '\u20B9' },
  },
  // Step 4 - Monthly Surplus
  {
    id: 'monthlySurplus',
    inputType: 'slider',
    questionEn: 'After all expenses, how much is left every month?',
    questionHi: '\u0938\u092D\u0940 \u0916\u0930\u094D\u091A\u094B\u0902 \u0915\u0947 \u092C\u093E\u0926 \u0939\u0930 \u092E\u0939\u0940\u0928\u0947 \u0915\u093F\u0924\u0928\u093E \u092C\u091A\u0924\u093E \u0939\u0948?',
    subEn: 'After rent, food, bills, EMIs, and school fees \u2014 what remains with you.',
    subHi: '\u0915\u093F\u0930\u093E\u092F\u093E, \u092D\u094B\u091C\u0928, \u092C\u093F\u0932, \u0908\u090F\u092E\u0906\u0908 \u0914\u0930 \u0938\u094D\u0915\u0942\u0932 \u092B\u0940\u0938 \u0915\u0947 \u092C\u093E\u0926 \u091C\u094B \u092C\u091A\u0947\u0964',
    isRequired: true,
    sliderConfig: { min: 500, max: 300000, step: 500, default: 5000, prefix: '\u20B9' },
  },
  // Step 5 - Goal
  {
    id: 'goal',
    inputType: 'goal_grid',
    questionEn: 'What do you want this money to do for you?',
    questionHi: '\u0906\u092A \u092F\u0939 \u092A\u0948\u0938\u093E \u0915\u093F\u0938 \u0915\u093E\u092E \u092E\u0947\u0902 \u0932\u0917\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902?',
    subEn: 'Pick the goal closest to your heart.',
    subHi: '\u0935\u0939 \u0932\u0915\u094D\u0937\u094D\u092F \u091A\u0941\u0928\u0947\u0902 \u091C\u094B \u0906\u092A\u0915\u0947 \u0926\u093F\u0932 \u0915\u0947 \u0938\u092C\u0938\u0947 \u0915\u0930\u0940\u092C \u0939\u0948\u0964',
    isRequired: true,
    options: [
      { value: GoalType.CHILD_EDUCATION, labelEn: "Child's Education", labelHi: '\u092C\u091A\u094D\u091A\u0947 \u0915\u0940 \u092A\u095C\u093E\u0908',        icon: '\U0001F4DA' },
      { value: GoalType.CHILD_MARRIAGE,  labelEn: "Child's Marriage",  labelHi: '\u092C\u091A\u094D\u091A\u0947 \u0915\u0940 \u0936\u093E\u0926\u0940',        icon: '\U0001F48D' },
      { value: GoalType.BUY_HOME,        labelEn: 'Buy a Home',        labelHi: '\u0918\u0930 \u0916\u0930\u0940\u0926\u0947\u0902',                           icon: '\U0001F3E0' },
      { value: GoalType.RETIREMENT,      labelEn: 'Retirement',        labelHi: '\u0938\u0947\u0935\u093E\u0928\u093F\u0935\u0943\u0924\u094D\u0924\u093F',    icon: '\U0001F334' },
      { value: GoalType.EMERGENCY_FUND,  labelEn: 'Emergency Fund',    labelHi: '\u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 \u092B\u0902\u0921', icon: '\U0001F6E1' },
      { value: GoalType.GROW_WEALTH,     labelEn: 'Grow Wealth',       labelHi: '\u0938\u0902\u092A\u0924\u094D\u0924\u093F \u0935\u0943\u0926\u094D\u0927\u093F',   icon: '\U0001F4B0' },
      { value: GoalType.START_BUSINESS,  labelEn: 'Start a Business',  labelHi: '\u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902', icon: '\U0001F680' },
      { value: GoalType.BIG_PURCHASE,    labelEn: 'A Big Purchase',    labelHi: '\u092C\u095C\u0940 \u0916\u0930\u0940\u0926\u0940',                           icon: '\U0001F6CD' },
    ],
  },
  // Step 6 - Goal Amount
  {
    id: 'goalAmount',
    inputType: 'slider',
    questionEn: 'How much money do you think you will need?',
    questionHi: '\u0906\u092A\u0915\u094B \u0915\u093F\u0924\u0928\u0947 \u092A\u0948\u0938\u0947 \u0915\u0940 \u091C\u093C\u0930\u0942\u0930\u0924 \u0932\u0917\u0924\u0940 \u0939\u0948?',
    subEn: "Give your best estimate in today's value \u2014 we will adjust for inflation automatically.",
    subHi: '\u0906\u091C \u0915\u0940 \u0915\u0940\u092E\u0924 \u092E\u0947\u0902 \u0905\u0928\u0941\u092E\u093E\u0928 \u0926\u0947\u0902 \u2014 \u0939\u092E \u092E\u0941\u0926\u094D\u0930\u093E\u0938\u094D\u092B\u0940\u0924\u093F \u0938\u094D\u0935\u0924\u0903 \u0938\u092E\u0902\u091C\u093F\u0924 \u0915\u0930\u0947\u0902\u0917\u0947\u0964',
    isRequired: true,
    sliderConfig: { min: 50000, max: 20000000, step: 50000, default: 1000000, prefix: '\u20B9' },
  },
  // Step 7 - Timeline
  {
    id: 'timeline',
    inputType: 'option_list',
    questionEn: 'How soon do you need this money?',
    questionHi: '\u0906\u092A\u0915\u094B \u092F\u0939 \u092A\u0948\u0938\u093E \u0915\u092C \u091A\u093E\u0939\u093F\u090F?',
    subEn: 'Your timeline determines which instruments suit you best.',
    subHi: '\u0906\u092A\u0915\u0940 \u0938\u092E\u092F\u0938\u0940\u092E\u093E \u0924\u092F \u0915\u0930\u0924\u0940 \u0939\u0948 \u0915\u093F \u0915\u094C\u0928 \u0938\u0947 \u0938\u093E\u0927\u0928 \u0938\u0939\u0940 \u0939\u0948\u0902\u0964',
    isRequired: true,
    options: [
      { value: TimelineType.UNDER_1_YEAR,   labelEn: 'Within 1 year',     labelHi: '1 \u0938\u093E\u0932 \u0915\u0947 \u092D\u0940\u0924\u0930',          subEn: 'Very short term',       subHi: '\u0905\u0924\u093F \u0905\u0932\u094D\u092A\u0915\u093E\u0932\u093F\u0915' },
      { value: TimelineType.ONE_TO_3_YEARS, labelEn: '1 to 3 years',      labelHi: '1 \u0938\u0947 3 \u0938\u093E\u0932',                                  subEn: 'Short term goal',       subHi: '\u0905\u0932\u094D\u092A\u0915\u093E\u0932\u093F\u0915 \u0932\u0915\u094D\u0937\u094D\u092F' },
      { value: TimelineType.THREE_TO_7,     labelEn: '3 to 7 years',      labelHi: '3 \u0938\u0947 7 \u0938\u093E\u0932',                                  subEn: 'Medium term goal',      subHi: '\u092E\u0927\u094D\u092F\u0915\u093E\u0932\u093F\u0915 \u0932\u0915\u094D\u0937\u094D\u092F' },
      { value: TimelineType.SEVEN_TO_15,    labelEn: '7 to 15 years',     labelHi: '7 \u0938\u0947 15 \u0938\u093E\u0932',                                 subEn: 'Long term goal',        subHi: '\u0926\u0940\u0930\u094D\u0918\u0915\u093E\u0932\u093F\u0915 \u0932\u0915\u094D\u0937\u094D\u092F' },
      { value: TimelineType.ABOVE_15,       labelEn: '15 years or more',  labelHi: '15 \u0938\u093E\u0932 \u092F\u093E \u0905\u0927\u093F\u0915',           subEn: 'Very long term goal',   subHi: '\u0905\u0924\u093F \u0926\u0940\u0930\u094D\u0918\u0915\u093E\u0932\u093F\u0915 \u0932\u0915\u094D\u0937\u094D\u092F' },
      { value: TimelineType.NOT_SURE,       labelEn: 'I am not sure yet', labelHi: '\u092E\u0941\u091D\u0947 \u092A\u0915\u094D\u0915\u093E \u0928\u0939\u0940\u0902 \u092A\u0924\u093E', subEn: 'Help me figure it out', subHi: '\u0938\u092E\u091D\u0928\u0947 \u092E\u0947\u0902 \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0930\u0947\u0902' },
    ],
  },
  // Step 8 - Monthly Investment
  {
    id: 'monthlyInvestment',
    inputType: 'slider',
    questionEn: 'How much can you set aside every month?',
    questionHi: '\u0906\u092A \u0939\u0930 \u092E\u0939\u0940\u0928\u0947 \u0915\u093F\u0924\u0928\u093E \u0905\u0932\u0917 \u0930\u0916 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902?',
    subEn: 'Be realistic \u2014 consistency matters more than the amount.',
    subHi: '\u092F\u0925\u093E\u0930\u094D\u0925\u0935\u093E\u0926\u0940 \u0930\u0939\u0947\u0902 \u2014 \u0930\u093E\u0936\u093F \u0938\u0947 \u091C\u093C\u094D\u092F\u093E\u0926\u093E \u0928\u093F\u0930\u0902\u0924\u0930\u0924\u093E \u092E\u093E\u092F\u0928\u0947 \u0930\u0916\u0924\u0940 \u0939\u0948\u0964',
    isRequired: true,
    sliderConfig: { min: 500, max: 200000, step: 500, default: 3000, prefix: '\u20B9' },
  },
  // Step 9 - Experience
  {
    id: 'experience',
    inputType: 'option_list',
    questionEn: 'Have you invested before?',
    questionHi: '\u0915\u094D\u092F\u093E \u0906\u092A\u0928\u0947 \u092A\u0939\u0932\u0947 \u0915\u092D\u0940 \u0928\u093F\u0935\u0947\u0936 \u0915\u093F\u092F\u093E \u0939\u0948?',
    subEn: 'No judgement \u2014 this helps us explain things at the right level.',
    subHi: '\u0915\u094B\u0908 \u0928\u093F\u0930\u094D\u0923\u092F \u0928\u0939\u0940\u0902 \u2014 \u0907\u0938\u0938\u0947 \u0939\u092E \u0938\u0939\u0940 \u0938\u094D\u0924\u0930 \u092A\u0930 \u0938\u092E\u091D\u093E\u0928\u0947 \u092E\u0947\u0902 \u092E\u0926\u0926 \u092E\u093F\u0932\u0924\u0940 \u0939\u0948\u0964',
    isRequired: true,
    options: [
      { value: ExperienceType.NEVER,                labelEn: 'Never invested',              labelHi: '\u0915\u092D\u0940 \u0928\u0939\u0940\u0902',                                                              subEn: 'This is my first time',          subHi: '\u092F\u0939 \u092E\u0947\u0930\u093E \u092A\u0939\u0932\u093E \u092E\u094C\u0915\u093E \u0939\u0948' },
      { value: ExperienceType.ONLY_FD_SAVINGS,      labelEn: 'Only FD or savings account',  labelHi: '\u0938\u093F\u0930\u094D\u092B FD \u092F\u093E \u0938\u0947\u0935\u093F\u0902\u0917\u094D\u0938',       subEn: 'Safe bank deposits only',        subHi: '\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092C\u0948\u0902\u0915 \u0921\u093F\u092A\u0949\u091C\u093F\u091F' },
      { value: ExperienceType.GOLD_REAL_ESTATE,     labelEn: 'Gold or real estate',         labelHi: '\u0938\u094B\u0928\u093E \u092F\u093E \u091C\u093C\u092E\u0940\u0928-\u091C\u093E\u092F\u0926\u093E\u0926', subEn: 'Physical assets',              subHi: '\u092D\u094C\u0924\u093F\u0915 \u0938\u0902\u092A\u0924\u094D\u0924\u093F' },
      { value: ExperienceType.MF_STOCKS_OCCASIONAL, labelEn: 'Mutual Funds or stocks occasionally', labelHi: '\u092E\u094D\u092F\u0942\u091A\u0941\u0905\u0932 \u092B\u0902\u0921 \u092F\u093E \u0936\u0947\u092F\u0930 \u0915\u092D\u0940-\u0915\u092D\u0940', subEn: 'Some market experience', subHi: '\u0915\u0941\u091B \u092C\u093E\u091C\u093C\u093E\u0930 \u0905\u0928\u0941\u092D\u0935' },
      { value: ExperienceType.REGULAR_INVESTOR,     labelEn: 'Yes, I invest regularly',     labelHi: '\u0939\u093E\u0902, \u092E\u0948\u0902 \u0928\u093F\u092F\u092E\u093F\u0924 \u0928\u093F\u0935\u0947\u0936 \u0915\u0930\u0924\u093E \u0939\u0942\u0902', subEn: 'Active investor with portfolio', subHi: '\u0938\u0915\u094D\u0930\u093F\u092F \u0928\u093F\u0935\u0947\u0936\u0915 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902' },
    ],
  },
  // Step 10 - Risk Tolerance
  {
    id: 'riskTolerance',
    inputType: 'option_list',
    questionEn: 'If your investment dropped 15% temporarily, what would you do?',
    questionHi: '\u0905\u0917\u0930 \u0906\u092A\u0915\u093E \u0928\u093F\u0935\u0947\u0936 \u0905\u0938\u094D\u0925\u093E\u092F\u0940 \u0930\u0942\u092A \u0938\u0947 15% \u0917\u093F\u0930 \u091C\u093E\u090F, \u0924\u094B \u0906\u092A \u0915\u094D\u092F\u093E \u0915\u0930\u0947\u0902\u0917\u0947?',
    subEn: 'Be honest \u2014 this shapes your entire plan.',
    subHi: '\u0908\u092E\u093E\u0928\u0926\u093E\u0930\u0940 \u0938\u0947 \u091C\u0935\u093E\u092C \u0926\u0947\u0902 \u2014 \u092F\u0939 \u0906\u092A\u0915\u0940 \u092A\u0942\u0930\u0940 \u092F\u094B\u091C\u0928\u093E \u0924\u092F \u0915\u0930\u0924\u093E \u0939\u0948\u0964',
    isRequired: true,
    options: [
      { value: RiskToleranceType.WITHDRAW_IMMEDIATELY, labelEn: 'Withdraw everything immediately', labelHi: '\u0938\u092C \u0915\u0941\u091B \u0924\u0941\u0930\u0902\u0924 \u0928\u093F\u0915\u093E\u0932 \u0932\u0942\u0902',            subEn: 'I cannot afford to take this loss',      subHi: '\u092E\u0948\u0902 \u092F\u0939 \u0928\u0941\u0915\u0938\u093E\u0928 \u0928\u0939\u0940\u0902 \u0909\u0920\u093E \u0938\u0915\u0924\u093E' },
      { value: RiskToleranceType.WORRY_AND_WAIT,       labelEn: 'Worry a lot but wait and watch',  labelHi: '\u091A\u093F\u0902\u0924\u093E \u0915\u0930\u0942\u0902 \u092A\u0930 \u0930\u0941\u0915\u0942\u0902 \u0914\u0930 \u0926\u0947\u0916\u0942\u0902', subEn: 'I would monitor it closely', subHi: '\u092E\u0948\u0902 \u0928\u091C\u093C\u0930 \u0930\u0916\u0942\u0902\u0917\u093E' },
      { value: RiskToleranceType.STAY_CALM,            labelEn: 'Stay calm and hold',              labelHi: '\u0936\u093E\u0902\u0924 \u0930\u0939\u0942\u0902 \u0914\u0930 \u092C\u0928\u093E\u090F \u0930\u0916\u0942\u0902',          subEn: 'Markets recover, I trust the long run', subHi: '\u092C\u093E\u091C\u093C\u093E\u0930 \u0920\u0940\u0915 \u0939\u094B \u091C\u093E\u090F\u0917\u093E, \u0932\u0902\u092C\u0940 \u0926\u094C\u095C \u092A\u0930 \u092D\u0930\u094B\u0938\u093E \u0939\u0948' },
      { value: RiskToleranceType.BUY_MORE,             labelEn: 'Add more money \u2014 this is an opportunity', labelHi: '\u0914\u0930 \u092A\u0948\u0938\u093E \u0932\u0917\u093E\u090A\u0902 \u2014 \u092F\u0939 \u0905\u0935\u0938\u0930 \u0939\u0948', subEn: 'Market dips are normal to me', subHi: '\u092C\u093E\u091C\u093C\u093E\u0930 \u0915\u0940 \u0917\u093F\u0930\u093E\u0935\u091F \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0939\u0948' },
    ],
  },
];

export const TOTAL_STEPS = onboardingSteps.length;