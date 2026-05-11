# Field Reports + Partners Implementation Plan (Plan 4 of 5)

**Spec reference:** §6.4 Field Reports index, §6.5 Field Report detail, §6.6 Partners index, §6.7 Partner deep-dive.

**Goal:** Complete the editorial spine — long-form Field Reports + Partners deep-dives that the home page already links to.

**Dependencies on Plans 1–3 (tags `plan-1-foundation` … `plan-3-products`):**
- field-reports + partners collections seeded (3 reports, 2 partners)
- ReportCard / PartnerCard / Breadcrumb / Layout / CaptionStrip
- Editorial primitives (Kicker, SectionNumber, PullQuote, DropCap, PhotoStamp, DisclaimerChip)

**Out of scope:**
- /about, /contact, /privacy, /terms (Plan 5)
- Search/filter on archive pages
- Comment threads or save-report functionality (post-launch)

---

## File Structure

**Create (components):**
```
src/components/reports/
  TrialInBrief.astro       ← dark spec card for the report sidebar
  TrialSitePanel.astro     ← paper panel with location + crop + date
  PartnerSidePanel.astro   ← paper panel with partner logo + tagline
  ReportHero.astro         ← issue-stamp + headline + byline + full-bleed photo

src/components/partners/
  PartnerHero.astro        ← dark hero band with 200×200 logo + 4-stat row
  ProductLinesTable.astro  ← table of SKUs Zagros carries from this partner
  ReportsByPartner.astro   ← 3-card grid filtered to a partner
```

**Create (pages):**
```
src/pages/field-reports/index.astro
src/pages/field-reports/[slug].astro
src/pages/ar/field-reports/index.astro
src/pages/ar/field-reports/[slug].astro
src/pages/partners/index.astro
src/pages/partners/[slug].astro
src/pages/ar/partners/index.astro
src/pages/ar/partners/[slug].astro
```

**Modify:**
- `src/i18n/{en,ar}.json` + types.ts — add `reports.*` + `partner_page.*` subtrees

**Tests:**
```
tests/pages/field-reports.test.ts
tests/pages/partners.test.ts
```

---

## Task 1: Report side panels (TrialInBrief, TrialSitePanel, PartnerSidePanel)

- [ ] **TrialInBrief.astro** — dark card with crop · date · read-time · related products

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
interface Props { report: CollectionEntry<'field-reports'>; }
const { report } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const dateLabel = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(report.data.date);
---
<aside class="bg-ink text-paper p-sp-6">
  <h3 class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-paper/60 mb-sp-5 m-0">{t('report_detail.brief.label')}</h3>
  <dl class="space-y-sp-4 font-mono text-[11px] tracking-[0.16em] uppercase">
    <div class="flex justify-between gap-sp-4 border-b border-dashed border-paper/15 pb-2">
      <dt class="text-paper/55">{t('report_detail.brief.crop')}</dt><dd class="text-paper m-0 text-end">{report.data.crop}</dd>
    </div>
    <div class="flex justify-between gap-sp-4 border-b border-dashed border-paper/15 pb-2">
      <dt class="text-paper/55">{t('report_detail.brief.date')}</dt><dd class="text-paper m-0 text-end">{dateLabel}</dd>
    </div>
    <div class="flex justify-between gap-sp-4 border-b border-dashed border-paper/15 pb-2">
      <dt class="text-paper/55">{t('report_detail.brief.read_time')}</dt><dd class="text-paper m-0 text-end">{report.data.read_time_minutes} min</dd>
    </div>
    <div class="flex justify-between gap-sp-4">
      <dt class="text-paper/55">{t('report_detail.brief.author')}</dt><dd class="text-paper m-0 text-end">{report.data.author}</dd>
    </div>
  </dl>
</aside>
```

- [ ] **TrialSitePanel.astro** — location + crop in a paper panel.

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
interface Props { report: CollectionEntry<'field-reports'>; }
const { report } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<aside class="bg-paper border border-stone p-sp-6">
  <h3 class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute mb-sp-4 m-0">{t('report_detail.site.label')}</h3>
  <div class="font-display italic text-sienna text-3xl mb-sp-3">§ {report.data.location}</div>
  <p class="font-sans text-sm text-ink/80 m-0 leading-relaxed">{report.data.crop} · {t('report_detail.site.placeholder')}</p>
</aside>
```

