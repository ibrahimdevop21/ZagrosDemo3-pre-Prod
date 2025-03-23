export interface UITranslations {
  nav: {
    home: string;
    products: string;
    about: string;
    contact: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: {
        products: string;
        contact: string;
      };
    };
    services: {
      title: string;
      items: string[];
    };
    partners: {
      title: string;
      fertilizers: string;
      pesticides: string;
    };
    customers: {
      title: string;
    };
  };
  products: {
    title: string;
    heading: string;
    subheading: string;
    pesticides: string;
    fertilizers: string;
    type: string;
    composition: string;
    usage: string;
  };
  about: {
    title: string;
    history: {
      title: string;
      established: string;
      specialization: string;
    };
    network: {
      title: string;
    };
    management: {
      title: string;
    };
    partners: {
      title: string;
      seeds: string;
      vegetableSeeds: string;
      forageCrops: string;
      agriculturalInputs: string;
    };
  };
  contact: {
    title: string;
    getInTouch: string;
    address: string;
    email: string;
    phone: string;
    branches: string;
    form: {
      title: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      send: string;
    };
  };
  footer: {
    contact: string;
    branches: string;
    quickLinks: string;
    rights: string;
  };
}
