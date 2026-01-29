
// app/App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './src/session/SessionProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </SafeAreaProvider>
  );
};

export default App;