- [ ] **PartnerSidePanel.astro** — pick first related partner.

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
interface Props { report: CollectionEntry<'field-reports'>; }
const { report } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const partners = await getCollection('partners');
const partner = partners.find(p => p.slug === report.data.related_partners[0]);
---
{partner && (
  <aside class="bg-paper border border-stone p-sp-6">
    <h3 class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute mb-sp-4 m-0">{t('report_detail.partner.label')}</h3>
    <div class:list={['inline-flex items-center justify-center px-4 py-3 mb-sp-4', partner.slug === 'k-plus-s' ? 'bg-signal' : 'bg-field']}>
      <img src={partner.data.logo_path} alt={partner.data.name} class="block max-h-10 w-auto" />
    </div>
    <div class="font-display text-2xl text-ink leading-tight">{partner.data.name}</div>
    <p class="font-sans text-sm text-ink/75 mt-sp-3 m-0">{partner.data.tagline[lang as 'en' | 'ar']}</p>
    <a href={`${lang === 'ar' ? '/ar' : ''}/partners/${partner.slug}`} class="mt-sp-4 inline-block font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink border-b border-ink no-underline">{t('common.view')} →</a>
  </aside>
)}
```

- [ ] **Commit** — `feat(reports): three sidebar panels for field-report detail pages`

---

## Task 2: ReportHero.astro — issue stamp + headline + byline + full-bleed photo

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getLangFromUrl } from '../../i18n/utils';
import PhotoStamp from '../editorial/PhotoStamp.astro';
import DisclaimerChip from '../editorial/DisclaimerChip.astro';

interface Props { report: CollectionEntry<'field-reports'>; }
const { report } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const title = report.data.title[lang as 'en' | 'ar'];
const dateLabel = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(report.data.date);
---
<header class="stage-grid pb-sp-9 pt-sp-7">
  <div class="col-span-2 col-start-2 hidden lg:block">
    <span class="font-display italic font-light text-sienna text-[clamp(96px,14vw,200px)] leading-none">{String(report.data.issue).padStart(2, '0')}</span>
  </div>
  <div class="col-span-9 col-start-5">
    <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute">Issue {String(report.data.issue).padStart(2, '0')} · {report.data.crop}</span>
    <h1 class="font-display text-[clamp(40px,6vw,84px)] leading-[1.02] text-ink mt-sp-5 max-w-[24ch]">{title}</h1>
    <div class="flex flex-wrap gap-sp-5 mt-sp-7 font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute">
      <span>{report.data.author}</span>
      <span>{dateLabel}</span>
      <span>{report.data.location}</span>
      <span>{report.data.read_time_minutes} min read</span>
    </div>
  </div>
</header>

<figure class="relative">
  <img src={report.data.hero_image} alt={`Illustrative hero for ${title}`} class="block w-full h-[min(60vh,640px)] object-cover" />
  <PhotoStamp issue={String(report.data.issue).padStart(2, '0')} year={String(report.data.date.getFullYear())} edition={report.data.crop} />
  <div class="absolute top-sp-6 start-sp-6"><DisclaimerChip /></div>
</figure>
```

- [ ] **Commit** — `feat(reports): ReportHero with massive issue numeral + byline + full-bleed photo`

---

## Task 3: /field-reports index (EN + AR)

3-col grid with all reports + page header. Reuses ReportCard from Plan 2.

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import ReportCard from '../../components/cards/ReportCard.astro';
import Kicker from '../../components/editorial/Kicker.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const reports = (await getCollection('field-reports')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<Layout title={t('field_reports.page.title')}>
  <Breadcrumb items={[{ label: t('nav.home'), href: lang === 'ar' ? '/ar/' : '/' }, { label: t('nav.field_reports') }]} />
  <header class="px-page-x pb-sp-9">
    <Kicker label={t('field_reports.page.kicker')} accent="sienna" />
    <h1 class="font-display text-[clamp(48px,7vw,96px)] leading-[0.95] text-ink mt-sp-5 max-w-[22ch] mb-sp-7">{t('field_reports.page.headline')}</h1>
    <p class="font-sans text-lg text-ink/80 max-w-[60ch]">{t('field_reports.page.deck')}</p>
  </header>
  <section class="px-page-x pb-section-y">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sp-7">
      {reports.map(r => <ReportCard report={r} />)}
    </div>
  </section>
</Layout>
```

- [ ] **Commit** — `feat(reports): /field-reports index — 3-col card grid sorted by date desc`

---

## Task 4: /field-reports/[slug] detail (EN + AR)

Asymmetric 3+6+3 layout per spec §6.5. MDX body rendered via `entry.render()`.

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import ReportHero from '../../components/reports/ReportHero.astro';
import TrialInBrief from '../../components/reports/TrialInBrief.astro';
import TrialSitePanel from '../../components/reports/TrialSitePanel.astro';
import PartnerSidePanel from '../../components/reports/PartnerSidePanel.astro';

export async function getStaticPaths() {
  const reports = await getCollection('field-reports');
  return reports.map(r => ({ params: { slug: r.slug }, props: { report: r } }));
}
interface Props { report: CollectionEntry<'field-reports'>; }
const { report } = Astro.props;
const lang: 'en' | 'ar' = 'en';
const t = useTranslations(lang);
const { Content } = await report.render();
const title = report.data.title[lang];
---
<Layout title={title}>
  <Breadcrumb items={[
    { label: t('nav.home'), href: '/' },
    { label: t('nav.field_reports'), href: '/field-reports' },
    { label: `Issue ${String(report.data.issue).padStart(2, '0')}` },
    { label: title },
  ]} />

  <ReportHero report={report} />

  <article class="stage-grid py-section-y">
    <aside class="col-span-3 col-start-2 flex flex-col gap-sp-6">
      <TrialInBrief report={report} />
      <TrialSitePanel report={report} />
      <PartnerSidePanel report={report} />
    </aside>

    <div class="col-span-7 col-start-6 prose-editorial">
      <Content />
    </div>
  </article>
</Layout>
```

