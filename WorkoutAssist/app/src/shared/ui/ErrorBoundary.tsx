
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from './Theme';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    /** Custom fallback UI. Pass `null` for a silent boundary (e.g. optional visuals). */
    fallback?: React.ReactNode;
    onError?: (error: Error, info: React.ErrorInfo) => void;
    /** When this value changes, the boundary resets and re-renders children. */
    resetKey?: unknown;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

/**
 * Generic error boundary. Used app-wide as a last-resort crash screen and
 * reused around optional UI (e.g. GL animations) with a silent fallback so
 * a failing extra never takes down a critical flow.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
        this.props.onError?.(error, info);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false });
        }
    }

    private handleRetry = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback !== undefined) {
                return <>{this.props.fallback}</>;
            }
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.subtitle}>
                        An unexpected error occurred. Your data is safe.
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                        <Text style={styles.retryText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.brandDarkBlue,
        padding: 24,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: Colors.brandPurple,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 14,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
