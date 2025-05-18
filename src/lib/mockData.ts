
import { Investment, InvestorProfile, CompanyProfile } from './types';

export const mockInvestments: Investment[] = [
  {
    id: '1',
    title: 'Beirut Tech Hub Office Building',
    companyName: 'Lebanon Real Estate Ventures',
    description: 'A prime commercial real estate development in the heart of Beirut Digital District, designed to house tech startups and established companies alike. This property offers state-of-the-art facilities and is expected to generate steady rental income.',
    category: 'real_estate',
    riskLevel: 'low',
    expectedReturn: 8.5,
    minInvestment: 5000,
    targetAmount: 2000000,
    raisedAmount: 850000,
    location: 'beirut',
    sector: 'real_estate',
    investmentType: 'equity',
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    highlights: [
      'Prime location in Beirut Digital District',
      'Pre-leasing agreements with 3 tech companies',
      'Smart building with advanced security features',
      'Expected to be fully operational by Q2 2026'
    ],
    aiPrediction: {
      profitPrediction: 9.2,
      riskAssessment: 'Low risk investment with stable returns expected due to prime location and pre-existing lease agreements.',
      confidenceScore: 85
    },
    fundingStage: 'Series A',
    deadline: '2025-12-31T00:00:00Z',
    createdAt: '2025-01-15T00:00:00Z',
    team: [
      {
        name: 'Karim Hayek',
        role: 'Project Director',
        bio: 'Over 20 years of experience in commercial real estate development across the Middle East.'
      },
      {
        name: 'Nadia Moussa',
        role: 'Financial Manager',
        bio: 'Former investment banker with expertise in real estate financing and portfolio management.'
      }
    ],
    financials: [
      {
        revenue: 0,
        expenses: 100000,
        profit: -100000,
        year: 2024
      },
      {
        revenue: 250000,
        expenses: 150000,
        profit: 100000,
        year: 2025
      },
      {
        revenue: 400000,
        expenses: 200000,
        profit: 200000,
        year: 2026
      }
    ],
    documents: [
      {
        title: 'Business Plan',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Financial Projections',
        type: 'spreadsheet',
        url: '#'
      },
      {
        title: 'Property Valuation Report',
        type: 'pdf',
        url: '#'
      }
    ],
    updates: [
      {
        date: '2025-01-15T00:00:00Z',
        title: 'Project Launch',
        content: 'We are excited to announce the launch of our Beirut Tech Hub project, aimed at revitalizing the local tech ecosystem.'
      },
      {
        date: '2025-02-20T00:00:00Z',
        title: 'Building Permits Secured',
        content: 'All necessary building permits and approvals have been secured from local authorities.'
      }
    ]
  },
  {
    id: '2',
    title: 'Cedar AI - Natural Language Processing Startup',
    companyName: 'Cedar Technologies',
    description: 'A cutting-edge AI startup developing Arabic natural language processing solutions for businesses and government institutions across the Middle East. Our proprietary algorithms offer superior accuracy and cultural relevance for the Arabic language.',
    category: 'startup',
    riskLevel: 'high',
    expectedReturn: 25.0,
    minInvestment: 10000,
    targetAmount: 1500000,
    raisedAmount: 750000,
    location: 'beirut',
    sector: 'technology',
    investmentType: 'equity',
    duration: 36,
    imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a',
    highlights: [
      'Proprietary Arabic NLP technology',
      'Already serving 3 major regional banks',
      'Strong team of AI researchers and engineers',
      'Expanding to government and healthcare sectors'
    ],
    aiPrediction: {
      profitPrediction: 28.5,
      riskAssessment: 'High risk investment with significant growth potential based on proprietary technology and existing client relationships.',
      confidenceScore: 72
    },
    fundingStage: 'Seed',
    deadline: '2025-08-15T00:00:00Z',
    createdAt: '2025-02-10T00:00:00Z',
    team: [
      {
        name: 'Dr. Hassan Abboud',
        role: 'CEO & Founder',
        bio: 'PhD in Computer Science from MIT, previously worked at Google AI research division.'
      },
      {
        name: 'Layla Nassar',
        role: 'CTO',
        bio: 'Machine learning expert with experience at Amazon and local tech startups.'
      }
    ],
    financials: [
      {
        revenue: 200000,
        expenses: 500000,
        profit: -300000,
        year: 2024
      },
      {
        revenue: 800000,
        expenses: 600000,
        profit: 200000,
        year: 2025
      },
      {
        revenue: 2500000,
        expenses: 1200000,
        profit: 1300000,
        year: 2026
      }
    ],
    documents: [
      {
        title: 'Pitch Deck',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Technical White Paper',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Client Testimonials',
        type: 'pdf',
        url: '#'
      }
    ],
    updates: [
      {
        date: '2025-02-10T00:00:00Z',
        title: 'Funding Round Opened',
        content: 'Cedar Technologies has opened its seed funding round to accelerate product development and market expansion.'
      },
      {
        date: '2025-03-05T00:00:00Z',
        title: 'New Banking Client',
        content: 'We are proud to announce a new partnership with one of Lebanon\'s largest banks to implement our NLP solutions.'
      }
    ]
  },
  {
    id: '3',
    title: 'Lebanese Treasury Bonds - 5 Year',
    companyName: 'Lebanese Ministry of Finance',
    description: 'Government bonds issued by the Lebanese Ministry of Finance with a 5-year maturity period. These bonds offer a stable return and are backed by the Lebanese government.',
    category: 'government_bonds',
    riskLevel: 'medium',
    expectedReturn: 7.0,
    minInvestment: 1000,
    targetAmount: 50000000,
    raisedAmount: 25000000,
    location: 'beirut',
    sector: 'finance',
    investmentType: 'debt',
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1618044619888-009e412ff12a',
    highlights: [
      'Government-backed security',
      'Fixed interest rate payments',
      'Helps fund national infrastructure projects',
      'Tax advantages for Lebanese residents'
    ],
    aiPrediction: {
      profitPrediction: 7.2,
      riskAssessment: 'Medium risk due to economic factors, but government backing provides certain safeguards.',
      confidenceScore: 80
    },
    fundingStage: 'N/A',
    deadline: '2025-06-30T00:00:00Z',
    createdAt: '2024-12-01T00:00:00Z',
    team: [
      {
        name: 'Lebanese Ministry of Finance',
        role: 'Issuer',
        bio: 'Official government body responsible for fiscal policy and public finance management.'
      }
    ],
    financials: [
      {
        revenue: 15000000000,
        expenses: 17000000000,
        profit: -2000000000,
        year: 2023
      },
      {
        revenue: 16000000000,
        expenses: 17500000000,
        profit: -1500000000,
        year: 2024
      }
    ],
    documents: [
      {
        title: 'Bond Prospectus',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Government Financial Report',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Terms & Conditions',
        type: 'pdf',
        url: '#'
      }
    ],
    updates: [
      {
        date: '2024-12-01T00:00:00Z',
        title: 'Bond Issuance Announcement',
        content: 'The Ministry of Finance announces a new series of 5-year treasury bonds to fund critical infrastructure projects.'
      },
      {
        date: '2025-01-15T00:00:00Z',
        title: 'Halfway to Target',
        content: 'Bond subscription has reached 50% of the target amount, showing strong investor confidence.'
      }
    ]
  },
  {
    id: '4',
    title: 'Organic Farm & Export Initiative',
    companyName: 'Bekaa Valley Organics',
    description: 'An organic farming initiative in the fertile Bekaa Valley, focused on producing premium organic fruits and vegetables for both local consumption and export to European markets. The project combines traditional Lebanese farming practices with modern organic techniques.',
    category: 'agriculture',
    riskLevel: 'medium',
    expectedReturn: 12.5,
    minInvestment: 2500,
    targetAmount: 500000,
    raisedAmount: 175000,
    location: 'bekaa',
    sector: 'agriculture',
    investmentType: 'crowdfunding',
    duration: 48,
    imageUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad',
    highlights: [
      'Certified organic farming practices',
      'Export agreements with European distributors',
      'Growing local demand for organic produce',
      'EU agricultural standards compliant'
    ],
    aiPrediction: {
      profitPrediction: 13.1,
      riskAssessment: 'Medium risk with potential for stable returns due to increasing demand for organic produce globally.',
      confidenceScore: 76
    },
    fundingStage: 'Growth',
    deadline: '2025-09-15T00:00:00Z',
    createdAt: '2025-03-01T00:00:00Z',
    team: [
      {
        name: 'Ahmad Khoury',
        role: 'Agricultural Director',
        bio: 'Third-generation Lebanese farmer with specialization in organic farming techniques.'
      },
      {
        name: 'Marie Abou Jaoude',
        role: 'Export Manager',
        bio: 'Experience in agricultural exports with established connections to European markets.'
      }
    ],
    financials: [
      {
        revenue: 120000,
        expenses: 100000,
        profit: 20000,
        year: 2024
      },
      {
        revenue: 300000,
        expenses: 200000,
        profit: 100000,
        year: 2025
      },
      {
        revenue: 500000,
        expenses: 300000,
        profit: 200000,
        year: 2026
      }
    ],
    documents: [
      {
        title: 'Business Plan',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Organic Certification',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Export Agreements',
        type: 'pdf',
        url: '#'
      }
    ],
    updates: [
      {
        date: '2025-03-01T00:00:00Z',
        title: 'Project Launch',
        content: 'Bekaa Valley Organics launches its investment campaign to expand organic farming operations.'
      },
      {
        date: '2025-04-10T00:00:00Z',
        title: 'First Harvest Success',
        content: 'Our initial harvest has been completed with excellent yield and quality, meeting EU organic standards.'
      }
    ]
  },
  {
    id: '5',
    title: 'Modern Lebanese Culinary School',
    companyName: 'Beirut Culinary Arts',
    description: 'A vocational education project establishing a world-class culinary school in Beirut focused on traditional Lebanese cuisine with modern techniques. The school will train chefs and offer culinary tourism experiences for international visitors.',
    category: 'education',
    riskLevel: 'medium',
    expectedReturn: 10.0,
    minInvestment: 3000,
    targetAmount: 800000,
    raisedAmount: 320000,
    location: 'beirut',
    sector: 'education',
    investmentType: 'equity',
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf',
    highlights: [
      'Partnerships with renowned Lebanese chefs',
      'Dual revenue from education and tourism',
      'International student recruitment',
      'Restaurant and catering services'
    ],
    aiPrediction: {
      profitPrediction: 11.2,
      riskAssessment: 'Medium risk investment with good growth potential due to Lebanon\'s renowned culinary heritage and tourism opportunities.',
      confidenceScore: 78
    },
    fundingStage: 'Early Growth',
    deadline: '2025-10-30T00:00:00Z',
    createdAt: '2025-01-20T00:00:00Z',
    team: [
      {
        name: 'Chef Ziad Asseily',
        role: 'Culinary Director',
        bio: 'Internationally acclaimed Lebanese chef with restaurants in Beirut and London.'
      },
      {
        name: 'Sarah Halabi',
        role: 'Education Director',
        bio: 'Former administrator at Le Cordon Bleu with expertise in culinary education systems.'
      }
    ],
    financials: [
      {
        revenue: 100000,
        expenses: 250000,
        profit: -150000,
        year: 2024
      },
      {
        revenue: 450000,
        expenses: 350000,
        profit: 100000,
        year: 2025
      },
      {
        revenue: 750000,
        expenses: 500000,
        profit: 250000,
        year: 2026
      }
    ],
    documents: [
      {
        title: 'Business Plan',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Curriculum Overview',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Chef Endorsements',
        type: 'pdf',
        url: '#'
      }
    ],
    updates: [
      {
        date: '2025-01-20T00:00:00Z',
        title: 'School Concept Unveiled',
        content: 'Beirut Culinary Arts reveals its vision for a world-class Lebanese culinary education facility.'
      },
      {
        date: '2025-03-15T00:00:00Z',
        title: 'Location Secured',
        content: 'We have secured a historic building in downtown Beirut for renovation into our culinary campus.'
      }
    ]
  },
  {
    id: '6',
    title: 'Sustainable Tourism Eco-Lodge',
    companyName: 'Cedar Peaks Hospitality',
    description: 'A sustainable tourism project developing an eco-lodge in the mountains of North Lebanon. This property will offer authentic Lebanese experiences while maintaining environmentally responsible practices and supporting local communities.',
    category: 'tourism',
    riskLevel: 'medium',
    expectedReturn: 14.5,
    minInvestment: 5000,
    targetAmount: 1200000,
    raisedAmount: 450000,
    location: 'north',
    sector: 'tourism',
    investmentType: 'equity',
    duration: 72,
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562',
    highlights: [
      'Eco-friendly design and operations',
      'Located near historical cedar forests',
      'Four-season activities and experiences',
      'Supporting local artisans and producers'
    ],
    aiPrediction: {
      profitPrediction: 15.8,
      riskAssessment: 'Medium risk with strong potential returns as sustainable tourism grows globally and Lebanon's natural attractions gain recognition.',
      confidenceScore: 75
    },
    fundingStage: 'Series A',
    deadline: '2025-11-15T00:00:00Z',
    createdAt: '2025-02-01T00:00:00Z',
    team: [
      {
        name: 'Rami Abboud',
        role: 'CEO',
        bio: 'Experience in boutique hospitality management across Lebanon and the Middle East.'
      },
      {
        name: 'Yasmine Khatib',
        role: 'Sustainability Director',
        bio: 'Environmental consultant with certification in sustainable tourism development.'
      }
    ],
    financials: [
      {
        revenue: 0,
        expenses: 150000,
        profit: -150000,
        year: 2024
      },
      {
        revenue: 300000,
        expenses: 250000,
        profit: 50000,
        year: 2025
      },
      {
        revenue: 650000,
        expenses: 400000,
        profit: 250000,
        year: 2026
      }
    ],
    documents: [
      {
        title: 'Business Plan',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Environmental Impact Study',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Architectural Renderings',
        type: 'pdf',
        url: '#'
      }
    ],
    updates: [
      {
        date: '2025-02-01T00:00:00Z',
        title: 'Project Announcement',
        content: 'Cedar Peaks Hospitality unveils plans for a sustainable eco-lodge in North Lebanon.'
      },
      {
        date: '2025-04-05T00:00:00Z',
        title: 'Land Acquisition Complete',
        content: 'We have successfully acquired a 10-hectare property with stunning mountain views for our eco-lodge development.'
      }
    ]
  }
];