Add `prose-editorial` utility in global.css for Fraunces lead + Plex Sans body + signal pull-quote styling.

- [ ] **Commit** — `feat(reports): /field-reports/[slug] detail — asymmetric 3+7 layout with MDX body + sidebar panels`

---

## Task 5: PartnerHero.astro

Dark hero band with logo tile + identity panel + 4-stat row.

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Kicker from '../editorial/Kicker.astro';

interface Props { partner: CollectionEntry<'partners'>; }
const { partner } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const tagline = partner.data.tagline[lang as 'en' | 'ar'];
const tileBg = partner.slug === 'k-plus-s' ? 'bg-signal' : 'bg-field';
---
<section class="bg-ink text-paper py-section-y">
  <div class="stage-grid">
    <div class:list={['col-span-2 col-start-2 flex items-center justify-center aspect-square', tileBg]}>
      <img src={partner.data.logo_path} alt={partner.data.name} class="block max-h-24 w-auto" style="mix-blend-mode: multiply;" />
    </div>
    <div class="col-span-7 col-start-5">
      <Kicker label={`${t('partner_page.kicker')} · ${partner.data.country}`} accent="signal" />
      <h1 class="font-display italic font-light text-[clamp(48px,7vw,96px)] leading-[0.95] text-paper mt-sp-5 mb-sp-7">{partner.data.name}</h1>
      <p class="font-display text-2xl text-paper/85 max-w-[40ch] leading-snug">{tagline}</p>
    </div>

    <div class="col-span-12 col-start-2 mt-section-y grid grid-cols-2 lg:grid-cols-4 gap-sp-7 border-t border-paper/20 pt-sp-5">
      <div>
        <span class="font-display italic text-paper text-5xl leading-none">{partner.data.stats.products_carried}</span>
        <div class="mt-sp-3 font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/70">{t('partner_page.stat_skus')}</div>
      </div>
      <div>
        <span class="font-display italic text-paper text-5xl leading-none">{partner.data.product_lines.length}</span>
        <div class="mt-sp-3 font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/70">{t('partner_page.stat_lines')}</div>
      </div>
      <div>
        <span class="font-display italic text-paper text-5xl leading-none">{partner.data.country}</span>
        <div class="mt-sp-3 font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/70">{t('partner_page.stat_country')}</div>
      </div>
      <div>
        <span class="font-display italic text-paper text-5xl leading-none">{Array.from(new Set(partner.data.product_lines.flatMap(l => l.crops))).length}</span>
        <div class="mt-sp-3 font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/70">{t('partner_page.stat_crops')}</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Commit** — `feat(partners): PartnerHero — dark band with logo tile + identity panel + 4-stat row`

---

## Task 6: ProductLinesTable + ReportsByPartner

```astro
---
// ProductLinesTable.astro
import type { CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
interface Props { partner: CollectionEntry<'partners'>; }
const { partner } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <h2 class="col-span-5 col-start-2 font-display text-5xl text-ink leading-tight">{t('partner_page.lines_headline')}</h2>
    <div class="col-span-6 col-start-8">
      <table class="w-full">
        <tbody>
          {partner.data.product_lines.map((line) => (
            <tr class="border-b border-stone align-baseline">
              <td class="py-sp-5 font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute w-[12ch]">{line.name}</td>
              <td class="py-sp-5 font-display italic text-xl text-ink">{line.grade}</td>
              <td class="py-sp-5 font-mono text-[10px] tracking-[0.16em] uppercase text-mute text-end">{line.crops.join(' · ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
```

```astro
---
// ReportsByPartner.astro
import { getCollection } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import ReportCard from '../cards/ReportCard.astro';
interface Props { partnerSlug: string; }
const { partnerSlug } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const reports = await getCollection('field-reports', ({ data }) => data.related_partners.includes(partnerSlug));
---
{reports.length > 0 && (
  <section class="py-section-y bg-stone/30">
    <div class="stage-grid">
      <h2 class="col-span-12 col-start-2 font-display text-4xl text-ink mb-sp-7">{t('partner_page.reports_headline')}</h2>
      <div class="col-span-12 col-start-2 grid grid-cols-1 md:grid-cols-3 gap-sp-6">
        {reports.slice(0, 3).map(r => <ReportCard report={r} />)}
      </div>
    </div>
  </section>
)}
```

