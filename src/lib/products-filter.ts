export type FacetState = Record<string, Set<string>>;

export interface FacetCard {
  text: string;
  facets: Record<string, Set<string>>;
}

export function parseStateFromQuery(query: string): FacetState {
  const params = new URLSearchParams(query);
  const state: FacetState = {};
  for (const [key, val] of params.entries()) {
    if (!state[key]) state[key] = new Set();
    val.split(',').forEach(v => v && state[key].add(v));
  }
  return state;
}

export function serializeState(state: FacetState): string {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(state)) {
    if (values.size > 0) params.set(key, Array.from(values).join(','));
  }
  return params.toString();
}

export function matchesProduct(card: FacetCard, state: FacetState, search: string): boolean {
  if (search) {
    const needle = search.toLowerCase();
    if (!card.text.toLowerCase().includes(needle)) return false;
  }
  for (const [facet, values] of Object.entries(state)) {
    if (facet === 'q') continue;
    if (values.size === 0) continue;
    const cardValues = card.facets[facet];
    if (!cardValues || cardValues.size === 0) return false;
    let anyMatch = false;
    for (const v of values) {
      if (cardValues.has(v)) { anyMatch = true; break; }
    }
    if (!anyMatch) return false;
  }
  return true;
}

export function cardFromElement(el: HTMLElement): FacetCard {
  const facets: Record<string, Set<string>> = {};
  for (const key of Object.keys(el.dataset)) {
    if (key.startsWith('facet')) {
      const facetName = key.slice('facet'.length).replace(/^./, c => c.toLowerCase());
      const value = el.dataset[key] ?? '';
      facets[facetName] = new Set(value.split(' ').filter(Boolean));
    }
  }
  return { text: el.textContent ?? '', facets };
}
