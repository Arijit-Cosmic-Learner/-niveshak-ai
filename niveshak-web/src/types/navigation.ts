export type BottomTabParamList = {
	Home:     undefined;
	Discover: undefined;
	MyPlan:   undefined;
	Partner:  undefined;
};

export type RootStackParamList = {
	BottomTabs:  undefined;
	Onboarding:  { startFromStep?: number };
	Results:     { fromOnboarding?: boolean };
};

// Navigation prop types — React Router v6 equivalents (web)
// Use useNavigate() from react-router-dom instead of navigation prop
export type AppRoute = keyof BottomTabParamList;
// placeholder — navigation.ts — implementation coming