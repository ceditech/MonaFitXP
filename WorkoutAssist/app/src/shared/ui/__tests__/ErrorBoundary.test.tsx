import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { ErrorBoundary } from '../ErrorBoundary';

const Bomb = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('boom');
    }
    return <Text>safe content</Text>;
};

// Suppress React's expected error logging for thrown test components.
let consoleSpy: jest.SpyInstance;
beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
    consoleSpy.mockRestore();
});

describe('ErrorBoundary', () => {
    it('renders children when nothing throws', () => {
        let tree: renderer.ReactTestRenderer;
        act(() => {
            tree = renderer.create(
                <ErrorBoundary>
                    <Bomb shouldThrow={false} />
                </ErrorBoundary>,
            );
        });
        expect(JSON.stringify(tree!.toJSON())).toContain('safe content');
    });

    it('renders the default fallback when a child throws', () => {
        let tree: renderer.ReactTestRenderer;
        act(() => {
            tree = renderer.create(
                <ErrorBoundary>
                    <Bomb shouldThrow={true} />
                </ErrorBoundary>,
            );
        });
        const json = JSON.stringify(tree!.toJSON());
        expect(json).toContain('Something went wrong');
        expect(json).toContain('Try Again');
    });

    it('renders a custom fallback (including null for silent boundaries)', () => {
        let tree: renderer.ReactTestRenderer;
        act(() => {
            tree = renderer.create(
                <ErrorBoundary fallback={null}>
                    <Bomb shouldThrow={true} />
                </ErrorBoundary>,
            );
        });
        expect(tree!.toJSON()).toBeNull();
    });

    it('calls onError with the thrown error', () => {
        const onError = jest.fn();
        act(() => {
            renderer.create(
                <ErrorBoundary onError={onError} fallback={null}>
                    <Bomb shouldThrow={true} />
                </ErrorBoundary>,
            );
        });
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(onError.mock.calls[0][0].message).toBe('boom');
    });

    it('resets when resetKey changes', () => {
        let tree: renderer.ReactTestRenderer;
        act(() => {
            tree = renderer.create(
                <ErrorBoundary resetKey={1}>
                    <Bomb shouldThrow={true} />
                </ErrorBoundary>,
            );
        });
        expect(JSON.stringify(tree!.toJSON())).toContain('Something went wrong');

        act(() => {
            tree!.update(
                <ErrorBoundary resetKey={2}>
                    <Bomb shouldThrow={false} />
                </ErrorBoundary>,
            );
        });
        expect(JSON.stringify(tree!.toJSON())).toContain('safe content');
    });
});
