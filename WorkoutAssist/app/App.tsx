
// app/App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './src/session/SessionProvider';
import { RepoProvider } from './src/data/RepoProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { MigrationOverlay } from './src/features/auth/components/MigrationOverlay';
import { EntitlementProvider } from './src/core/entitlements/EntitlementProvider';

const App = () => {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <EntitlementProvider>
          <MigrationOverlay />
          <RepoProvider>
            <RootNavigator />
          </RepoProvider>
        </EntitlementProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
};

export default App;
