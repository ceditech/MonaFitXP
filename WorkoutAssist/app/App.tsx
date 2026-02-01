
// app/App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './src/session/SessionProvider';
import { RepoProvider } from './src/data/RepoProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <RepoProvider>
          <RootNavigator />
        </RepoProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
};

export default App;
