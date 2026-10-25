/**
 * ============================================================================
 * 🛍️ WEEKLY BAZAAR • MASTER DATABASE
 * ============================================================================
 */
// src/data.js
export const INITIAL_CATEGORIES = [
  { id: 'daily_needs', name: 'Daily Home Needs', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80' },
  { id: 'construction', name: 'Construction & Hardware', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80' },
  { id: 'medicines', name: 'Pharmacy & Wellness', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80' },
  { id: 'decorations', name: 'Events & Decor', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=80' }
];

export const CURATED_COLLECTIONS = [
  { id: 'col_1', title: 'Adilabad Morning Essentials', tag: '🔥 Fast Moving' },
  { id: 'col_2', title: 'Site Construction Bulk Deals', tag: '🏗️ Zero Transport Fee' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Amul Taaza Homogenised Milk',
    shopName: 'Adilabad Dairy Parlour',
    distanceKm: 0.9,
    rating: 4.9,
    buyersToday: 29,
    curiosityTag: '🥛 Morning Fresh Batch',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'mv1', label: '500 ml Pack', price: 28, mrp: 30, weightGrams: 500 },
      { id: 'mv2', label: '1 Litre Carton', price: 56, mrp: 60, weightGrams: 1000 }
    ]
  },
  {
    id: 'prod_2',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Swastick Pure Turmeric Powder',
    shopName: 'Sri Laxmi Supermart',
    distanceKm: 1.4,
    rating: 4.8,
    buyersToday: 42,
    curiosityTag: '🌿 Pure Adilabad Haldi',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'tv1', label: '250 g Pouch', price: 50, mrp: 60, weightGrams: 250 },
      { id: 'tv2', label: '500 g Pack', price: 95, mrp: 115, weightGrams: 500 }
    ]
  },
  {
    id: 'prod_3',
    categoryId: 'construction',
    subCategoryBrand: 'UltraTech Cement (53 Grade)',
    shopName: 'Balaji Steel & Cement Traders',
    distanceKm: 2.1,
    rating: 4.9,
    buyersToday: 18,
    curiosityTag: '🏗️ Fresh Factory Stock',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'cv1', label: '50 kg Bag', price: 380, mrp: 410, weightGrams: 50000 },
      { id: 'cv2', label: '5 Bags Lot', price: 1875, mrp: 2050, weightGrams: 250000 }
    ]
  },
  {
    id: 'prod_4',
    categoryId: 'medicines',
    subCategoryBrand: 'Dolo 650mg & First-Aid Kit',
    shopName: 'Apollo Meds Adilabad',
    distanceKm: 1.1,
    rating: 4.9,
    buyersToday: 34,
    curiosityTag: '⚡ 15-Min Emergency',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'md1', label: '1 Strip (15 Tabs)', price: 32, mrp: 35, weightGrams: 50 },
      { id: 'md2', label: 'Home First-Aid Box', price: 299, mrp: 350, weightGrams: 400 }
    ]
  }
];

export const INITIAL_FUNCTION_HALLS = [
  { id: 'fh_1', name: 'Royal Palace Function Hall', area: 'Vidya Nagar, Adilabad', capacity: 800, pricePerDay: 45000, acIncluded: true },
  { id: 'fh_2', name: 'Green Gardens Open Lawn', area: 'Collectorate Chowk, Adilabad', capacity: 1200, pricePerDay: 60000, acIncluded: false }
];

export const DECORATION_SERVICE_MODULES = [
  { id: 'dec_1', title: 'Grand Floral Entrance Arch & Gate', baseEstimate: 6500 },
  { id: 'dec_2', title: 'Royal Wedding / Haldi Stage Backdrop', baseEstimate: 12000 },
  { id: 'dec_3', title: 'Warm LED Spotlights & Walkway Truss', baseEstimate: 4500 },
  { id: 'dec_4', title: 'VIP Sofa Seating & Mandapam Setup', baseEstimate: 8000 }
];

export const REJECTION_REASONS = [
  'Item out of stock today',
  'Shop closing for lunch break',
  'Heavy transport unavailable right now'
];