export const mockInvestorProfile: InvestorProfile = {
  id: '1',
  name: 'Omar Mansour',
  email: 'omar.mansour@example.com',
  portfolioValue: 125000,
  totalInvested: 100000,
  totalReturns: 25000,
  investmentPreferences: {
    categories: ['startup', 'real_estate'],
    riskLevels: ['low', 'medium'],
    sectors: ['technology', 'real_estate', 'healthcare'],
    locations: ['beirut', 'mount_lebanon']
  },
  investments: [
    {
      investmentId: '1',
      amount: 50000,
      date: '2024-12-15T00:00:00Z',
      currentValue: 54250
    },
    {
      investmentId: '2',
      amount: 30000,
      date: '2025-02-20T00:00:00Z',
      currentValue: 37500
    },
    {
      investmentId: '5',
      amount: 20000,
      date: '2025-01-25T00:00:00Z',
      currentValue: 21500
    }
  ],
  watchlist: ['3', '4', '6'],
  notifications: [
    {
      id: '1',
      type: 'new_opportunity',
      title: 'New Investment Opportunity',
      message: 'A new tech startup matching your preferences is now available for investment.',
      date: '2025-04-10T00:00:00Z',
      read: false,
      relatedInvestmentId: '2'
    },
    {
      id: '2',
      type: 'update',
      title: 'Investment Update',
      message: 'Beirut Tech Hub has secured all building permits ahead of schedule.',
      date: '2025-04-05T00:00:00Z',
      read: true,
      relatedInvestmentId: '1'
    },
    {
      id: '3',
      type: 'threshold',
      title: 'Goal Progress Alert',
      message: 'Your investment portfolio has reached 80% of your 2025 target.',
      date: '2025-04-01T00:00:00Z',
      read: false
    }
  ],
  goals: [
    {
      id: '1',
      title: '2025 Investment Goal',
      targetAmount: 150000,
      currentAmount: 120000,
      deadline: '2025-12-31T00:00:00Z'
    },
    {
      id: '2',
      title: 'Tech Startup Fund',
      targetAmount: 50000,
      currentAmount: 30000,
      deadline: '2026-06-30T00:00:00Z'
    }
  ]
};

