
// app/App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './src/app/context/SessionContext';
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
