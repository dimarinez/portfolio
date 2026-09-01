export interface Project {
  id: string;
  name: string;
  index: string;
  image: string;
  year: string;
  role: string;
  context: string;
  stack: string[];
  overview: string;
  outcome: string;
  credit: string;
  galleryImages: string[];
  contributions: string[];
}

export const projects: Project[] = [
  {
    id: 'pga',
    name: 'PGA TOUR Superstore',
    index: '01',
    image: '/screenshots/pga.png',
    year: '2021-2025',
    role: 'Senior Full Stack Developer',
    context: 'Capgemini America',
    stack: ['React', 'SFCC', 'uSchedule API', 'Bootstrap'],
    overview:
      'A booking experience that brings golf fittings and lessons into a high-traffic commerce platform.',
    outcome:
      'Delivered a responsive scheduling workflow integrated with Salesforce Commerce Cloud and the existing storefront experience.',
    credit: 'Work completed as part of the Capgemini delivery team.',
    galleryImages: [
      '/screenshots/pga.png',
      '/projects/pga.png',
      '/projects/pga-4.png',
      '/projects/pga-5.png',
    ],
    contributions: [
      'Led development of the React booking interface and customer journey',
      'Integrated Salesforce Commerce Cloud with the uSchedule API',
      'Created a responsive, accessible flow for fittings and lessons',
    ],
  },
  {
    id: 'ugg',
    name: 'UGG',
    index: '02',
    image: '/screenshots/ugg.png',
    year: '2020-2021',
    role: 'Lead Software Engineer',
    context: 'Deckers Outdoor',
    stack: ['SFRA', 'JavaScript', 'ISML', 'Commerce Cloud'],
    overview:
      'Commerce features delivered within the shared platform powering Deckers\' North American brand portfolio.',
    outcome:
      'Supported production storefront experiences while leading the pre-checkout team across multiple Deckers brands.',
    credit: 'Work completed in-house at Deckers Outdoor.',
    galleryImages: [
      '/screenshots/ugg.png',
      '/projects/ugg.png',
      '/projects/ugg-1.png',
    ],
    contributions: [
      'Delivered reusable storefront features across a multi-brand SFRA platform',
      'Led a team of in-house engineers and delivery partners',
      'Translated product requirements into clear, achievable technical work',
    ],
  },
  {
    id: 'asics',
    name: 'ASICS',
    index: '03',
    image: '/screenshots/asics.png',
    year: '2021-2025',
    role: 'Senior Full Stack Developer',
    context: 'Capgemini America',
    stack: ['Next.js', 'Contentstack', 'Material UI', 'React Hook Form'],
    overview:
      'A flexible global form system designed for regional content, validation, and consistent brand presentation.',
    outcome:
      'Created reusable contact and warranty experiences that could adapt to the needs of multiple international regions.',
    credit: 'Work completed as part of the Capgemini delivery team.',
    galleryImages: [
      '/screenshots/asics.png',
      '/projects/asics.png',
      '/projects/asics-1.png',
      '/projects/asics-2.png',
    ],
    contributions: [
      'Built dynamic forms with Next.js, React Hook Form, and Material UI',
      'Connected the experience to Contentstack for regional content control',
      'Established reusable patterns for validation and interface consistency',
    ],
  },
  {
    id: 'prana',
    name: 'prAna',
    index: '04',
    image: '/screenshots/prana.png',
    year: '2016-2019',
    role: 'Web Developer II',
    context: 'prAna / Columbia Sportswear',
    stack: ['SFCC', 'AEM', 'JavaScript', 'Optimizely'],
    overview:
      'A long-term commerce modernization spanning storefront migration, shopping tools, editorial experiences, and CMS workflows.',
    outcome:
      'Helped move the brand onto Salesforce Commerce Cloud while giving the commerce team faster ways to publish and test content.',
    credit: 'Work completed in-house at prAna Living.',
    galleryImages: [
      '/screenshots/prana.png',
      '/projects/prana.png',
      '/projects/prana-1.png',
      '/projects/prana-2.png',
      '/projects/prana-3.png',
    ],
    contributions: [
      'Contributed to the migration from Magento to Salesforce Commerce Cloud',
      'Built shopping tools, fit guides, microsites, and editorial experiences',
      'Created CMS workflows in AEM and supported Optimizely testing',
    ],
  },
  {
    id: 'disney',
    name: 'Disney',
    index: '05',
    image: '/screenshots/disney.png',
    year: '2021-2025',
    role: 'Senior Full Stack Developer',
    context: 'Capgemini America',
    stack: ['SFRA', 'Apple Pay', 'JavaScript', 'Postman'],
    overview:
      'Front-end commerce work focused on cohesive branded experiences, reliable checkout behavior, and reusable standards.',
    outcome:
      'Supported a polished storefront experience and helped deliver a secure Apple Pay integration within SFRA checkout.',
    credit: 'Work completed as part of the Capgemini delivery team.',
    galleryImages: [
      '/screenshots/disney.png',
      '/projects/disney.png',
      '/projects/disney-1.png',
      '/projects/disney-2.png',
      '/projects/disney-3.png',
      '/projects/disney-4.png',
    ],
    contributions: [
      'Developed and refined reusable SFRA interface components',
      'Led Apple Pay integration work and validated payment requests',
      'Helped establish frontend standards through a shared style guide',
    ],
  },
  {
    id: 'sackcloth',
    name: 'Sackcloth & Ashes',
    index: '06',
    image: '/screenshots/sackcloth.png',
    year: '2020',
    role: 'Shopify Developer',
    context: 'Independent engagement',
    stack: ['Shopify', 'Liquid', 'JavaScript', 'CMS'],
    overview:
      'A custom Shopify storefront translating an established mission-driven brand into a flexible commerce experience.',
    outcome:
      'Launched a tailored theme with reusable publishing tools and brand-specific interactions.',
    credit: 'Direct independent client engagement.',
    galleryImages: [
      '/screenshots/sackcloth.png',
      '/projects/sackcloth.png',
      '/projects/sackcloth-1.png',
      '/projects/sackcloth-2.png',
      '/projects/sackcloth-3.png',
    ],
    contributions: [
      'Developed a custom Shopify theme with Liquid',
      'Created reusable content-management sections for the client team',
      'Extended the visual system with custom interactions and components',
    ],
  },
];

export const proofPoints = [
  { value: '10+', label: 'Years in production' },
  { value: '15+', label: 'Commerce launches' },
  { value: '4', label: 'Published apps' },
  { value: '01', label: 'Salesforce credential' },
];

export const capabilities = [
  'Frontend architecture',
  'Commerce platforms',
  'Web applications',
  'Internal tools',
  'CMS engineering',
  'API integrations',
];

export const experience = [
  {
    years: '2026-NOW',
    company: 'Elyon Technology',
    role: 'Lead Developer',
    focus: 'Warehouse operations and product-design software',
  },
  {
    years: '2025-2026',
    company: 'Chize LLC',
    role: 'Founder / Principal Developer',
    focus: 'Mobile apps, custom CMS, commerce, and immersive web',
  },
  {
    years: '2021-2025',
    company: 'Capgemini America',
    role: 'Senior Full Stack Developer',
    focus: 'Enterprise commerce and multi-brand platform delivery',
  },
  {
    years: '2020-2021',
    company: 'Deckers Outdoor',
    role: 'Lead Software Engineer',
    focus: 'Multi-brand SFRA platform and team leadership',
  },
  {
    years: '2016-2019',
    company: 'prAna Living',
    role: 'Web Developer II',
    focus: 'Commerce modernization, CMS tools, and experimentation',
  },
];
