import { Product, DiscoverArticle, Review, Order } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    title: 'The Sovereign HD Melt Lace Wig',
    slug: 'sovereign-hd-melt-lace-wig',
    subtitle: '13x6 Ultra-Thin Swiss HD Lace · Raw Virgin Hair',
    category: 'wigs',
    price: 420,
    originalPrice: 480,
    supplierCost: 165,
    rating: 4.95,
    reviewCount: 128,
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
    description: 'The pinnacle of undetectable lace craftsmanship. Sourced from single-donor raw virgin temple hair with cuticle alignment in one direction. Pre-plucked with ultra-fine single micro-knots that melt flawlessly into any skin tone.',
    hairOrigin: '100% Raw Virgin Cambodian Temple Hair',
    details: [
      'Pre-plucked natural graduated hairline with delicate baby hairs',
      'Bleached micro-knots for invisible scalp simulation',
      'Ventilated elastic luxury cap with adjustable silicone non-slip band',
      'Can be dyed, heat-styled up to 230°C (450°F), and washed with premium hair care',
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
    title: 'Aura Body Wave Raw Bundles (3-Piece)',
    slug: 'aura-body-wave-raw-bundles',
    subtitle: 'Triple-Wefted Raw Virgin Hair · Natural High Luster',
    category: 'bundles',
    price: 290,
    originalPrice: 340,
    supplierCost: 110,
    rating: 4.92,
    reviewCount: 94,
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
    description: 'Voluminous, lustrous body wave bundles with intact natural cuticles. Retains its deep S-curve wave pattern through multiple washes and heat restylings.',
    hairOrigin: '100% Raw Virgin Brazilian Hair',
    details: [
      'Reinforced double-drawn machine wefts to prevent shedding',
      'Weight: 100g (±5g) per bundle — full thickness from root to tip',
      'Holds curls effortlessly for over 72 hours without stiff hairspray',
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
    title: 'Ethereal 13x6 HD Illusion Frontal',
    slug: 'ethereal-13x6-hd-illusion-frontal',
    subtitle: 'Transparent Ultra-Fine Swiss Lace · Free Parting',
    category: 'frontals',
    price: 185,
    originalPrice: 215,
    supplierCost: 68,
    rating: 4.88,
    reviewCount: 63,
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
    description: 'An expansive ear-to-ear frontal offering 6 inches of deep parting versatility. Hand-ventilated using genuine ultra-fine Swiss HD lace that becomes completely invisible upon contact.',
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
    title: 'Velvet Noir Deep Wave Glueless Wig',
    slug: 'velvet-noir-deep-wave-glueless-wig',
    subtitle: 'Ready-to-Wear 3D Fitted Cap · Zero Glue Needed',
    category: 'wigs',
    price: 460,
    originalPrice: 510,
    supplierCost: 178,
    rating: 4.98,
    reviewCount: 172,
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
    description: 'Designed for effortless luxury in under 3 minutes. Built on a tailored 3D ergonomic dome cap with an invisible piano elastic band for rock-solid security without glue or harsh edge gels.',
    hairOrigin: '100% Cuticle-Aligned Peruvian Virgin Hair',
    details: [
      'Patented anti-slip silicone forehead grip & adjustable nape tension strap',
      'Deep defined curl pattern with zero tangle formula',
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
    title: 'Lumière Seamless Clip-In Extensions (7-Piece Set)',
    slug: 'lumiere-seamless-clip-in-extensions',
    subtitle: 'Ultra-Flat Silicone Wefts · Instant Volume & Length',
    category: 'extensions',
    price: 240,
    originalPrice: 280,
    supplierCost: 88,
    rating: 4.91,
    reviewCount: 88,
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
    description: 'Innovative polyurethane seamless bands that lay 50% flatter against the scalp than traditional stitched wefts. Invisible even in fine or thin hair.',
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
    title: 'Artisan 5x5 HD Skin Closure',
    slug: 'artisan-5x5-hd-skin-closure',
    subtitle: 'Natural Scalp Parting · High Density Base',
    category: 'closures',
    price: 135,
    originalPrice: 160,
    supplierCost: 45,
    rating: 4.86,
    reviewCount: 47,
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
    description: 'Compact 5x5 inch HD lace closure offering side and middle partings with minimal maintenance. Ideal for natural everyday sew-ins and custom wig making.',
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
    title: 'Tanelia Mulberry Silk Care Kit',
    slug: 'tanelia-mulberry-silk-care-kit',
    subtitle: 'Signature 22-Momme Silk Bonnet & Wide-Tooth Brass Comb',
    category: 'accessories',
    price: 65,
    originalPrice: 85,
    supplierCost: 19,
    rating: 4.99,
    reviewCount: 215,
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
    description: 'Engineered specifically for preserving luxury hair bundles and lace wigs. Made from pure 22-momme Grade 6A mulberry silk to eliminate friction, split ends, and nocturnal moisture loss.',
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
    title: 'Monarch Platinum 613 Raw Blonde Lace Wig',
    slug: 'monarch-platinum-613-raw-blonde-wig',
    subtitle: 'Double-Processed Pure 613 Blonde · 13x6 HD Lace',
    category: 'wigs',
    price: 495,
    originalPrice: 560,
    supplierCost: 195,
    rating: 4.96,
    reviewCount: 78,
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
    description: 'Clean, radiant platinum blonde crafted with our gentle cold-bath lift process to maintain 100% cuticle integrity and silky soft tactile texture.',
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
    subtitle: 'Why microscopic single knots and cuticle-aligned raw hair represent the new luxury standard.',
    category: 'Editorial',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    author: 'Elena Lindqvist, Head of Hair Craftsmanship',
    date: 'August 14, 2026',
    featuredProductIds: ['prod-01', 'prod-03'],
    quote: 'True luxury in hair is invisible. It looks like it is growing directly from your own scalp.',
    content: [
      'In traditional wig production, thick French lace and bulky double knots create an artificial ridge at the hairline. At Tanelia, we re-engineered the architecture from the ground up.',
      'We utilize ultra-fine 0.03mm Swiss HD mesh combined with single-hair hand ventilation. Each strand is knotted at an anatomical 45-degree angle, mimicking the natural whorl of human scalp growth.',
      'Coupled with our raw Cambodian temple hair that has never undergone chemical acid baths, the hair retains natural elasticity, movement, and a high-end natural sheen that lasts years.'
    ],
    tags: ['HD Lace', 'Temple Hair', 'Craftsmanship', 'Hair Anatomy']
  },
  {
    id: 'art-02',
    title: 'How Our Weekly Batch Model Protects Quality and Eliminates Waste',
    subtitle: 'A transparent look into our sustainable pre-order logistics from artisan ateliers to Oslo fulfillment.',
    category: 'Trend Report',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
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

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    author: 'Camilla Thorne',
    location: 'Oslo, Norway',
    rating: 5,
    title: 'The lace completely vanished on my skin',
    content: 'I have worn luxury hair for over 7 years from London and New York salons, and Tanelia is on an entirely different level. The Sovereign HD melted seamlessly with zero makeup foundation needed. The pre-order took 12 days to arrive at my door in Oslo in the most gorgeous magnetic black box with silk pouch. Incredible.',
    date: 'August 12, 2026',
    verifiedPurchase: true,
    hairLength: '24 inch',
    hairTexture: 'Body Wave',
    helpfulCount: 34
  },
  {
    id: 'rev-02',
    author: 'Soraia V.',
    location: 'Stockholm, Sweden',
    rating: 5,
    title: 'Worth every single day of the pre-order wait',
    content: 'I was hesitant about waiting 2 weeks for pre-order, but the weekly batch tracking gave me updates every step of the way. Seeing when it left China, arrived in Oslo, and got packed was so reassuring. The hair is thick from root to tip and smells heavenly.',
    date: 'August 08, 2026',
    verifiedPurchase: true,
    hairLength: '26 inch',
    hairTexture: 'Deep Wave',
    helpfulCount: 29
  },
  {
    id: 'rev-03',
    author: 'Isabelle M.',
    location: 'Copenhagen, Denmark',
    rating: 5,
    title: 'Pure raw temple hair — zero tangles',
    content: 'I dyed this unit to a rich chocolate brown with honey highlights and the cuticle stayed silky smooth. No shedding in the brush. The glueless elastic band means I can take it off at night effortlessly.',
    date: 'July 29, 2026',
    verifiedPurchase: true,
    hairLength: '20 inch',
    hairTexture: 'Straight',
    helpfulCount: 18
  }
];

export const INITIAL_ORDER_SAMPLE: Order = {
  id: 'ord-10245',
  orderNumber: 'VA10245',
  date: '2026-08-15',
  customer: {
    name: 'Astrid Holmsen',
    email: 'astrid.holmsen@example.no',
    phone: '+47 982 45 102',
    address: 'Bygdøy Allé 14B',
    city: 'Oslo',
    country: 'Norway',
    postalCode: '0262'
  },
  items: [
    {
      id: 'item-01',
      product: MOCK_PRODUCTS[0],
      selectedLength: '24 inch',
      selectedDensity: '200%',
      selectedLace: '13x6 HD Lace',
      selectedColor: 'Natural Black (#1B)',
      unitPrice: 420,
      quantity: 1,
      isPreOrder: true
    }
  ],
  subtotal: 420,
  shippingFee: 0,
  discount: 0,
  total: 420,
  currency: 'EUR',
  paymentMethod: 'card',
  paymentStatus: 'paid',
  orderStatus: 'international_transit',
  batchId: 'batch-002',
  trackingNumber: 'VAE-NO-99482103',
  estimatedDeliveryRange: 'Aug 24 – Aug 28, 2026',
  trackingEvents: [
    {
      step: 'payment_confirmed',
      title: 'Payment Confirmed',
      description: 'Secure transaction processed via Stripe Gateway.',
      location: 'Tanelia Commerce Engine',
      timestamp: 'Aug 15, 14:22 CET',
      completed: true,
      current: false
    },
    {
      step: 'order_received',
      title: 'Order Allocated to Weekly Batch',
      description: 'Order registered into Weekly Batch #BATCH-2026-W33.',
      location: 'Tanelia Operations Hub',
      timestamp: 'Aug 15, 14:25 CET',
      completed: true,
      current: false
    },
    {
      step: 'weekly_batch_created',
      title: 'Weekly Batch PO Generated',
      description: 'Consolidated purchase order transmitted to Qingdao atelier.',
      location: 'Operations · Oslo',
      timestamp: 'Aug 16, 23:59 CET',
      completed: true,
      current: false
    },
    {
      step: 'supplier_processing',
      title: 'Artisan Custom Handcrafting',
      description: 'Single-knot ventilation & cuticle alignment inspection in progress.',
      location: 'Qingdao Atelier, China',
      timestamp: 'Aug 17, 09:00 CST',
      completed: true,
      current: false
    },
    {
      step: 'shipped_china',
      title: 'Dispatched from Supplier Atelier',
      description: 'Handed over to International Air Freight.',
      location: 'Qingdao Airport (TAO), China',
      timestamp: 'Aug 18, 18:30 CST',
      completed: true,
      current: false
    },
    {
      step: 'international_transit',
      title: 'International Air Transit',
      description: 'Flight EN-882 in transit toward Scandinavian Hub.',
      location: 'In Flight · International Air Corridor',
      timestamp: 'Aug 19, 04:15 CET',
      completed: true,
      current: true
    },
    {
      step: 'arrived_norway',
      title: 'Customs Clearance & Arrival in Norway',
      description: 'Batch arrives at Gardermoen Cargo & enters bonded transfer.',
      location: 'Oslo Gardermoen (OSL), Norway',
      timestamp: 'Pending (Expected Aug 21)',
      completed: false,
      current: false
    },
    {
      step: 'fulfillment_center',
      title: 'Received by Oslo 3PL Center',
      description: 'Quality QC, argan conditioning & placement into luxury box.',
      location: 'Tanelia 3PL Center, Oslo',
      timestamp: 'Pending (Expected Aug 22)',
      completed: false,
      current: false
    },
    {
      step: 'preparing_shipment',
      title: 'Branded Luxury Packaging Sealed',
      description: 'Silk bonnet, brass comb, authenticity card & ribbon secured.',
      location: 'Fulfillment Logistics, Oslo',
      timestamp: 'Pending (Expected Aug 23)',
      completed: false,
      current: false
    },
    {
      step: 'shipped_customer',
      title: 'Dispatched with Posten / Bring Norway',
      description: 'Local tracking number assigned.',
      location: 'Posten Hub, Oslo',
      timestamp: 'Pending (Expected Aug 24)',
      completed: false,
      current: false
    },
    {
      step: 'out_for_delivery',
      title: 'Out for Courier Delivery',
      description: 'Courier on route to your specified address.',
      location: 'Oslo West Route',
      timestamp: 'Pending (Expected Aug 24)',
      completed: false,
      current: false
    },
    {
      step: 'delivered',
      title: 'Delivered',
      description: 'Package handed to recipient.',
      location: 'Bygdøy Allé 14B, Oslo',
      timestamp: 'Pending (Expected Aug 24)',
      completed: false,
      current: false
    }
  ]
};
