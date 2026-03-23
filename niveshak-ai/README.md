# Niveshak.AI
> Aapke sapno ke liye, sahi nivesh
> For your dreams, the right investment.

## What is this?
Arun Jadav, an auto driver in Ranchi earning ₹2,500/month, needs government-backed schemes like Sukanya Samriddhi Yojana and Post Office RD, but no one guides him. Subhash Mukherjee, a product manager in Bengaluru earning ₹60,000/month, needs ELSS, Nifty 50 Index Fund, and InvITs, but only sees mutual funds and stocks.

Niveshak.AI fixes this by asking 9 simple questions in English or Hindi, projects the real inflation-adjusted corpus needed, and matches users to the right investment instruments from a curated set. It then shows a clear plan and connects users to trusted partners to invest.

## Design System
- **Colours:** black #0D0D0D, lime #AAFF00 and their variants
- **Logo:** "Ni" in black on lime green rounded square
- **Fonts:** Sora for English, Noto Sans Devanagari for Hindi

## Tech Stack
| Technology                | Purpose                                 |
|--------------------------|-----------------------------------------|
| React Native + Expo      | App framework, cross-platform           |
| TypeScript (strict)      | Language, type safety                   |
| NativeWind + Tailwind    | Styling, design tokens                   |
| React Navigation v6      | Navigation (tabs, stacks)               |
| Zustand                  | State management                        |
| i18n-js + expo-localization | Internationalisation (EN/HI)         |
| Supabase                 | Backend, database, auth                 |
| @expo-google-fonts/sora  | English font                            |
| @expo-google-fonts/noto-sans-devanagari | Hindi font              |
| @expo/vector-icons       | Icons (Ionicons)                        |
| EAS Build                | Android builds                          |
| Vercel                   | Web deploy                              |
| Prettier, ESLint         | Formatting, linting                     |

## Getting Started
1. Clone this repo
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and add your keys
4. Run `npx expo start`

## Folder Structure
```
niveshak-ai/
├── src/
│   ├── screens/
│   │   ├── LandingScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── PartnerScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LanguageToggle.tsx
│   │   │   ├── LogoMark.tsx
│   │   │   └── Disclaimer.tsx
│   │   ├── onboarding/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── GoalGrid.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   ├── OptionList.tsx
│   │   │   ├── OptionCard.tsx
│   │   │   ├── GoalSlider.tsx
│   │   │   └── InflationProjectionBox.tsx
│   │   ├── results/
│   │   │   ├── ScoreRing.tsx
│   │   │   ├── CorpusCard.tsx
│   │   │   ├── AllocationBar.tsx
│   │   │   ├── AllocationCard.tsx
│   │   │   └── InstrumentCard.tsx
│   │   ├── landing/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── PersonaCard.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── PartnerChips.tsx
│   │   └── partner/
│   │       ├── RevenueModelGrid.tsx
│   │       ├── ValuePropCard.tsx
│   │       └── DemoRequestForm.tsx
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   └── types.ts
│   ├── store/
│   │   ├── useOnboardingStore.ts
│   │   ├── useLanguageStore.ts
│   │   └── useResultsStore.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── en.ts
│   │   └── hi.ts
│   ├── engine/
│   │   ├── riskScorer.ts
│   │   ├── inflationProjector.ts
│   │   ├── instrumentMatcher.ts
│   │   └── allocationBuilder.ts
│   ├── data/
│   │   ├── instruments.ts
│   │   ├── steps.ts
│   │   └── personas.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── anthropic.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── spacing.ts
│   │   └── radius.ts
│   ├── hooks/
│   │   ├── useTranslation.ts
│   │   ├── useOnboarding.ts
│   │   └── useRecommendation.ts
│   └── types/
│       ├── index.ts
│       ├── onboarding.ts
│       ├── instruments.ts
│       └── navigation.ts
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── App.tsx
├── app.json
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
├── .env.example
├── .env.local
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

## Environment Variables
| Variable                      | Description                        | Required |
|-------------------------------|------------------------------------|----------|
| EXPO_PUBLIC_SUPABASE_URL      | Supabase project URL               | Yes      |
| EXPO_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key                  | Yes      |
| EXPO_PUBLIC_ANTHROPIC_API_KEY | Anthropic Claude API key           | No       |
| EXPO_PUBLIC_APP_ENV           | App environment (development)      | Yes      |
| EXPO_PUBLIC_APP_NAME          | App name                           | Yes      |
| EXPO_PUBLIC_INFLATION_RATE    | Default inflation rate (0.06)      | Yes      |
| EXPO_PUBLIC_DEFAULT_LANG      | Default language (en)              | Yes      |

## Screens
Screen         | File                  | Purpose
-------------- | --------------------- | --------------------------------------
Landing        | LandingScreen.tsx     | Hero, personas, how it works
Discover       | OnboardingScreen.tsx  | 9-step goal profiling flow  
My Plan        | ResultsScreen.tsx     | Corpus, allocation, instruments
Partner        | PartnerScreen.tsx     | B2B demo request for banks

## Building for Android
`npx eas build --platform android`

## Deploying Web
`npx expo export --platform web` then `vercel deploy`