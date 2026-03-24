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

import type {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type {
	BottomTabNavigationProp,
	BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

export type RootStackNavigationProp =
	NativeStackNavigationProp<RootStackParamList>;

export type OnboardingScreenProps =
	NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export type ResultsScreenProps =
	NativeStackScreenProps<RootStackParamList, 'Results'>;

export type BottomTabNavProp =
	BottomTabNavigationProp<BottomTabParamList>;
// placeholder — navigation.ts — implementation coming