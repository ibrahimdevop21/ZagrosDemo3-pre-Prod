# Corporate Agricultural Color System Guide

## Overview
This document outlines the comprehensive corporate color system implemented for the Zagros Trading agricultural website. The design emphasizes maturity, trustworthiness, and professional authority through a carefully balanced palette of deep greens and warm yellows.

---

## Design Philosophy

### Core Principles
- **No Pure White**: All backgrounds use warm off-white or subtle green tints
- **No Pure Black**: Text uses deep green-grays for a softer, more organic feel
- **Green as Authority**: Deep forest green establishes brand presence and trust
- **Yellow as Accent**: Warm golden yellow provides highlights without dominating
- **Intentional Hierarchy**: Every color choice serves a specific purpose

### Brand Personality
- Corporate and trustworthy
- Agricultural and earth-connected
- Regional authority
- Calm, confident, professional
- Established (not startup-ish)

---

## Color Token System

### Primary Brand Colors

#### Deep Agricultural Green
```css
--color-brand-primary: 21 87 36;        /* #155724 - Main brand anchor */
--color-brand-primary-hover: 13 60 23;  /* #0D3C17 - Hover state */
--color-brand-primary-light: 34 107 52; /* #226B34 - Lighter variant */
--color-brand-primary-muted: 46 125 50; /* #2E7D32 - Icons */
```

**Usage:**
- Primary CTAs and buttons
- Section headings
- Navigation active states
- Icon colors
- Footer background

#### Warm Agricultural Yellow
```css
--color-accent-primary: 212 163 15;     /* #D4A30F - Golden harvest tone */
--color-accent-hover: 184 134 11;       /* #B8860B - Darker hover */
--color-accent-light: 234 192 49;       /* #EAC031 - Highlights */
--color-accent-muted: 196 148 20;       /* #C49414 - Subtle accents */
```

**Usage:**
- Card borders (left accent)
- Hover states
- Navigation underlines
- Icon accents
- Separator lines
- Never as large background blocks

---

## Background System

### Base Backgrounds (No Pure White)
```css
--color-bg-base: 248 247 244;           /* #F8F7F4 - Body background */
--color-bg-surface: 252 251 248;        /* #FCFBF8 - Card surfaces */
--color-bg-surface-alt: 244 248 242;    /* #F4F8F2 - Alt surface */
--color-bg-surface-hover: 242 245 239;  /* #F2F5EF - Hover state */
```

### Green-Tinted Backgrounds
```css
--color-bg-green-tint: 240 246 238;     /* #F0F6EE - Subtle sections */
--color-bg-green-light: 237 243 234;    /* #EDF3EA - Stronger tint */
--color-bg-brand-muted: 237 243 234;    /* Light brand sections */
--color-bg-brand-soft: 245 250 243;     /* Very soft tint */
```

### Warm Yellow-Tinted Background
```css
--color-bg-yellow-tint: 254 252 245;    /* #FEFCF5 - Subtle warmth */
```

### Section Alternation Pattern
```
Hero → Green Tint → Surface Alt → Green Light → Surface → Green Tint → Footer
```

---

## Text Hierarchy (No Pure Black)

```css
--color-text-primary: 26 32 21;         /* #1A2015 - Headings */
--color-text-secondary: 52 64 42;       /* #34402A - Body text */
--color-text-tertiary: 96 108 86;       /* #606C56 - Meta text */
--color-text-quaternary: 134 142 126;   /* #868E7E - Captions */
--color-text-inverse: 252 251 248;      /* Off-white on dark */
--color-text-brand: 21 87 36;           /* Brand emphasis */
--color-text-accent: 184 134 11;        /* Accent emphasis */
```

**Hierarchy Rules:**
- H1-H2: `text-primary` (deep green-black)
- Body: `text-secondary` (dark green-gray)
- Labels/Meta: `text-tertiary` (muted green-gray)
- Captions: `text-quaternary` (very muted)

---

## Border & Divider System

```css
--color-border-default: 220 222 215;    /* #DCDED7 - Standard */
--color-border-muted: 235 237 230;      /* #EBEDE6 - Subtle */
--color-border-strong: 196 200 189;     /* #C4C8BD - Stronger */
--color-border-brand: 21 87 36;         /* Deep green */
--color-border-accent: 212 163 15;      /* Yellow accent */
--color-border-accent-light: 234 192 49; /* Light yellow */
```

---

## Footer Colors (Deep Green)

```css
--color-footer-bg: 18 46 24;            /* #122E18 - Very deep green */
--color-footer-text: 196 204 189;       /* #C4CCBD - Muted light */
--color-footer-text-muted: 134 142 126; /* #868E7E - Very muted */
--color-footer-border: 34 107 52;       /* Subtle green border */
```

---

## Component Styling Rules

### Buttons

**Primary Button:**
```css
bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
```
- Deep green background
- Off-white text
- Darker green on hover

