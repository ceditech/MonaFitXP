
// app/App.tsx
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './src/session/SessionProvider';
import { RepoProvider } from './src/data/RepoProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { MigrationOverlay } from './src/features/auth/components/MigrationOverlay';
import { EntitlementProvider } from './src/core/entitlements/EntitlementProvider';
import { ErrorBoundary } from './src/shared/ui/ErrorBoundary';

/**
 * On desktop web the app renders in a centered phone-width frame instead of
 * stretching edge-to-edge (native is untouched). Matches modern PWA fitness
 * apps and keeps every screen's layout phone-shaped on all platforms.
 */
const WebFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={frameStyles.backdrop}>
      <View style={frameStyles.frame}>{children}</View>
    </View>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <SessionProvider>
          <EntitlementProvider>
            <MigrationOverlay />
            <RepoProvider>
              <WebFrame>
                <RootNavigator />
              </WebFrame>
            </RepoProvider>
          </EntitlementProvider>
        </SessionProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

const frameStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#0D0D18',
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#1A1A2E',
    // Subtle edge so the frame reads against the backdrop on wide screens
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
});

export default App;
