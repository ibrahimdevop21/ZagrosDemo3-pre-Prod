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

const products = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string(),
    name: z.object({
      en: z.string(),
      ar: z.string(),
    }),
    brand: z.enum(['K+S', 'Barenbrug']),
    supplier: z.string(),
    category: z.enum(['fertilizer', 'forage_seed']),
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
    }),
    form: z.string(),
    packaging: z.string(),
    applications: z.array(z.enum(['foliar', 'fertigation', 'soil', 'pivot', 'hydroponic'])),
    ideal_stages: z.array(z.enum(['establishment', 'vegetative', 'flowering', 'fruiting', 'post_harvest'])),
    crops: z.array(cropApplication),
    compatibility: z.object({
      compatible: z.string().optional(),
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
    bag_photo_url: z.string().optional(),       // empty until client provides
    bag_color_token: z.string(),                 // CSS color token for SVG mockup
    brochure_url: z.string().optional(),
  }),
});

const fieldReports = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string(),
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
  }),
});

const partners = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    country: z.string(),
    since_year: z.number(),
    logo_path: z.string(),
    tagline: z.object({ en: z.string(), ar: z.string() }),
    product_lines: z.array(z.object({
      name: z.string(),
      grade: z.string(),
      crops: z.array(z.string()),
    })),
    stats: z.object({
      years_in_partnership: z.number(),
      products_carried: z.number(),
      tons_2024: z.number().optional(),
      states_served: z.number().optional(),
    }),
  }),
});

export const collections = { products, 'field-reports': fieldReports, partners };
