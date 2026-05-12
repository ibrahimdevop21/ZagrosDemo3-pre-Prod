export interface UITranslations {
  site: {
    name: string;
    wordmark: string;
    tagline: string;
    meta_description: string;
  };
  nav: {
    home: string;
    products: string;
    field_reports: string;
    partners: string;
    customers: string;
    about: string;
    contact: string;
    cta_primary: string;
    cta_secondary: string;
    language: string;
  };
  utility: {
    service_area: string;
    hours_label: string;
    partners_label: string;
  };
  footer: {
    newsletter_label: string;
    newsletter_placeholder: string;
    newsletter_submit: string;
    col_catalog: string;
    col_reports: string;
    col_branches: string;
    col_company: string;
    copyright: string;
    colophon_label: string;
    colophon_section: string;
  };
  about: {
    title: string;
    kicker: string;
    headline: string;
    deck: string;
    timeline_label: string;
    timeline: {
      founded_label: string;
      years_label: string;
      staff_label: string;
      parent_label: string;
    };
    services_label: string;
    services: {
      consultancy_title: string;
      consultancy_body: string;
      fertilizers_title: string;
      fertilizers_body: string;
      pesticides_title: string;
      pesticides_body: string;
      seeds_title: string;
      seeds_body: string;
    };
    branches_label: string;
    branches: {
      hq_label: string;
      branch_label: string;
    };
    team_label: string;
    team_pending: string;
    affiliations_label: string;
    affiliations: {
      iata: string;
      additional_pending: string;
    };
    story_label: string;
    story_pending: string;
  };
  contact: {
    title: string;
    kicker: string;
    headline: string;
    deck: string;
    form_route_label: string;
    form_route_sales: string;
    form_route_agronomy: string;
    form_route_press: string;
    form_route_careers: string;
    form_name: string;
    form_email: string;
    form_org: string;
    form_message: string;
    form_submit: string;
    form_disclaimer: string;
    direct_label: string;
    direct_phone: string;
    direct_email: string;
    direct_whatsapp: string;
    direct_hours: string;
    direct_pending: string;
    branches_label: string;
  };
  legal: {
    privacy_title: string;
    privacy_headline: string;
    terms_title: string;
    terms_headline: string;
    section_intro: string;
    section_data: string;
    section_use: string;
    section_sharing: string;
    section_rights: string;
    section_contact: string;
    section_acceptance: string;
    section_scope: string;
    section_pricing: string;
    section_warranty: string;
    section_liability: string;
    section_jurisdiction: string;
    boilerplate_body: string;
    pending_review: string;
  };
  field_reports: {
    page: {
      title: string;
      kicker: string;
      headline: string;
      deck: string;
    };
  };
  partners_page: {
    title: string;
    kicker: string;
    headline: string;
    deck: string;
  };
  customers: {
    page: {
      title: string;
      kicker: string;
      headline: string;
      deck: string;
    };
  };
  report_detail: {
    brief: {
      label: string;
      crop: string;
      date: string;
      read_time: string;
      author: string;
    };
    site: {
      label: string;
      placeholder: string;
    };
    partner: {
      label: string;
    };
  };
  partner_page: {
    kicker: string;
    stat_skus: string;
    stat_lines: string;
    stat_country: string;
    stat_crops: string;
    lines_headline: string;
    reports_headline: string;
  };
  products: {
    page: {
      title: string;
      headline: string;
      deck: string;
      stat_skus: string;
      stat_partners: string;
      stat_subcats: string;
    };
    lines: {
      seeds: {
        label: string;
        headline: string;
        deck: string;
        empty_state: string;
        vegetable_pending: string;
        stat_suppliers: string;
        stat_skus: string;
        stat_subcats: string;
      };
      fertilizers: {
        label: string;
        headline: string;
        deck: string;
        empty_state: string;
        agro_dragon_pending: string;
        stat_suppliers: string;
        stat_skus: string;
        stat_subcats: string;
      };
      pesticides: {
        label: string;
        headline: string;
        deck: string;
        empty_state: string;
        stat_suppliers: string;
        stat_skus: string;
        stat_subcats: string;
      };
    };
    results: {
      label: string;
    };
    compact: {
      col_brand: string;
      col_name: string;
      col_composition: string;
      col_applications: string;
    };
    toolbar: {
      search_label: string;
      search_placeholder: string;
      sort_label: string;
      sort_catalog: string;
      sort_name: string;
      sort_brand: string;
      view_label: string;
      view_cards: string;
      view_compact: string;
    };
    filters: {
      label: string;
      reset: string;
      stub_open: string;
      stub_close: string;
      stub_message: string;
    };
    pills: {
      active_label: string;
      clear_all: string;
    };
    facets: {
      category: string;
      subcategory: string;
      nutrient: string;
      application: string;
      crop_stage: string;
      crop_category: string;
      special_props: string;
      special: {
        organic: string;
        chloride_free: string;
        sodium_free: string;
        acidifying: string;
      };
    };
  };
  product: {
    composition: {
      label: string;
      form: string;
      packaging: string;
      applications: string;
      brochure: string;
      brochure_download: string;
    };
    why: {
      kicker: string;
      headline: string;
    };
    related: {
      kicker: string;
      headline: string;
    };
    header: {
      supplied_via: string;
    };
    badges: {
      organic: string;
      chloride_free: string;
      sodium_free: string;
      acidifying: string;
    };
    rates: {
      label: string;
      kicker: string;
      headline: string;
      col_crop: string;
      col_examples: string;
      col_rate: string;
      col_stage: string;
    };
    compatibility: {
      label: string;
      kicker: string;
      headline: string;
      compatible: string;
      incompatible: string;
      universal_rule_label: string;
      seed_note_headline: string;
      seed_note_body: string;
    };
    seed: {
      agronomy_label: string;
      species: string;
      coating: string;
      pbr: string;
      rainfall: string;
      ph_range: string;
      soil_type: string;
      origin: string;
      sowing_label: string;
      sowing_marginal: string;
      sowing_ideal: string;
      sowing_irrigated: string;
      features_label: string;
    };
    pesticide: {
      spec_label: string;
      active_ingredient: string;
      ai_content: string;
      type: string;
      form: string;
      code: string;
      manufacturer: string;
      origin: string;
      target_pests: string;
      target_crops: string;
      recommendation_label: string;
      efficacy_label: string;
      description_label: string;
    };
  };
  common: {
    read_more: string;
    view: string;
    open_category: string;
    browse_archive: string;
    section: string;
    back: string;
    pending_audit: string;
  };
  home: {
    hero: {
      edition_label: string;
      photo_alt: string;
      headline_a: string;
      headline_b: string;
      deck: string;
      kpi_partners: string;
      kpi_skus: string;
      kpi_years: string;
      kpi_categories: string;
    };
    featured: {
      kicker: string;
    };
    reports: {
      kicker: string;
      headline: string;
    };
    sources: {
      runner: string;
      kicker: string;
      headline_a: string;
      headline_b: string;
    };
    customers: {
      kicker: string;
      headline: string;
      cta: string;
    };
    numbers: {
      kicker: string;
      headline: string;
      regions_label: string;
      audit_chip: string;
    };
    catalog: {
      kicker: string;
      headline: string;
      headline_short: string;
      full_catalog: string;
    };
    cta: {
      kicker: string;
      headline_a: string;
      headline_b: string;
      primary: string;
      secondary: string;
      meta_hours: string;
      meta_response: string;
      meta_languages: string;
    };
    editors_note: {
      kicker: string;
      headline: string;
      first_letter: string;
      para1_body: string;
      para2: string;
      pull_quote: string;
      para3: string;
    };
  };
}
