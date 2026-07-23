
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
    AICoach: undefined;
};

export type MainStackParamList = {
    OnboardingWizard: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    // Plans
    PlanTemplateDetail: undefined;
    CreatePlan: undefined;
    // Catalog
    ExerciseDetail: { exerciseId: string };
    CreateCustomExercise: undefined;
    // Workout
    WorkoutPlayer: { planId?: string };
    WorkoutSummary: { workoutId: string };
    // History
    WorkoutDetail: { workoutId: string };
    ProgressDashboard: undefined;
    // Settings
    Settings: undefined;
    NotificationPrefs: undefined;
    DeleteAccount: undefined;
    Paywall: { source?: string; templateId?: string; returnTo?: string };
    Upgrade: { reason?: string };
    AICoach: undefined;
    SignUp: undefined;
};

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<MainStackParamList>;
};
