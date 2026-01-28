import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';
import { useSession } from '../../app/context/SessionContext';

export const HomeTodayScreen = ({ navigation }: any) => {
    const { signOut } = useSession();

    return (
        <PlaceholderScreen
            title="Today"
            description="Your daily workout overview."
            action={() => navigation.navigate('WorkoutPlayer')}
            actionLabel="Start Workout"
            navigation={navigation}
            nextLabel="Logout (Dev)"
            nextRoute="Auth"
            onNextPress={signOut}
        />
    );
};
