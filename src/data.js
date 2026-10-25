/**
 * ============================================================================
 * 🛍️ WEEKLY BAZAAR • MASTER DATABASE
 * ============================================================================
 */

export const INITIAL_CATEGORIES = [
  { id: 'daily_needs', name: 'Fresh & Daily', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80' },
  { id: 'construction', name: 'Hardware & Build', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&auto=format&fit=crop&q=80' },
  { id: 'medicines', name: 'Pharmacy', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80' },
  { id: 'decorations', name: 'Event Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&auto=format&fit=crop&q=80' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Amul Taaza Milk (Fresh)',
    shopName: 'Sri Laxmi Supermart',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v1', label: '500ml', price: 28, mrp: 30, weightGrams: 500 },
      { id: 'v2', label: '1L Carton', price: 56, mrp: 60, weightGrams: 1000 }
    ]
  },
  {
    id: 'p2',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Pure Forest Honey',
    shopName: 'Adilabad Organics',
    image: 'https://images.unsplash.com/photo-1587049352847-81a56d773c1c?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v3', label: '250g Jar', price: 150, mrp: 180, weightGrams: 400 },
      { id: 'v4', label: '500g Jar', price: 280, mrp: 350, weightGrams: 800 }
    ]
  },
  {
    id: 'p3',
    categoryId: 'construction',
    subCategoryBrand: 'UltraTech Cement (53 Grade)',
    shopName: 'Balaji Traders',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v5', label: '50kg Bag', price: 380, mrp: 400, weightGrams: 50000 }
    ]
  }
];

export const INITIAL_FUNCTION_HALLS = [
  { id: 'fh1', name: 'Royal Palace Hall', location: 'Vidya Nagar, Adilabad', price: 25000 },
  { id: 'fh2', name: 'Kisan Community Hall', location: 'Collectorate Chowk', price: 15000 }
];

export const DECORATION_SERVICE_MODULES = [
  { id: 'dm1', title: 'Grand Floral Entrance Arch', baseEstimate: 5000 },
  { id: 'dm2', title: 'Traditional Haldi Stage Setup', baseEstimate: 8500 },
  { id: 'dm3', title: 'Warm LED Lighting & DJ System', baseEstimate: 12000 }
];

export const REJECTION_REASONS = [
  'Invalid or blurry Government ID submitted.',
  'Pricing exceeds Adilabad local market standards.',
  'Business physical location could not be verified.',
  'Suspected duplicate merchant account.'
];