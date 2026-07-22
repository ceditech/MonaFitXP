
// app/src/app/navigation/RootNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSession } from '../../session/SessionProvider';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import { WelcomeScreen } from '../../features/auth/WelcomeScreen';
import { SignInScreen } from '../../features/auth/SignInScreen';
import { SignUpScreen } from '../../features/auth/SignUpScreen';
import { OnboardingWizard } from '../../features/onboarding/OnboardingWizard';

import { HomeTodayScreen } from '../../features/home/HomeTodayScreen';
import { ExerciseCatalogScreen } from '../../features/catalog/ExerciseCatalogScreen';
import { PlanTemplatesScreen } from '../../features/plans/PlanTemplatesScreen';
import { WorkoutHistoryScreen } from '../../features/history/WorkoutHistoryScreen';

import { WorkoutPlayerScreen } from '../../features/workout/WorkoutPlayerScreen';
import { WorkoutSummaryScreen } from '../../features/workout/WorkoutSummaryScreen';
import { ExerciseDetailScreen } from '../../features/catalog/ExerciseDetailScreen';
import { CreateCustomExerciseScreen } from '../../features/catalog/CreateCustomExerciseScreen';
import { PlanTemplateDetailScreen } from '../../features/plans/PlanTemplateDetailScreen';
import { CreatePlanScreen } from '../../features/plans/CreatePlanScreen';
import { WorkoutDetailScreen } from '../../features/history/WorkoutDetailScreen';
import { ProgressDashboardScreen } from '../../features/history/ProgressDashboardScreen';
import { SettingsScreen } from '../../features/home/SettingsScreen';
import { NotificationPrefsScreen } from '../../features/home/NotificationPrefsScreen';
import { DeleteAccountScreen } from '../../features/home/DeleteAccountScreen';
import { PaywallScreen } from '../../features/home/PaywallScreen';
import { UpgradeScreen } from '../../pages/UpgradeScreen';
import { AICoachScreen } from '../../pages/AICoachScreen';

import { AuthStackParamList, MainStackParamList, MainTabParamList } from './Routes';
import { Colors } from '../../shared/ui/Theme';
import { useEntitlement } from '../../core/entitlements/EntitlementProvider';
import { Flags } from '../../core/flags';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
        <AuthStack.Screen name="SignIn" component={SignInScreen} />
        <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
);

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Bottom-tab icons, as [focused, unfocused] Ionicons names.
 * Without an explicit `tabBarIcon` React Navigation renders a placeholder glyph,
 * which showed up as the broken tab-bar characters. Keyed by route name so
 * adding a tab is a one-line change here.
 */
const TAB_ICONS: Record<keyof MainTabParamList, readonly [IoniconName, IoniconName]> = {
    HomeToday: ['today', 'today-outline'],
    PlanTemplates: ['clipboard', 'clipboard-outline'],
    ExerciseCatalog: ['barbell', 'barbell-outline'],
    WorkoutHistory: ['time', 'time-outline'],
    AICoach: ['sparkles', 'sparkles-outline'],
};

const TabNavigator = () => (
    <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarIcon: ({ color, size, focused }) => {
            const pair = TAB_ICONS[route.name as keyof MainTabParamList];
            // Unknown route → fall back to a neutral dot rather than crashing.
            const name: IoniconName = pair ? (focused ? pair[0] : pair[1]) : 'ellipse-outline';
            return <Ionicons name={name} size={size} color={color} />;
        },
    })}>
        <Tab.Screen name="HomeToday" component={HomeTodayScreen} options={{ title: 'Today' }} />
        <Tab.Screen name="PlanTemplates" component={PlanTemplatesScreen} options={{ title: 'Plans' }} />
        <Tab.Screen name="ExerciseCatalog" component={ExerciseCatalogScreen} options={{ title: 'Exercises' }} />
        <Tab.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} options={{ title: 'History' }} />
        {/* Hidden until a real coach experience ships — the current screen is
            a static placeholder that reads as broken to users. */}
        {Flags.aiCoachEnabled && (
            <Tab.Screen name="AICoach" component={AICoachScreen} options={{ title: 'AI Coach' }} />
        )}
    </Tab.Navigator>
);

const MainNavigator = () => {
    const { session } = useSession();
    const { onboardingCompleted, onboardingSkippedAt } = session;

    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Skipping counts as dismissing: without the skip check the wizard
                remounted on every launch and "Skip" was effectively a no-op. */}
            {!onboardingCompleted && !onboardingSkippedAt && (
                <MainStack.Screen name="OnboardingWizard" component={OnboardingWizard} />
            )}
            <MainStack.Screen name="MainTabs" component={TabNavigator} />

            {/* Modals & Details usually show header */}
            <MainStack.Group screenOptions={{ headerShown: true }}>
                <MainStack.Screen name="PlanTemplateDetail" component={PlanTemplateDetailScreen} />
                <MainStack.Screen name="CreatePlan" component={CreatePlanScreen} />
                <MainStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
                <MainStack.Screen name="CreateCustomExercise" component={CreateCustomExerciseScreen} />
                <MainStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
                <MainStack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
                <MainStack.Screen name="Settings" component={SettingsScreen} />
                <MainStack.Screen name="NotificationPrefs" component={NotificationPrefsScreen} />
                <MainStack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: 'Delete Account' }} />
                <MainStack.Screen name="Upgrade" component={UpgradeScreen} />
                {session.mode === 'guest' && (
                    <MainStack.Screen
                        name="SignUp"
                        component={SignUpScreen}
                        options={{ title: 'Create Account', headerBackTitle: 'Back' }}
                    />
                )}
            </MainStack.Group>
        </MainStack.Navigator>
    );
};

export const RootNavigator = () => {
    const { session } = useSession();
    const { uid, isLoading } = session;
    console.log('[RootNavigator] rendering, uid:', uid, 'OnboardingWizard defined:', !!OnboardingWizard);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {uid ? (
                    <>
                        <Stack.Screen name="Main" component={MainNavigator} />
                        <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />
                        <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
                        <Stack.Screen name="Paywall" component={PaywallScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
