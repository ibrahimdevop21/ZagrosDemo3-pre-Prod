import { describe, it, expect } from 'vitest';
import compatibility from '../../src/data/compatibility.json';

describe('compatibility matrix', () => {
  it('exposes a record keyed by SKU slug', () => {
    expect(compatibility).toBeTypeOf('object');
    expect(Object.keys(compatibility).length).toBeGreaterThanOrEqual(11);
  });

  it('records soluCN cannot mix with phosphate sources or sulphates', () => {
    expect(compatibility['solu-cn'].incompatible).toEqual(
      expect.arrayContaining(['solu-up', 'solu-map', 'solu-mkp', 'epso-top', 'solu-ams-premium'])
    );
  });

  it('records soluAMS Premium cannot mix with calcium-containing fertilizers or pesticides', () => {
    expect(compatibility['solu-ams-premium'].incompatible).toContain('solu-cn');
    expect(compatibility['solu-ams-premium'].notes).toMatch(/pesticide/i);
  });

  it('records each entry includes a chemistry "why" reason', () => {
    for (const sku of Object.keys(compatibility)) {
      if (sku.startsWith('_')) continue;
      const entry = compatibility[sku as keyof typeof compatibility] as {
        incompatible: string[];
        reasons?: Record<string, string>;
      };
      if (entry.incompatible.length > 0) {
        expect(entry.reasons, `${sku} must have reasons`).toBeDefined();
      }
    }
  });

  it('the universal-rule callout is present', () => {
    expect(compatibility._universal_rule).toMatch(/tank-mix/);
  });
});
