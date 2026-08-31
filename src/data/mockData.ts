import { Product, DiscoverArticle } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    title: 'Sovereign HD Lace Wig',
    slug: 'sovereign-hd-melt-lace-wig',
    subtitle: '13x6 Fine Swiss Lace · Single-Donor Hair',
    category: 'wigs',
    price: 420,
    originalPrice: 480,
    supplierCost: 165,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085704652057288704Xp9vRzsMdgUsmQaX_3483a27a-35e4-469a-a27c-a8669c3694ec.jpg',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085704652057288705sGng7OjgwW8eKtnh.jpg',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085547949357604864fkqqjX08slEa01mr.webp',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085539561127092224G3RuS4ZmhLtI7Mhw.webp'
    ],
    isPreOrder: true,
    estimatedDelivery: '10–18 business days (Batch Delivery to Norway & Europe)',
    stockCount: 0,
    textures: ['Silky Blunt Cut', 'Straight', 'Body Wave'],
    lengths: ['16 inch', '20 inch', '24 inch', '28 inch', '30 inch'],
    densities: ['180%', '200%', '250%'],
    laceTypes: ['13x6 HD Lace', '13x4 HD Swiss Lace', 'Full Lace Invisible'],
    colors: ['Natural Black (#1B)', 'Jet Black (#1)', 'Rich Chestnut Brown', 'Honey Blonde Mix (#P4/27)'],
    description: 'A considered 13x6 lace wig made from single-donor hair with aligned cuticle and a soft, natural-looking hairline. Fine single knots keep the finish light and discreet.',
    hairOrigin: '100% Raw Virgin Cambodian Temple Hair',
    details: [
      'Pre-plucked natural graduated hairline with delicate baby hairs',
      'Bleached micro-knots for invisible scalp simulation',
      'Ventilated elastic cap with an adjustable silicone grip band',
      'Can be dyed, heat-styled up to 230°C (450°F), and washed with a gentle hair-care routine',
      'Lifespan: 2–3+ years with proper maintenance'
    ],
    careInstructions: [
      'Co-wash weekly with sulfate-free hydrating shampoo & rich argan oil conditioner',
      'Always detangle starting from the ends working gently up to the roots using a wide-tooth comb',
      'Store on the included Tanelia velvet satin head stand inside the magnetic protective box'
    ],
    isNew: true,
    isBestSeller: true,
    isTrending: true,
    supplierId: 'sup-01'
  },
  {
    id: 'prod-02',
    title: 'Aura Body Wave Bundles',
    slug: 'aura-body-wave-raw-bundles',
    subtitle: 'Three-Piece Set · Natural Movement and Soft Sheen',
    category: 'bundles',
    price: 290,
    originalPrice: 340,
    supplierCost: 110,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=85'
    ],
    isPreOrder: true,
    estimatedDelivery: '10–18 business days (Batch Delivery to Norway & Europe)',
    stockCount: 0,
    textures: ['Body Wave', 'Deep Wave', 'Loose Wave'],
    lengths: ['18 inch', '22 inch', '26 inch', '30 inch'],
    densities: ['180%', '200%'],
    laceTypes: ['5x5 HD Closure'],
    colors: ['Natural Black (#1B)', 'Jet Black (#1)', 'Rich Chestnut Brown'],
    description: 'A three-piece set with a deep, natural S-curve and soft movement. The aligned cuticle helps the wave retain its shape through wear and careful restyling.',
    hairOrigin: '100% Raw Virgin Brazilian Hair',
    details: [
      'Reinforced double-drawn machine wefts to prevent shedding',
      'Weight: 100g (±5g) per bundle — full thickness from root to tip',
      'Holds a curl beautifully without relying on stiff hairspray',
      'Naturally soft bouncy texture with medium-high luster'
    ],
    careInstructions: [
      'Apply lightweight heat protectant serum before hot wand styling',
      'Sleep on the Tanelia mulberry silk pillowcase or wear our signature silk bonnet'
    ],
    isNew: false,
    isBestSeller: true,
    isTrending: false,
    supplierId: 'sup-01'
  },
  {
    id: 'prod-03',
    title: 'Ethereal 13x6 HD Frontal',
    slug: 'ethereal-13x6-hd-illusion-frontal',
    subtitle: 'Fine Swiss Lace · Open Parting',
    category: 'frontals',
    price: 185,
    originalPrice: 215,
    supplierCost: 68,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85'
    ],
    isPreOrder: false,
    estimatedDelivery: '2–4 business days (In Stock — Direct Norway 3PL Dispatch)',
    stockCount: 14,
    textures: ['Straight', 'Body Wave', 'Water Wave'],
    lengths: ['14 inch', '18 inch', '20 inch'],
    densities: ['150%', '180%'],
    laceTypes: ['13x6 HD Lace', '13x4 HD Swiss Lace'],
    colors: ['Natural Black (#1B)', 'Honey Blonde Mix (#P4/27)'],
    description: 'An ear-to-ear frontal with six inches of open parting and a fine Swiss lace base. Hand-ventilated for a soft transition at the hairline.',
    hairOrigin: '100% Virgin Hair Single Donor',
    details: [
      'Full 13" x 6" ear-to-ear perimeter allowing high ponytails and half-up styles',
      'Pre-bleached single knots on the hairline transitioning to reinforced double knots behind',
      'Breathable, lightweight construction preventing scalp moisture retention'
    ],
    careInstructions: [
      'Handle lace gently when removing adhesive with organic solvent remover',
      'Do not apply direct concentrated heat or heavy oils directly onto lace knotting'
    ],
    isNew: true,
    isBestSeller: false,
    isTrending: true,
    supplierId: 'sup-02'
  },
  {
    id: 'prod-04',
    title: 'Velvet Noir Deep Wave Wig',
    slug: 'velvet-noir-deep-wave-glueless-wig',
    subtitle: 'Glueless Fit · Defined Deep Wave',
    category: 'wigs',
    price: 460,
    originalPrice: 510,
    supplierCost: 178,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320188886065153v1aY413AR8x3UMJ1_9579f0ac-9a49-4d31-a5d7-1c0927f72b21.png',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320188886065152tq2FNZSPotRRNubJ_a883f996-ea4e-44ac-b083-41e034e27275.png',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320187271258112uQGWZWkeeYeD0s7W_9296d849-7a21-4c40-9253-275161d19f50.png'
    ],
    isPreOrder: true,
    estimatedDelivery: '10–18 business days (Batch Delivery to Norway & Europe)',
    stockCount: 0,
    textures: ['Deep Wave', 'Water Wave', 'Kinky Curly'],
    lengths: ['20 inch', '24 inch', '28 inch', '32 inch'],
    densities: ['200%', '250%'],
    laceTypes: ['13x4 HD Swiss Lace', '5x5 HD Closure'],
    colors: ['Natural Black (#1B)', 'Burgundy (#99J)', 'Rich Chestnut Brown'],
    description: 'A defined deep wave on a tailored glueless cap. The adjustable band gives a secure, comfortable fit without adhesive or heavy edge products.',
    hairOrigin: '100% Cuticle-Aligned Peruvian Virgin Hair',
    details: [
      'Patented anti-slip silicone forehead grip & adjustable nape tension strap',
      'Deep defined curl pattern with considered care for easy detangling',
      'Pre-cut precision zig-zag hairline for natural irregular hairline look'
    ],
    careInstructions: [
      'Use water spray and curl defining mousse to refresh bounce daily',
      'Air dry naturally; avoid vigorous towel rubbing'
    ],
    isNew: false,
    isBestSeller: true,
    isTrending: true,
    supplierId: 'sup-01'
  },
  {
    id: 'prod-05',
    title: 'Lumière Seamless Clip-Ins',
    slug: 'lumiere-seamless-clip-in-extensions',
    subtitle: 'Seven-Piece Set · Flat, Flexible Wefts',
    category: 'extensions',
    price: 240,
    originalPrice: 280,
    supplierCost: 88,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320104320507904WHhs8TJ151sL318C_e6a2c697-f41a-416a-9427-c6c0dd66181e.png',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/208532018898672844850NrUyklchO9ysop_64aa0075-ba7e-4dd8-aaef-1bc7434f0555.webp'
    ],
    isPreOrder: false,
    estimatedDelivery: '2–4 business days (In Stock — Direct Norway 3PL Dispatch)',
    stockCount: 22,
    textures: ['Straight', 'Body Wave'],
    lengths: ['18 inch', '22 inch', '26 inch'],
    densities: ['180%'],
    laceTypes: ['Transparent Lace'],
    colors: ['Natural Black (#1B)', 'Honey Blonde Mix (#P4/27)', 'Rich Chestnut Brown', 'Platinum Ash 613'],
    description: 'Seven flexible pieces with smooth polyurethane bands that sit close to the head for discreet volume and length, even through fine hair.',
    hairOrigin: '100% European Remy Human Hair',
    details: [
      '7 distinct pieces per set (180g total density)',
      'Comfort-coated silicone clips that lock without tugging or scalp tension',
      'Can be washed, curled, straightened and toned'
    ],
    careInstructions: [
      'Wash every 15–20 wears with lukewarm water and deep hydrating mask',
      'Store in the provided Tanelia travel zip hanger case'
    ],
    isNew: true,
    isBestSeller: false,
    isTrending: false,
    supplierId: 'sup-03'
  },
  {
    id: 'prod-06',
    title: 'Artisan 5x5 HD Closure',
    slug: 'artisan-5x5-hd-skin-closure',
    subtitle: 'Fine Lace · Natural Parting',
    category: 'closures',
    price: 135,
    originalPrice: 160,
    supplierCost: 45,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085705268292820992dfqmuuvWSGHYdU39_230f3642-ec06-4fba-a81c-30bcca57938c.jpg',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320187267063808XAthZtraG4AWmex5_59fc5448-331b-4270-8cd2-8dfbc8c32be3.png'
    ],
    isPreOrder: false,
    estimatedDelivery: '2–4 business days (In Stock — Direct Norway 3PL Dispatch)',
    stockCount: 18,
    textures: ['Straight', 'Body Wave', 'Deep Wave'],
    lengths: ['14 inch', '16 inch', '18 inch'],
    densities: ['150%', '180%'],
    laceTypes: ['5x5 HD Closure'],
    colors: ['Natural Black (#1B)', 'Jet Black (#1)'],
    description: 'A compact 5x5 closure with flexible side and middle parting. Fine lace and a natural density transition make it an easy foundation for everyday styling.',
    hairOrigin: '100% Raw Virgin Cambodian Hair',
    details: [
      'Real micro-fine Swiss mesh lace',
      'Natural density transition from hairline back into full body',
      'Custom pre-plucked perimeter'
    ],
    careInstructions: [
      'Avoid scratching lace base with sharp fingernails or metal combs'
    ],
    isNew: false,
    isBestSeller: false,
    isTrending: false,
    supplierId: 'sup-02'
  },
  {
    id: 'prod-07',
    title: 'Mulberry Silk Care Set',
    slug: 'tanelia-mulberry-silk-care-kit',
    subtitle: '22-Momme Silk Bonnet · Brass Comb',
    category: 'accessories',
    price: 65,
    originalPrice: 85,
    supplierCost: 19,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2x_1_55d74548-0357-4f47-8390-65501ff65e04.png',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2x_308f27c5-3af1-4ca4-938b-657dca2b5404.png'
    ],
    isPreOrder: false,
    estimatedDelivery: '2–4 business days (In Stock — Direct Norway 3PL Dispatch)',
    stockCount: 45,
    textures: ['Straight'],
    lengths: ['One Size'],
    densities: ['150%'],
    laceTypes: ['Transparent Lace'],
    colors: ['Rich Chestnut Brown', 'Natural Black (#1B)'],
    description: 'A considered care set for protecting hair between wears. The 22-momme silk bonnet helps reduce friction, while the brass comb moves gently through the lengths.',
    hairOrigin: '100% Grade 6A Mulberry Silk & Gold Plated Brass',
    details: [
      'Extra-wide soft elastic band with zero forehead crease mark technology',
      'Roomy interior accommodating up to 34" long hair and high-density wigs',
      'Includes handcrafted anti-static detangling comb with Tanelia insignia'
    ],
    careInstructions: [
      'Hand wash in cold water with delicate silk detergent; flat dry in shade'
    ],
    isNew: false,
    isBestSeller: true,
    isTrending: false,
    supplierId: 'sup-03'
  },
  {
    id: 'prod-08',
    title: 'Monarch Platinum 613 Wig',
    slug: 'monarch-platinum-613-raw-blonde-wig',
    subtitle: 'Platinum Blonde · 13x6 Fine Lace',
    category: 'wigs',
    price: 495,
    originalPrice: 560,
    supplierCost: 195,
    rating: 0,
    reviewCount: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320188886065155uX2AlAURXsvNKmbi_9bb3263a-0d58-4b95-ad73-44f519c0e731.png',
      'https://cdn.shopify.com/s/files/1/2465/8681/files/2089309686636552192d2C5pGL3NMDHWPYY.png'
    ],
    isPreOrder: true,
    estimatedDelivery: '10–18 business days (Batch Delivery to Norway & Europe)',
    stockCount: 0,
    textures: ['Straight', 'Body Wave'],
    lengths: ['22 inch', '26 inch', '30 inch'],
    densities: ['180%', '200%'],
    laceTypes: ['13x6 HD Lace'],
    colors: ['Platinum Ash 613', 'Honey Blonde Mix (#P4/27)'],
    description: 'A clean platinum blonde finished on fine 13x6 lace. Lifted with care to preserve a soft hand feel and natural movement through the lengths.',
    hairOrigin: '100% Raw Virgin Temple Hair (Cold Lifted 613)',
    details: [
      'Ready to accept custom pastels, warm caramels or vivid tones without bleach damage',
      'Ultra-thin transparent HD lace that disappears on all undertones',
      'Silky straight with heavy natural density'
    ],
    careInstructions: [
      'Use purple toning shampoo once every 3 weeks to eliminate brassiness',
      'Deep condition with bonding oil treatment after heat styling'
    ],
    isNew: true,
    isBestSeller: false,
    isTrending: true,
    supplierId: 'sup-01'
  }
];

