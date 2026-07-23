import { LEGAL_DOCS, LEGAL_VERSION, LegalDocKey } from '../content';

const KEYS: LegalDocKey[] = ['privacy', 'terms', 'disclaimer'];

describe('legal content', () => {
    it.each(KEYS)('%s doc is complete and renderable', key => {
        const doc = LEGAL_DOCS[key];
        expect(doc.key).toBe(key);
        expect(doc.title.length).toBeGreaterThan(0);
        expect(doc.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(doc.sections.length).toBeGreaterThan(0);
        // Every section must render at least one paragraph.
        for (const section of doc.sections) {
            expect(section.body.length).toBeGreaterThan(0);
            expect(section.body.every(p => typeof p === 'string' && p.length > 0)).toBe(true);
        }
    });

    it('each doc version matches the LEGAL_VERSION map that consent records store', () => {
        for (const key of KEYS) {
            expect(LEGAL_DOCS[key].version).toBe(LEGAL_VERSION[key]);
        }
    });

    it('the privacy policy names the data-subject rights it must disclose', () => {
        const text = LEGAL_DOCS.privacy.sections.flatMap(s => s.body).join(' ').toLowerCase();
        expect(text).toContain('export');
        expect(text).toContain('delete');
        expect(text).toContain('health');
    });
});
