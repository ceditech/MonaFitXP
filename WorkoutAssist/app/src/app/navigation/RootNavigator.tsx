
// app/src/app/navigation/RootNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSession } from '../../session/SessionProvider';
import { View, ActivityIndicator } from 'react-native';

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
import { PlanTemplateDetailScreen } from '../../features/plans/PlanTemplateDetailScreen';
import { CreatePlanScreen } from '../../features/plans/CreatePlanScreen';
import { WorkoutDetailScreen } from '../../features/history/WorkoutDetailScreen';
import { ProgressDashboardScreen } from '../../features/history/ProgressDashboardScreen';
import { SettingsScreen } from '../../features/home/SettingsScreen';
import { NotificationPrefsScreen } from '../../features/home/NotificationPrefsScreen';
import { PaywallScreen } from '../../features/home/PaywallScreen';

import { AuthStackParamList, MainStackParamList, MainTabParamList } from './Routes';
import { Colors } from '../../shared/ui/Theme';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
        <AuthStack.Screen name="SignIn" component={SignInScreen} />
        <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        <AuthStack.Screen name="OnboardingWizard" component={OnboardingWizard} />
    </AuthStack.Navigator>
);

const TabNavigator = () => (
    <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
    }}>
        <Tab.Screen name="HomeToday" component={HomeTodayScreen} options={{ title: 'Today' }} />
        <Tab.Screen name="PlanTemplates" component={PlanTemplatesScreen} options={{ title: 'Plans' }} />
        <Tab.Screen name="ExerciseCatalog" component={ExerciseCatalogScreen} options={{ title: 'Exercises' }} />
        <Tab.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} options={{ title: 'History' }} />
    </Tab.Navigator>
);

const MainNavigator = () => (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="MainTabs" component={TabNavigator} />

        {/* Modals & Details usually show header */}
        <MainStack.Group screenOptions={{ headerShown: true }}>
            <MainStack.Screen name="PlanTemplateDetail" component={PlanTemplateDetailScreen} />
            <MainStack.Screen name="CreatePlan" component={CreatePlanScreen} />
            <MainStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
            <MainStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
            <MainStack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
            <MainStack.Screen name="Settings" component={SettingsScreen} />
            <MainStack.Screen name="NotificationPrefs" component={NotificationPrefsScreen} />
        </MainStack.Group>

        {/* Full Screen Modals */}
        <MainStack.Group screenOptions={{ presentation: 'fullScreenModal', headerShown: false }}>
            <MainStack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />
            <MainStack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
            <MainStack.Screen name="Paywall" component={PaywallScreen} />
        </MainStack.Group>
    </MainStack.Navigator>
);

export const RootNavigator = () => {
    const { session } = useSession();
    const { uid, isLoading } = session;

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
                    <Stack.Screen name="App" component={MainNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