export const MOCK_ARTICLES: DiscoverArticle[] = [
  {
    id: 'art-01',
    title: 'The Art of the Undetectable Melt: Behind Our HD Swiss Lace',
    subtitle: 'A closer look at fine single knots, aligned cuticle, and a natural-looking hairline.',
    category: 'Editorial',
    readTime: '4 min read',
    image: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085704652057288705sGng7OjgwW8eKtnh.jpg?width=1200',
    author: 'Elena Lindqvist, Head of Hair Craftsmanship',
    date: 'August 14, 2026',
    featuredProductIds: ['prod-01', 'prod-03'],
    quote: 'True luxury in hair is invisible. It looks like it is growing directly from your own scalp.',
    content: [
      'In traditional wig production, thick French lace and bulky double knots create an artificial ridge at the hairline. At Tanelia, we re-engineered the architecture from the ground up.',
      'We utilize ultra-fine 0.03mm Swiss HD mesh combined with single-hair hand ventilation. Each strand is knotted at an anatomical 45-degree angle, mimicking the natural whorl of human scalp growth.',
      'Paired with raw Cambodian temple hair, the lace retains a natural movement and soft sheen through careful wear and maintenance.'
    ],
    tags: ['HD Lace', 'Temple Hair', 'Craftsmanship', 'Hair Anatomy']
  },
  {
    id: 'art-02',
    title: 'How Our Weekly Batch Model Protects Quality and Eliminates Waste',
    subtitle: 'A transparent look into our sustainable pre-order logistics from artisan ateliers to Oslo fulfillment.',
    category: 'Trend Report',
    readTime: '3 min read',
    image: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320104320507904WHhs8TJ151sL318C_e6a2c697-f41a-416a-9427-c6c0dd66181e.png?width=1200',
    author: 'Henrik Vang, Operations & Logistics',
    date: 'August 11, 2026',
    featuredProductIds: ['prod-02', 'prod-04'],
    quote: 'By consolidating orders weekly, we ensure custom salon-grade freshness while avoiding landfill overproduction.',
    content: [
      'Mass-produced retail hair often sits in damp warehouses for months, drying out delicate cuticles before reaching customers.',
      'Tanelia operates a curated weekly batch model: customers place pre-orders Monday through Sunday. On Monday morning, consolidated purchase orders are sent directly to our master craftsmen in China.',
      'Within 4 days, finished units are inspected, packaged in custom temperature-controlled freight, and flown directly to our Norwegian 3PL center in Oslo. Here, each piece is inspected, conditioned, and nestled into signature Tanelia rigid magnetic packaging.'
    ],
    tags: ['Sustainability', 'Logistics', 'Transparency', 'Norway 3PL']
  },
  {
    id: 'art-03',
    title: 'The Platinum 613 Masterclass: Styling and Care Without Damage',
    subtitle: 'From thermal protection to purple toning bath recipes for salon-level radiance.',
    category: 'Styling Masterclass',
    readTime: '5 min read',
    image: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320188886065155uX2AlAURXsvNKmbi_9bb3263a-0d58-4b95-ad73-44f519c0e731.png?width=1200',
    author: 'Astrid S., Celebrity Stylist',
    date: 'August 06, 2026',
    featuredProductIds: ['prod-08', 'prod-07'],
    quote: 'Blonde is not just a shade; it is a commitment to hydration and silk protection.',
    content: [
      'Bleached hair requires a different lipid barrier strategy. Because cuticles have been opened during the lift, hydration must be sealed with lightweight ceramide treatments.',
      'Always co-wash in lukewarm to cool water, and never apply heat above 180°C without our botanical argan shield.',
      'Sleeping on our 22-momme pure mulberry silk bonnet prevents the friction that leads to blonde breakage at the nape.'
    ],
    tags: ['613 Blonde', 'Silk Care', 'Thermal Styling', 'Maintenance']
  }
];
