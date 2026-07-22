import { Platform, Share } from 'react-native';
import { httpsCallable } from 'firebase/functions';
import { requestAccountDeletion, requestDataExport, deliverExport } from '../accountApi';

describe('accountApi', () => {
    const originalOS = Platform.OS;
    const setPlatform = (os: string) =>
        Object.defineProperty(Platform, 'OS', { value: os, configurable: true });

    afterEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
    });

    describe('callable wrappers', () => {
        it('requestAccountDeletion invokes the deleteAccount callable', async () => {
            await requestAccountDeletion();
            expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'deleteAccount');
        });

        it('requestDataExport invokes exportMyData and returns its data', async () => {
            (httpsCallable as jest.Mock).mockReturnValueOnce(
                jest.fn(() => Promise.resolve({ data: { uid: 'u1', id: 'u1' } })),
            );
            const out = await requestDataExport();
            expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'exportMyData');
            expect(out).toEqual({ uid: 'u1', id: 'u1' });
        });
    });

    describe('deliverExport', () => {
        it('downloads a JSON file on web', async () => {
            setPlatform('web');
            const click = jest.fn();
            const remove = jest.fn();
            const anchor: any = { click, remove, href: '', download: '' };
            const g = globalThis as any;
            g.Blob = jest.fn(function (this: any, parts: any) { this.parts = parts; });
            g.URL = { createObjectURL: jest.fn(() => 'blob:x'), revokeObjectURL: jest.fn() };
            g.document = {
                createElement: jest.fn(() => anchor),
                body: { appendChild: jest.fn() },
            };

            await deliverExport({ uid: 'u1', hello: 'world' });

            expect(g.Blob).toHaveBeenCalled();
            expect(anchor.download).toMatch(/^workoutassist-data-\d{4}-\d{2}-\d{2}\.json$/);
            expect(click).toHaveBeenCalled();
            expect(g.URL.revokeObjectURL).toHaveBeenCalledWith('blob:x');

            delete g.Blob; delete g.URL; delete g.document;
        });

        it('uses the OS share sheet on native', async () => {
            setPlatform('ios');
            const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as any);

            await deliverExport({ uid: 'u1' });

            expect(share).toHaveBeenCalledTimes(1);
            expect(share.mock.calls[0][0].message).toContain('"uid": "u1"');
        });
    });
});