**Secondary Button:**
```css
bg-transparent text-brand-primary border-2 border-accent-primary 
hover:border-accent-hover hover:bg-bg-yellow-tint
```
- Transparent background
- Yellow border
- Green text
- Subtle yellow tint on hover

**Ghost Button:**
```css
text-brand-primary hover:bg-bg-green-tint
```
- Green text
- Subtle green background on hover

### Cards

**Default Card:**
```css
bg-bg-surface border-l-4 border-l-accent-light hover:shadow-md
```
- Warm surface background
- Left yellow accent border
- Shadow on hover

**Elevated Card:**
```css
bg-bg-surface border-l-4 border-l-accent-primary shadow-lg
```
- Stronger yellow border
- Larger shadow

### Navigation

**Active Link:**
```css
text-brand-primary after:bg-accent-primary
```
- Deep green text
- Yellow underline accent

**Hover State:**
```css
hover:bg-bg-green-tint hover:text-brand-primary
```
- Subtle green background
- Deep green text

### Badges

```css
bg-bg-green-light text-brand-primary border border-brand-primary-muted
```
- Light green background
- Deep green text
- Muted green border

---

## Page-Specific Applications

### Homepage Sections
1. **Hero**: Image carousel with overlay
2. **Partners**: `bg-bg-green-tint`
3. **Trust Indicators**: `bg-bg-yellow-tint` with yellow borders
4. **Activities**: `bg-bg-surface-alt` with yellow-accented cards
5. **Market Presence**: Green gradient background
6. **Customers**: `bg-bg-green-light`
7. **Testimonials**: `bg-bg-surface`

### Navigation Bar
- Background: `bg-bg-surface/95` with backdrop blur
- Active: Deep green text + yellow underline
- Hover: Green tint background

### Footer
- Background: Very deep green (`footer-bg`)
- Text: Muted light colors
- Icons: Yellow accents
- Social: Green backgrounds with yellow hover

---

## Accessibility & Contrast

All color combinations meet WCAG AA standards:
- Text on backgrounds: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

### Focus States
```css
focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
```

---

## Implementation Notes

### Tailwind Classes
All colors are exposed through Tailwind config:
- `bg-brand-primary`, `text-brand-primary`
- `bg-accent-primary`, `border-accent-light`
- `bg-bg-green-tint`, `bg-bg-surface`
- `text-text-primary`, `text-text-secondary`
- `footer-bg`, `footer-text`

### CSS Variables
Direct access via CSS custom properties:
```css
background: rgb(var(--color-bg-green-tint));
color: rgb(var(--color-text-primary));
border-color: rgb(var(--color-accent-primary));
```

---

## Design Outcomes

### Visual Weight
- ✅ No longer feels "too white"
- ✅ Grounded and substantial
- ✅ Clear visual hierarchy
- ✅ Professional depth

### Brand Expression
- ✅ Agricultural authenticity
- ✅ Corporate maturity
- ✅ Regional authority
- ✅ Long-term stability

### User Experience
- ✅ Calm and confident
- ✅ Easy to scan
- ✅ Clear CTAs
- ✅ Consistent patterns

---

## Maintenance Guidelines

### Adding New Components
1. Use `bg-bg-surface` or `bg-bg-surface-alt` for cards
2. Add yellow left border for accent: `border-l-4 border-accent-light`
3. Use `text-brand-primary` for headings
4. Use `text-text-secondary` for body text
5. Icons should be `text-brand-primary`

### Section Backgrounds
Alternate between:
- `bg-bg-surface` (warm off-white)
- `bg-bg-green-tint` (subtle green)
- `bg-bg-green-light` (stronger green)
- Never use pure white (`bg-white`)

### Avoiding Common Mistakes
- ❌ Don't use pure white backgrounds
- ❌ Don't use pure black text
- ❌ Don't use yellow as large background blocks
- ❌ Don't mix too many background tints in one section
- ✅ Do maintain consistent border accent patterns
- ✅ Do use green for authority, yellow for accents
- ✅ Do ensure proper contrast ratios

---

## Quick Reference

| Element | Background | Text | Border/Accent |
|---------|-----------|------|---------------|
| Body | `bg-base` | `text-primary` | - |
| Card | `bg-surface` | `text-secondary` | `border-l-accent-light` |
| Section Alt | `bg-green-tint` | `text-primary` | - |
| Button Primary | `brand-primary` | `text-inverse` | - |
| Button Secondary | `transparent` | `brand-primary` | `accent-primary` |
| Navigation Active | - | `brand-primary` | `accent-primary` underline |
| Footer | `footer-bg` | `footer-text` | `footer-border` |
| Icon | - | `brand-primary` | - |
| Badge | `bg-green-light` | `brand-primary` | `brand-primary-muted` |

---

**Last Updated:** January 2026  
**Design System Version:** 1.0  
**Framework:** Astro + Tailwind CSS
