
// app/src/app/navigation/Routes.ts

import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
    Welcome: undefined;
    SignIn: undefined;
    SignUp: undefined;
};

export type MainTabParamList = {
    HomeToday: undefined;
    ExerciseCatalog: undefined;
    PlanTemplates: undefined;
    WorkoutHistory: undefined;
};

export type MainStackParamList = {
    OnboardingWizard: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    // Plans
    PlanTemplateDetail: undefined;
    CreatePlan: undefined;
    // Catalog
    ExerciseDetail: undefined;
    // Workout
    WorkoutPlayer: { planId?: string };
    WorkoutSummary: { workoutId: string };
    // History
    WorkoutDetail: undefined;
    ProgressDashboard: undefined;
    // Settings
    Settings: undefined;
    NotificationPrefs: undefined;
    Paywall: undefined;
};

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<MainStackParamList>;
};
