import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { AlertHost } from '../AlertHost';
import { showAlert } from '../showAlert';

/** All nodes carrying a given testID (composite + host both match). */
const byId = (tree: ReactTestRenderer, id: string) =>
    tree.root.findAllByProps({ testID: id });

const textOf = (tree: ReactTestRenderer, id: string) =>
    byId(tree, id)[0].props.children;

const press = (tree: ReactTestRenderer, id: string) =>
    act(() => {
        byId(tree, id)[0].props.onPress();
    });

describe('AlertHost', () => {
    let tree: ReactTestRenderer;

    afterEach(() => {
        act(() => tree?.unmount());
    });

    it('renders nothing until an alert is raised', () => {
        act(() => {
            tree = renderer.create(<AlertHost />);
        });
        expect(byId(tree, 'alert-title')).toHaveLength(0);
    });

    it('shows the title and message from showAlert', () => {
        act(() => {
            tree = renderer.create(<AlertHost />);
        });

        act(() => {
            showAlert('Sign Up Failed', 'An account with this email already exists.');
        });

        expect(textOf(tree, 'alert-title')).toBe('Sign Up Failed');
        expect(textOf(tree, 'alert-message')).toBe(
            'An account with this email already exists.',
        );
    });

    it('omits the message row when only a title is given', () => {
        act(() => {
            tree = renderer.create(<AlertHost />);
        });

        act(() => showAlert('Selection Required'));

        expect(textOf(tree, 'alert-title')).toBe('Selection Required');
        expect(byId(tree, 'alert-message')).toHaveLength(0);
    });

    it('dismisses on OK', () => {
        act(() => {
            tree = renderer.create(<AlertHost />);
        });

        act(() => showAlert('Error', 'Failed to activate plan.'));
        expect(byId(tree, 'alert-title').length).toBeGreaterThan(0);

        press(tree, 'alert-dismiss');

        expect(byId(tree, 'alert-title')).toHaveLength(0);
    });

    it('queues alerts instead of letting a second overwrite the first', () => {
        act(() => {
            tree = renderer.create(<AlertHost />);
        });

        act(() => {
            showAlert('First', 'one');
            showAlert('Second', 'two');
        });

        // Dismissing the first reveals the second rather than losing it.
        expect(textOf(tree, 'alert-title')).toBe('First');
        press(tree, 'alert-dismiss');
        expect(textOf(tree, 'alert-title')).toBe('Second');
    });

    it('unregisters on unmount so a later showAlert does not set state', () => {
        act(() => {
            tree = renderer.create(<AlertHost />);
        });
        act(() => tree.unmount());

        // Would warn about updating an unmounted component if still registered.
        expect(() => showAlert('After', 'unmount')).not.toThrow();
    });
});
