import { describe, it, expect } from 'vitest';
import {
  parseStateFromQuery,
  serializeState,
  matchesProduct,
  type FacetCard,
} from '../../src/lib/products-filter';

const makeCard = (overrides: Partial<FacetCard> = {}): FacetCard => ({
  text: 'soluCN 15.5-0-0 Ca calcium tomato citrus',
  facets: {
    category: new Set(['fertilizer']),
    application: new Set(['fertigation', 'foliar']),
    nutrient: new Set(['N', 'Ca']),
    special: new Set(['chloride_free']),
  },
  ...overrides,
});

describe('products-filter library', () => {
  describe('parseStateFromQuery / serializeState', () => {
    it('round-trips a multi-facet query', () => {
      const state = parseStateFromQuery('nutrient=N,Ca&application=foliar');
      expect(state.nutrient).toEqual(new Set(['N', 'Ca']));
      expect(state.application).toEqual(new Set(['foliar']));
      const back = serializeState(state);
      expect(back.split('&').sort()).toEqual(['application=foliar', 'nutrient=N%2CCa'].sort());
    });

    it('returns empty state for empty query', () => {
      expect(Object.keys(parseStateFromQuery(''))).toHaveLength(0);
    });

    it('omits empty facet sets when serializing', () => {
      const state = { nutrient: new Set<string>(), application: new Set(['foliar']) };
      expect(serializeState(state)).toBe('application=foliar');
    });
  });

  describe('matchesProduct', () => {
    it('matches everything when state is empty and search is empty', () => {
      expect(matchesProduct(makeCard(), {}, '')).toBe(true);
    });

    it('matches when a facet value is present on the card', () => {
      expect(
        matchesProduct(makeCard(), { nutrient: new Set(['Ca']) }, '')
      ).toBe(true);
    });

    it('fails when a facet value is required but missing on the card', () => {
      expect(
        matchesProduct(makeCard(), { nutrient: new Set(['Mg']) }, '')
      ).toBe(false);
    });

    it('treats multi-facet state as AND across groups', () => {
      // Card has nutrient Ca AND application foliar — passes.
      expect(
        matchesProduct(makeCard(), {
          nutrient: new Set(['Ca']),
          application: new Set(['foliar']),
        }, '')
      ).toBe(true);

      // Card has nutrient Ca but NOT application soil — fails on second group.
      expect(
        matchesProduct(makeCard(), {
          nutrient: new Set(['Ca']),
          application: new Set(['soil']),
        }, '')
      ).toBe(false);
    });

    it('treats multi-value within one group as OR', () => {
      // Card has nutrient Ca (not Mg). Mg-or-Ca passes via OR.
      expect(
        matchesProduct(makeCard(), { nutrient: new Set(['Mg', 'Ca']) }, '')
      ).toBe(true);
    });

    it('search term substring match is case-insensitive', () => {
      expect(matchesProduct(makeCard(), {}, 'CALCIUM')).toBe(true);
      expect(matchesProduct(makeCard(), {}, 'magnesium')).toBe(false);
    });

    it('search and facets compose with AND', () => {
      // Search matches but facet does not → false.
      expect(
        matchesProduct(makeCard(), { nutrient: new Set(['Mg']) }, 'calcium')
      ).toBe(false);
    });

    it('ignores the q facet (reserved for search)', () => {
      expect(
        matchesProduct(makeCard(), { q: new Set(['anything']) }, '')
      ).toBe(true);
    });
  });
});
