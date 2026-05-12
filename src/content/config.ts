import { defineCollection, z } from 'astro:content';

const compositionEntry = z.object({
  value: z.number(),
  unit: z.string(),
});

const cropApplication = z.object({
  category: z.enum(['field_crops', 'vegetables', 'fruit_trees', 'forages', 'oilseeds']),
  examples: z.array(z.string()),
  foliar_rate: z.string().optional(),
  fertigation_rate: z.string().optional(),
  soil_rate: z.string().optional(),
  stage: z.string(),
});

// NOTE: `slug` is reserved by Astro for legacy `type: 'content'` collections.
// Astro strips it from frontmatter and exposes it as `entry.slug`. Do not add
// `slug` here — it will cause "ContentSchemaContainsSlugError" or "slug Required" errors.

const fertilizers = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.object({ en: z.string(), ar: z.string() }),
    brand: z.enum(['K+S', 'Agro Dragon']),
    supplier_slug: z.enum(['k-plus-s', 'agro-dragon']),
    subcategory: z.string(),
    grade: z.string(),
    composition: z.object({
      N: compositionEntry.optional(),
      P2O5: compositionEntry.optional(),
      K2O: compositionEntry.optional(),
      Ca: compositionEntry.optional(),
      MgO: compositionEntry.optional(),
      SO3: compositionEntry.optional(),
      S: compositionEntry.optional(),
      Cl: compositionEntry.optional(),
      trace_elements: z.boolean().optional(),
      chelated_micros: z.boolean().optional(),
    }).optional(),
    form: z.string(),
    packaging: z.string(),
    applications: z.array(z.enum(['foliar', 'fertigation', 'soil', 'pivot', 'hydroponic'])),
    ideal_stages: z.array(z.enum([
      'establishment', 'seedling', 'vegetative', 'flowering',
      'heading', 'fruiting', 'post_harvest'
    ])),
    crops: z.array(cropApplication).optional(),
    compatibility: z.object({
      compatible: z.array(z.string()).optional(),
      incompatible: z.array(z.string()).default([]),
      notes: z.string().optional(),
    }),
    certifications: z.array(z.string()).default([]),
    organic_certified: z.boolean().default(false),
    chloride_free: z.boolean().default(false),
    sodium_free: z.boolean().default(false),
    acidifying: z.boolean().default(false),
    hazard_class: z.string().optional(),
    origin_country: z.string().optional(),
    bag_photo_url: z.string().optional(),
    bag_color_token: z.string().optional(),
    brochure_url: z.string().optional(),
    stock_confirmation: z.enum(['confirmed', 'pending_client']).default('confirmed'),
  }),
});

const seeds = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.object({ en: z.string(), ar: z.string() }),
    brand: z.enum(['Barenbrug', 'East West Seeds']),
    supplier_slug: z.enum(['barenbrug', 'east-west-seeds']),
    subcategory: z.enum(['forage', 'vegetable']),
    species: z.string(),
    coating: z.string().optional(),
    pbr: z.boolean().default(false),
    rainfall_mm: z.string().optional(),
    ph_range: z.string().optional(),
    soil_type: z.string().optional(),
    sowing_rates: z.object({
      marginal_dryland: z.string().optional(),
      ideal_dryland: z.string().optional(),
      irrigated: z.string().optional(),
    }).optional(),
    key_features: z.array(z.object({ en: z.string(), ar: z.string() })).default([]),
    origin_country: z.string(),
    image_url: z.string().optional(),
    datasheet_url: z.string().optional(),
  }),
});

const pesticides = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.object({ en: z.string(), ar: z.string() }),
    code: z.object({ en: z.string(), ar: z.string() }),
    subcategory: z.enum(['insecticide', 'herbicide', 'fungicide']),
    type: z.object({ en: z.string(), ar: z.string() }),
    form: z.object({ en: z.string(), ar: z.string() }),
    active_ingredient: z.string(),
    active_ingredient_content: z.object({ en: z.string(), ar: z.string() }),
    manufacturer: z.object({ en: z.string(), ar: z.string() }),
    origin_country: z.string(),
    description: z.object({ en: z.string(), ar: z.string() }),
    recommendation: z.object({ en: z.string(), ar: z.string() }).optional(),
    efficacy: z.object({ en: z.string(), ar: z.string() }).optional(),
    target_pests: z.array(z.string()).default([]),
    target_crops: z.array(z.string()).default([]),
    image_url: z.string().optional(),
  }),
});

const fieldReports = defineCollection({
  type: 'content',
  schema: z.object({
    // NOTE: `slug` is reserved by Astro for `type: 'content'` collections —
    // it's auto-derived from the filename and exposed as `entry.slug`.
    // Do not add it here (will cause "slug Required" or schema errors).
    issue: z.number(),
    title: z.object({ en: z.string(), ar: z.string() }),
    summary: z.object({ en: z.string(), ar: z.string() }),
    author: z.string(),
    date: z.date(),
    location: z.string(),
    read_time_minutes: z.number(),
    related_products: z.array(z.string()),    // SKU slugs
    related_partners: z.array(z.string()),    // partner slugs
    crop: z.string(),
    hero_image: z.string(),
    illustrative: z.boolean().default(false),
    featured: z.boolean().default(false),
    stat_line: z.string().optional(),
  }),
});

const partners = defineCollection({
  type: 'content',
  schema: z.object({
    // NOTE: `slug` auto-derived from filename. See note above on fieldReports.
    name: z.string(),
    country: z.string(),
    country_code: z.string(),
    category: z.enum(['vegetable_seeds', 'forage_seeds', 'fertilizers', 'pesticides']),
    since_year: z.number().nullable(),
    logo_path: z.string().nullable(),
    tagline: z.object({ en: z.string(), ar: z.string() }),
    product_lines: z.array(z.object({
      name: z.string(),
      grade: z.string(),
      crops: z.array(z.string()),
    })),
    stats: z.object({
      years_in_partnership: z.number().optional(),
      products_carried: z.number(),
      tons_2024: z.number().optional(),
      states_served: z.number().optional(),
    }).nullable(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  fertilizers,
  seeds,
  pesticides,
  'field-reports': fieldReports,
  partners,
};