export const mockCompanyProfiles: CompanyProfile[] = [
  {
    id: '1',
    name: 'Lebanon Real Estate Ventures',
    logo: 'https://via.placeholder.com/150',
    description: 'A leading real estate development company focused on commercial properties in key Lebanese cities.',
    founded: '2015',
    location: 'beirut',
    sector: 'real_estate',
    team: [
      {
        name: 'Karim Hayek',
        role: 'CEO & Founder',
        bio: 'Over 20 years of experience in commercial real estate development across the Middle East.'
      },
      {
        name: 'Nadia Moussa',
        role: 'CFO',
        bio: 'Former investment banker with expertise in real estate financing and portfolio management.'
      }
    ],
    investments: [mockInvestments[0]],
    documents: [
      {
        title: 'Company Profile',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Portfolio Overview',
        type: 'pdf',
        url: '#'
      }
    ],
    financials: [
      {
        revenue: 5000000,
        expenses: 3500000,
        profit: 1500000,
        year: 2022
      },
      {
        revenue: 7000000,
        expenses: 4500000,
        profit: 2500000,
        year: 2023
      },
      {
        revenue: 9000000,
        expenses: 6000000,
        profit: 3000000,
        year: 2024
      }
    ],
    socialMedia: {
      website: 'https://lebrev.example.com',
      linkedin: 'https://linkedin.com/company/lebrev'
    },
    investors: [
      {
        investorId: '1',
        amount: 50000,
        date: '2024-12-15T00:00:00Z'
      }
    ],
    fundingHistory: [
      {
        round: 'Seed',
        amount: 500000,
        date: '2016-05-01T00:00:00Z',
        investors: ['Angel Investor Group']
      },
      {
        round: 'Series A',
        amount: 2000000,
        date: '2019-08-15T00:00:00Z',
        investors: ['Lebanon Ventures Fund', 'Middle East Growth Capital']
      }
    ]
  },
  {
    id: '2',
    name: 'Cedar Technologies',
    logo: 'https://via.placeholder.com/150',
    description: 'A cutting-edge AI startup developing Arabic natural language processing solutions for businesses and government institutions across the Middle East.',
    founded: '2022',
    location: 'beirut',
    sector: 'technology',
    team: [
      {
        name: 'Dr. Hassan Abboud',
        role: 'CEO & Founder',
        bio: 'PhD in Computer Science from MIT, previously worked at Google AI research division.'
      },
      {
        name: 'Layla Nassar',
        role: 'CTO',
        bio: 'Machine learning expert with experience at Amazon and local tech startups.'
      }
    ],
    investments: [mockInvestments[1]],
    documents: [
      {
        title: 'Technology Overview',
        type: 'pdf',
        url: '#'
      },
      {
        title: 'Market Analysis',
        type: 'pdf',
        url: '#'
      }
    ],
    financials: [
      {
        revenue: 100000,
        expenses: 350000,
        profit: -250000,
        year: 2023
      },
      {
        revenue: 500000,
        expenses: 700000,
        profit: -200000,
        year: 2024
      }
    ],
    socialMedia: {
      website: 'https://cedartech.example.com',
      linkedin: 'https://linkedin.com/company/cedartech',
      twitter: 'https://twitter.com/cedartech'
    },
    investors: [
      {
        investorId: '1',
        amount: 30000,
        date: '2025-02-20T00:00:00Z'
      }
    ],
    fundingHistory: [
      {
        round: 'Pre-seed',
        amount: 250000,
        date: '2022-10-01T00:00:00Z',
        investors: ['Founder Capital']
      },
      {
        round: 'Seed',
        amount: 1000000,
        date: '2024-03-15T00:00:00Z',
        investors: ['Beirut Angels', 'Tech Growth Fund']
      }
    ]
  }
];