- [ ] **Commit** — `feat(partners): ProductLinesTable + ReportsByPartner components`

---

## Task 7: /partners index (EN + AR)

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import PartnerCard from '../../components/cards/PartnerCard.astro';
import Kicker from '../../components/editorial/Kicker.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const partners = await getCollection('partners');
---
<Layout title={t('partners_page.title')}>
  <Breadcrumb items={[{ label: t('nav.home'), href: lang === 'ar' ? '/ar/' : '/' }, { label: t('nav.partners') }]} />
  <header class="px-page-x pb-sp-9">
    <Kicker label={t('partners_page.kicker')} accent="sienna" />
    <h1 class="font-display text-[clamp(48px,7vw,96px)] leading-[0.95] text-ink mt-sp-5 max-w-[24ch] mb-sp-7">{t('partners_page.headline')}</h1>
    <p class="font-sans text-lg text-ink/80 max-w-[60ch]">{t('partners_page.deck')}</p>
  </header>
  <section class="px-page-x pb-section-y">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-sp-7">
      {partners.map(p => <PartnerCard partner={p} />)}
    </div>
  </section>
</Layout>
```

- [ ] **Commit** — `feat(partners): /partners index — 2-col big-card grid`

---

## Task 8: /partners/[slug] deep-dive (EN + AR)

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import PartnerHero from '../../components/partners/PartnerHero.astro';
import ProductLinesTable from '../../components/partners/ProductLinesTable.astro';
import ReportsByPartner from '../../components/partners/ReportsByPartner.astro';

export async function getStaticPaths() {
  const partners = await getCollection('partners');
  return partners.map(p => ({ params: { slug: p.slug }, props: { partner: p } }));
}
interface Props { partner: CollectionEntry<'partners'>; }
const { partner } = Astro.props;
const lang: 'en' | 'ar' = 'en';
const t = useTranslations(lang);
---
<Layout title={partner.data.name}>
  <Breadcrumb items={[
    { label: t('nav.home'), href: '/' },
    { label: t('nav.partners'), href: '/partners' },
    { label: partner.data.name },
  ]} />
  <PartnerHero partner={partner} />
  <ProductLinesTable partner={partner} />
  <ReportsByPartner partnerSlug={partner.slug} />
</Layout>
```

- [ ] **Commit** — `feat(partners): /partners/[slug] deep-dive — hero + lines table + reports strip`

---

## Task 9: i18n strings (field_reports, partners_page, report_detail, partner_page subtrees)

Single batched edit to en.json + ar.json + types.ts. EN keys:
- `field_reports.page.{title, kicker, headline, deck}`
- `partners_page.{title, kicker, headline, deck}`
- `report_detail.brief.{label, crop, date, read_time, author}`
- `report_detail.site.{label, placeholder}`
- `report_detail.partner.label`
- `partner_page.{kicker, stat_skus, stat_lines, stat_country, stat_crops, lines_headline, reports_headline}`

AR equivalents — hand-curated.

- [ ] **Commit** — `feat(i18n): field-reports + partners-page subtrees (EN + AR)`

---

## Task 10: Tests

```typescript
// tests/pages/field-reports.test.ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../src/pages/field-reports/index.astro';
import Detail from '../../src/pages/field-reports/[slug].astro';
import { getCollection } from 'astro:content';

describe('field-reports index', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('</html>');
  });
  it('contains all 3 report slugs', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('issue-03-salt-stress-tomato');
    expect(html).toContain('issue-03-magnesium-citrus');
    expect(html).toContain('issue-03-lucerne-yield');
  });
});

describe('field-reports detail', () => {
  it('renders for every report', async () => {
    const container = await AstroContainer.create();
    const reports = await getCollection('field-reports');
    for (const report of reports) {
      const html = await container.renderToString(Detail, { props: { report } });
      expect(html).toContain('</html>');
      expect(html).toContain(report.data.title.en);
    }
  });
});
```

Similar for `tests/pages/partners.test.ts`.

- [ ] **Commit** — `test: field-reports + partners pages render smoke`

---

## Task 11: Milestone

```bash
npm test && npm run build
git commit --allow-empty -m "milestone: Plan 4 — Field Reports + Partners complete"
git tag plan-4-reports-partners
```

Target build size: 40 base + 6 field-reports (1 index + 3 detail × 2 locales — wait, 3 detail per locale + 1 index per locale = 8) + 6 partner routes (1 index + 2 detail × 2 locales) = 40 + 8 + 6 = **54 pages**.
